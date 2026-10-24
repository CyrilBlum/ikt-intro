# AGENTS.md – IKT-Einführung (ikt.in-form-atik.ch)

Projektwissen für Agents. Gilt zusätzlich zu den globalen Anweisungen.

## Projekt

- Interaktive Schritt-für-Schritt-Anleitungen für Schüler/-innen (SuS) und
  Lehrpersonen (LP) der Kantonsschule Stadelhofen, Filiale Dübendorf (FDU).
- Live: https://ikt.in-form-atik.ch (nginx, statisch; Konfig in `deploy/`).
- Sprache der Inhalte: Deutsch (Schweiz), «ss» statt «ß», Anrede «Sie»,
  Guillemets «…» für UI-Begriffe.

## Architektur

- Gesamte App in `app/page.tsx` (Client-Komponente, kein Router):
  - `Step`-Arrays je Anleitung (`image`, `phase`, `title`, `text`, `tip` …).
  - `GuideKey` (Union-Typ), `guideNames`, `guidePaths`, `guideDescriptions`,
    `getGuideSteps()` und der `steps`-`useMemo` müssen bei einer neuen Anleitung
    alle ergänzt werden.
  - `navigationGroups` definiert Menügruppen/«Tabs» (z. B. `LP`, `/lehrpersonen`)
    inkl. Übersichtsseite.
  - Liste `desktopAppGuide` steuert die Darstellung von Desktop-Screenshots;
    LP-Anleitungen sind von Moodle-Abschlussblock ausgenommen (Liste im
    `finish-block`).
- `app/[...path]/page.tsx` re-exportiert die Startseite (Deep Links).
- Screenshots: `public/screenshots/<bereich>/…` (z. B. `kg-intranet/real/`,
  `klp/fobizz/`).
- PDFs: `scripts/build_guide_pdfs.py` → `output/pdf/`.
- Build: `npm run build` (vinext) bzw. `npm run build:static` (`dist-static/`).

## Intranet (IN2, https://in2.tam.ch)

- Schulverwaltungs-Intranet «Intranet Sek II» (Gyselroth IN2), App «IN2 Mobile».
- Inhalte liegen in einem Cross-Origin-iframe (`intranet.tam.ch/fdu/…`); Menü
  sind `ion-submenu-item`-Elemente (per JS `.click()` öffnen). Die iframe-URL
  lässt sich direkt in einem eigenen Tab öffnen (gleiche Session, DOM lesbar).
- Admin: oben rechts Profilbild → «Benutzer wechseln» (Impersonation),
  zurück mit «Verlassen». Test-Personen: beim Benutzer erfragen (nicht im Repo festhalten).
- SuS-Menü «Absenzen»: «Absenzenerfassung» (Lektionen wählen + Begründung),
  «Jokertage Schuljahr», «Dispensationsgesuche bis 1 Tag» / «mehr als 1 Tag»
  (Typ «Fach» oder «Zeitabschnitt», Begründung als Dropdown, Vorlage
  herunterladen, unterschrieben hochladen, max. 1,5 MB).
- LP-Menü «Absenzen»: «Absenzenerfassung» (pro Lektion; Ansicht «Lektion» /
  «Semester»), «Absenzen meiner Klassen (FLP)», «Absenzen meiner Klasse (KLP)»,
  «Wochenübersicht», «Semesterübersicht» («i» → Status x/e/u/S je Lektion),
  «Jokertage meiner Schüler KLP», «Disp/Jokertage meiner Klassen KLP».
  «Absenzen-Admin» (wichtigste KLP-Ansicht): Person aufklappen, Lektionen
  anhaken → «Bearbeiten» → «Einträge anpassen» (Typ: Abwesend / Abwesend
  (disp. Schule); Status: abwesend / entschuldigt / unentschuldigt / «2»?) →
  «Update». Dokument-Symbol = «Eintrag kommentieren».
  «Stundenplan» → «Unbestätigte Lektionen».
- Spaltenkürzel: X offen, XE entschuldigt, XU unentschuldigt, V/VE/VU
  Verspätung, J Jokertag, D Dispensation, S Absenz Schule (schulische
  Anlässe wie Theater, Chor, Orchester, Peer-Support; nicht in normalen
  Absenzenberichten). Quelle: interne Mail.
- KLP sollen Dispensationen bewilligen können (interne Mail: Spalte D
  in Wochen-/Semesterübersicht veränderbar); Klickpfad unbekannt.
- Kontakte IN2 (DSC): siehe `kontaktpersonen.md` im Ordner «IM, Intranet» (nicht im Repo).

