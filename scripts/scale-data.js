const fs = require('fs');
const path = require('path');

const PERSONS_FILE = path.join(__dirname, '../src/data/persons.json');
const COMPANIES_FILE = path.join(__dirname, '../src/data/companies.json');
const TOPICS_FILE = path.join(__dirname, '../src/data/topics.json');

const NEW_PERSONS = [
  {
    "slug": "edo-liberty",
    "name": "Edo Liberty",
    "title": "Founder & CEO, Pinecone",
    "bio": "",
    "netWorth": "Unknown",
    "age": 45,
    "companies": ["pinecone"],
    "education": "Tel Aviv University, Yale University",
    "socials": {}
  },
  {
    "slug": "bob-van-luijt",
    "name": "Bob van Luijt",
    "title": "Co-Founder & CEO, Weaviate",
    "bio": "",
    "netWorth": "Unknown",
    "age": 39,
    "companies": ["weaviate"],
    "education": "Utrecht School of the Arts",
    "socials": {}
  },
  {
    "slug": "brian-armstrong",
    "name": "Brian Armstrong",
    "title": "Co-Founder & CEO, Coinbase",
    "bio": "",
    "netWorth": "$10B+",
    "age": 43,
    "companies": ["coinbase"],
    "education": "Rice University",
    "socials": {
      "twitter": "https://twitter.com/brian_armstrong"
    }
  },
  {
    "slug": "anatoly-yakovenko",
    "name": "Anatoly Yakovenko",
    "title": "Co-Founder, Solana",
    "bio": "",
    "netWorth": "Unknown",
    "age": 46,
    "companies": ["solana-foundation"],
    "education": "University of Illinois Urbana-Champaign",
    "socials": {
      "twitter": "https://twitter.com/aeyakovenko"
    }
  },
  {
    "slug": "arthur-mensch",
    "name": "Arthur Mensch",
    "title": "Co-Founder & CEO, Mistral AI",
    "bio": "",
    "netWorth": "Unknown",
    "age": 33,
    "companies": ["mistral-ai"],
    "education": "École Polytechnique, ENS Paris-Saclay",
    "socials": {
      "twitter": "https://twitter.com/arthurmensch"
    }
  },
  {
    "slug": "aravind-srinivas",
    "name": "Aravind Srinivas",
    "title": "Co-Founder & CEO, Perplexity AI",
    "bio": "",
    "netWorth": "Unknown",
    "age": 36,
    "companies": ["perplexity-ai"],
    "education": "IIT Madras, UC Berkeley",
    "socials": {
      "twitter": "https://twitter.com/AravSrinivas"
    }
  }
];

