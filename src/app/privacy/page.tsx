import { Shield, EyeOff, Scale, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | TechAtlas",
  description: "Read the privacy practices and data collection policy of TechAtlas.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl space-y-12">
      <header className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Privacy Policy</h1>
        <p className="text-gray-500 mt-2">Last updated: June 2026</p>
      </header>

      <section className="prose text-gray-600 space-y-8 max-w-none">
        <p className="text-lg leading-relaxed text-gray-700">
          At TechAtlas, we prioritize transparency and privacy. This policy explains what information we collect, how it is used, and how we curate directory content.
        </p>

        {/* Section 1 */}
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1">
            <Shield className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">1. Information We Collect</h2>
            <p className="leading-relaxed">
              We do not require user accounts to browse our directory. We only collect standard, non-personally identifiable analytical data (such as page requests, search queries, browser type, and country of origin) to help optimize search indices and page performance.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-1">
            <EyeOff className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">2. Cookies and Tracking</h2>
            <p className="leading-relaxed">
              We do not use tracking pixels, behavioral advertisement targeting cookies, or third-party data tracking networks. Any cookies used are strictly technical and temporary in nature, aiming to enhance the stability and speed of your sessions.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-1">
            <Scale className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">3. Directory Content and Sourcing</h2>
            <p className="leading-relaxed">
              All data profiles featured on TechAtlas are compiled from publicly available disclosures, verified press releases, corporate directories, patent entries, and media coverage. We respect individuals' preferences regarding public information representation. If you are featured in our directory and want to request updates or removal, please reach out to us.
            </p>
          </div>
        </div>

        {/* Section 4 */}
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-1">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">4. Contact Information</h2>
            <p className="leading-relaxed">
              If you have any questions or feedback about our privacy practices, or if you need to submit a data rectification request, you can contact us at <span className="font-semibold text-gray-900">privacy@techatlas.com</span>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
