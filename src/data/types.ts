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
}

export interface Topic {
  slug: string;
  name: string;
  description: string;
  relatedCompanies: string[]; // Slugs of companies
}
