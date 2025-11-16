---
title: Phishing Case
date: 2024-01-17 21:28
author: 3lioo
featured: false
published: true
seo:
  noIndex: false
category: Phishing
threatLevel: info
readTime: 5 min read
tags:
  - Phishing
---
## Introduction

In this post, I'll analyze an interesting URL submitted to the AnyRun public submission platform.

## Hunting the Source

**URL:** `hxxps://pub-e03b84ede40949d783b7ef41e8b36c50[.]r2[.]dev/web.html#REDACTED@syriatel[.]com.sy`

When visiting the URL, it displays an Outlook login page with a prefilled email address (`REDACTED@syriatel[.]com[.]sy`) written in the URL after the `#` character. This suggests the recipient likely received a spam email leading to this phishing site.

View source was disabled, so I inspected the HTTP request using Burp Suite after refreshing the page.

![Outlook phishing page](/assets/images/phishing_case/phish_page.png)
*Outlook phishing page*

![Source of phishing page](/assets/images/phishing_case/requsted_js_files.png)
*Source of the phishing page*

Two JavaScript files were identified for analysis:

## First JavaScript File

The first script creates the HTML template for the phishing page.

![First obfuscated JS file](/assets/images/phishing_case/first_js.png)
*First obfuscated JavaScript file*

After deobfuscation, the file uses the `unescape` function to generate the HTML page.

![Deobfuscated first JS file](/assets/images/phishing_case/debof_first_js.png)

![Generated HTML page](/assets/images/phishing_case/first_html.png)
*Generated HTML page*

## Second JavaScript File

The second file, after deobfuscation, handles sending the captured credentials to the attacker.

![Second JS file sending code](/assets/images/phishing_case/second_js.png)
*Sending part of the code*

It sends a POST request after decoding a base64-encoded URL using the `atob` function. The decoded URL is: `hxxps://gsenddata[.]com/web/dropbox[.]php`

![Received data](/assets/images/phishing_case/reciv1.png)

The domain hosts additional files serving similar purposes.

![Additional files 1](/assets/images/phishing_case/addfile2.png)
![Additional files 2](/assets/images/phishing_case/addfiles1.png)

## Back to the Start Point

Using Google search and tracing the domain `hxxps://eu.starton-ipfs[.]com`, I found an interesting file:  
`hxxps://eu.starton-ipfs[.]com/ipfs//bafybeiffgj723rrq4ejwm7iydforlu2gu4xaog6xhhf2knoyk4ktt53y4y`

![Interesting file](/assets/images/phishing_case/int.png)

Scrolling to the end of the file reveals that it writes the `em` variable to the document.

![End of file](/assets/images/phishing_case/intdown.png)

Saving and debugging this JavaScript file to extract the string stored in the `em` variable revealed new HTML code.

![New HTML code](/assets/images/phishing_case/newhtml.png)

The generated HTML appears to be an older phishing page using a similar method—storing a base64-encoded URL in a variable named `file` and sending credentials to the decoded URL.

![HTML source 1](/assets/images/phishing_case/inthtml1.png)
![HTML source 2](/assets/images/phishing_case/inthtml2.png)

The decoded URL is `hxxps://lslamic-relief[.]org/Irworldwide/oba[.]php`, which is currently offline.

## Image of Interest

While examining the generated HTML file, I discovered a suspicious PNG link used as a background image.

![Suspicious PNG link](/assets/images/phishing_case/intimg.png)

The image is hosted on `hxxps://swatantraindialive7[.]com/wp-includes/`, indicating the site was likely compromised.

![Open directory](/assets/images/phishing_case/imgopen.png)

Further investigation revealed this PNG is widely used across similar phishing pages and appears linked to a phish kit. Searching for the PNG hash on urlscan.io returned thousands of phishing sites.

![Image search results](/assets/images/phishing_case/imgsearch1.png)

I decoded the base64 image from the generated HTML file, searched for its hash on urlscan.io, and found thousands of similar phishing sites—many hosted on Cloudflare Pages.dev and Workers.dev domains.

![Base64 PNG image](/assets/images/phishing_case/imgcontainer.png)
*Base64 PNG image*

![Cloudflare results](/assets/images/phishing_case/resultcloud.png)
*Search results for the base64 image*

## Indicators of Compromise (IOCs)

| Type | Indicator | Description |
|------|-----------|-------------|
| URL | `hxxps://pub-e03b84ede40949d783b7ef41e8b36c50[.]r2[.]dev/web.html` | Outlook login phishing site |
| URL | `hxxps://eu.starton-ipfs[.]com/ipfs/bafybeicnzy4miwpnysban6yu5taxmsxjslw4nhmsykbfr6k6prqeohdgyi` | JS file that loads HTML (first file) |
| URL | `hxxps://eu.starton-ipfs[.]com/ipfs/bafkreifwfl4267c7mwuq4yfvedvjgulgmwmk5tveeik6wqjnb7bwunf2ki` | JS file that sends credentials (second file) |
| URL | `hxxps://gsenddata[.]com` | Domain hosting PHP files for data exfiltration |
| URL | `hxxps://eu.starton-ipfs[.]com/ipfs//bafybeiffgj723rrq4ejwm7iydforlu2gu4xaog6xhhf2knoyk4ktt53y4y` | JS file generating older phishing site |
| URL | `hxxps://lslamic-relief[.]org/Irworldwide/oba[.]php` | Receiver PHP file (currently offline) |
| URL | `hxxps://swatantraindialive7[.]com/wp-includes/` | Open directory hosting background PNG |
| SHA-256 | `cdff0a47d3bb27e0015ed5332bb2614a5cc8ff8879b9469b531f18fb9dbc9822` | PNG file (background image) |
| SHA-256 | `d9ed6586942003696afe4e52b09f343f8342244b51a9e175b75162d7e615207b` | PNG file (base64 encoded version) |

## References

- [Trustwave: Cloudflare Pages and Workers Abuse](https://www.trustwave.com/en-us/resources/blogs/spiderlabs-blog/its-raining-phish-and-scams-how-cloudflare-pages-dev-and-workers-dev-domains-get-abused/)
- [OBF-IO Deobfuscator](https://obf-io.deobfuscate.io/)
- [AnyRun Submissions](https://app.any.run/submissions/)
- [URLScan.io](https://urlscan.io/)
