---
title: Acceptable use
description: Understand prohibited content, abusive workloads, and the account and data consequences of violating Deplexo platform rules.
---

Last updated: October 5, 2026

These rules apply to all Deplexo accounts, builds, applications, bots and stored files on free and paid plans. They cover private deployments, temporary files, caches and backups as well as public content. They apply alongside the [Terms of Service](https://deplexo.com/terms). Only use code and content you have the legal right to run, store and distribute.

## Prohibited content

- Copyright infringement: storing, hosting, streaming or distributing material without permission or another legal right to do so, including pirated movies, music, software and books. This also covers bots, download services and collections of links that help people infringe copyright. You may store content you created, licensed or can otherwise lawfully use, provided it follows the other rules below.
- NSFW content and sexual exploitation: pornography, sexually explicit material, child sexual abuse or exploitation material, and intimate images shared without consent. This includes synthetic or AI-generated versions and applications or bots used to produce, host or distribute them.
- Fraud and unlawful activity: scams, payment fraud, deceptive impersonation, illegal sales or other activity prohibited by applicable law.
- Abuse and privacy violations: threats, targeted harassment, encouraging violence or terrorism, doxxing, or collecting, publishing or selling personal information without a lawful basis, including stolen credentials and leaked private data.

You are responsible for your applications and content submitted by their users. Secure your applications, address abuse and comply with applicable law and the terms of connected providers.

## Prohibited workloads

### Proxy, VPN and traffic relay services

Do not run proxy or VPN servers on Deplexo. This includes HTTP/SOCKS proxies, anonymizers, Tor relays or exit nodes, and tunnels that relay general internet traffic. Private and password-protected services are also prohibited, even a VPN for your own use. You must not sell bandwidth or let others route their internet traffic through your application.

Your app may route requests between its own components or to specific APIs it uses. You may also use a reverse proxy to serve your own web app, provided it does not forward arbitrary internet traffic. The proxy and VPN ban still applies if you offer the service through an application endpoint.

### Security and network abuse

- Malware, phishing, credential theft, botnets, DDoS attacks and attack tooling.
- Accessing, scanning, testing or intercepting traffic on systems without the owner's permission, including third-party systems. Permission to run your own app does not include permission to test Deplexo's infrastructure or other customers' apps.
- Attempts to escape a container, compromise the host, access another tenant's data or interfere with other applications.
- Spam or unsolicited bulk messages, including email, SMS and bot messages. This includes messages your app sends through an external provider.
- Open mail relays and open recursive DNS resolvers that accept requests from arbitrary internet users.
- Bots or scrapers that bypass access controls, violate a connected provider's terms or disrupt other services.

### Resource abuse and file sharing

- Cryptocurrency mining.
- Torrent clients, trackers and seedboxes, even when the files being shared are lawful.
- Attempts to bypass CPU, memory, disk, process, network or other platform limits, billing requirements or security controls.
- Workloads that disrupt shared resources or interfere with other applications.

Repeated resource violations can result in an application being stopped or removed. Check your plan's limits and use the [troubleshooting guide](/operations/troubleshooting/) to investigate resource problems.

## Multiple-account and alternate-account abuse

Creating or using multiple accounts to claim extra free-tier resources, bypass quotas, evade a suspension or ban, or conceal abusive activity is prohibited. Spreading the same abuse across different repositories, applications, identities, or sign-in providers does not avoid this rule.

**Confirmed alternate-account abuse results in bans across all associated accounts and the permanent purge of all their applications and stored data.** This applies to the associated accounts as a group, not only the account where the abuse was first detected.

Do not use extra accounts as a substitute for a suitable plan or as a way to continue after enforcement. Contact support if you need resources or have a legitimate account-access problem.

## Enforcement and data deletion

Violations can result in applications being stopped or removed, account suspension or bans, and permanent deletion of applications and their stored data. For confirmed alternate-account abuse, enforcement covers all associated accounts and all of their apps and data.

Permanently deleted applications and data cannot be recovered. Keep independent backups of data you are permitted to host; backups do not make prohibited content or abusive activity acceptable.

## Report abuse or ask about a restriction

Email [support@deplexo.com](mailto:support@deplexo.com), or use [Deplexo support](https://deplexo.com/support) if you can sign in, to report abuse or ask about a restriction. Include the application URL or ID and a short explanation. For a copyright complaint, identify the work, the specific URLs or file locations at issue, your relationship to the rights holder and a way to contact you. Do not submit passwords, API keys, bot tokens or copies of illegal material.

If an account is restricted, contact support rather than creating an alternate account to bypass the restriction.
