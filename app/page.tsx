"use client";

import { useEffect, useState } from "react";

const steps = [
  { image: "appstore-01-suchen.png", androidImage: "android-01-suchen.png", phase: "Vorbereiten", title: "Microsoft Authenticator suchen", text: "Öffne den App Store oder Google Play Store und suche nach «Microsoft Authenticator». Du brauchst für die ganze Einrichtung nur dein Smartphone – keinen Computer." },
  { image: "appstore-02-laden.jpg", androidImage: "android-02-laden.jpg", phase: "Gerät wählen", title: "Welches Smartphone verwendest du?", text: "Wähle dein Gerät aus. Die Screenshots und Hinweise der folgenden Schritte passen sich automatisch an. Lade danach «Microsoft Authenticator» und öffne die App." },
  { image: "appstore-03-annehmen.jpg", androidImage: "android-03-annehmen.jpg", phase: "Vorbereiten", title: "Datenschutzbestimmungen annehmen", text: "Beim ersten Start informiert dich die App über erforderliche Diagnosedaten. Lies den Hinweis und tippe auf «Annehmen»." },
  { image: "appstore-04-weiter.jpg", androidImage: "android-04-weiter.jpg", phase: "Vorbereiten", title: "Einführung fortsetzen", text: "Die freiwillige Freigabe zusätzlicher Nutzungsdaten kannst du ausgeschaltet lassen. Tippe unten auf «Weiter»." },
  { image: "appstore-05-microsoft-anmelden.png", androidImage: "appstore-05-microsoft-anmelden.png", phase: "Vorbereiten", title: "Bei Microsoft anmelden", text: "Tippe auf «Bei Microsoft anmelden». Verwende danach dein EduZH-Schulkonto mit der Endung @stud.edu.zh.ch. Die Darstellung kann auf Android leicht abweichen." },
  { image: "IMG_0677.PNG", androidImage: "android-06-email.png", phase: "Anmelden", title: "Mit dem EduZH-Konto anmelden", text: "Gib deine vollständige Schul-E-Mail-Adresse ein (z. B. muster.max@stud.edu.zh.ch) und tippe auf «Weiter». Verwende anschliessend das Startkennwort, das du von der Schule erhalten hast.", tip: "Achte auf die Endung @stud.edu.zh.ch." },
  { image: "IMG_0678.PNG", androidImage: "android-07-zusatzinfo.png", phase: "Authenticator", title: "Sicherheitsinformationen starten", text: "Microsoft informiert dich, dass weitere Sicherheitsinformationen benötigt werden. Tippe auf «Weiter» und bleibe im Browser." },
  { image: "IMG_0679.PNG", androidImage: "android-08-koppeln.png", phase: "Authenticator", title: "Konto mit der App koppeln", text: "Tippe auf den blauen Link zum Koppeln des Kontos. Dein Smartphone öffnet den Authenticator automatisch und richtet das Schulkonto ein." },
  { image: "IMG_0680.PNG", androidImage: "android-09-konto.png", phase: "Authenticator", title: "Konto wurde hinzugefügt", text: "Das Schulkonto erscheint jetzt im Authenticator. Bestätige allfällige Hinweise und wechsle danach zurück in deinen Browser." },
  { image: "IMG_0681.PNG", androidImage: "android-10-zahl.png", phase: "Authenticator", title: "Anmeldung testen", text: "Im Browser wird eine zweistellige Zahl angezeigt. Merke dir diese Zahl – du brauchst sie gleich in der Authenticator-App." },
  { image: "IMG_0682.PNG", androidImage: "android-11-bestaetigen.jpg", phase: "Authenticator", title: "Zahl eingeben und bestätigen", text: "Gib im Authenticator die im Browser angezeigte Zahl ein, tippe auf «Ja» und kehre anschliessend in den Browser zurück." },
  { image: "IMG_0683.PNG", androidImage: "android-12-erfolgreich.png", phase: "Authenticator", title: "Authenticator abschliessen", text: "Die Testanmeldung war erfolgreich. Tippe im Browser auf «Weiter», um die Telefonnummer einzurichten." },
  { image: "IMG_0684.PNG", androidImage: "android-13-telefon.png", phase: "Telefon", title: "Telefonnummer hinzufügen", text: "Wähle «Switzerland (+41)», gib deine Mobilnummer ein und lasse dir den Bestätigungscode per SMS senden." },
  { image: "IMG_0685.PNG", androidImage: "android-14-sms.png", phase: "Telefon", title: "SMS-Code eingeben", text: "Übertrage den sechsstelligen Code aus der SMS in das Feld «Code eingeben» und tippe auf «Weiter»." },
  { image: "IMG_0686.PNG", androidImage: "android-15-telefon-bestaetigt.png", phase: "Telefon", title: "Telefonnummer bestätigt", text: "Die Telefonnummer wurde erfolgreich hinzugefügt. Tippe auf «Weiter» oder «Fertig», um fortzufahren." },
  { image: "IMG_0687.PNG", androidImage: "android-16-methoden.png", phase: "Telefon", title: "Sicherheitsmethoden prüfen", text: "Kontrolliere, ob sowohl «Telefon» als auch «Microsoft Authenticator» aufgeführt sind. Tippe dann auf «Fertig»." },
  { image: "IMG_0688.PNG", androidImage: "android-17-kennwort.png", phase: "Kennwort", title: "Persönliches Kennwort setzen", text: "Gib zuerst das erhaltene Startkennwort ein. Lege danach ein neues, persönliches Kennwort fest und bestätige es ein zweites Mal.", tip: "Bewahre dein Kennwort sicher auf und gib es niemandem weiter." },
  { image: "IMG_0689.PNG", androidImage: "android-18-fertig.jpg", phase: "Fertig", title: "Willkommen – dein Konto ist bereit", text: "Du bist jetzt mit deinem EduZH-Konto angemeldet. Authenticator, Telefonnummer und dein persönliches Kennwort sind eingerichtet." },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [device, setDevice] = useState<"iphone" | "android">("iphone");
  const step = steps[current];
  const stepImage = device === "android" ? step.androidImage : step.image;

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
        <div className="header-info"><span>IKT-Einführung</span><strong>Mit ← → navigieren</strong></div>
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
            <img src={`/screenshots/${stepImage}`} alt={`Screenshot zu Schritt ${current + 1}: ${step.title}`} />
            <span className="zoom-label">＋ Vergrössern</span>
          </button>
          <div className="swipe-hint">Screenshot antippen zum Vergrössern</div>
        </div>

        <article className="instruction">
          <div className="step-label"><span>Schritt {String(current + 1).padStart(2, "0")}</span><i />{step.phase}</div>
          <h2>{step.title}</h2>
          <p>{step.text}</p>
          {current === 1 && <div className="device-picker" aria-label="Gerät auswählen">
            <button className={device === "iphone" ? "selected" : ""} onClick={() => setDevice("iphone")} aria-pressed={device === "iphone"}><b>iPhone</b><span>App Store</span></button>
            <button className={device === "android" ? "selected" : ""} onClick={() => setDevice("android")} aria-pressed={device === "android"}><b>Android</b><span>Google Play</span></button>
          </div>}
          {step.tip && <aside><strong>Gut zu wissen</strong>{step.tip}</aside>}
          {step.phase === "Kennwort" && <aside className="password-box"><strong>So wird dein Kennwort sicher</strong><ul><li>Verwende mehrere zufällige Wörter.</li><li>Ergänze Zahlen und Sonderzeichen.</li><li>Nutze es nur für dieses Konto.</li><li>Keine Namen, Geburtstage oder einfachen Folgen.</li></ul><small>Merksatz-Prinzip: vier unerwartete Wörter sind lang und trotzdem gut merkbar.</small></aside>}
          {current === steps.length - 1 && <div className="success">✓ Einrichtung abgeschlossen</div>}
          <div className="actions">
            <button className="back" onClick={() => go(current - 1)} disabled={current === 0}>← Zurück</button>
            <button className="next" onClick={() => go(current + 1)} disabled={current === steps.length - 1}>{current === steps.length - 2 ? "Zum Abschluss" : "Weiter"} <span>→</span></button>
          </div>
          <p className="keyboard">Tipp: Du kannst auch die Pfeiltasten verwenden.</p>
        </article>
      </section>

      <img className="bottom-decoration" src="/glatt-linie-farbig.svg" alt="" aria-hidden="true" />
      <footer><strong>IKT-Einführung</strong><span>EduZH-Erstlogin · Anleitung für Schülerinnen und Schüler</span></footer>

      {zoom && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Vergrösserter Screenshot" onClick={() => setZoom(false)}><button aria-label="Schliessen">×</button><img src={`/screenshots/${stepImage}`} alt="" /></div>}
    </main>
  );
}
