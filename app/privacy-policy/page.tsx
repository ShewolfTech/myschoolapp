import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | MySchoolApp Uganda",
  description:
    "Learn how MySchoolApp Uganda collects, uses, stores, and protects information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-10">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Back to MySchoolApp Uganda
          </Link>
        </div>

        <header className="mb-10 border-b border-slate-200 pb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-chalkboard mb-3">
            Privacy Policy
          </h1>

          <p className="text-sm text-slate-500">
            Last updated: September 2026
          </p>
        </header>

        <div className="space-y-10 leading-7">
          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              1. Introduction
            </h2>

            <p>
              MySchoolApp Uganda helps parents, students, guardians, and other
              users discover and compare schools across Uganda. We respect your
              privacy and are committed to handling personal information
              responsibly and in accordance with applicable data protection
              laws.
            </p>

            <p className="mt-4">
              This Privacy Policy explains what information we may collect,
              why we collect it, how we use it, and the choices available to
              you when using MySchoolApp Uganda.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              2. Information We Collect
            </h2>

            <p>Depending on how you use the platform, we may collect:</p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                Account information such as your name and email address.
              </li>
              <li>
                Information provided when creating or updating a user profile.
              </li>
              <li>
                School information submitted through school registration or
                listing forms.
              </li>
              <li>
                Saved schools, favourites, searches, and other preferences.
              </li>
              <li>
                Messages or information you provide when contacting us.
              </li>
              <li>
                Technical information such as browser type, device type,
                approximate location, IP address, and usage information.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              3. How We Use Information
            </h2>

            <p>We may use collected information to:</p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Provide and maintain MySchoolApp Uganda.</li>
              <li>Create and manage user accounts.</li>
              <li>Display and manage school listings.</li>
              <li>Allow users to save and compare schools.</li>
              <li>
                Verify information submitted by schools or authorised
                representatives.
              </li>
              <li>
                Communicate important account, security, or service updates.
              </li>
              <li>
                Respond to questions, support requests, and feedback.
              </li>
              <li>Improve the performance and usability of the platform.</li>
              <li>Prevent fraud, abuse, and unauthorised access.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              4. School Information
            </h2>

            <p>
              Some information displayed on MySchoolApp Uganda relates to
              schools rather than individual users. This may include school
              names, locations, contact information, programmes, facilities,
              fees, admission information, and other details useful to parents
              and students.
            </p>

            <p className="mt-4">
              School representatives are responsible for ensuring that
              information they submit is accurate and that they have authority
              to provide it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              5. How We Share Information
            </h2>

            <p>
              We do not sell your personal information. We may share limited
              information with service providers that help us operate the
              platform, such as hosting, authentication, email, security,
              analytics, and database providers.
            </p>

            <p className="mt-4">
              We may also disclose information where required by law, to
              protect the security of our platform, or to protect the rights
              and safety of our users or others.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              6. Cookies and Similar Technologies
            </h2>

            <p>
              MySchoolApp Uganda may use cookies and similar technologies to
              maintain login sessions, remember preferences, improve security,
              understand usage, and provide essential platform functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              7. Data Security
            </h2>

            <p>
              We use reasonable technical and organisational safeguards to
              protect information from unauthorised access, loss, misuse,
              alteration, or disclosure. However, no internet-based service can
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              8. Data Retention
            </h2>

            <p>
              We retain personal information only for as long as reasonably
              necessary to provide our services, meet legal obligations,
              resolve disputes, prevent abuse, and maintain appropriate
              business records.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              9. Your Rights
            </h2>

            <p>
              Subject to applicable law, you may have the right to request
              access to personal information we hold about you, ask us to
              correct inaccurate information, request deletion of certain
              information, or object to certain forms of processing.
            </p>

            <p className="mt-4">
              You may also update some account information directly through
              your MySchoolApp Uganda account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              10. Children&apos;s Privacy
            </h2>

            <p>
              MySchoolApp Uganda provides information about schools and may be
              used by students as well as parents and guardians. We do not
              intentionally request unnecessary sensitive personal information
              from children.
            </p>

            <p className="mt-4">
              Where parental or guardian consent is required by applicable law,
              users should obtain that consent before providing personal
              information relating to a child.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              11. Third-Party Services
            </h2>

            <p>
              Our platform may contain links to school websites or other
              third-party services. We are not responsible for the privacy
              practices, security, or content of third-party websites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              12. Changes to This Privacy Policy
            </h2>

            <p>
              We may update this Privacy Policy when our services, technology,
              or legal obligations change. The latest version will always be
              published on this page with the date of the most recent update.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              13. Contact Us
            </h2>

            <p>
              If you have questions about this Privacy Policy or how your
              information is handled, please contact MySchoolApp Uganda through
              the contact information provided on our website.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
