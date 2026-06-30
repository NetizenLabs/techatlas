const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const PERSONS_FILE = path.join(__dirname, '../src/data/persons.json');
const COMPANIES_FILE = path.join(__dirname, '../src/data/companies.json');

// Helper to fetch and parse Wikipedia HTML
async function fetchWikipediaHTML(name) {
  const query = encodeURIComponent(name.replace(/ /g, '_'));
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${query}&format=json`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'TechAtlasBot/2.0 (contact@netizenlabs.online)'
      }
    });
    const data = await res.json();
    if (data.error) return null;
    return data.parse.text['*'];
  } catch (err) {
    console.error(`Error fetching Wikipedia HTML for ${name}:`, err.message);
    return null;
  }
}

// Extract Timeline using a basic heuristic (sentences with years)
function extractTimeline(html) {
  if (!html) return [];
  const $ = cheerio.load(html);
  const timeline = [];
  
  // We'll just look for paragraphs that contain years between 1980 and 2030
  $('p').each((_, el) => {
    const text = $(el).text().replace(/\[\d+\]/g, '').trim(); // Remove citations [1], [2]
    
    // Regex to match a year
    const yearMatch = text.match(/\b(19\d{2}|20\d{2})\b/);
    if (yearMatch) {
      const year = yearMatch[1];
      // Grab the sentence containing the year
      const sentences = text.split(/(?<=[.?!])\s+/);
      const sentence = sentences.find(s => s.includes(year));
      
      if (sentence && sentence.length > 20 && sentence.length < 200) {
        // Ensure we don't add duplicate years or identical events
        if (!timeline.find(t => t.year === year)) {
          timeline.push({ year, event: sentence });
        }
      }
    }
  });

  // Sort by year
  return timeline.sort((a, b) => parseInt(a.year) - parseInt(b.year)).slice(0, 8); // Top 8 events
}

// Fetch Quotes from Wikiquote
async function fetchWikiquotes(name) {
  const query = encodeURIComponent(name.replace(/ /g, '_'));
  const url = `https://en.wikiquote.org/w/api.php?action=parse&page=${query}&format=json`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'TechAtlasBot/2.0 (contact@netizenlabs.online)'
      }
    });
    const data = await res.json();
    if (data.error) return [];
    
    const html = data.parse.text['*'];
    const $ = cheerio.load(html);
    const quotes = [];
    
    // Wikiquote usually puts quotes in <ul> <li> blocks without bullets sometimes
    // Or just regular <li> tags under certain sections
    $('ul > li').each((_, el) => {
      let text = $(el).clone().children('ul').remove().end().text().trim(); // remove sub-lists (often sources)
      text = text.replace(/\[\d+\]/g, ''); // remove citations
      
      if (text.length > 40 && text.length < 300 && !text.includes('Wikipedia')) {
        quotes.push({
          text: text,
          source: 'Wikiquote',
          year: ''
        });
      }
    });

    return quotes.slice(0, 3); // Top 3 quotes
  } catch (err) {
    console.error(`Error fetching Wikiquote for ${name}:`, err.message);
    return [];
  }
}

// Original summary fetcher for basic Bio
async function fetchWikipediaSummary(name) {
  const query = encodeURIComponent(name.replace(/ /g, '_'));
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${query}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'TechAtlasBot/2.0 (contact@netizenlabs.online)'
      }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

async function updatePersons() {
  const rawData = fs.readFileSync(PERSONS_FILE, 'utf-8');
  const persons = JSON.parse(rawData);
  const today = new Date().toISOString().split('T')[0];
  
  console.log(`\n--- Processing ${persons.length} persons ---`);
  
  for (let i = 0; i < persons.length; i++) {
    const person = persons[i];
    console.log(`Fetching data for: ${person.name}...`);
    
    // 1. Basic Summary
    const wikiData = await fetchWikipediaSummary(person.name);
    if (wikiData && wikiData.extract) {
      person.bio = wikiData.extract;
    }
    
    // 2. Full HTML (Timeline)
    const html = await fetchWikipediaHTML(person.name);
    if (html) {
      const timeline = extractTimeline(html);
      if (timeline.length > 0) {
        person.careerTimeline = timeline;
        console.log(`  -> Extracted ${timeline.length} timeline events`);
      }
    }
    
    // 3. Quotes
    const quotes = await fetchWikiquotes(person.name);
    if (quotes.length > 0) {
      person.quotes = quotes;
      console.log(`  -> Extracted ${quotes.length} quotes`);
    }

    person.lastUpdated = today;
    await new Promise(resolve => setTimeout(resolve, 1500)); // Respect rate limits
  }
  
  fs.writeFileSync(PERSONS_FILE, JSON.stringify(persons, null, 2), 'utf-8');
  console.log(`✅ Updated persons.`);
}

async function updateCompanies() {
  const rawData = fs.readFileSync(COMPANIES_FILE, 'utf-8');
  const companies = JSON.parse(rawData);
  const today = new Date().toISOString().split('T')[0];
  
  console.log(`\n--- Processing ${companies.length} companies ---`);
  
  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];
    console.log(`Fetching data for: ${company.name}...`);
    
    const wikiData = await fetchWikipediaSummary(company.name);
    if (wikiData && wikiData.extract) {
      company.description = wikiData.extract;
    }
    
    const html = await fetchWikipediaHTML(company.name);
    if (html) {
      const timeline = extractTimeline(html);
      if (timeline.length > 0) {
        company.milestones = timeline;
        console.log(`  -> Extracted ${timeline.length} milestones`);
      }
    }

    company.lastUpdated = today;
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  fs.writeFileSync(COMPANIES_FILE, JSON.stringify(companies, null, 2), 'utf-8');
  console.log(`✅ Updated companies.`);
}

async function main() {
  console.log('Starting Wikipedia & Wikiquote Deep Scraper...');
  await updatePersons();
  await updateCompanies();
  console.log('\nDeep Scrape complete!');
}

main();
