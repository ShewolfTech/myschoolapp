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
          <h1 className="text-3xl md:text-4xl font-bold text-chalkboard-light mb-3">
            Terms of Use
          </h1>

          <p className="text-sm text-slate-500">
            Last updated: September 2026
          </p>
        </header>

        <div className="space-y-10 leading-7">
          {/* 1. Acceptance of These Terms */}
          <section>
            <h2 className="text-xl font-semibold text-chalkboard-light mb-3">
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

          {/* 2. About MySchoolApp Uganda */}
          <section>
            <h2 className="text-xl font-semibold text-chalkboard-light mb-3">
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

          {/* 3. User Accounts */}
          <section>
            <h2 className="text-xl font-semibold text-chalkboard-light mb-3">
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

          {/* 4. School Listings */}
          <section>
            <h2 className="text-xl font-semibold text-chalkboard-light mb-3">
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

          {/* 5. School Representatives */}
          <section>
            <h2 className="text-xl font-semibold text-chalkboard-light mb-3">
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

          {/* 6. School Subscriptions and Payments */}
          <section>
            <h2 className="text-xl font-semibold text-chalkboard-light mb-3">
              6. School Subscriptions and Payments
            </h2>

            <p>
              Schools that wish to be listed on MySchoolApp Uganda are required
              to purchase an annual subscription. The applicable subscription
              fee must be paid in full before a school can be reviewed,
              approved, and published as an active school listing on the
              platform.
            </p>

            <p className="mt-4">
              Payment of the subscription fee does not automatically guarantee
              approval or publication. MySchoolApp Uganda reserves the right
              to verify the information submitted by a school and to approve
              or reject a school listing at its discretion.
            </p>

            <p className="mt-4">
              The person registering a school is responsible for ensuring that
              the school is genuine, legitimately operating as represented, and
              that they are authorised to submit the school for listing.
              MySchoolApp Uganda may request additional information or
              documentation to verify a school's identity, existence,
              ownership, or authorisation.
            </p>

            <h3 className="text-lg font-semibold text-chalkboard-light mt-6 mb-3">
              Non-Refundable Payments
            </h3>

            <p>
              Subscription payments are generally non-refundable once payment
              has been made. In particular, no refund will be issued where:
            </p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                a person registers a school that does not exist;
              </li>
              <li>
                a person knowingly provides false, misleading, or fraudulent
                information;
              </li>
              <li>
                a person impersonates a school or registers a school without
                authorisation;
              </li>
              <li>
                the submitted school information cannot be reasonably verified;
              </li>
              <li>
                a school is rejected, suspended, or removed because of false,
                misleading, fraudulent, or unauthorised information; or
              </li>
              <li>
                an account or school listing is terminated because of a
                violation of these Terms.
              </li>
            </ul>

            <p className="mt-4">
              By making a payment, the person submitting the school
              acknowledges and agrees that the subscription fee is not a
              payment for guaranteed approval or publication. Payment is
              required for the school's application to and, once approved,
              participation in the MySchoolApp Uganda platform.
            </p>

            <p className="mt-4">
              Where a legitimate school is approved, the subscription remains
              valid for the applicable subscription period stated at the time
              of purchase. Renewal of the subscription is subject to payment
              of the applicable renewal fee and continued compliance with
              these Terms.
            </p>
          </section>

          {/* 7. Acceptable Use */}
          <section>
            <h2 className="text-xl font-semibold text-chalkboard-light mb-3">
              7. Acceptable Use
            </h2>

            <p>You agree not to use MySchoolApp Uganda to:</p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Provide knowingly false or misleading information.</li>

              <li>
                Impersonate another individual, school, or organisation.
              </li>

              <li>
                Attempt to gain unauthorised access to another account.
              </li>

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

          {/* 8. Content Submitted by Users */}
          <section>
            <h2 className="text-xl font-semibold text-chalkboard-light mb-3">
              8. Content Submitted by Users
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

          {/* 9. Intellectual Property */}
          <section>
            <h2 className="text-xl font-semibold text-chalkboard-light mb-3">
              9. Intellectual Property
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

          {/* 10. No Guarantee of Admission */}
          <section>
            <h2 className="text-xl font-semibold text-chalkboard-light mb-3">
              10. No Guarantee of Admission
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

          {/* 11. Third-Party Websites */}
          <section>
            <h2 className="text-xl font-semibold text-chalkboard-light mb-3">
              11. Third-Party Websites
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

          {/* 12. Availability of the Service */}
          <section>
            <h2 className="text-xl font-semibold text-chalkboard-light mb-3">
              12. Availability of the Service
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

          {/* 13. Limitation of Liability */}
          <section>
            <h2 className="text-xl font-semibold text-chalkboard-light mb-3">
              13. Limitation of Liability
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

          {/* 14. Suspension or Termination */}
          <section>
            <h2 className="text-xl font-semibold text-chalkboard-light mb-3">
              14. Suspension or Termination
            </h2>

            <p>
              We may restrict or suspend accounts that violate these Terms,
              threaten platform security, impersonate schools or individuals,
              engage in fraudulent activity, or otherwise misuse the service.
            </p>
          </section>

          {/* 15. Privacy */}
          <section>
            <h2 className="text-xl font-semibold text-chalkboard-light mb-3">
              15. Privacy
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

          {/* 16. Changes to These Terms */}
          <section>
            <h2 className="text-xl font-semibold text-chalkboard-light mb-3">
              16. Changes to These Terms
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

          {/* 17. Contact */}
          <section>
            <h2 className="text-xl font-semibold text-chalkboard-light mb-3">
              17. Contact
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
