import Link from "next/link";
import { getPersons } from "@/data/api";
import { Users, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "People Index | TechAtlas",
  description: "Browse all tech founders, AI researchers, and executives.",
};

export default function PersonsIndexPage() {
  const persons = getPersons();
  
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-3xl space-y-10">
      <header className="space-y-4 border-b border-slate-100 pb-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">People Directory</h1>
        </div>
        <p className="text-slate-500 max-w-xl text-base leading-relaxed">
          Explore and navigate verified timelines, net worth estimations, and key contributions of elite researchers and founders.
        </p>
      </header>

      <div className="flex flex-col space-y-4">
        {persons.map(p => (
          <Link 
            key={p.slug} 
            href={`/person/${p.slug}`} 
            className="flex items-start gap-4 p-5 border border-slate-200/80 rounded-2xl hover:border-indigo-500 hover:shadow-md hover:-translate-y-0.5 transition-all bg-white group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
              {getInitials(p.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <div className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors text-lg">{p.name}</div>
                {p.netWorth && (
                  <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex-shrink-0 border border-emerald-100">
                    {p.netWorth}
                  </div>
                )}
              </div>
              <div className="text-sm font-medium text-slate-500 mt-0.5">{p.title}</div>
              <p className="text-sm text-slate-600 mt-3 line-clamp-2 leading-relaxed">{p.bio}</p>
              
              {p.companies && p.companies.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Affiliations:</span>
                  {p.companies.map(cSlug => (
                    <span key={cSlug} className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                      {cSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
