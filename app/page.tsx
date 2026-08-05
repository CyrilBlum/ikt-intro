"use client";

import { useEffect, useState } from "react";

const steps = [
  { image: "appstore-01-suchen.png", phase: "Vorbereiten", title: "Authenticator im App Store suchen", text: "Öffne auf deinem iPhone den App Store. Tippe unten auf «Suchen» und suche nach «Microsoft Authenticator». Du brauchst für die ganze Einrichtung nur dein iPhone – keinen Computer." },
  { image: "appstore-02-laden.jpg", phase: "Vorbereiten", title: "Microsoft Authenticator laden", text: "Wähle die App «Microsoft Authenticator» von Microsoft aus und tippe auf «Laden». Warte, bis die Installation abgeschlossen ist, und öffne die App." },
  { image: "appstore-03-annehmen.jpg", phase: "Vorbereiten", title: "Datenschutzbestimmungen annehmen", text: "Beim ersten Start informiert dich die App über erforderliche Diagnosedaten. Lies den Hinweis und tippe auf «Annehmen»." },
  { image: "appstore-04-weiter.jpg", phase: "Vorbereiten", title: "Einführung fortsetzen", text: "Die freiwillige Freigabe zusätzlicher Nutzungsdaten kannst du ausgeschaltet lassen. Tippe unten auf «Weiter»." },
  { image: "appstore-05-microsoft-anmelden.png", phase: "Vorbereiten", title: "Bei Microsoft anmelden", text: "Tippe auf «Bei Microsoft anmelden». Verwende danach dein EduZH-Schulkonto mit der Endung @stud.edu.zh.ch. So ist der Authenticator bereit für die nächsten Schritte." },
  { image: "IMG_0677.PNG", phase: "Anmelden", title: "Mit dem EduZH-Konto anmelden", text: "Gib deine vollständige Schul-E-Mail-Adresse ein (z. B. muster.max@stud.edu.zh.ch) und tippe auf «Weiter». Verwende anschliessend das Startkennwort, das du von der Schule erhalten hast.", tip: "Achte auf die Endung @stud.edu.zh.ch." },
  { image: "IMG_0678.PNG", phase: "Authenticator", title: "Microsoft Authenticator installieren", text: "Installiere die kostenlose App «Microsoft Authenticator» auf deinem Smartphone. Kehre danach zu dieser Seite im Browser zurück und tippe auf «Weiter»." },
  { image: "IMG_0679.PNG", phase: "Authenticator", title: "Konto mit der App koppeln", text: "Tippe auf den blauen Link zum Koppeln des Kontos. Dein Smartphone öffnet den Authenticator automatisch und richtet das Schulkonto ein." },
  { image: "IMG_0680.PNG", phase: "Authenticator", title: "Konto wurde hinzugefügt", text: "Im Authenticator erscheint «Konto wurde erfolgreich hinzugefügt». Bestätige mit «OK» und wechsle danach zurück zu Safari." },
  { image: "IMG_0681.PNG", phase: "Authenticator", title: "Anmeldung testen", text: "Im Browser wird eine zweistellige Zahl angezeigt. Merke dir diese Zahl – du brauchst sie gleich in der Authenticator-App." },
  { image: "IMG_0682.PNG", phase: "Authenticator", title: "Zahl eingeben und bestätigen", text: "Gib im Authenticator die im Browser angezeigte Zahl ein, tippe auf «Ja» und kehre anschliessend zu Safari zurück." },
  { image: "IMG_0683.PNG", phase: "Authenticator", title: "Authenticator abschliessen", text: "Wenn «Authenticator Added» erscheint, war die Einrichtung erfolgreich. Tippe auf «Fertig»." },
  { image: "IMG_0684.PNG", phase: "Telefon", title: "Telefonnummer hinzufügen", text: "Wähle «Switzerland (+41)», gib deine Mobilnummer ein und lasse dir den Bestätigungscode per SMS senden." },
  { image: "IMG_0685.PNG", phase: "Telefon", title: "SMS-Code eingeben", text: "Übertrage den sechsstelligen Code aus der SMS in das Feld «Code eingeben» und tippe auf «Weiter»." },
  { image: "IMG_0686.PNG", phase: "Telefon", title: "Telefonnummer bestätigt", text: "Die Telefonnummer wurde erfolgreich hinzugefügt. Tippe auf «Fertig», um die Sicherheitseinrichtung abzuschliessen." },
  { image: "IMG_0687.PNG", phase: "Telefon", title: "Sicherheitsmethoden prüfen", text: "Kontrolliere, ob sowohl «Telefon» als auch «Microsoft Authenticator» aufgeführt sind. Tippe dann auf «Fertig»." },
  { image: "IMG_0688.PNG", phase: "Kennwort", title: "Persönliches Kennwort setzen", text: "Gib zuerst das erhaltene Startkennwort ein. Lege danach ein neues, persönliches Kennwort fest und bestätige es ein zweites Mal." , tip: "Bewahre dein Kennwort sicher auf und gib es niemandem weiter."},
  { image: "IMG_0689.PNG", phase: "Fertig", title: "Willkommen – dein Konto ist bereit", text: "Du bist jetzt mit deinem EduZH-Konto angemeldet. Authenticator, Telefonnummer und dein persönliches Kennwort sind eingerichtet." },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [zoom, setZoom] = useState(false);
  const step = steps[current];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setCurrent((n) => Math.min(n + 1, steps.length - 1));
      if (event.key === "ArrowLeft") setCurrent((n) => Math.max(n - 1, 0));
      if (event.key === "Escape") setZoom(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (index: number) => {
    setCurrent(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Zum Anfang"><img className="official-logo" src="/fdu-logo-schwarz.svg" alt="Kantonsschule Stadelhofen – Filiale Dübendorf" /></a>
        <span className="account">IKT-Einführung</span>
      </header>

      <nav className="progress" aria-label="Fortschritt">
        <div className="progress-copy"><span>Fortschritt</span><strong>{current + 1} / {steps.length}</strong></div>
        <div className="bar"><i style={{ width: `${((current + 1) / steps.length) * 100}%` }} /></div>
        <div className="dots">
          {steps.map((item, index) => <button key={item.image} onClick={() => go(index)} className={index === current ? "active" : index < current ? "done" : ""} aria-label={`Schritt ${index + 1}: ${item.title}`}><span>{index + 1}</span></button>)}
        </div>
      </nav>

      <section className="guide" id="top" aria-live="polite">
        <div className="phone-wrap">
          <button className="screenshot" onClick={() => setZoom(true)} aria-label="Screenshot vergrössern">
            <img src={`/screenshots/${step.image}`} alt={`Screenshot zu Schritt ${current + 1}: ${step.title}`} />
            <span className="zoom-label">＋ Vergrössern</span>
          </button>
          <div className="swipe-hint">Screenshot antippen zum Vergrössern</div>
        </div>

        <article className="instruction">
          <div className="step-label"><span>Schritt {String(current + 1).padStart(2, "0")}</span><i />{step.phase}</div>
          <h2>{step.title}</h2>
          <p>{step.text}</p>
          {step.tip && <aside><strong>Gut zu wissen</strong>{step.tip}</aside>}
          {current === steps.length - 1 && <div className="success">✓ Einrichtung abgeschlossen</div>}
          <div className="actions">
            <button className="back" onClick={() => go(current - 1)} disabled={current === 0}>← Zurück</button>
            <button className="next" onClick={() => go(current + 1)} disabled={current === steps.length - 1}>{current === steps.length - 2 ? "Zum Abschluss" : "Weiter"} <span>→</span></button>
          </div>
          <p className="keyboard">Tipp: Du kannst auch die Pfeiltasten verwenden.</p>
        </article>
      </section>

      <footer><strong>IKT-Einführung</strong><span>EduZH-Erstlogin · Anleitung für Schülerinnen und Schüler</span></footer>

      {zoom && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Vergrösserter Screenshot" onClick={() => setZoom(false)}><button aria-label="Schliessen">×</button><img src={`/screenshots/${step.image}`} alt="" /></div>}
    </main>
  );
}
