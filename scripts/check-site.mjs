import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const origin = 'https://docs.deplexo.com';
const directory = path.resolve(process.argv[2] ?? fileURLToPath(new URL('../dist', import.meta.url)));
const failures = [];
const fail = (location, message) => failures.push(`${location}: ${message}`);

function decode(value) {
  const entities = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: '\u00a0' };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (match, entity) => {
    if (!entity.startsWith('#')) return entities[entity.toLowerCase()] ?? match;
    const number = entity[1].toLowerCase() === 'x' ? Number.parseInt(entity.slice(2), 16) : Number.parseInt(entity.slice(1), 10);
    return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : match;
  });
}

function attributes(tag) {
  const result = new Map();
  const pattern = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'<>`=]+)))?/g;
  const contents = tag.replace(/^<\/?[^\s>]+/, '').replace(/\/?\s*>$/, '');
  for (const match of contents.matchAll(pattern)) {
    result.set(match[1].toLowerCase(), decode(match[2] ?? match[3] ?? match[4] ?? ''));
  }
  return result;
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((match) => attributes(match[0]));
}

async function filesIn(folder) {
  const result = [];
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const filename = path.join(folder, entry.name);
    if (entry.isDirectory()) result.push(...await filesIn(filename));
    else if (entry.isFile()) result.push(filename);
  }
  return result.sort();
}

function routeFor(filename) {
  const relative = path.relative(directory, filename).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  if (relative === '404.html') return '/404/';
  return `/${relative.replace(/index\.html$/, '')}`;
}

function localFile(url) {
  const filename = path.resolve(directory, `.${decodeURIComponent(url.pathname)}`);
  if (filename !== directory && !filename.startsWith(`${directory}${path.sep}`)) {
    throw new Error(`URL escapes the build directory: ${url.href}`);
  }
  return filename;
}

