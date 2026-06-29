const fs = require('fs');
const path = require('path');

const PERSONS_FILE = path.join(__dirname, '../src/data/persons.json');

async function fetchWikidataId(name) {
  const query = encodeURIComponent(name);
  const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${query}&language=en&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'TechAtlasBot/1.0 (test@techatlas.com)' } });
    const data = await res.json();
    if (data.search && data.search.length > 0) {
      return data.search[0].id;
    }
  } catch (err) {
    console.error(`Error searching Wikidata for ${name}:`, err.message);
  }
  return null;
}

async function fetchWikidataEntity(id) {
  const url = `https://www.wikidata.org/wiki/Special:EntityData/${id}.json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'TechAtlasBot/1.0 (test@techatlas.com)' } });
    const data = await res.json();
    return data.entities[id];
  } catch (err) {
    console.error(`Error fetching entity ${id}:`, err.message);
  }
  return null;
}

function calculateAge(birthDateStr) {
  // Format: "+1985-04-22T00:00:00Z"
  if (!birthDateStr) return 0;
  const match = birthDateStr.match(/\+?(-?\d{4}-\d{2}-\d{2})/);
  if (!match) return 0;
  const birthDate = new Date(match[1]);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

async function updatePersonsWithWikidata() {
  const rawData = fs.readFileSync(PERSONS_FILE, 'utf-8');
  const persons = JSON.parse(rawData);
  
  console.log(`\n--- Querying Wikidata for ${persons.length} persons ---`);
  
  let updatedCount = 0;

  for (let i = 0; i < persons.length; i++) {
    const person = persons[i];
    console.log(`Searching Wikidata for: ${person.name}...`);
    
    const entityId = await fetchWikidataId(person.name);
    if (!entityId) {
      console.log(`  -> Not found in search.`);
      continue;
    }
    
    const entity = await fetchWikidataEntity(entityId);
    if (!entity || !entity.claims) continue;

    // P569: Date of birth
    if (entity.claims.P569 && entity.claims.P569[0].mainsnak.datavalue) {
      const timeStr = entity.claims.P569[0].mainsnak.datavalue.value.time;
      const age = calculateAge(timeStr);
      if (age > 0) {
        person.age = age;
        console.log(`  -> Age found: ${age}`);
      }
    }

    // P27: Country of citizenship (we could resolve the ID to string, but skipping for brevity unless needed)
    // Actually resolving P27/P69 names requires another fetch, which is slow.
    // For now, getting the Age is the biggest SEO win as per the user.

    updatedCount++;
    // Polite delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  fs.writeFileSync(PERSONS_FILE, JSON.stringify(persons, null, 2), 'utf-8');
  console.log(`✅ Updated ${updatedCount}/${persons.length} persons with Wikidata facts.`);
}

updatePersonsWithWikidata();
