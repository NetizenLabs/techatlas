import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCompanyBySlug, getCompanies, getPersonBySlug } from '@/data/api';
import Link from 'next/link';
import { Building2, ExternalLink, Flag, Target, TrendingUp, Users, ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const company = getCompanyBySlug(resolvedParams.slug);
  
  if (!company) {
    return {
      title: 'Not Found',
    };
  }
  
  return {
    title: `${company.name} - Valuation, Founders & Funding | TechAtlas`,
    description: company.description || `Learn about the founding story, milestones, and funding history of ${company.name}.`,
  };
}

export async function generateStaticParams() {
  const companies = getCompanies();
  return companies.map((company) => ({
    slug: company.slug,
  }));
}

export default async function CompanyPage({ params }: Props) {
  const resolvedParams = await params;
  const company = getCompanyBySlug(resolvedParams.slug);

  if (!company) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    description: company.description,
    foundingDate: company.founded.toString(),
    url: company.website,
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
        <Link href="/company" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Companies
        </Link>
      </div>

      {/* Main Header Card */}
      <header className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl shrink-0 border border-blue-100">
            {getInitials(company.name)}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{company.name}</h1>
            <a href={company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
              {new URL(company.website).hostname} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
        
        <div className="flex gap-4 md:items-center">
          <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/60 text-center min-w-[100px]">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valuation</div>
            <div className="text-base font-extrabold text-slate-900 mt-0.5">{company.valuation || 'Unknown'}</div>
          </div>
          <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/60 text-center min-w-[100px]">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Founded</div>
            <div className="text-base font-extrabold text-slate-900 mt-0.5">{company.founded}</div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core Profile */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Founding Story */}
          {(company.foundingStory || company.description) && (
            <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Flag className="w-5 h-5 text-indigo-500" />
                Founding Story
              </h2>
              <div className="text-slate-600 leading-relaxed text-base font-light space-y-4">
                <p>{company.foundingStory || company.description}</p>
              </div>
            </section>
          )}

          {/* Timeline Milestones */}
          {company.milestones && company.milestones.length > 0 && (
            <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Target className="w-5 h-5 text-emerald-500" />
                Key Milestones
              </h2>
              <div className="relative border-l border-slate-200 ml-3 space-y-6 pb-2">
                {company.milestones.map((item, idx) => (
                  <div key={idx} className="relative pl-6 group">
                    <span className="absolute -left-[5.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border border-emerald-500 group-hover:bg-emerald-500 transition-colors"></span>
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                      <time className="text-xs font-bold text-emerald-600 tracking-wider uppercase min-w-[3rem]">{item.year}</time>
                      <p className="text-slate-800 font-semibold leading-relaxed text-sm">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Funding History Table */}
          {company.fundingHistory && company.fundingHistory.length > 0 && (
            <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Funding History
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Round</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {company.fundingHistory.map((funding, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 text-sm text-slate-500 font-semibold">{funding.date}</td>
                        <td className="py-3.5 text-sm text-slate-900 font-bold">{funding.round}</td>
                        <td className="py-3.5 text-sm font-extrabold text-emerald-600 text-right">{funding.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Directory Details */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">Company Facts</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Headquarters</dt>
                <dd className="font-bold text-slate-900 text-base">{company.headquarters || 'Unknown'}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Employees</dt>
                <dd className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  {company.employees || 'Unknown'}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Funding</dt>
                <dd className="font-bold text-slate-900 text-base text-emerald-600">{company.funding || 'Unknown'}</dd>
              </div>
              {company.lastUpdated && (
                <div className="pt-4 border-t border-slate-100">
                  <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Last Verified</dt>
                  <dd className="text-xs font-semibold text-slate-500">{new Date(company.lastUpdated).toLocaleDateString()}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Founders Section */}
          {company.founders && company.founders.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-950 text-sm tracking-wide uppercase px-1">Founders</h3>
              <div className="flex flex-col gap-2">
                {company.founders.map(fSlug => {
                  const founder = getPersonBySlug(fSlug);
                  if (!founder) return null;
                  return (
                    <Link key={fSlug} href={`/person/${fSlug}`} className="group flex items-center gap-3 p-3 bg-white border border-slate-200/80 rounded-2xl hover:border-indigo-500 hover:shadow-xs transition-all">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {founder.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors text-sm">{founder.name}</div>
                        <div className="text-[10px] font-semibold text-slate-400 truncate">{founder.title}</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Core Products */}
          {company.products && company.products.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-950 text-sm tracking-wide uppercase px-1">Core Products</h3>
              <div className="flex flex-wrap gap-1.5">
                {company.products.map(product => (
                  <span key={product} className="px-2.5 py-1 bg-white text-slate-700 text-xs font-semibold rounded-lg border border-slate-200/80">
                    {product}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Competitors */}
          {company.competitors && company.competitors.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-950 text-sm tracking-wide uppercase px-1">Competitors</h3>
              <div className="flex flex-col gap-2">
                {company.competitors.map(cSlug => (
                  <Link key={cSlug} href={`/company/${cSlug}`} className="group flex items-center justify-between p-3 bg-white border border-slate-200/80 rounded-2xl hover:border-blue-500 hover:shadow-xs transition-all">
                    <span className="font-semibold text-slate-800 text-xs">{cSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
