import Link from "next/link";
import { restaurantInfo } from "@/lib/menuData";

export const metadata = { title: "Impressum — Karmel Café & Restaurant" };

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-stone-300 px-6 py-24 md:py-32">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-amber-500 text-xs uppercase tracking-widest">
          ← Back
        </Link>
        <h1 className="text-3xl md:text-4xl text-white mt-6 mb-10">Impressum</h1>

        <div className="border border-amber-500/40 bg-amber-500/5 text-amber-200 text-xs sm:text-sm px-5 py-4 mb-10">
          <strong>Note for the site operator:</strong> the bracketed placeholders
          below must be filled in with your real business details before this
          site goes live — an incomplete or inaccurate Impressum is itself a
          legal risk under §5 DDG. Have a lawyer or a service such as
          eRecht24/Trusted Shops verify the final text.
        </div>

        <Section title="Angaben gemäß § 5 DDG">
          <p>{restaurantInfo.name}</p>
          <p>[Vollständiger Name des Betreibers/Inhabers bzw. Rechtsform, z. B. „Max Mustermann“ oder „Karmel GmbH“]</p>
          <p>{restaurantInfo.address}</p>
        </Section>

        <Section title="Kontakt">
          <p>Telefon: {restaurantInfo.phone}</p>
          <p>E-Mail: [kontakt@ihre-domain.de]</p>
        </Section>

        <Section title="Umsatzsteuer-ID">
          <p>
            [Umsatzsteuer-Identifikationsnummer gemäß §27a UStG, falls vorhanden
            — sonst diesen Abschnitt entfernen]
          </p>
        </Section>

        <Section title="Handelsregister">
          <p>
            [Falls im Handelsregister eingetragen: Registergericht und
            Registernummer — sonst diesen Abschnitt entfernen]
          </p>
        </Section>

        <Section title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
          <p>[Name und Anschrift der verantwortlichen Person]</p>
        </Section>

        <Section title="EU-Streitschlichtung">
          <p>
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            . Unsere E-Mail-Adresse finden Sie oben. Wir sind nicht bereit oder
            verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen. [Anpassen, falls dies
            nicht zutrifft.]
          </p>
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-amber-500 text-sm uppercase tracking-widest mb-2">{title}</h2>
      <div className="text-sm leading-relaxed space-y-1">{children}</div>
    </section>
  );
}
