import { Compass, Users, Building, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "About Us | TechAtlas",
  description: "Learn about the mission, data curation process, and team behind TechAtlas.",
};

export default function AboutPage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12 relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-black text-white px-6">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Our Purpose
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-white bg-clip-text text-transparent">
            Mapping the Tech Frontier
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed">
            TechAtlas is an intelligence directory providing structured profiles of AI researchers, industry leaders, high-growth startups, and the underlying technologies driving them.
          </p>
        </div>
      </section>

      {/* Pillars Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Our Core Focus Areas</h2>
          <p className="text-gray-500 mt-2">We construct relational mapping across three main entities to paint a complete picture of tech innovation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md hover:border-blue-500 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Founders & Researchers</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Timelines of academic achievements, key milestones, notable statements, and past ventures for the visionaries building tomorrow.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md hover:border-indigo-500 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Ventures & Startup Assets</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Funding records, employee growth, competitor landscapes, and product structures mapping the commercial engines.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md hover:border-emerald-500 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Emerging Landscapes</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Contextualizing how technologies like Large Language Models, Vector Databases, and Cloud Architectures bind organizations together.
            </p>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="bg-gray-50 rounded-2xl border border-gray-200/60 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-900">Data Curation & Reliability</h3>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            Every profile on TechAtlas is compiled using high-fidelity datasets, validated public filings, patent databases, and official press releases. We aim to present objective, structured historical context devoid of rumors and noise. If you identify an inaccuracy, please contact our support team.
          </p>
        </div>
      </section>
    </div>
  );
}