## Absenzenreglement FDU (Stand 8. Mai 2026)

Quelle: Reglement zu Absenzen, Dispensation und Jokertagen, FDU, 8. Mai 2026
(Grundlage: §§ 21–35 Mittelschulverordnung).

- **Unvorhersehbare Absenzen** (Krankheit, Verspätung, frühzeitiges Verlassen):
  SuS oder Erziehungsberechtigte erfassen sie mit Grund **vor Beginn der
  Lektion** im Intranet (Ziff. 21, 29).
- **Entschuldigung:** innert **10 Unterrichtstagen** unterschreiben
  Erziehungsberechtigte bzw. volljährige SuS das Entschuldigungsformular und
  senden es digital (Mail/Teams-Chat) an die KLP; die KLP setzt die Absenzen
  innerhalb der Frist auf «entschuldigt» (Ziff. 22). Danach automatisch
  unentschuldigt (Ziff. 23); nachträglich nur durch Schulleitung (Ziff. 24).
- **Arztzeugnis:** ab mehr als 4 Tagen oder bei verpasster Abschlussprüfung
  (Ziff. 3).
- **Sport:** Unpässlichkeit vor der Lektion bei der Sport-LP melden; auch mit
  Volldispens grundsätzlich anwesend (Ziff. 4).
- **Dispensationen** (vorhersehbar): Gesuch im Intranet + vollständiger «Antrag
  auf Dispensation» (Unterschrift volljährige SuS bzw. Erziehungsberechtigte
  und KLP, Beilagen). Gründe Ziff. 7 a–j; keine Ferienverlängerung.
  - bis 1 Tag: Bewilligung durch KLP (ausser Blockwochen), möglichst früh
    erfassen.
  - mehr als 1 Tag: Schulleitung nach Rücksprache mit KLP; mind.
    **14 Unterrichtstage** im Voraus (Ziff. 26).
  - i. d. R. höchstens eine ganzwöchige Dispensation pro Schuljahr (Ziff. 9);
    Leistungssport nach kantonalen Richtlinien (Ziff. 10).
  - Betroffene Prüfungen: LP direkt nach Bewilligung informieren (Ziff. 7).
- **Jokertage:** 2 pro Schuljahr, nur ganze Tage, verfallen Ende Schuljahr;
  mind. **14 Kalendertage** im Voraus im Intranet; Minderjährige zusätzlich
  Einverständnis der Erziehungsberechtigten; Bewilligung Schulleitung;
  Sperrtage (Ziff. 11–17, 27).
- **Verpasster Stoff/Prüfungen:** selbständig nacharbeiten, Prüfungen in
  Absprache nach- oder vorholen (Ziff. 18–19).
- **Zählung:** semesterweise (Ziff. 20). Unentschuldigt = jede Verspätung ab
  dem 3. Eintrag sowie jede unentschuldigte Lektion (Ziff. 29).
- **Massnahmen:** ab 40 Absenzen/Semester Absenzengespräch mit KLP (Ziff. 28);
  bei 3 unentschuldigten Ereignissen Gespräch KLP, Information Schulleitung und
  Erziehungsberechtigte (Ziff. 30); danach Schulleitung, Disziplinarreglement
  §10 (Ziff. 31–32).

## Screenshots aus dem Intranet

- Keine Namen realer SuS/LP im Repo (öffentlich auf GitHub).
- Echte Personendaten (Namen, Fotos, Klassen, Absenzgründe) vor der
  Veröffentlichung unkenntlich machen oder durch Platzhalter ersetzen – die
  Website ist öffentlich. Werkzeug: `.venv/bin/python scripts/blur_regions.py
  IN OUT x,y,w,h …` (Profilbild oben rechts wird immer verpixelt).
- Im Intranet keine Gesuche, Absenzen oder Statusänderungen im Namen echter
  Personen absenden; nur Masken öffnen und vor dem Absenden fotografieren.

## Bekannte Fakten (vom Benutzer bestätigt)

- LP erfassen Absenzen/Verspätungen bevorzugt in IN2 oder (am einfachsten)
  in der App IN2 Mobile.
- Klick auf Schüler*in in «Absenzen meiner Klasse (KLP)» → «Die Daten konnten
  nicht geladen werden»: bekannter Fehler, Ticket beim DSC-ServicePortal.
- Entschuldigungsformular für SuS: SharePoint
  https://eduzh.sharepoint.com/sites/bi-mba-2250-su
- KLP bewilligen Dispensationsgesuche ≤ 1 Tag über den Link in einer
  automatisch generierten E-Mail.
