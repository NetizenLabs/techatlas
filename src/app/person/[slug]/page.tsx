import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPersonBySlug, getPersons } from '@/data/api';
import Link from 'next/link';

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
    title: `${person.name} - Net Worth, Age & Bio | TechAtlas`,
    description: person.bio,
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

  return (
    <article className="max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2 tracking-tight text-gray-900">{person.name}</h1>
        <p className="text-xl text-gray-500">{person.title}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">Biography</h2>
            <div className="prose text-gray-700">
              <p>{person.bio}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">Associated Companies</h2>
            <div className="flex flex-wrap gap-3">
              {person.companies.map(cSlug => (
                <Link key={cSlug} href={`/company/${cSlug}`} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
                  {cSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Facts</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-gray-500">Net Worth</dt>
                <dd className="font-medium text-gray-900">{person.netWorth}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Age</dt>
                <dd className="font-medium text-gray-900">{person.age}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Education</dt>
                <dd className="font-medium text-gray-900">{person.education}</dd>
              </div>
              {person.lastUpdated && (
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <dt className="text-xs text-gray-500">Last Verified</dt>
                  <dd className="text-xs font-medium text-gray-700">{new Date(person.lastUpdated).toLocaleDateString()}</dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>
    </article>
  );
}
