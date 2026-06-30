import Link from "next/link";
import { getCompanies } from "@/data/api";
import { Building2, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Companies Index | TechAtlas",
  description: "Browse tech and AI companies.",
};

export default function CompaniesIndexPage() {
  const companies = getCompanies();
  
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
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Companies Directory</h1>
        </div>
        <p className="text-slate-500 max-w-xl text-base leading-relaxed">
          Browse profiles of SaaS platforms, deep-tech operations, and AI research startups tracking their growth, funding, and founders.
        </p>
      </header>

      <div className="flex flex-col space-y-4">
        {companies.map(c => (
          <Link 
            key={c.slug} 
            href={`/company/${c.slug}`} 
            className="flex items-start gap-4 p-5 border border-slate-200/80 rounded-2xl hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5 transition-all bg-white group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
              {getInitials(c.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <div className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors text-lg">{c.name}</div>
                <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full flex-shrink-0 border border-slate-200">
                  Est. {c.founded}
                </div>
              </div>
              <div className="text-sm font-medium text-slate-500 mt-0.5">{c.headquarters}</div>
              <p className="text-sm text-slate-600 mt-3 line-clamp-2 leading-relaxed">{c.description}</p>
              
              <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-500 border-t border-slate-100 pt-3">
                {c.valuation && (
                  <div>
                    <span className="text-slate-400 font-medium">Valuation:</span> <span className="text-slate-700">{c.valuation}</span>
                  </div>
                )}
                {c.funding && (
                  <div>
                    <span className="text-slate-400 font-medium">Total Funding:</span> <span className="text-slate-700">{c.funding}</span>
                  </div>
                )}
                {c.employees && (
                  <div>
                    <span className="text-slate-400 font-medium">Size:</span> <span className="text-slate-700">{c.employees}</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
