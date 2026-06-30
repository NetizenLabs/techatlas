import { MetadataRoute } from 'next';
import { getPersons, getCompanies, getTopics } from '@/data/api';

const BASE_URL = 'https://tech.netizenlabs.online';

export default function sitemap(): MetadataRoute.Sitemap {
  const persons = getPersons();
  const companies = getCompanies();
  const topics = getTopics();

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/person`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/company`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/topic`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Person routes
  const personRoutes: MetadataRoute.Sitemap = persons.map((person) => ({
    url: `${BASE_URL}/person/${person.slug}`,
    lastModified: person.lastUpdated ? new Date(person.lastUpdated) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Company routes
  const companyRoutes: MetadataRoute.Sitemap = companies.map((company) => ({
    url: `${BASE_URL}/company/${company.slug}`,
    lastModified: company.lastUpdated ? new Date(company.lastUpdated) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Topic routes
  const topicRoutes: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: `${BASE_URL}/topic/${topic.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...routes, ...personRoutes, ...companyRoutes, ...topicRoutes];
}
