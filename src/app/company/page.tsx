import Link from "next/link";
import { getCompanies } from "@/data/api";

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
    <div className="max-w-3xl">
      <header className="mb-8 border-b border-gray-100 pb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Companies Directory</h1>
        <p className="text-gray-600">Browse all SaaS tools, startups, and AI companies.</p>
      </header>

      <div className="flex flex-col space-y-3">
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
    </div>
  );
}
