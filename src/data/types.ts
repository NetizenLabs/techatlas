export interface Person {
  slug: string;
  name: string;
  title: string;
  bio: string;
  netWorth: string;
  age: number;
  companies: string[]; // Slugs of companies they are associated with
  education: string;
  socials: {
    twitter?: string;
    linkedin?: string;
  };
  lastUpdated?: string;
  // Enhanced SEO Fields
  careerTimeline?: { year: string; event: string }[];
  achievements?: string[];
  quotes?: { text: string; source: string; year?: string }[];
  relatedPersons?: string[]; // Slugs for internal linking
}

export interface Company {
  slug: string;
  name: string;
  founded: number;
  founders: string[]; // Slugs of founders
  headquarters: string;
  employees: string;
  funding: string;
  valuation: string;
  description: string;
  website: string;
  lastUpdated?: string;
  // Enhanced SEO Fields
  foundingStory?: string;
  milestones?: { year: string; event: string }[];
  products?: string[];
  fundingHistory?: { round: string; amount: string; date: string }[];
  competitors?: string[]; // Slugs for internal linking
}

export interface Topic {
  slug: string;
  name: string;
  description: string;
  relatedCompanies: string[]; // Slugs of companies
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  content?: string;
  link: string;
  pubDate: string;
  source: string;
  author: string;
  category?: string;
}
