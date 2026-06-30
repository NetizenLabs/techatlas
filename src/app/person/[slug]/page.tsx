import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPersonBySlug, getPersons, getPersonBySlug as getRelatedPerson } from '@/data/api';
import Link from 'next/link';
import { Quote, Trophy, CalendarDays, ExternalLink, ArrowLeft, GraduationCap, DollarSign, Calendar } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const person = getPersonBySlug(resolvedParams.slug);
  
  if (!person) {
    return {
      title: 'Not Found',
    };
  }
  
  return {
    title: `${person.name} - Career Timeline, Net Worth & Bio | TechAtlas`,
    description: person.bio || `Learn about the career timeline, achievements, and biography of ${person.name}.`,
  };
}

export async function generateStaticParams() {
  const persons = getPersons();
  return persons.map((person) => ({
    slug: person.slug,
  }));
}

export default async function PersonPage({ params }: Props) {
  const resolvedParams = await params;
  const person = getPersonBySlug(resolvedParams.slug);

  if (!person) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.title,
    description: person.bio,
    url: `https://techatlas.com/person/${person.slug}`,
    sameAs: [
      person.socials.twitter,
      person.socials.linkedin,
    ].filter(Boolean),
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <article className="max-w-4xl mx-auto space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/person" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to People
        </Link>
      </div>

      {/* Main Header Card */}
      <header className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xl shrink-0 border border-indigo-100">
            {getInitials(person.name)}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{person.name}</h1>
            <p className="text-sm font-semibold text-slate-500">{person.title}</p>
          </div>
        </div>
        
        {person.netWorth && (
          <div className="bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100 text-center min-w-[120px] self-start md:self-auto">
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Net Worth</div>
            <div className="text-base font-extrabold text-emerald-800 mt-0.5">{person.netWorth}</div>
          </div>
        )}
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Biography & Timeline */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Bio */}
          {person.bio && (
            <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">Biography</h2>
              <p className="text-slate-600 leading-relaxed text-base font-light">{person.bio}</p>
            </section>
          )}

          {/* Timeline */}
          {person.careerTimeline && person.careerTimeline.length > 0 && (
            <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <CalendarDays className="w-5 h-5 text-indigo-500" />
                Career Timeline
              </h2>
              <div className="relative border-l border-slate-200 ml-3 space-y-6 pb-2">
                {person.careerTimeline.map((item, idx) => (
                  <div key={idx} className="relative pl-6 group">
                    <span className="absolute -left-[5.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border border-indigo-500 group-hover:bg-indigo-500 transition-colors"></span>
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                      <time className="text-xs font-bold text-indigo-600 tracking-wider uppercase min-w-[3rem]">{item.year}</time>
                      <p className="text-slate-800 font-semibold leading-relaxed text-sm">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements */}
          {person.achievements && person.achievements.length > 0 && (
            <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Trophy className="w-5 h-5 text-amber-500" />
                Key Achievements
              </h2>
              <ul className="space-y-3">
                {person.achievements.map((achievement, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 text-sm font-semibold text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Quotes */}
          {person.quotes && person.quotes.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 px-1">
                <Quote className="w-5 h-5 text-indigo-500" />
                Notable Quotes
              </h2>
              <div className="space-y-4">
                {person.quotes.map((quote, idx) => (
                  <blockquote key={idx} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs relative space-y-3">
                    <p className="text-base text-slate-800 font-serif italic leading-relaxed">
                      "{quote.text}"
                    </p>
                    <footer className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                      <span className="w-3 h-[1px] bg-slate-200"></span>
                      {quote.source} {quote.year && <span>({quote.year})</span>}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">Quick Facts</h3>
            <dl className="space-y-4">
              {person.netWorth && (
                <div className="flex items-start gap-2.5">
                  <DollarSign className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                  <div>
                    <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Net Worth</dt>
                    <dd className="font-bold text-slate-900 text-sm">{person.netWorth}</dd>
                  </div>
                </div>
              )}
              {person.age && (
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                  <div>
                    <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Age</dt>
                    <dd className="font-bold text-slate-900 text-sm">{person.age} years</dd>
                  </div>
                </div>
              )}
              {person.education && (
                <div className="flex items-start gap-2.5">
                  <GraduationCap className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                  <div>
                    <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Education</dt>
                    <dd className="font-bold text-slate-900 text-sm leading-snug">{person.education}</dd>
                  </div>
                </div>
              )}
              {person.lastUpdated && (
                <div className="pt-4 border-t border-slate-100">
                  <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Last Verified</dt>
                  <dd className="text-xs font-semibold text-slate-500">{new Date(person.lastUpdated).toLocaleDateString()}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Social Links */}
          {(person.socials.twitter || person.socials.linkedin) && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-xs tracking-wider uppercase border-b border-slate-100 pb-2">Social Channels</h3>
              <div className="flex flex-col gap-2">
                {person.socials.linkedin && (
                  <a href={person.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-blue-50/20 transition-all">
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {person.socials.twitter && (
                  <a href={person.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-slate-600 hover:text-sky-600 flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-sky-50/20 transition-all">
                    <span>Twitter/X Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Associated Companies */}
          {person.companies && person.companies.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-950 text-sm tracking-wide uppercase px-1">Associated Companies</h3>
              <div className="flex flex-col gap-2">
                {person.companies.map(cSlug => (
                  <Link key={cSlug} href={`/company/${cSlug}`} className="group flex items-center justify-between p-3 bg-white border border-slate-200/80 rounded-2xl hover:border-blue-500 hover:shadow-xs transition-all">
                    <span className="font-semibold text-slate-800 text-xs">{cSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related People */}
          {person.relatedPersons && person.relatedPersons.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-950 text-sm tracking-wide uppercase px-1">Related People</h3>
              <div className="flex flex-col gap-2">
                {person.relatedPersons.map(rSlug => {
                  const related = getRelatedPerson(rSlug);
                  if (!related) return null;
                  return (
                    <Link key={rSlug} href={`/person/${rSlug}`} className="group flex items-center gap-3 p-3 bg-white border border-slate-200/80 rounded-2xl hover:border-indigo-500 hover:shadow-xs transition-all">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {related.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors text-sm">{related.name}</div>
                        <div className="text-[10px] font-semibold text-slate-400 truncate">{related.title}</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
