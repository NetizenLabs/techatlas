// Dynamic execution helper to test news parsing
const fs = require("fs");
const path = require("path");

// Mocking imports so we can run under Node directly without ts-node wrapper
// We will simply load raw json data as the api functions would
const companies = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/data/companies.json"), "utf8"));
const persons = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/data/persons.json"), "utf8"));

const FEEDS = [
  {
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    category: "AI & ML"
  },
  {
    name: "Hacker News",
    url: "https://news.ycombinator.com/rss",
    category: "Developer Tech"
  },
  {
    name: "VentureBeat AI",
    url: "https://venturebeat.com/category/ai/feed/",
    category: "AI Business"
  }
];

function sanitizeText(text) {
  if (!text) return "";
  let clean = text;
  if (clean.includes("<![CDATA[")) {
    const match = clean.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
    if (match) clean = match[1];
  }
  clean = clean
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&nbsp;/g, " ");
  clean = clean.replace(/<\/?[^>]+(>|$)/g, "");
  return clean.trim();
}

function generateSlug(title, id) {
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const shortId = id.substring(0, 4);
  return `${cleanTitle}-${shortId}`;
}

function extractTagContent(xmlChunk, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\/${tagName}>`, "i");
  const match = xmlChunk.match(regex);
  return match ? match[1] : "";
}

async function runVerification() {
  console.log("Starting News RSS Ingestion Verification...\n");
  
  for (const feed of FEEDS) {
    try {
      console.log(`Fetching from source: ${feed.name} (${feed.url})...`);
      const res = await fetch(feed.url);
      if (!res.ok) {
        console.error(`  -> Failed: HTTP ${res.status}`);
        continue;
      }
      
      const xmlText = await res.text();
      const itemBlocks = xmlText.split(/<item[^>]*>/i).slice(1);
      
      console.log(`  -> Fetched successfully. Found ${itemBlocks.length} items.`);
      
      // Let's print the top 2 parsed items
      const sampleCount = Math.min(itemBlocks.length, 2);
      for (let i = 0; i < sampleCount; i++) {
        const block = itemBlocks[i];
        const title = sanitizeText(extractTagContent(block, "title"));
        const link = sanitizeText(extractTagContent(block, "link"));
        const pubDate = sanitizeText(extractTagContent(block, "pubDate"));
        const author = sanitizeText(extractTagContent(block, "dc:creator") || extractTagContent(block, "author")) || feed.name;
        
        const uniqueId = Buffer.from(link).toString("base64").replace(/[^a-zA-Z0-9]/g, "").substring(0, 12);
        const slug = generateSlug(title, uniqueId);

        // Check Entity mapping
        const matchedCos = [];
        const searchScope = title.toLowerCase();
        for (const company of companies) {
          if (searchScope.includes(company.name.toLowerCase())) {
            matchedCos.push(company.slug);
          }
        }

        console.log(`    [Article ${i+1}]`);
        console.log(`      Title: ${title}`);
        console.log(`      Author: ${author}`);
        console.log(`      Date: ${pubDate}`);
        console.log(`      Slug: ${slug}`);
        if (matchedCos.length > 0) {
          console.log(`      Entity Cross-Links: ${matchedCos.join(", ")}`);
        }
      }
    } catch (err) {
      console.error(`  -> Error parsing feed: ${err.message}`);
    }
    console.log();
  }
}

runVerification();
