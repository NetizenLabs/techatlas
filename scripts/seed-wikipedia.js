const fs = require('fs');
const path = require('path');

const PERSONS_FILE = path.join(__dirname, '../src/data/persons.json');
const COMPANIES_FILE = path.join(__dirname, '../src/data/companies.json');

async function fetchWikipediaSummary(name) {
  // Format name for Wikipedia API (replace spaces with underscores)
  const query = encodeURIComponent(name.replace(/ /g, '_'));
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${query}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Wikipedia API responded with ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`Error fetching data for ${name}:`, err.message);
    return null;
  }
}

async function updateEntities(filePath, type) {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const entities = JSON.parse(rawData);
  const today = new Date().toISOString().split('T')[0];
  
  console.log(`\n--- Processing ${entities.length} ${type} ---`);
  
  let updatedCount = 0;
  let notFound = [];

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    console.log(`Fetching data for: ${entity.name}...`);
    
    const wikiData = await fetchWikipediaSummary(entity.name);
    
    if (wikiData && wikiData.extract) {
      // Update bio/description with Wikipedia extract if available
      if (type === 'persons') {
        entity.bio = wikiData.extract;
      } else {
        entity.description = wikiData.extract;
      }
      updatedCount++;
    } else {
      notFound.push(entity.name);
    }
    
    // Always add the lastUpdated timestamp
    entity.lastUpdated = today;
    
    // Polite delay to respect Wikipedia API guidelines (1 request / sec)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  fs.writeFileSync(filePath, JSON.stringify(entities, null, 2), 'utf-8');
  
  console.log(`✅ Updated ${updatedCount}/${entities.length} ${type}.`);
  if (notFound.length > 0) {
    console.log(`⚠️  Could not find Wikipedia summaries for: ${notFound.join(', ')}`);
  }
}

async function main() {
  console.log('Starting Wikipedia Seed Script...');
  await updateEntities(PERSONS_FILE, 'persons');
  await updateEntities(COMPANIES_FILE, 'companies');
  console.log('\nSeed script complete!');
}

main();
