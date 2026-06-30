import Link from "next/link";
import { getNewsArticles } from "@/data/news";
import { ArrowLeft, Search, Newspaper, Calendar, ArrowRight } from "lucide-react";

interface Props {
  searchParams: Promise<{ source?: string; category?: string; q?: string }>;
}

export const metadata = {
  title: "AI & Tech News Hub | TechAtlas",
  description: "Live aggregated AI and technology insights from top developer feeds and tech resources.",
};

export default async function NewsIndexPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const sourceFilter = resolvedSearchParams.source || "";
  const categoryFilter = resolvedSearchParams.category || "";
  const q = resolvedSearchParams.q || "";
  const query = q.toLowerCase();

  // Load all parsed RSS news articles
  const allArticles = await getNewsArticles();

  // Apply filters
  const filteredArticles = allArticles.filter(article => {
    if (sourceFilter && article.source !== sourceFilter) return false;
    if (categoryFilter && article.category !== categoryFilter) return false;
    if (query) {
      const matchScope = `${article.title} ${article.description} ${article.author}`.toLowerCase();
      if (!matchScope.includes(query)) return false;
    }
    return true;
  });

  // Extract list of unique categories and sources for filters
  const uniqueSources = Array.from(new Set(allArticles.map(a => a.source)));
  const uniqueCategories = Array.from(new Set(allArticles.filter(a => a.category).map(a => a.category as string)));

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
    <div className="max-w-3xl space-y-10">
      <header className="space-y-4 border-b border-slate-100 pb-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Newspaper className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">AI & Tech News Hub</h1>
        </div>
        <p className="text-slate-500 max-w-xl text-base leading-relaxed">
          Stay updated with real-time parsed insights covering software engineering, neural networks, startups, and open-source releases.
        </p>

        {/* Article Search Bar */}
        <form action="/news" method="GET" className="relative max-w-md pt-2">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search within feed..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200/80 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm transition-all"
          />
          {sourceFilter && <input type="hidden" name="source" value={sourceFilter} />}
          {categoryFilter && <input type="hidden" name="category" value={categoryFilter} />}
        </form>
      </header>

      {/* Filters Column */}
      <section className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Source Filters */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Feed Sources</div>
          <div className="flex flex-wrap gap-2">
            <Link 
              href={`/news${categoryFilter ? `?category=${encodeURIComponent(categoryFilter)}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                !sourceFilter 
                  ? "bg-amber-600 border-amber-600 text-white shadow-xs" 
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              All Sources
            </Link>
            {uniqueSources.map(source => {
              const queryParams = new URLSearchParams();
              queryParams.set("source", source);
              if (categoryFilter) queryParams.set("category", categoryFilter);
              if (q) queryParams.set("q", q);
              return (
                <Link 
                  key={source}
                  href={`/news?${queryParams.toString()}`}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                    sourceFilter === source
                      ? "bg-amber-600 border-amber-600 text-white shadow-xs" 
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {source}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Category Filters */}
        {uniqueCategories.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categories</div>
            <div className="flex flex-wrap gap-2">
              <Link 
                href={`/news${sourceFilter ? `?source=${encodeURIComponent(sourceFilter)}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                  !categoryFilter 
                    ? "bg-slate-900 border-slate-900 text-white shadow-xs" 
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                All Categories
              </Link>
              {uniqueCategories.map(cat => {
                const queryParams = new URLSearchParams();
                queryParams.set("category", cat);
                if (sourceFilter) queryParams.set("source", sourceFilter);
                if (q) queryParams.set("q", q);
                return (
                  <Link 
                    key={cat}
                    href={`/news?${queryParams.toString()}`}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                      categoryFilter === cat
                        ? "bg-slate-900 border-slate-900 text-white shadow-xs" 
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Articles Feed */}
      <section className="space-y-4">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Showing {filteredArticles.length} Article{filteredArticles.length === 1 ? "" : "s"}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
            <p className="text-slate-400 text-sm">No articles match your current filtering criteria.</p>
          </div>
        )}

        <div className="flex flex-col space-y-4">
          {filteredArticles.map(article => (
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
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{article.description}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-50">
                <span className="text-xs font-semibold text-slate-400">By {article.author}</span>
                
                {/* Cross-linking entities */}
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
      </section>
    </div>
  );
}
