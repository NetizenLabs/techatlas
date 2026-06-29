import Link from "next/link";
import { getTopics } from "@/data/api";

export const metadata = {
  title: "Tech Topics & AI Frameworks Index | TechAtlas",
  description: "Browse AI frameworks, vector databases, cloud computing platforms, and other tech domains.",
};

export default function TopicsIndexPage() {
  const topics = getTopics();

  return (
    <div className="max-w-3xl">
      <header className="mb-8 border-b border-gray-100 pb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Explore Topics</h1>
        <p className="text-gray-600">Browse AI frameworks, dev tools, and emerging tech landscapes.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {topics.map(t => (
          <Link key={t.slug} href={`/topic/${t.slug}`} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
            <div className="font-semibold text-gray-900 mb-1">
              {t.name}
            </div>
            <div className="text-sm text-gray-500 mb-2">{t.description.substring(0, 80)}...</div>
            <div className="text-xs font-medium text-blue-600">
              {t.relatedCompanies.length} related companies &rarr;
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
