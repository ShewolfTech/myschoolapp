import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | MySchoolApp Uganda",
  description:
    "Terms and conditions governing the use of MySchoolApp Uganda.",
};

export default function TermsOfUsePage() {
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
            Terms of Use
          </h1>

          <p className="text-sm text-slate-500">
            Last updated: September 2026
          </p>
        </header>

        <div className="space-y-10 leading-7">
          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              1. Acceptance of These Terms
            </h2>

            <p>
              These Terms of Use govern your access to and use of MySchoolApp
              Uganda. By accessing or using the platform, you agree to comply
              with these Terms.
            </p>

            <p className="mt-4">
              If you do not agree with these Terms, you should not use the
              platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              2. About MySchoolApp Uganda
            </h2>

            <p>
              MySchoolApp Uganda is a school discovery and information platform
              designed to help parents, guardians, students, and other users
              find, explore, and compare schools in different regions and
              districts of Uganda.
            </p>

            <p className="mt-4">
              The platform may also allow schools or their authorised
              representatives to submit, manage, or update school information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              3. User Accounts
            </h2>

            <p>
              Some features may require you to create an account. You are
              responsible for providing accurate information and maintaining
              the confidentiality of your login credentials.
            </p>

            <p className="mt-4">
              You are responsible for activity performed through your account
              unless you notify us promptly of suspected unauthorised access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              4. School Listings
            </h2>

            <p>
              MySchoolApp Uganda makes reasonable efforts to provide useful and
              accurate school information. However, information such as school
              fees, admission requirements, programmes, facilities, contact
              details, and other school information may change.
            </p>

            <p className="mt-4">
              Users should confirm important information directly with a school
              before making enrolment, financial, relocation, or other
              significant decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              5. School Representatives
            </h2>

            <p>
              If you register, claim, or manage a school listing, you represent
              that you are authorised to act on behalf of that school or have
              permission to provide the submitted information.
            </p>

            <p className="mt-4">
              You must ensure that information submitted to MySchoolApp Uganda
              is truthful, accurate, current, and not misleading.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              6. Acceptable Use
            </h2>

            <p>You agree not to use MySchoolApp Uganda to:</p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Provide knowingly false or misleading information.</li>
              <li>Impersonate another individual, school, or organisation.</li>
              <li>Attempt to gain unauthorised access to another account.</li>
              <li>
                Interfere with the operation, security, or availability of the
                platform.
              </li>
              <li>
                Upload malicious code, malware, or harmful technical material.
              </li>
              <li>
                Scrape, copy, or systematically extract platform content in a
                way that places an unreasonable burden on the service.
              </li>
              <li>
                Use the service for unlawful, fraudulent, abusive, or harmful
                purposes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              7. Content Submitted by Users
            </h2>

            <p>
              You remain responsible for content you submit to MySchoolApp
              Uganda.
            </p>

            <p className="mt-4">
              By submitting content intended for publication, you grant
              MySchoolApp Uganda permission to display, reproduce, format, and
              use that content as reasonably necessary to operate and promote
              the platform.
            </p>

            <p className="mt-4">
              You should not submit material that infringes the intellectual
              property, privacy, or other rights of another person or
              organisation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              8. Intellectual Property
            </h2>

            <p>
              The MySchoolApp Uganda name, branding, interface, software,
              design, and original platform content are protected by applicable
              intellectual property laws.
            </p>

            <p className="mt-4">
              School names, logos, photographs, and other third-party materials
              remain the property of their respective owners where applicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              9. No Guarantee of Admission
            </h2>

            <p>
              Listing a school on MySchoolApp Uganda does not guarantee that a
              student will be admitted to that school.
            </p>

            <p className="mt-4">
              Admission decisions, fees, requirements, scholarships, placement,
              and enrolment procedures are determined by the individual school
              or relevant institution.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              10. Third-Party Websites
            </h2>

            <p>
              MySchoolApp Uganda may provide links to school websites, social
              media profiles, map services, payment providers, or other
              third-party services.
            </p>

            <p className="mt-4">
              We do not control those services and are not responsible for
              their availability, security, content, or practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              11. Availability of the Service
            </h2>

            <p>
              We aim to keep MySchoolApp Uganda available and reliable, but we
              cannot guarantee uninterrupted or error-free access.
            </p>

            <p className="mt-4">
              We may temporarily suspend or modify parts of the service for
              maintenance, security, upgrades, or other operational reasons.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              12. Limitation of Liability
            </h2>

            <p>
              MySchoolApp Uganda provides school discovery and informational
              services. To the extent permitted by applicable law, we are not
              responsible for losses resulting solely from reliance on
              inaccurate, outdated, or incomplete information supplied by
              schools, users, or third parties.
            </p>

            <p className="mt-4">
              Users remain responsible for independently verifying important
              information before making decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              13. Suspension or Termination
            </h2>

            <p>
              We may restrict or suspend accounts that violate these Terms,
              threaten platform security, impersonate schools or individuals,
              engage in fraudulent activity, or otherwise misuse the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              14. Privacy
            </h2>

            <p>
              Our collection and use of personal information is described in
              our{" "}
              <Link
                href="/privacy-policy"
                className="font-medium underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              15. Changes to These Terms
            </h2>

            <p>
              We may update these Terms from time to time to reflect changes to
              the platform, our services, or applicable requirements.
            </p>

            <p className="mt-4">
              The latest version will be published on this page with its
              effective date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-chalkboard mb-3">
              16. Contact
            </h2>

            <p>
              Questions about these Terms may be directed to MySchoolApp Uganda
              using the contact information provided on our website.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