const NEW_COMPANIES = [
  {
    "slug": "pinecone",
    "name": "Pinecone",
    "founded": 2019,
    "founders": ["edo-liberty"],
    "headquarters": "New York, NY",
    "employees": "150+",
    "funding": "$138M",
    "valuation": "$750M",
    "description": "",
    "website": "https://pinecone.io",
    "products": ["Pinecone Vector Database"],
    "competitors": ["weaviate", "google", "meta"]
  },
  {
    "slug": "weaviate",
    "name": "Weaviate",
    "founded": 2019,
    "founders": ["bob-van-luijt"],
    "headquarters": "Amsterdam, Netherlands",
    "employees": "80+",
    "funding": "$65M",
    "valuation": "$200M+",
    "description": "",
    "website": "https://weaviate.io",
    "products": ["Weaviate Vector Database"],
    "competitors": ["pinecone", "google", "meta"]
  },
  {
    "slug": "ethereum-foundation",
    "name": "Ethereum Foundation",
    "founded": 2014,
    "founders": ["vitalik-buterin"],
    "headquarters": "Zug, Switzerland",
    "employees": "100+",
    "funding": "Foundation / Grant-funded",
    "valuation": "N/A",
    "description": "",
    "website": "https://ethereum.org",
    "products": ["Ethereum Network", "Solidity"],
    "competitors": ["solana-foundation"]
  },
  {
    "slug": "coinbase",
    "name": "Coinbase",
    "founded": 2012,
    "founders": ["brian-armstrong"],
    "headquarters": "San Francisco, CA",
    "employees": "3,400+",
    "funding": "Public",
    "valuation": "$40B+",
    "description": "",
    "website": "https://coinbase.com",
    "products": ["Coinbase Exchange", "Base Layer 2"],
    "competitors": []
  },
  {
    "slug": "solana-foundation",
    "name": "Solana Foundation",
    "founded": 2020,
    "founders": ["anatoly-yakovenko"],
    "headquarters": "Zug, Switzerland",
    "employees": "50+",
    "funding": "Foundation / Grant-funded",
    "valuation": "N/A",
    "description": "",
    "website": "https://solana.com",
    "products": ["Solana Blockchain"],
    "competitors": ["ethereum-foundation"]
  },
  {
    "slug": "mistral-ai",
    "name": "Mistral AI",
    "founded": 2023,
    "founders": ["arthur-mensch"],
    "headquarters": "Paris, France",
    "employees": "60+",
    "funding": "$1B+",
    "valuation": "$6B+",
    "description": "",
    "website": "https://mistral.ai",
    "products": ["Mistral Large", "Codestral", "Mixtral"],
    "competitors": ["openai", "google", "meta", "anthropic"]
  },
  {
    "slug": "perplexity-ai",
    "name": "Perplexity AI",
    "founded": 2022,
    "founders": ["aravind-srinivas"],
    "headquarters": "San Francisco, CA",
    "employees": "50+",
    "funding": "$165M",
    "valuation": "$3B+",
    "description": "",
    "website": "https://perplexity.ai",
    "products": ["Perplexity Answer Engine"],
    "competitors": ["google", "openai"]
  }
];

function scaleData() {
  console.log('Scaling TechAtlas JSON Databases...');

  // 1. Scale Persons
  const persons = JSON.parse(fs.readFileSync(PERSONS_FILE, 'utf-8'));
  for (const newPerson of NEW_PERSONS) {
    if (!persons.some(p => p.slug === newPerson.slug)) {
      persons.push(newPerson);
      console.log(`  + Added person: ${newPerson.name}`);
    }
  }
  fs.writeFileSync(PERSONS_FILE, JSON.stringify(persons, null, 2), 'utf-8');

  // 2. Scale Companies
  const companies = JSON.parse(fs.readFileSync(COMPANIES_FILE, 'utf-8'));
  for (const newCompany of NEW_COMPANIES) {
    if (!companies.some(c => c.slug === newCompany.slug)) {
      companies.push(newCompany);
      console.log(`  + Added company: ${newCompany.name}`);
    }
  }
  fs.writeFileSync(COMPANIES_FILE, JSON.stringify(companies, null, 2), 'utf-8');

  // 3. Link topics
  const topics = JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf-8'));
  for (const topic of topics) {
    if (topic.slug === 'vector-databases') {
      topic.relatedCompanies = Array.from(new Set([...topic.relatedCompanies, 'pinecone', 'weaviate']));
      console.log(`  * Linked Pinecone and Weaviate to topic: Vector Databases`);
    } else if (topic.slug === 'web3') {
      topic.relatedCompanies = Array.from(new Set([...topic.relatedCompanies, 'ethereum-foundation', 'coinbase', 'solana-foundation']));
      console.log(`  * Linked Ethereum, Coinbase, Solana to topic: Web3`);
    } else if (topic.slug === 'artificial-intelligence') {
      topic.relatedCompanies = Array.from(new Set([...topic.relatedCompanies, 'mistral-ai', 'perplexity-ai']));
      console.log(`  * Linked Mistral AI and Perplexity AI to topic: Artificial Intelligence`);
    } else if (topic.slug === 'developer-tools') {
      topic.relatedCompanies = Array.from(new Set([...topic.relatedCompanies, 'pinecone', 'weaviate']));
      console.log(`  * Linked Pinecone and Weaviate to topic: Developer Tools`);
    }
  }
  fs.writeFileSync(TOPICS_FILE, JSON.stringify(topics, null, 2), 'utf-8');

  console.log('✅ Databases scaled successfully!');
}

scaleData();
