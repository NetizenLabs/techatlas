const fs = require('fs');
const path = require('path');

const PERSONS_FILE = path.join(__dirname, '../src/data/persons.json');
const COMPANIES_FILE = path.join(__dirname, '../src/data/companies.json');

const MANUAL_PERSONS = {
  'sam-altman': {
    achievements: [
      'Scaled Y Combinator to fund hundreds of prominent startups',
      'Led OpenAI through the launch of ChatGPT',
      'Co-founded Worldcoin to distribute a global digital currency'
    ]
  },
  'elon-musk': {
    achievements: [
      'Pioneered reusable rocket technology with SpaceX',
      'Accelerated global transition to electric vehicles via Tesla',
      'Co-founded PayPal, revolutionizing online payments'
    ]
  },
  'jensen-huang': {
    achievements: [
      'Invented the GPU, transforming computer graphics and gaming',
      'Positioned NVIDIA as the hardware backbone of the AI revolution',
      'Maintained CEO position for over 30 years since founding NVIDIA'
    ]
  },
  'mark-zuckerberg': {
    achievements: [
      'Built the largest social networking platform in history',
      'Acquired and scaled Instagram and WhatsApp to billions of users',
      'Pivoted Meta towards massive investments in VR and open-source AI (Llama)'
    ]
  },
  'satya-nadella': {
    achievements: [
      'Successfully transitioned Microsoft into a Cloud-first company (Azure)',
      'Orchestrated strategic acquisitions of LinkedIn and GitHub',
      'Forged a multi-billion dollar exclusive partnership with OpenAI'
    ]
  },
  'sundar-pichai': {
    achievements: [
      'Led development of Google Chrome, the world\'s most popular browser',
      'Oversaw Android\'s dominance in the global smartphone market',
      'Guided Google\'s strategic pivot into an "AI-first" company'
    ]
  },
  'tim-cook': {
    achievements: [
      'Grew Apple into the world\'s first $3 Trillion company',
      'Successfully launched the Apple Watch and AirPods product lines',
      'Masterminded Apple\'s pivot towards high-margin services'
    ]
  },
  'yann-lecun': {
    achievements: [
      'Invented Convolutional Neural Networks (CNNs) for image recognition',
      'Won the 2018 Turing Award for breakthroughs in deep learning',
      'Pioneered Self-Supervised Learning research at Meta AI'
    ]
  },
  'demis-hassabis': {
    achievements: [
      'Co-founded DeepMind, solving grand challenges in AI',
      'Led the team that created AlphaGo to defeat human Go champions',
      'Developed AlphaFold, revolutionizing protein folding prediction in biology'
    ]
  },
  'dario-amodei': {
    achievements: [
      'Led AI safety research at OpenAI prior to founding Anthropic',
      'Developed Constitutional AI to create safer, steerable language models',
      'Released the Claude family of models to directly rival GPT-4'
    ]
  }
};

