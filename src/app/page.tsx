import Link from "next/link";
import { getPersons, getCompanies, getTopics } from "@/data/api";
import { getNewsArticles } from "@/data/news";
import { Search, Users, Building2, Sparkles, Compass, ArrowRight, TrendingUp, Newspaper, Calendar } from "lucide-react";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function Home({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams.q || "";
  const query = q.toLowerCase();

  const allPersons = getPersons();
  const allCompanies = getCompanies();
  const allTopics = getTopics().filter(t => t.relatedCompanies.length > 0);
  
  // Fetch live aggregated RSS news
  const allNews = await getNewsArticles();

  // Filter Directory elements if query exists
  const persons = query 
    ? allPersons.filter(p => p.name.toLowerCase().includes(query) || p.title.toLowerCase().includes(query))
    : allPersons.slice(0, 4);

  const companies = query
    ? allCompanies.filter(c => c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query))
    : allCompanies.slice(0, 4);

  const matchedNews = query
    ? allNews.filter(n => n.title.toLowerCase().includes(query) || n.description.toLowerCase().includes(query))
    : allNews.slice(0, 5);

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-12">
      {/* Premium Hero Banner */}
      <section className="text-center py-16 px-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            AI & Tech Intelligence Hub
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-300 via-indigo-200 to-white bg-clip-text text-transparent">
            The AI & Tech Atlas
          </h1>
          <p className="text-slate-300 max-w-lg mx-auto text-base md:text-lg font-light leading-relaxed">
            Your dynamic gateway for technology news, research feeds, and verified intelligence profiles on startups and builders.
          </p>
          
          {/* Search Form (Server-Driven) */}
          <form action="/" method="GET" className="max-w-lg mx-auto relative mt-8">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search news, people, or companies..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-base md:text-lg transition-all shadow-lg"
            />
            {q && (
              <Link href="/" className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
                Clear
              </Link>
            )}
          </form>
        </div>
      </section>

      {/* Main Grid: News Feed + Directory Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Live Aggregated News (Takes 2 cols on wide screens) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-amber-500" />
              {query ? "News Results" : "Latest Tech & AI Feed"}
            </h2>
            <Link href="/news" className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group">
              Explore feed <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-4">
            {matchedNews.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
                <p className="text-slate-400 text-sm">No articles found matching "{q}"</p>
              </div>
            )}
            {matchedNews.map(article => (
              <article 
                key={article.slug} 
                className="bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-amber-500 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all group space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">
                      {article.source}
                    </span>
                    {article.category && (
                      <span className="text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {article.category}
                      </span>
                    )}
                  </div>
                  <time className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formatDate(article.pubDate)}
                  </time>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors">
                    <Link href={`/news/${article.slug}`}>{article.title}</Link>
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{article.description}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-50">
                  <span className="text-xs font-semibold text-slate-400">By {article.author}</span>
                  
                  {/* Entity Cross-References */}
                  {(article.relatedCompanies || article.relatedPersons) && (
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase mr-1">Mentioned:</span>
                      {article.relatedCompanies?.map(cSlug => (
                        <Link 
                          key={cSlug} 
                          href={`/company/${cSlug}`} 
                          className="text-[10px] font-bold text-blue-600 bg-blue-50/50 hover:bg-blue-50 border border-blue-100 px-2 py-0.5 rounded"
                        >
                          {cSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </Link>
                      ))}
                      {article.relatedPersons?.map(pSlug => (
                        <Link 
                          key={pSlug} 
                          href={`/person/${pSlug}`} 
                          className="text-[10px] font-bold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded"
                        >
                          {pSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Right Column: Search Directory Directory List & Sidebar (Takes 1 col) */}
        <div className="space-y-8">
          
          {/* People Results */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-indigo-500" />
                {query ? "Directory People" : "Featured People"}
              </h2>
              {!query && (
                <Link href="/person" className="text-xs font-bold text-blue-600 hover:underline">
                  All
                </Link>
              )}
            </div>
            
            <div className="flex flex-col space-y-3">
              {persons.length === 0 && <p className="text-slate-400 text-xs text-center py-4 bg-white rounded-2xl border border-slate-100">No matching people</p>}
              {persons.map(p => (
                <Link 
                  key={p.slug} 
                  href={`/person/${p.slug}`} 
                  className="flex items-center gap-3 p-3 bg-white border border-slate-200/80 rounded-2xl hover:border-indigo-500 hover:shadow-xs transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {getInitials(p.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors text-xs">{p.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{p.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Company Results */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4.5 h-4.5 text-blue-500" />
                {query ? "Directory Companies" : "Top Companies"}
              </h2>
              {!query && (
                <Link href="/company" className="text-xs font-bold text-blue-600 hover:underline">
                  All
                </Link>
              )}
            </div>
            
            <div className="flex flex-col space-y-3">
              {companies.length === 0 && <p className="text-slate-400 text-xs text-center py-4 bg-white rounded-2xl border border-slate-100">No matching companies</p>}
              {companies.map(c => (
                <Link 
                  key={c.slug} 
                  href={`/company/${c.slug}`} 
                  className="flex items-center gap-3 p-3 bg-white border border-slate-200/80 rounded-2xl hover:border-blue-500 hover:shadow-xs transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {getInitials(c.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors text-xs">{c.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">Est. {c.founded} • {c.headquarters}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
      
      {/* Topics Footer Segment */}
      {!query && (
        <section className="pt-8 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-500" />
              Explore landscapes
            </h2>
            <Link href="/topic" className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group">
              View all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allTopics.map(t => (
              <Link 
                key={t.slug} 
                href={`/topic/${t.slug}`} 
                className="p-5 bg-white border border-slate-200/80 rounded-2xl hover:border-emerald-500 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className="font-bold text-slate-900 mb-1.5 group-hover:text-emerald-600 transition-colors">
                  {t.name}
                </div>
                <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">{t.description}</p>
                <div className="text-xs font-semibold text-emerald-600 inline-flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {t.relatedCompanies.length} companies
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
