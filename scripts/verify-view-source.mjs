async function check() {
  const res = await fetch("http://localhost:3100/");
  const html = await res.text();

  console.log("=== Response Status ===", res.status);

  const headMatch = html.match(/<head[\s\S]*?<\/head>/i);
  const headHtml = headMatch ? headMatch[0] : html;

  const linkRegex = /<link[^>]+>/gi;
  let m;
  console.log("=== Icon & Image Link Tags in <head> ===");
  while ((m = linkRegex.exec(headHtml)) !== null) {
    const tag = m[0];
    if (/rel=["'](?:icon|shortcut icon|apple-touch-icon)["']/i.test(tag) || /icon/i.test(tag)) {
      console.log(tag);
    }
  }

  // Also verify HTTP status of each icon URL
  const iconUrls = [
    "http://localhost:3100/favicon.ico",
    "http://localhost:3100/icon.png",
    "http://localhost:3100/apple-icon.png",
  ];

  console.log("=== Testing Direct Icon Asset URLs ===");
  for (const url of iconUrls) {
    const r = await fetch(url);
    const contentType = r.headers.get("content-type");
    const contentLength = r.headers.get("content-length");
    console.log(`${url} -> Status: ${r.status}, Content-Type: ${contentType}, Content-Length: ${contentLength}`);
  }
}

check().catch(console.error);
