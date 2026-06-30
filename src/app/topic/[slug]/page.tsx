import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTopicBySlug, getTopics } from '@/data/api';
import Link from 'next/link';
import { ArrowLeft, Building2 } from 'lucide-react';

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
  
  const hasCompanies = topic.relatedCompanies.length > 0;
  
  return {
    title: `${topic.name} Companies & Landscape | TechAtlas`,
    description: topic.description,
    ...(!hasCompanies && {
      robots: {
        index: false,
        follow: true,
      },
    }),
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
    <article className="max-w-3xl space-y-10">
      <header className="space-y-4 border-b border-slate-100 pb-8">
        <Link href="/topic" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Topics
        </Link>
        
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">{topic.name}</h1>
          <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed">{topic.description}</p>
        </div>
      </header>

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-500" />
          Related Companies in Landscape
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topic.relatedCompanies.map(cSlug => (
            <Link 
              key={cSlug} 
              href={`/company/${cSlug}`} 
              className="p-5 bg-white border border-slate-200/80 rounded-2xl hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                  {cSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </div>
                <p className="text-xs text-slate-500">View company growth, funding records, and founding team.</p>
              </div>
              <div className="text-xs font-semibold text-blue-600 mt-4 inline-flex items-center gap-1">
                View profile &rarr;
              </div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
