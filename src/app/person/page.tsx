import Link from "next/link";
import { getPersons } from "@/data/api";

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
    <div className="max-w-3xl">
      <header className="mb-8 border-b border-gray-100 pb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">People Directory</h1>
        <p className="text-gray-600">Browse all tech founders, AI researchers, and executives.</p>
      </header>

      <div className="flex flex-col space-y-3">
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
    </div>
  );
}
