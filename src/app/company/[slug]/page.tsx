import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCompanyBySlug, getCompanies } from '@/data/api';
import Link from 'next/link';

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
    description: company.description,
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

  return (
    <article className="max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight text-gray-900">{company.name}</h1>
          <p className="text-xl text-gray-500">{company.description}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">Founders</h2>
            <div className="flex flex-wrap gap-3">
              {company.founders.map(fSlug => (
                <Link key={fSlug} href={`/person/${fSlug}`} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
                  {fSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Company Facts</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-gray-500">Founded</dt>
                <dd className="font-medium text-gray-900">{company.founded}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Headquarters</dt>
                <dd className="font-medium text-gray-900">{company.headquarters}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Employees</dt>
                <dd className="font-medium text-gray-900">{company.employees}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Funding</dt>
                <dd className="font-medium text-gray-900">{company.funding}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Valuation</dt>
                <dd className="font-medium text-gray-900">{company.valuation}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Website</dt>
                <dd className="font-medium text-gray-900">
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {new URL(company.website).hostname}
                  </a>
                </dd>
              </div>
              {company.lastUpdated && (
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <dt className="text-xs text-gray-500">Last Verified</dt>
                  <dd className="text-xs font-medium text-gray-700">{new Date(company.lastUpdated).toLocaleDateString()}</dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>
    </article>
  );
}
