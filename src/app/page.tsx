"use client";

import Link from "next/link";
import { useState } from "react";
import { getPersons, getCompanies, getTopics } from "@/data/api";

export default function Home() {
  const [search, setSearch] = useState("");
  const allPersons = getPersons();
  const allCompanies = getCompanies();
  const allTopics = getTopics();

  const query = search.toLowerCase();
  
  const persons = query 
    ? allPersons.filter(p => p.name.toLowerCase().includes(query) || p.title.toLowerCase().includes(query))
    : allPersons.slice(0, 4);

  const companies = query
    ? allCompanies.filter(c => c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query))
    : allCompanies.slice(0, 4);

  const topics = allTopics;

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-12">
      <section className="text-center py-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900">
          The Tech & AI Directory
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-8">
          Explore structured profiles of tech founders, AI researchers, companies, and the tools they build.
        </p>
        
        <div className="max-w-xl mx-auto relative">
          <input
            type="text"
            placeholder="Search for people, companies, or tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg transition-shadow"
          />
          <svg className="absolute left-4 top-4 h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center justify-between">
            {query ? "People Results" : "Featured People"}
            {!query && <Link href="/person" className="text-sm font-normal text-blue-600 hover:underline">View all</Link>}
          </h2>
          <div className="flex flex-col space-y-3">
            {persons.length === 0 && <p className="text-gray-500 text-sm">No people found.</p>}
            {persons.map(p => (
              <Link key={p.slug} href={`/person/${p.slug}`} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-sm transition-all bg-white">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold flex-shrink-0">
                  {getInitials(p.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="font-semibold text-gray-900 truncate">{p.name}</div>
                    <div className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0">
                      {p.netWorth}
                    </div>
                  </div>
                  <div className="text-sm text-gray-900 mt-0.5">{p.title}</div>
                  <div className="text-sm text-gray-500 mt-1 line-clamp-1">{p.bio}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center justify-between">
            {query ? "Company Results" : "Top Companies"}
            {!query && <Link href="/company" className="text-sm font-normal text-blue-600 hover:underline">View all</Link>}
          </h2>
          <div className="flex flex-col space-y-3">
            {companies.length === 0 && <p className="text-gray-500 text-sm">No companies found.</p>}
            {companies.map(c => (
              <Link key={c.slug} href={`/company/${c.slug}`} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-sm transition-all bg-white">
                <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-700 flex-shrink-0">
                  {getInitials(c.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="font-semibold text-gray-900 truncate">{c.name}</div>
                    <div className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
                      Est. {c.founded}
                    </div>
                  </div>
                  <div className="text-sm text-gray-900 mt-0.5">{c.headquarters}</div>
                  <div className="text-sm text-gray-500 mt-1 line-clamp-1">{c.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
      
      {!query && (
        <section className="pt-4 border-t border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center justify-between">
            Explore Topics
            <Link href="/topic" className="text-sm font-normal text-blue-600 hover:underline">View all</Link>
          </h2>
          <div className="flex flex-wrap gap-2">
            {topics.map(t => (
              <Link key={t.slug} href={`/topic/${t.slug}`} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors border border-transparent">
                {t.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
