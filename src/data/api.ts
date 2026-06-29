import personsData from "./persons.json";
import companiesData from "./companies.json";
import topicsData from "./topics.json";
import { Person, Company, Topic } from "./types";

export const getPersons = (): Person[] => personsData as Person[];
export const getPersonBySlug = (slug: string): Person | undefined => 
  getPersons().find(p => p.slug === slug);

export const getCompanies = (): Company[] => companiesData as Company[];
export const getCompanyBySlug = (slug: string): Company | undefined => 
  getCompanies().find(c => c.slug === slug);

export const getTopics = (): Topic[] => topicsData as Topic[];
export const getTopicBySlug = (slug: string): Topic | undefined => 
  getTopics().find(t => t.slug === slug);
