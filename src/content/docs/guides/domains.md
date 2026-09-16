---
title: "Custom domains"
description: "Connect your hostname to a web service and verify ownership and traffic routing."
---

<span id="check-the-application"></span>

## Start with a working web service

Verify that the application responds at its Deplexo URL before changing DNS. Custom domains route HTTP traffic to web services; a background worker does not need one.

You need access to the authoritative DNS provider. Enter a hostname without a URL scheme, port, or path—for example, app.example.com.

<span id="add-and-verify"></span>

## Add the domain and prove ownership

Open Domains, add the hostname, and choose the application. Deplexo shows a TXT verification record and the traffic routing record. Copy the exact host and value displayed for your domain.

Publish the TXT record, wait for it to become visible, and select Verify. Some DNS providers append the zone name automatically; ensure the final record is at the intended hostname rather than duplicating the domain suffix.

```shell
dig TXT _deplexo-challenge.app.example.com +short
```

- [Open domains](https://deplexo.com/domains)

<span id="route-traffic"></span>

## Point traffic to the application

Add the CNAME target shown in the dashboard. Ownership verification and traffic routing are separate records: a correct TXT record alone does not direct visitors to the app.

For a root domain, your DNS provider must support appropriate apex behavior, such as CNAME flattening or an equivalent alias. Do not copy another application's target or assume a worker IP is a permanent routing address.

<span id="verify-https"></span>

## Check DNS and HTTPS

After DNS propagates, open the HTTPS URL and test a real route. Certificate provisioning and DNS changes may not complete immediately. If a CDN or proxy fronts the domain, review its TLS configuration when diagnosing failures.

Keep the verification TXT record after setup. Deplexo rechecks ownership, and removing it can disable routing. Add and verify each hostname you intend to use, including a separate www hostname when needed.

- [Troubleshoot a domain](/operations/troubleshooting/#domain-not-working)
