import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsArticles } from "@/data/news";
import { getCompanyBySlug, getPersonBySlug } from "@/data/api";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Calendar, Users, Building2, Sparkles, Newspaper } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const articles = await getNewsArticles();
  const article = articles.find(a => a.slug === resolvedParams.slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: `${article.title} | TechAtlas News`,
    description: article.description,
    alternates: {
      canonical: article.link,
    }
  };
}

export default async function NewsArticleReaderPage({ params }: Props) {
  const resolvedParams = await params;
  const articles = await getNewsArticles();
  const article = articles.find(a => a.slug === resolvedParams.slug);

  if (!article) {
    notFound();
  }

  // Resolve named directory entity objects
  const relatedCompanyObjects = (article.relatedCompanies || [])
    .map(slug => getCompanyBySlug(slug))
    .filter(Boolean);

  const relatedPersonObjects = (article.relatedPersons || [])
    .map(slug => getPersonBySlug(slug))
    .filter(Boolean);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.description,
    "datePublished": article.pubDate,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": article.source
    },
    "mainEntityOfPage": article.link
  };

  return (
    <article className="max-w-3xl mx-auto space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/news" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to News Feed
        </Link>
      </div>

      {/* Content Container */}
      <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        
        {/* Source Categories */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold tracking-wider uppercase bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-full">
            {article.source}
          </span>
          {article.category && (
            <span className="text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              {article.category}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug tracking-tight">
          {article.title}
        </h1>

        {/* Date + Author details */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-400 border-b border-slate-100 pb-5">
          <span>By {article.author}</span>
          <time className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {formatDate(article.pubDate)}
          </time>
        </div>

        {/* Summary Description block */}
        <div className="prose prose-slate max-w-none text-slate-600 font-light leading-relaxed text-base md:text-lg space-y-4">
          <p>{article.description}</p>
        </div>

        {/* CTA Link Out to Original Article */}
        <div className="pt-6">
          <a 
            href={article.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-md transition-all hover:-translate-y-0.5"
          >
            Continue reading on {article.source} <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Cross-linking entities segment */}
      {(relatedCompanyObjects.length > 0 || relatedPersonObjects.length > 0) && (
        <section className="space-y-4 pt-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 px-1">
            <Sparkles className="w-4.5 h-4.5 text-indigo-500" />
            Atlas Directory Connections
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mentioned Companies */}
            {relatedCompanyObjects.map(company => {
              if (!company) return null;
              return (
                <Link 
                  key={company.slug} 
                  href={`/company/${company.slug}`} 
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-blue-500 hover:shadow-md transition-all group flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                    <Building2 className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                      {company.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Company • Est. {company.founded}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">{company.description}</p>
                  </div>
                </Link>
              );
            })}

            {/* Mentioned People */}
            {relatedPersonObjects.map(person => {
              if (!person) return null;
              return (
                <Link 
                  key={person.slug} 
                  href={`/person/${person.slug}`} 
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-500 hover:shadow-md transition-all group flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                    <Users className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-indigo-600 transition-colors">
                      {person.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">{person.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">{person.bio}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}
