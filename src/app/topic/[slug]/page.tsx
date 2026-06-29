import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTopicBySlug, getTopics } from '@/data/api';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const topic = getTopicBySlug(resolvedParams.slug);
  
  if (!topic) {
    return {
      title: 'Not Found',
    };
  }
  
  return {
    title: `${topic.name} Companies & Landscape | TechAtlas`,
    description: topic.description,
  };
}

export async function generateStaticParams() {
  const topics = getTopics();
  return topics.map((topic) => ({
    slug: topic.slug,
  }));
}

export default async function TopicPage({ params }: Props) {
  const resolvedParams = await params;
  const topic = getTopicBySlug(resolvedParams.slug);

  if (!topic) {
    notFound();
  }

  return (
    <article className="max-w-3xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2 tracking-tight text-gray-900">{topic.name}</h1>
        <p className="text-xl text-gray-500">{topic.description}</p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold mb-3 text-gray-900">Related Companies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topic.relatedCompanies.map(cSlug => (
            <Link key={cSlug} href={`/company/${cSlug}`} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
              <div className="font-semibold text-gray-900 mb-1">
                {cSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </div>
              <div className="text-sm text-gray-500">View profile &rarr;</div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