const MANUAL_COMPANIES = {
  'openai': {
    foundingStory: 'OpenAI was founded in December 2015 by Sam Altman, Elon Musk, Ilya Sutskever, and others. Initially a non-profit, its mission was to ensure that artificial general intelligence (AGI) benefits all of humanity. It later transitioned to a capped-profit structure to raise the capital required for massive compute resources.',
    fundingHistory: [
      { round: 'Seed', amount: '$1B', date: '2015' },
      { round: 'Corporate Round', amount: '$1B', date: '2019' },
      { round: 'Corporate Round', amount: '$10B', date: '2023' }
    ]
  },
  'nvidia': {
    foundingStory: 'Founded in 1993 by Jensen Huang, Chris Malachowsky, and Curtis Priem at a Denny\'s restaurant. They foresaw that the right computing model could solve problems general-purpose computing couldn\'t, leading to the invention of the GPU in 1999.',
    fundingHistory: [
      { round: 'Series A', amount: '$20M', date: '1993' },
      { round: 'IPO', amount: '$42M', date: '1999' }
    ]
  },
  'google': {
    foundingStory: 'Larry Page and Sergey Brin met at Stanford University in 1995. They built a search engine that used links to determine the importance of individual pages on the World Wide Web, calling it BackRub, which was shortly after renamed Google.',
    fundingHistory: [
      { round: 'Seed', amount: '$100K', date: '1998' },
      { round: 'Series A', amount: '$25M', date: '1999' },
      { round: 'IPO', amount: '$1.67B', date: '2004' }
    ]
  },
  'microsoft': {
    foundingStory: 'Childhood friends Bill Gates and Paul Allen founded Microsoft in 1975 to develop and sell BASIC interpreters for the Altair 8800. It rose to dominate the personal computer operating system market with MS-DOS in the mid-1980s.',
    fundingHistory: [
      { round: 'IPO', amount: '$61M', date: '1986' }
    ]
  },
  'meta': {
    foundingStory: 'Mark Zuckerberg launched "Thefacebook" from his Harvard dorm room in 2004. Initially restricted to Harvard students, it rapidly expanded to other universities and eventually the general public, becoming the dominant global social network.',
    fundingHistory: [
      { round: 'Angel', amount: '$500K', date: '2004' },
      { round: 'Series A', amount: '$12.7M', date: '2005' },
      { round: 'IPO', amount: '$16B', date: '2012' }
    ]
  },
  'anthropic': {
    foundingStory: 'Founded in 2021 by former senior members of OpenAI, including siblings Daniela and Dario Amodei. Anthropic was created to focus intensely on AI safety and reliability, leading to the development of Constitutional AI.',
    fundingHistory: [
      { round: 'Series A', amount: '$124M', date: '2021' },
      { round: 'Series B', amount: '$580M', date: '2022' },
      { round: 'Corporate', amount: '$4B', date: '2023' }
    ]
  },
  'deepmind': {
    foundingStory: 'Founded in London in 2010 by Demis Hassabis, Shane Legg, and Mustafa Suleyman. DeepMind aimed to "solve intelligence" and use it to solve everything else, combining systems neuroscience with machine learning.',
    fundingHistory: [
      { round: 'Seed', amount: '$50M', date: '2010' },
      { round: 'Acquisition', amount: '$500M', date: '2014' }
    ]
  },
  'stripe': {
    foundingStory: 'Irish brothers Patrick and John Collison founded Stripe in 2010. Frustrated by the difficulty of setting up online payments for their previous startups, they wrote a few lines of code that allowed any website to accept payments instantly.',
    fundingHistory: [
      { round: 'Seed', amount: '$2M', date: '2011' },
      { round: 'Series C', amount: '$80M', date: '2014' },
      { round: 'Series I', amount: '$6.5B', date: '2023' }
    ]
  },
  'vercel': {
    foundingStory: 'Guillermo Rauch founded Vercel (originally ZEIT) in 2015. Vercel created Next.js, an open-source React framework, and built a global edge network to make deploying frontend applications frictionless.',
    fundingHistory: [
      { round: 'Series A', amount: '$21M', date: '2020' },
      { round: 'Series B', amount: '$40M', date: '2020' },
      { round: 'Series D', amount: '$150M', date: '2022' }
    ]
  },
  'hugging-face': {
    foundingStory: 'Founded in 2016 by Clément Delangue, Julien Chaumond, and Thomas Wolf. Originally started as a chatbot company, they open-sourced their underlying NLP library (Transformers) which rapidly became the central hub for machine learning models.',
    fundingHistory: [
      { round: 'Series A', amount: '$15M', date: '2019' },
      { round: 'Series C', amount: '$100M', date: '2022' },
      { round: 'Series D', amount: '$235M', date: '2023' }
    ]
  }
};

async function seedManualData() {
  console.log('Seeding Manual Human-curated Data...');

  // Update Persons
  const persons = JSON.parse(fs.readFileSync(PERSONS_FILE, 'utf-8'));
  for (let i = 0; i < persons.length; i++) {
    const slug = persons[i].slug;
    if (MANUAL_PERSONS[slug]) {
      persons[i].achievements = MANUAL_PERSONS[slug].achievements;
      console.log(`  -> Hand-seeded achievements for ${persons[i].name}`);
    }
  }
  fs.writeFileSync(PERSONS_FILE, JSON.stringify(persons, null, 2), 'utf-8');

  // Update Companies
  const companies = JSON.parse(fs.readFileSync(COMPANIES_FILE, 'utf-8'));
  for (let i = 0; i < companies.length; i++) {
    const slug = companies[i].slug;
    if (MANUAL_COMPANIES[slug]) {
      companies[i].foundingStory = MANUAL_COMPANIES[slug].foundingStory;
      companies[i].fundingHistory = MANUAL_COMPANIES[slug].fundingHistory;
      console.log(`  -> Hand-seeded funding & story for ${companies[i].name}`);
    }
  }
  fs.writeFileSync(COMPANIES_FILE, JSON.stringify(companies, null, 2), 'utf-8');

  console.log('✅ Manual data injected successfully.');
}

seedManualData();
