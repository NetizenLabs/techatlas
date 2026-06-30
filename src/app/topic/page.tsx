import Link from "next/link";
import { getTopics } from "@/data/api";
import { Compass, ArrowLeft, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Tech Topics & AI Frameworks Index | TechAtlas",
  description: "Browse AI frameworks, vector databases, cloud computing platforms, and other tech domains.",
};

export default function TopicsIndexPage() {
  const topics = getTopics().filter(t => t.relatedCompanies.length > 0);

  return (
    <div className="max-w-3xl space-y-10">
      <header className="space-y-4 border-b border-slate-100 pb-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Explore Topics</h1>
        </div>
        <p className="text-slate-500 max-w-xl text-base leading-relaxed">
          Navigate organized directories covering AI frameworks, databases, and foundational models linked to active organizations.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {topics.map(t => (
          <Link 
            key={t.slug} 
            href={`/topic/${t.slug}`} 
            className="p-6 bg-white border border-slate-200/80 rounded-2xl hover:border-emerald-500 hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <div className="font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors text-lg">
              {t.name}
            </div>
            <p className="text-sm text-slate-500 mb-4 line-clamp-3 leading-relaxed">{t.description}</p>
            <div className="text-xs font-semibold text-emerald-600 inline-flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {t.relatedCompanies.length} companies mapping &rarr;
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
