import Link from "next/link";
import { restaurantInfo } from "@/lib/menuData";

export const metadata = { title: "Datenschutzerklärung — Karmel Café & Restaurant" };

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-stone-300 px-6 py-24 md:py-32">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-amber-500 text-xs uppercase tracking-widest">
          ← Zurück
        </Link>
        <h1 className="text-3xl md:text-4xl text-white mt-6 mb-4">
          Datenschutzerklärung
        </h1>
        <p className="text-xs text-stone-500 mb-10">Stand: [Datum einfügen]</p>

        <div className="border border-amber-500/40 bg-amber-500/5 text-amber-200 text-xs sm:text-sm px-5 py-4 mb-10">
          <strong>Hinweis für den Betreiber:</strong> Die eckigen Klammern
          markieren Stellen, die mit Ihren echten Angaben ausgefüllt werden
          müssen. Diese Erklärung beschreibt, welche Daten diese Website
          technisch tatsächlich verarbeitet — lassen Sie den finalen Text vor
          Live-Schaltung von einer Anwältin/einem Anwalt für Datenschutzrecht
          prüfen.
        </div>

        <Section title="1. Verantwortlicher">
          <p>{restaurantInfo.name}</p>
          <p>[Vollständiger Name des Betreibers/Inhabers bzw. Rechtsform]</p>
          <p>{restaurantInfo.address}</p>
          <p>Telefon: {restaurantInfo.phone}</p>
          <p>E-Mail: [kontakt@ihre-domain.de]</p>
        </Section>

        <Section title="2. Übersicht der Verarbeitungen">
          <p>
            Wir verarbeiten personenbezogene Daten, wenn Sie ein Konto
            registrieren, sich anmelden, eine Tischreservierung vornehmen oder
            unsere Website besuchen. Details zu Art, Umfang, Zweck,
            Rechtsgrundlage und Speicherdauer finden Sie in den folgenden
            Abschnitten.
          </p>
        </Section>

        <Section title="3. Hosting und Server-Logfiles">
          <p>
            Diese Website wird bei [Hosting-Anbieter, z. B. Vercel Inc.,
            340 S Lemon Ave #4133, Walnut, CA 91789, USA] gehostet. Bei jedem
            Aufruf erfasst der Hosting-Anbieter automatisch technische
            Zugriffsdaten (IP-Adresse, Datum/Uhrzeit, aufgerufene Seite,
            Referrer, Browsertyp) in Server-Logfiles. Diese Verarbeitung
            erfolgt auf Grundlage unseres berechtigten Interesses (Art. 6
            Abs. 1 lit. f DSGVO) an einem sicheren und funktionsfähigen
            Betrieb der Website. Logfiles werden nach [Zeitraum, z. B.
            30 Tagen] automatisch gelöscht, sofern kein Sicherheitsvorfall
            eine längere Aufbewahrung erfordert.
          </p>
        </Section>

        <Section title="4. Registrierung und Login">
          <p>
            Bei der Registrierung erheben wir Name, E-Mail-Adresse,
            Telefonnummer und ein Passwort (gehasht mit bcrypt gespeichert,
            niemals im Klartext). Zur Bestätigung Ihrer Kontaktdaten senden
            wir einen Bestätigungscode per E-Mail und, sofern Sie eine
            Telefonnummer angeben, per SMS (über Firebase Authentication,
            siehe Abschnitt 7). Alternativ können Sie sich über Google oder
            Facebook anmelden (siehe Abschnitt 8). Rechtsgrundlage ist die
            Erfüllung eines Vertrags bzw. vorvertraglicher Maßnahmen (Art. 6
            Abs. 1 lit. b DSGVO) sowie unser berechtigtes Interesse an der
            Verhinderung von Missbrauch (Art. 6 Abs. 1 lit. f DSGVO, z. B.
            IP-basierte Ratenbegrenzung gegen automatisierte
            Registrierungsversuche). Nicht verifizierte Konten werden nach
            [7] Tagen automatisch gelöscht. Verifizierte Konten werden
            gespeichert, bis Sie deren Löschung verlangen (siehe Abschnitt
            11).
          </p>
        </Section>

        <Section title="5. Tischreservierung">
          <p>
            Bei einer Reservierung verarbeiten wir Name, E-Mail-Adresse,
            Telefonnummer, Datum, Uhrzeit, Personenzahl und optionale
            Anmerkungen, um Ihre Reservierung zu bearbeiten und zu bestätigen
            (Art. 6 Abs. 1 lit. b DSGVO). Diese Daten werden zusätzlich per
            E-Mail an das Restaurant weitergeleitet. Reservierungsdaten werden
            nach Ablauf von [24 Monaten] nach dem Reservierungsdatum
            automatisch gelöscht, sofern keine gesetzliche Aufbewahrungspflicht
            entgegensteht.
          </p>
        </Section>

        <Section title="6. Cookies und lokaler Speicher">
          <p>
            Wir setzen ein technisch notwendiges Cookie zur
            Anmeldesitzung (NextAuth-Session-Cookie) ein; dieses ist gemäß
            §25 Abs. 2 Nr. 2 TTDSG von der Einwilligungspflicht ausgenommen,
            da es zur Bereitstellung des von Ihnen ausdrücklich angeforderten
            Dienstes (Login) erforderlich ist. Ihre Cookie-Auswahl (nur
            essenziell / alle akzeptieren) speichern wir im lokalen Speicher
            (localStorage) Ihres Browsers, damit wir Sie nicht bei jedem
            Besuch erneut fragen müssen. Optionale Inhalte wie die
            Google-Maps-Karte werden erst nach Ihrer ausdrücklichen
            Einwilligung geladen (Art. 6 Abs. 1 lit. a DSGVO); Sie können
            Ihre Auswahl jederzeit über die Löschung der Browserdaten
            zurücksetzen.
          </p>
        </Section>

        <Section title="7. Firebase Authentication / Google reCAPTCHA (Telefonverifizierung)">
          <p>
            Zur Verifizierung Ihrer Telefonnummer nutzen wir Firebase
            Authentication der Google Ireland Limited, Gordon House, Barrow
            Street, Dublin 4, Irland (bzw. Google LLC, USA). Ihre
            Telefonnummer wird an Google übermittelt, um einen SMS-Code zu
            versenden; zusätzlich wird ein unsichtbares reCAPTCHA von Google
            geladen, um automatisierte Missbrauchsversuche zu erkennen.
            Rechtsgrundlage ist unser berechtigtes Interesse an der
            Verhinderung von Betrug und Missbrauch (Art. 6 Abs. 1 lit. f
            DSGVO). Diese Verarbeitung findet nur statt, wenn Sie aktiv die
            Telefonverifizierung während der Registrierung durchführen.
            Weitere Informationen:{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 underline"
            >
              Datenschutzerklärung von Google
            </a>
            .
          </p>
        </Section>

        <Section title="8. Login mit Google / Facebook">
          <p>
            Wenn Sie sich über Google oder Facebook anmelden, werden Sie zur
            jeweiligen Plattform weitergeleitet und melden sich dort mit
            Ihren Zugangsdaten an. Wir erhalten anschließend Ihren Namen und
            Ihre E-Mail-Adresse, um Ihr Konto bei uns anzulegen bzw. Sie
            anzumelden (Art. 6 Abs. 1 lit. b DSGVO). Es werden keine
            weitergehenden Daten von Google oder Facebook an uns übermittelt.
            Anbieter: Google Ireland Limited (siehe oben) bzw. Meta Platforms
            Ireland Limited, 4 Grand Canal Square, Dublin 2, Irland.
          </p>
        </Section>

        <Section title="9. Google Maps">
          <p>
            Nach Ihrer Einwilligung binden wir eine Karte von Google Maps
            ein, um den Standort des Restaurants anzuzeigen. Dabei wird Ihre
            IP-Adresse an Google übertragen. Rechtsgrundlage ist Ihre
            Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie jederzeit mit
            Wirkung für die Zukunft widerrufen können. Anbieter: Google
            Ireland Limited (siehe oben).
          </p>
        </Section>

        <Section title="10. Weitere Auftragsverarbeiter">
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Resend</strong> (Resend, Inc., USA) — Versand von
              Transaktions-E-Mails (Verifizierungscodes, Passwort-Reset,
              Reservierungsbestätigungen).
            </li>
            <li>
              <strong>Upstash</strong> (Upstash, Inc., USA) — speichert
              vorübergehend IP-Adressen bzw. E-Mail-Adressen zur
              Erkennung von Missbrauch (Ratenbegrenzung).
            </li>
            <li>
              <strong>[Datenbank-Anbieter, z. B. Neon/PostgreSQL]</strong> —
              Speicherung aller Konto- und Reservierungsdaten.
            </li>
          </ul>
          <p className="mt-2">
            Mit allen Auftragsverarbeitern bestehen bzw. werden
            Auftragsverarbeitungsverträge gemäß Art. 28 DSGVO abgeschlossen.
            Soweit Anbieter Daten in die USA übermitteln, stützen wir uns auf
            deren Zertifizierung unter dem EU-US Data Privacy Framework bzw.
            auf Standardvertragsklauseln — [vom Betreiber je Anbieter zu
            bestätigen].
          </p>
        </Section>

        <Section title="11. Ihre Rechte">
          <p>
            Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung
            (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung
            (Art. 18), Datenübertragbarkeit (Art. 20) sowie Widerspruch
            gegen Verarbeitungen auf Grundlage berechtigten Interesses
            (Art. 21). Erteilte Einwilligungen können Sie jederzeit mit
            Wirkung für die Zukunft widerrufen. Wenden Sie sich hierfür an
            die oben genannte Kontaktadresse. Sie haben zudem das Recht,
            sich bei einer Datenschutzaufsichtsbehörde zu beschweren, z. B.
            beim Bayerischen Landesamt für Datenschutzaufsicht (BayLDA),
            Promenade 27, 91522 Ansbach.
          </p>
        </Section>

        <Section title="12. Datensicherheit">
          <p>
            Wir übertragen alle Daten verschlüsselt über TLS/HTTPS. Passwörter
            werden gehasht (bcrypt) gespeichert, Verifizierungscodes und
            Passwort-Reset-Token werden ausschließlich als Hash (SHA-256) in
            der Datenbank abgelegt.
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