async function checkSite() {
  const allFiles = await filesIn(directory);
  const fileSet = new Set(allFiles);
  const htmlFiles = allFiles.filter((filename) => filename.endsWith('.html'));
  if (!htmlFiles.length) throw new Error('No HTML pages found. Run npm run build first.');
  const pages = [];
  const titleOwners = new Map();
  const descriptionOwners = new Map();

  for (const filename of htmlFiles) {
    const route = routeFor(filename);
    const html = (await readFile(filename, 'utf8'))
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
    const titleTags = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/gi)];
    const title = decode(titleTags[0]?.[1] ?? '').replace(/\s+/g, ' ').trim();
    if (titleTags.length !== 1 || !title) fail(route, 'must contain exactly one nonempty title');
    if (title && titleOwners.has(title)) fail(route, `title duplicates ${titleOwners.get(title)}`);
    titleOwners.set(title, route);

    const metas = tags(html, 'meta');
    const descriptions = metas.filter((tag) => tag.get('name')?.toLowerCase() === 'description');
    const description = descriptions[0]?.get('content')?.replace(/\s+/g, ' ').trim() ?? '';
    if (descriptions.length !== 1 || !description) fail(route, 'must contain exactly one nonempty meta description');
    if (description && descriptionOwners.has(description)) fail(route, `description duplicates ${descriptionOwners.get(description)}`);
    descriptionOwners.set(description, route);

    const canonicalTags = tags(html, 'link').filter((tag) => tag.get('rel')?.toLowerCase().split(/\s+/).includes('canonical'));
    const canonical = canonicalTags[0]?.get('href');
    const expected = `${origin}${route}`;
    if (canonicalTags.length !== 1 || canonical !== expected) {
      fail(route, `canonical must be exactly ${expected}; found ${JSON.stringify(canonical)}`);
    }

    const brandMetadata = {
      'application-name': 'Deplexo',
      author: 'Deplexo',
      'og:site_name': 'Deplexo',
      'og:locale': 'en_US',
      'og:title': title,
      'og:description': description,
      'og:url': expected,
      'og:image': `${origin}/social.png`,
      'og:image:width': '1200',
      'og:image:height': '630',
      'twitter:card': 'summary_large_image',
      'twitter:site': '@deplexo',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': `${origin}/social.png`,
    };
    for (const [name, value] of Object.entries(brandMetadata)) {
      const matches = metas.filter(tag => (tag.get('name') ?? tag.get('property')) === name);
      if (matches.length !== 1 || matches[0].get('content') !== value) fail(route, `${name} must occur once with the correct brand or page value`);
    }
    const icons = tags(html, 'link');
    if (!icons.some(tag => tag.get('rel')?.split(/\s+/).includes('icon') && tag.get('href') === '/favicon.ico')) fail(route, 'must use the Deplexo favicon');
    if (!icons.some(tag => tag.get('rel') === 'apple-touch-icon' && tag.get('href') === '/apple-touch-icon.png')) fail(route, 'must use the Deplexo touch icon');

    const notFound = route === '/404/' || route === '/404.html';
    const directives = metas.filter((tag) => ['robots', 'googlebot'].includes(tag.get('name')?.toLowerCase()))
      .flatMap((tag) => (tag.get('content') ?? '').toLowerCase().split(/[\s,]+/));
    const noindex = directives.includes('noindex') || directives.includes('none');
    const robotsDirectives = metas.filter((tag) => tag.get('name')?.toLowerCase() === 'robots')
      .flatMap((tag) => (tag.get('content') ?? '').toLowerCase().split(/[\s,]+/));
    if (notFound && !robotsDirectives.includes('noindex') && !robotsDirectives.includes('none')) fail(route, '404 must have a noindex robots meta tag');
    if (!notFound && noindex) fail(route, 'public documentation page must be indexable');

    const ids = new Set();
    for (const match of html.matchAll(/<[a-z][^>]*>/gi)) {
      const tag = attributes(match[0]);
      if (tag.has('id')) ids.add(tag.get('id'));
      if (/^<a\b/i.test(match[0]) && tag.has('name')) ids.add(tag.get('name'));
    }
    pages.push({ filename, route, expected, html, ids, notFound });
  }

  const publicPages = pages.filter((page) => !page.notFound);
  if (!pages.some((page) => page.notFound)) fail('404', 'a generated 404 page is required');
  const pageByFile = new Map(pages.map((page) => [page.filename, page]));
  const pageByRoute = new Map(pages.map((page) => [page.route, page]));
  let checkedLinks = 0;

  for (const page of pages) {
    for (const tag of [...tags(page.html, 'a'), ...tags(page.html, 'area'), ...tags(page.html, 'link')]) {
      const href = tag.get('href');
      if (href === undefined) continue;
      try {
        const url = new URL(href, page.expected);
        if (url.origin !== origin) continue;
        checkedLinks++;
        const filename = localFile(url);
        const targetPage = pageByRoute.get(url.pathname) ?? pageByFile.get(filename) ?? pageByFile.get(path.join(filename, 'index.html'));
        if (!targetPage && !fileSet.has(filename)) {
          fail(page.route, `internal link does not resolve: ${href}`);
          continue;
        }
        const fragment = decodeURIComponent(url.hash.slice(1).split(':~:')[0]);
        if (fragment && targetPage && !targetPage.ids.has(fragment)) {
          fail(page.route, `anchor does not exist: ${href}`);
        }
      } catch (error) {
        fail(page.route, `invalid link ${JSON.stringify(href)}: ${error.message}`);
      }
    }
  }

  const sitemapURLs = new Set();
  const visitedMaps = new Set();
  async function readSitemap(address) {
    const url = new URL(address);
    if (url.origin !== origin || url.search || url.hash) throw new Error(`invalid sitemap address: ${address}`);
    if (visitedMaps.has(url.href)) return;
    visitedMaps.add(url.href);
    const xml = await readFile(localFile(url), 'utf8');
    const locations = [...xml.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc\s*>/gi)].map((match) => decode(match[1].trim()));
    if (/<sitemapindex\b/i.test(xml)) {
      if (!locations.length) throw new Error(`empty sitemap index: ${address}`);
      for (const location of locations) await readSitemap(location);
    } else if (/<urlset\b/i.test(xml)) {
      for (const location of locations) {
        if (sitemapURLs.has(location)) fail(address, `duplicate sitemap URL: ${location}`);
        sitemapURLs.add(location);
      }
    } else {
      throw new Error(`unrecognized sitemap XML: ${address}`);
    }
  }

  try {
    const robots = await readFile(path.join(directory, 'robots.txt'), 'utf8');
    const advertised = [...robots.matchAll(/^\s*Sitemap:\s*(\S+)\s*$/gim)].map((match) => match[1]);
    if (!advertised.length) fail('robots.txt', 'must advertise the documentation sitemap');
    for (const address of advertised) await readSitemap(address);
    const expectedURLs = new Set(publicPages.map((page) => page.expected));
    for (const address of expectedURLs) if (!sitemapURLs.has(address)) fail('sitemap', `missing public page: ${address}`);
    for (const address of sitemapURLs) if (!expectedURLs.has(address)) fail('sitemap', `contains a noncanonical, missing, or nonpublic page: ${address}`);
  } catch (error) {
    fail('sitemap/robots', error.message);
  }

  try {
    for (const filename of ['pagefind.js', 'pagefind-entry.json']) {
      if (!(await stat(path.join(directory, 'pagefind', filename))).size) throw new Error(`${filename} is empty`);
    }
    const entry = JSON.parse(await readFile(path.join(directory, 'pagefind', 'pagefind-entry.json'), 'utf8'));
    const count = Object.values(entry.languages ?? {}).reduce((sum, language) => sum + (Number(language.page_count) || 0), 0);
    if (count < 1) throw new Error('Pagefind contains no searchable pages');
    if (!allFiles.some((filename) => filename.includes(`${path.sep}pagefind${path.sep}fragment${path.sep}`))) throw new Error('Pagefind content fragments are missing');
  } catch (error) {
    fail('pagefind', error.message);
  }

  if (failures.length) {
    console.error(`Site validation failed (${failures.length}):\n${failures.map((message) => `- ${message}`).join('\n')}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Site validation passed: ${publicPages.length} public pages, ${checkedLinks} internal links, ${sitemapURLs.size} sitemap entries; canonical metadata, 404 noindex, robots, and search verified.`);
}

await checkSite().catch((error) => {
  console.error(`Site validation failed: ${error.message}`);
  process.exitCode = 1;
});
