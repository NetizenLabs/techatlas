import * as cheerio from "cheerio";
import { NewsArticle } from "./types";
import { getCompanies, getPersons } from "./api";

// Configured free high-fidelity RSS feeds
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

// Helper to sanitize html residues and entities (Cheerio does most text decoding automatically)
function sanitizeText(text: string): string {
  if (!text) return "";
  return text
    .replace(/<\/?[^>]+(>|$)/g, "") // Strip raw tags if any
    .replace(/&nbsp;/g, " ")
    .trim();
}

// Helper to generate SEO-friendly slug with 6-char uniqueness hash
function generateSlug(title: string, shortId: string): string {
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  
  return `${cleanTitle}-${shortId}`;
}

// Ingests, parses, and formats RSS feeds using Cheerio (extremely robust)
export async function getNewsArticles(): Promise<(NewsArticle & { relatedCompanies?: string[]; relatedPersons?: string[] })[]> {
  const articles: (NewsArticle & { relatedCompanies?: string[]; relatedPersons?: string[] })[] = [];
  
  // Retrieve directory names to cross-reference
  const allCompanies = getCompanies();
  const allPersons = getPersons();

  for (const feed of FEEDS) {
    try {
      // Fetch feed with Next.js revalidation cache (30 mins)
      const res = await fetch(feed.url, {
        next: { revalidate: 1800 },
        headers: {
          "User-Agent": "TechAtlasBot/2.0 (Mozilla compatible; contact@netizenlabs.online)"
        }
      });
      
      if (!res.ok) {
        console.error(`Failed to fetch RSS feed: ${feed.name}`, res.statusText);
        continue;
      }
      
      const xmlText = await res.text();
      
      // Load xml text using Cheerio in XML mode
      const $ = cheerio.load(xmlText, { xmlMode: true });
      
      $("item").each((_, itemEl) => {
        const item = $(itemEl);
        const rawTitle = item.find("title").text();
        const rawLink = item.find("link").text();
        const rawDescription = item.find("description").text();
        const rawPubDate = item.find("pubDate").text();
        
        // Find author (standard namespace or author tag)
        const rawAuthor = item.find("dc\\:creator").text() || item.find("author").text();

        const title = sanitizeText(rawTitle);
        const link = sanitizeText(rawLink);
        const description = sanitizeText(rawDescription);
        const pubDate = sanitizeText(rawPubDate);
        const author = sanitizeText(rawAuthor) || feed.name;

        if (!title || !link) return;

        // Generate clean ID & unique slug (using 6-char hash to prevent collision)
        const uniqueId = Buffer.from(link).toString("base64").replace(/[^a-zA-Z0-9]/g, "").substring(0, 12);
        const slug = generateSlug(title, uniqueId.substring(0, 6));

        // Cross-reference detection
        const relatedCompanies: string[] = [];
        const relatedPersons: string[] = [];
        
        const searchScope = `${title} ${description}`.toLowerCase();

        for (const company of allCompanies) {
          if (searchScope.includes(company.name.toLowerCase())) {
            relatedCompanies.push(company.slug);
          }
        }
        for (const person of allPersons) {
          if (searchScope.includes(person.name.toLowerCase())) {
            relatedPersons.push(person.slug);
          }
        }

        articles.push({
          id: uniqueId,
          slug,
          title,
          description: description.substring(0, 240) + (description.length > 240 ? "..." : ""),
          link,
          pubDate,
          source: feed.name,
          author,
          category: feed.category,
          relatedCompanies: relatedCompanies.length > 0 ? relatedCompanies : undefined,
          relatedPersons: relatedPersons.length > 0 ? relatedPersons : undefined
        });
      });
    } catch (err: any) {
      console.error(`Error parsing feed ${feed.name}:`, err.message);
    }
  }

  // Sort articles chronologically descending
  return articles.sort((a, b) => {
    const timeA = new Date(a.pubDate).getTime();
    const timeB = new Date(b.pubDate).getTime();
    return timeB - timeA;
  });
}
