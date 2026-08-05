"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Step = { image?: string; altImage?: string; phase: string; title: string; text: string; tip?: string; shortcut?: string };
type GuideKey = "eduzh" | "wlan" | "apps" | "challenge" | "shortcuts";

const eduzh: Step[] = [
  { image:"/screenshots/appstore-01-suchen.png", altImage:"/screenshots/android-01-suchen.png", phase:"Vorbereiten", title:"Microsoft Authenticator suchen", text:"Öffne den App Store oder Google Play Store und suche nach «Microsoft Authenticator». Du brauchst für die ganze Einrichtung nur dein Smartphone – keinen Computer." },
  { image:"/screenshots/appstore-02-laden.jpg", altImage:"/screenshots/android-02-laden.jpg", phase:"Gerät wählen", title:"Welches Smartphone verwendest du?", text:"Wähle dein Gerät aus. Die nächsten Screenshots passen sich automatisch an. Lade danach «Microsoft Authenticator» und öffne die App." },
  { image:"/screenshots/appstore-03-annehmen.jpg", altImage:"/screenshots/android-03-annehmen.jpg", phase:"Vorbereiten", title:"Datenschutzbestimmungen annehmen", text:"Lies den Hinweis zu den erforderlichen Diagnosedaten und tippe auf «Annehmen»." },
  { image:"/screenshots/appstore-04-weiter.jpg", altImage:"/screenshots/android-04-weiter.jpg", phase:"Vorbereiten", title:"Einführung fortsetzen", text:"Die freiwillige Freigabe zusätzlicher Nutzungsdaten kannst du ausgeschaltet lassen. Tippe unten auf «Weiter»." },
  { image:"/screenshots/appstore-05-microsoft-anmelden.png", altImage:"/screenshots/appstore-05-microsoft-anmelden.png", phase:"Vorbereiten", title:"Bei Microsoft anmelden", text:"Tippe auf «Bei Microsoft anmelden». Verwende danach dein EduZH-Schulkonto mit der Endung @stud.edu.zh.ch." },
  { image:"/screenshots/IMG_0677.PNG", altImage:"/screenshots/android-06-email.png", phase:"Anmelden", title:"Mit dem EduZH-Konto anmelden", text:"Gib deine vollständige Schul-E-Mail-Adresse ein und verwende anschliessend das Startkennwort, das du von der Schule erhalten hast.", tip:"Achte auf die Endung @stud.edu.zh.ch." },
  { image:"/screenshots/IMG_0678.PNG", altImage:"/screenshots/android-07-zusatzinfo.png", phase:"Authenticator", title:"Sicherheitsinformationen starten", text:"Microsoft benötigt weitere Sicherheitsinformationen. Tippe auf «Weiter» und bleibe im Browser." },
  { image:"/screenshots/IMG_0679.PNG", altImage:"/screenshots/android-08-koppeln.png", phase:"Authenticator", title:"Konto mit der App koppeln", text:"Tippe auf den blauen Link zum Koppeln. Dein Smartphone öffnet den Authenticator und richtet das Schulkonto ein." },
  { image:"/screenshots/IMG_0680.PNG", altImage:"/screenshots/android-09-konto.png", phase:"Authenticator", title:"Konto wurde hinzugefügt", text:"Das Schulkonto erscheint jetzt im Authenticator. Bestätige allfällige Hinweise und wechsle zurück in den Browser." },
  { image:"/screenshots/IMG_0681.PNG", altImage:"/screenshots/android-10-zahl.png", phase:"Authenticator", title:"Anmeldung testen", text:"Im Browser erscheint eine zweistellige Zahl. Merke sie dir – du brauchst sie gleich in der Authenticator-App." },
  { image:"/screenshots/IMG_0682.PNG", altImage:"/screenshots/android-11-bestaetigen.jpg", phase:"Authenticator", title:"Zahl eingeben und bestätigen", text:"Gib im Authenticator die Zahl aus dem Browser ein, tippe auf «Ja» und kehre in den Browser zurück." },
  { image:"/screenshots/IMG_0683.PNG", altImage:"/screenshots/android-12-erfolgreich.png", phase:"Authenticator", title:"Authenticator abschliessen", text:"Die Testanmeldung war erfolgreich. Tippe im Browser auf «Weiter»." },
  { image:"/screenshots/IMG_0684.PNG", altImage:"/screenshots/android-13-telefon.png", phase:"Telefon", title:"Telefonnummer hinzufügen", text:"Wähle «Switzerland (+41)», gib deine Mobilnummer ein und fordere den Bestätigungscode per SMS an." },
  { image:"/screenshots/IMG_0685.PNG", altImage:"/screenshots/android-14-sms.png", phase:"Telefon", title:"SMS-Code eingeben", text:"Übertrage den sechsstelligen Code aus der SMS und tippe auf «Weiter»." },
  { image:"/screenshots/IMG_0686.PNG", altImage:"/screenshots/android-15-telefon-bestaetigt.png", phase:"Telefon", title:"Telefonnummer bestätigt", text:"Die Telefonnummer wurde erfolgreich hinzugefügt. Tippe auf «Weiter» oder «Fertig»." },
  { image:"/screenshots/IMG_0687.PNG", altImage:"/screenshots/android-16-methoden.png", phase:"Telefon", title:"Sicherheitsmethoden prüfen", text:"Kontrolliere, ob «Telefon» und «Microsoft Authenticator» aufgeführt sind. Tippe dann auf «Fertig»." },
  { image:"/screenshots/IMG_0688.PNG", altImage:"/screenshots/android-17-kennwort.png", phase:"Kennwort", title:"Persönliches Kennwort setzen", text:"Gib zuerst das Startkennwort ein. Lege danach ein neues persönliches Kennwort fest und bestätige es.", tip:"Bewahre dein Kennwort sicher auf und gib es niemandem weiter." },
  { image:"/screenshots/IMG_0689.PNG", altImage:"/screenshots/android-18-fertig.jpg", phase:"Fertig", title:"Dein Konto ist bereit", text:"Authenticator, Telefonnummer und persönliches Kennwort sind eingerichtet. Melde dich nun auf Moodle an und bearbeite dort die Aufgaben." },
];

const wlanWindows: Step[] = [
  {image:"/screenshots/wlan/windows-01.png",phase:"Windows",title:"Netzwerke öffnen",text:"Klicke unten rechts in der Taskleiste auf das Netzwerk- oder Erdkugel-Symbol."},
  {image:"/screenshots/wlan/windows-02.jpg",phase:"Windows",title:"KTZH-S auswählen",text:"Wähle in der Liste der verfügbaren Netzwerke «KTZH-S»."},
  {image:"/screenshots/wlan/windows-03.jpg",phase:"Windows",title:"Automatisch verbinden",text:"Aktiviere «Automatisch verbinden» und klicke auf «Verbinden»."},
  {image:"/screenshots/wlan/windows-04.jpg",phase:"Windows",title:"EduZH-Login eingeben",text:"Gib deine Adresse @stud.edu.zh.ch und dein persönliches Kennwort ein. Klicke auf «OK»."},
  {image:"/screenshots/wlan/windows-05.jpg",phase:"Windows",title:"Verbindung bestätigen",text:"Bestätige mit «Verbinden». Dein Gerät ist jetzt mit KTZH-S verbunden."},
];
const wlanMac: Step[] = [
  {image:"/screenshots/wlan/macos-01.jpg",phase:"macOS",title:"WLAN-Menü öffnen",text:"Klicke oben in der Menüleiste auf das WLAN-Symbol."},
  {image:"/screenshots/wlan/macos-02.jpg",phase:"macOS",title:"KTZH-S auswählen",text:"Öffne «Andere Netzwerke» und wähle «KTZH-S»."},
  {image:"/screenshots/wlan/macos-03.jpg",phase:"macOS",title:"EduZH-Login eingeben",text:"Gib deine Adresse @stud.edu.zh.ch und dein persönliches Kennwort ein. Klicke auf «OK»."},
  {image:"/screenshots/wlan/macos-04.jpg",phase:"macOS",title:"Zertifikat bestätigen",text:"macOS zeigt das Zertifikat des Netzwerks. Klicke auf «Fortfahren» und bestätige bei Bedarf mit deinem Mac-Kennwort."},
  {image:"/screenshots/wlan/macos-05.jpg",phase:"macOS",title:"WLAN ist verbunden",text:"Dein Mac ist jetzt mit KTZH-S verbunden."},
];

const apps: Step[] = [
  {image:"/screenshots/apps/step-009.jpg",phase:"Teams",title:"Schulkonto hinzufügen",text:"Öffne in Teams dein Profil und wähle «Weiteres Konto hinzufügen»."},
  {image:"/screenshots/apps/step-012.png",phase:"Teams",title:"EduZH-Adresse eingeben",text:"Gib deine Adresse @stud.edu.zh.ch ein und klicke auf «Weiter»."},
  {image:"/screenshots/apps/step-013.jpg",phase:"Teams",title:"Anmelden",text:"Gib dein Kennwort ein und bestätige die Anmeldung im Authenticator."},
  {image:"/screenshots/apps/step-019.png",phase:"Teams",title:"Kontoverwendung wählen",text:"Wähle «Ja, alle Apps», damit deine Microsoft-Apps dieses Konto nutzen können."},
  {image:"/screenshots/apps/step-022.jpg",phase:"Teams",title:"Teams ist bereit",text:"Dein EduZH-Konto ist nun in Teams hinterlegt."},
  {image:"/screenshots/apps/step-025.jpg",phase:"Outlook",title:"Outlook öffnen",text:"Öffne Outlook, gib deine EduZH-Adresse ein und klicke auf «Weiter»."},
  {image:"/screenshots/apps/step-029.jpg",phase:"Outlook",title:"Anmeldung bestätigen",text:"Gib dein Kennwort ein und bestätige die Anfrage im Authenticator."},
  {image:"/screenshots/apps/step-032.png",phase:"Outlook",title:"Für alle Apps anmelden",text:"Wähle «Ja, alle Apps». Damit wird dein Schulkonto auch in Outlook eingerichtet."},
  {image:"/screenshots/apps/step-035.png",phase:"Outlook",title:"Outlook ist bereit",text:"Dein EduZH-Postfach ist jetzt mit Outlook verbunden."},
  {image:"/screenshots/apps/step-038.jpg",phase:"OneDrive",title:"OneDrive öffnen",text:"Klicke in der Taskleiste mit der rechten Maustaste auf das OneDrive-Symbol."},
  {image:"/screenshots/apps/step-039.png",phase:"OneDrive",title:"Einstellungen öffnen",text:"Klicke auf das Zahnrad und öffne die Einstellungen."},
  {image:"/screenshots/apps/step-040.jpg",phase:"OneDrive",title:"Konto hinzufügen",text:"Wähle «Konto hinzufügen»."},
  {image:"/screenshots/apps/step-043.jpg",phase:"OneDrive",title:"EduZH-Adresse eingeben",text:"Gib deine EduZH-Adresse ein und klicke auf «Anmelden»."},
  {image:"/screenshots/apps/step-050.png",phase:"OneDrive",title:"Anmeldung bestätigen",text:"Gib dein Kennwort ein, bestätige im Authenticator und wähle «Ja, alle Apps»."},
  {image:"/screenshots/apps/step-053.jpg",phase:"OneDrive",title:"OneDrive-Ordner wählen",text:"Klicke auf «Weiter» und wähle, welche Ordner synchronisiert werden sollen."},
  {image:"/screenshots/apps/step-061.png",phase:"OneDrive",title:"OneDrive ist bereit",text:"Die Einrichtung ist abgeschlossen. Deine Schuldateien werden jetzt synchronisiert."},
];

const challengeWindows: Step[] = [
  {phase:"Tiling",title:"Zwei Fenster nebeneinander",text:"Öffne Browser und Datei-Explorer. Lege den Browser links und den Explorer rechts ab.",shortcut:"Win + ← / →"},
  {phase:"Tiling",title:"Fenster in eine Ecke legen",text:"Drücke zuerst Win + Pfeil links oder rechts und direkt danach Pfeil hoch oder runter. Ordne vier Fenster als Raster an.",shortcut:"Win + ←, dann ↑"},
  {phase:"Tiling",title:"Maximieren und verkleinern",text:"Maximiere das aktive Fenster. Drücke danach den Gegenbefehl zweimal, um es wiederherzustellen und zu minimieren.",shortcut:"Win + ↑ / ↓"},
  {phase:"Snap Layouts",title:"Ein Layout auswählen",text:"Öffne die Snap-Layouts, wähle ein Dreispalten-Layout und verteile Browser, Teams und Explorer.",shortcut:"Win + Z"},
  {phase:"Apps",title:"Zwischen Programmen wechseln",text:"Halte Alt gedrückt und tippe wiederholt auf Tab. Wechsle gezielt zwischen Browser, Teams und Explorer.",shortcut:"Alt + Tab"},
  {phase:"Desktops",title:"Virtuellen Desktop erstellen",text:"Erstelle einen neuen Desktop und öffne dort Outlook.",shortcut:"Win + Ctrl + D"},
  {phase:"Desktops",title:"Zwischen Desktops wechseln",text:"Wechsle ohne Maus zum vorherigen Desktop und wieder zurück.",shortcut:"Win + Ctrl + ← / →"},
  {phase:"Bildschirme",title:"Fenster auf einen anderen Monitor",text:"Falls ein zweiter Bildschirm vorhanden ist: verschiebe das aktive Fenster dorthin und wieder zurück.",shortcut:"Win + Shift + ← / →"},
  {phase:"Finale",title:"Windows-Tiling-Mission",text:"Baue ein Dreifenster-Layout, verschiebe Teams auf einen zweiten Desktop und kehre nur mit der Tastatur zum Browser zurück.",shortcut:"Win + Z · Alt + Tab"},
];
const challengeMac: Step[] = [
  {phase:"Rectangle",title:"Zwei Fenster nebeneinander",text:"Öffne Safari und Finder. Lege Safari in die linke und Finder in die rechte Bildschirmhälfte.",shortcut:"Ctrl + Option + ← / →",tip:"Dies sind die Rectangle-Standardkürzel. Sie können in Rectangle angepasst worden sein."},
  {phase:"Rectangle",title:"Fenster in die Ecken legen",text:"Ordne vier Fenster oben links, oben rechts, unten links und unten rechts an.",shortcut:"Ctrl + Option + U / I / J / K"},
  {phase:"Rectangle",title:"Fenster maximieren",text:"Maximiere das aktive Fenster mit Rectangle und stelle danach die vorherige Grösse wieder her.",shortcut:"Ctrl + Option + Return"},
  {phase:"Rectangle",title:"Fenster zentrieren",text:"Verkleinere ein Fenster und setze es anschliessend exakt in die Bildschirmmitte.",shortcut:"Ctrl + Option + C"},
  {phase:"Rectangle",title:"Drei Spalten bauen",text:"Ordne Browser, Teams und Finder im linken, mittleren und rechten Drittel an.",shortcut:"Ctrl + Option + D / F / G"},
  {phase:"Apps",title:"Zwischen Programmen wechseln",text:"Halte Command gedrückt und tippe auf Tab. Wechsle gezielt zwischen Safari, Teams und Finder.",shortcut:"Command + Tab"},
  {phase:"Spaces",title:"Neuen Schreibtisch nutzen",text:"Öffne Mission Control, erstelle einen neuen Schreibtisch und öffne dort Outlook.",shortcut:"Ctrl + ↑"},
  {phase:"Spaces",title:"Zwischen Schreibtischen wechseln",text:"Wechsle ohne Maus zum vorherigen Schreibtisch und wieder zurück.",shortcut:"Ctrl + ← / →"},
  {phase:"Bildschirme",title:"Fenster zum nächsten Monitor",text:"Falls ein zweiter Bildschirm vorhanden ist: verschiebe das aktive Fenster mit Rectangle dorthin.",shortcut:"Ctrl + Option + Command + →"},
  {phase:"Finale",title:"Rectangle-Tiling-Mission",text:"Baue ein Dreispalten-Layout, verschiebe Teams auf einen zweiten Schreibtisch und kehre nur mit der Tastatur zu Safari zurück.",shortcut:"D / F / G · Command + Tab"},
];

const shortcutsWindows: Step[] = [
  {phase:"Navigation",title:"Wortweise durch Text springen",text:"Öffne ein Textdokument. Bewege den Cursor fünf Wörter nach rechts und danach zwei Wörter zurück, ohne die Maus zu benutzen.",shortcut:"Ctrl + ← / →"},
  {phase:"Markieren",title:"Wörter präzise markieren",text:"Markiere die nächsten drei Wörter ab der Cursorposition. Kopiere noch nichts.",shortcut:"Ctrl + Shift + →"},
  {phase:"Auswahl",title:"Alles auswählen",text:"Markiere den gesamten Text mit einem einzigen Kürzel und hebe die Auswahl danach mit einer Pfeiltaste wieder auf.",shortcut:"Ctrl + A"},
  {phase:"Zwischenablage",title:"Kopieren, ausschneiden, einfügen",text:"Kopiere einen Satz, füge ihn an einer neuen Stelle ein und verschiebe einen zweiten Satz per Ausschneiden.",shortcut:"Ctrl + C / X / V"},
  {phase:"Bearbeiten",title:"Fehler rückgängig machen",text:"Lösche absichtlich ein Wort, mache die Aktion rückgängig und führe sie danach nochmals aus.",shortcut:"Ctrl + Z · Ctrl + Shift + Z"},
  {phase:"Dokument",title:"Suchen, speichern, drucken",text:"Suche im Dokument nach einem Wort, speichere und öffne zuletzt den Druckdialog. Brich den Druckdialog wieder ab.",shortcut:"Ctrl + F / S / P"},
  {phase:"Programme",title:"Fenster wechseln und schliessen",text:"Wechsle zu einem anderen Programm, kehre zurück und schliesse anschliessend ein nicht benötigtes Fenster.",shortcut:"Alt + Tab · Alt + F4"},
  {phase:"Sicherheit",title:"Computer sperren",text:"Sperre den Computer und melde dich danach wieder an.",shortcut:"Win + L"},
  {phase:"Browser",title:"Tabs steuern",text:"Öffne zwei neue Tabs, wechsle zum rechten Tab, schliesse ihn und stelle ihn wieder her.",shortcut:"Ctrl + T / Tab / W · Ctrl + Shift + T"},
  {phase:"Code",title:"Code ein- und ausrücken",text:"Markiere mehrere Codezeilen, rücke sie einmal ein und danach wieder aus.",shortcut:"Tab · Shift + Tab"},
  {phase:"Finale",title:"Die 60-Sekunden-Mission",text:"Kopiere Text, finde ein Wort, wechsle die App, öffne einen Browser-Tab und stelle einen geschlossenen Tab wieder her - alles ohne Maus.",shortcut:"C · F · Tab · T · Shift + T"},
];
const shortcutsMac: Step[] = [
  {phase:"Navigation",title:"Wortweise durch Text springen",text:"Öffne ein Textdokument. Bewege den Cursor fünf Wörter nach rechts und danach zwei Wörter zurück, ohne die Maus zu benutzen.",shortcut:"Option + ← / →"},
  {phase:"Markieren",title:"Wörter präzise markieren",text:"Markiere die nächsten drei Wörter ab der Cursorposition. Kopiere noch nichts.",shortcut:"Option + Shift + →"},
  {phase:"Auswahl",title:"Alles auswählen",text:"Markiere den gesamten Text mit einem einzigen Kürzel und hebe die Auswahl danach mit einer Pfeiltaste wieder auf.",shortcut:"Command + A"},
  {phase:"Zwischenablage",title:"Kopieren, ausschneiden, einfügen",text:"Kopiere einen Satz und füge ihn neu ein. Verschiebe danach eine Datei mit Kopieren und der Einfügen-Variante zum Bewegen.",shortcut:"Command + C / V · Option + Command + V"},
  {phase:"Bearbeiten",title:"Fehler rückgängig machen",text:"Lösche absichtlich ein Wort, mache die Aktion rückgängig und führe sie danach nochmals aus.",shortcut:"Command + Z · Command + Shift + Z"},
  {phase:"Dokument",title:"Suchen, speichern, drucken",text:"Suche im Dokument nach einem Wort, speichere und öffne zuletzt den Druckdialog. Brich den Druckdialog wieder ab.",shortcut:"Command + F / S / P"},
  {phase:"Programme",title:"Programme und Fenster wechseln",text:"Wechsle zu einer anderen App. Wechsle danach zwischen zwei Fenstern derselben App und schliesse die App.",shortcut:"Command + Tab · Command + < · Command + Q"},
  {phase:"Sicherheit",title:"Computer sperren",text:"Sperre den Mac und melde dich danach wieder an.",shortcut:"Command + Ctrl + Q"},
  {phase:"Browser",title:"Tabs steuern",text:"Öffne zwei neue Tabs, wechsle zum rechten Tab, schliesse ihn und stelle ihn wieder her.",shortcut:"Command + T / Option + → / W · Command + Shift + T"},
  {phase:"Code",title:"Code ein- und ausrücken",text:"Markiere mehrere Codezeilen, rücke sie einmal ein und danach wieder aus.",shortcut:"Tab · Shift + Tab"},
  {phase:"Finale",title:"Die 60-Sekunden-Mission",text:"Kopiere Text, finde ein Wort, wechsle die App, öffne einen Browser-Tab und stelle einen geschlossenen Tab wieder her - alles ohne Maus.",shortcut:"C · F · Tab · T · Shift + T"},
];

const guideNames: Record<GuideKey,string> = {eduzh:"EduZH-Erstlogin",wlan:"WLAN verbinden",apps:"Teams, Outlook & OneDrive",challenge:"Window-Management-Challenge",shortcuts:"Shortcut-Challenge"};

export default function Home() {
  const [guide,setGuide]=useState<GuideKey>("eduzh");
  const [current,setCurrent]=useState(0);
  const [phone,setPhone]=useState<"iphone"|"android">("iphone");
  const [computer,setComputer]=useState<"windows"|"mac">("windows");
  const [menu,setMenu]=useState(false);
  const [zoom,setZoom]=useState(false);
  const [headerHidden,setHeaderHidden]=useState(false);
  const swipeStart=useRef<{x:number;y:number}|null>(null);
  const steps=useMemo(()=>guide==="eduzh"?eduzh:guide==="apps"?apps:guide==="wlan"?(computer==="windows"?wlanWindows:wlanMac):guide==="challenge"?(computer==="windows"?challengeWindows:challengeMac):(computer==="windows"?shortcutsWindows:shortcutsMac),[guide,computer]);
  const step=steps[current]||steps[0];
  const image=guide==="eduzh"&&phone==="android"?step.altImage:step.image;
  const pdfHref=guide==="eduzh"?`/pdfs/eduzh-${phone}.pdf`:guide==="wlan"?`/pdfs/wlan-${computer==="mac"?"macos":"windows"}.pdf`:guide==="apps"?"/pdfs/microsoft-365.pdf":guide==="challenge"?`/pdfs/window-management-${computer==="mac"?"macos":"windows"}.pdf`:`/pdfs/shortcut-challenge-${computer==="mac"?"macos":"windows"}.pdf`;
  const choose=(key:GuideKey)=>{setGuide(key);setCurrent(0);setMenu(false);setZoom(false);window.scrollTo({top:0,behavior:"smooth"});};
  const go=(n:number)=>{setCurrent(Math.max(0,Math.min(n,steps.length-1)));window.scrollTo({top:0,behavior:"smooth"});};
  useEffect(()=>{setCurrent(0)},[computer]);
  useEffect(()=>{const timer=window.setTimeout(()=>setHeaderHidden(true),3600);return()=>window.clearTimeout(timer)},[]);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==="ArrowRight")setCurrent(n=>Math.min(n+1,steps.length-1));if(e.key==="ArrowLeft")setCurrent(n=>Math.max(n-1,0));if(e.key==="Escape"){setZoom(false);setMenu(false)}};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)},[steps.length]);
  const finishSwipe=(event:React.PointerEvent)=>{
    if(!swipeStart.current)return;
    const dx=event.clientX-swipeStart.current.x,dy=event.clientY-swipeStart.current.y;
    swipeStart.current=null;
    if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.2)go(current+(dx<0?1:-1));
  };

  return <main>
    <button className="menu-button" onClick={()=>setMenu(true)} aria-label="Anleitungen öffnen"><span>☰</span><b>Anleitungen</b></button>
    <header className={`topbar ${headerHidden?"hidden":""}`} onClick={()=>setHeaderHidden(false)}>
      <a className="brand" href="#top"><img className="official-logo" src="/fdu-logo-weiss.svg" alt="Kantonsschule Stadelhofen – Filiale Dübendorf"/></a>
      <div className="header-info"><span>IKT-Einführung</span><strong><span className="desktop-hint">← → navigieren</span><span className="mobile-hint">↔ wischen</span></strong></div>
    </header>
    <div className={`drawer-shade ${menu?"open":""}`} onClick={()=>setMenu(false)}/>
    <aside className={`drawer ${menu?"open":""}`} aria-hidden={!menu}>
      <button className="drawer-close" onClick={()=>setMenu(false)} aria-label="Menü schliessen">×</button>
      <small>IKT-EINFÜHRUNG</small><h1>Was möchtest du einrichten?</h1>
      {(Object.keys(guideNames) as GuideKey[]).map((key,i)=><button key={key} className={guide===key?"active":""} onClick={()=>choose(key)}><span>0{i+1}</span><b>{guideNames[key]}</b></button>)}
      <a href="https://cyrilblum.github.io/KSTFDue/" target="_blank" rel="noreferrer">BYOD-Software & weitere Anleitungen ↗</a>
    </aside>

    <nav className="progress" aria-label="Fortschritt">
      <div className="progress-copy"><span>{guideNames[guide]}</span><strong>{current+1} / {steps.length}</strong></div>
      <div className="bar"><i style={{width:`${((current+1)/steps.length)*100}%`}}/></div>
      <div className="dots">{steps.map((s,i)=><button key={`${s.title}-${i}`} onClick={()=>go(i)} className={i===current?"active":i<current?"done":""} aria-label={`Schritt ${i+1}: ${s.title}`}><span>{i+1}</span></button>)}</div>
    </nav>

    <section className={`guide ${!image?"challenge-guide":""}`} id="top" onPointerDown={e=>{if((e.target as HTMLElement).closest("button,a"))return;swipeStart.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerUp={finishSwipe} onPointerCancel={()=>{swipeStart.current=null}}>
      <div className="visual-wrap">
        {image?<button className="screenshot" onClick={()=>setZoom(true)} aria-label="Screenshot vergrössern"><img src={image} alt={`Screenshot zu ${step.title}`}/><span className="zoom-label">＋ Vergrössern</span></button>:<div className="challenge-card"><small>{computer==="windows"?"WINDOWS":"macOS"}</small><span>{String(current+1).padStart(2,"0")}</span><b>{step.shortcut|| (current===steps.length-1?"✓":"GO")}</b><p>{guide==="shortcuts"?"SHORTCUT TRAINING":"WINDOW MANAGEMENT · KG / HMS"}</p></div>}
        <div className="swipe-hint">{image?"Screenshot antippen zum Vergrössern":"Praxisaufgabe am eigenen BYOD-Gerät"}</div>
      </div>
      <article className="instruction">
        <div className="step-label"><span>Schritt {String(current+1).padStart(2,"0")}</span><i/>{step.phase}</div>
        <h2>{step.title}</h2><p>{step.text}</p>
        {guide==="eduzh"&&current===1&&<div className="device-picker"><button className={phone==="iphone"?"selected":""} onClick={()=>setPhone("iphone")}><b>iPhone</b><span>App Store</span></button><button className={phone==="android"?"selected":""} onClick={()=>setPhone("android")}><b>Android</b><span>Google Play</span></button></div>}
        {(guide==="wlan"||guide==="challenge"||guide==="shortcuts")&&<div className="device-picker"><button className={computer==="windows"?"selected":""} onClick={()=>setComputer("windows")}><b>Windows</b><span>PC</span></button><button className={computer==="mac"?"selected":""} onClick={()=>setComputer("mac")}><b>macOS</b><span>MacBook</span></button></div>}
        {step.tip&&<aside className="tip"><strong>Gut zu wissen</strong>{step.tip}</aside>}
        {guide==="eduzh"&&step.phase==="Kennwort"&&<aside className="password-box"><strong>Konkretes Beispiel</strong><code>Wolke!Kanu7Tisch-Lama</code><p>Vier unerwartete Wörter, Gross-/Kleinbuchstaben, Zahl und Sonderzeichen. Erfinde unbedingt dein eigenes Beispiel und verwende es nur für dieses Konto.</p></aside>}
        {current===steps.length-1&&<div className="finish-block"><div className="success">✓ Anleitung abgeschlossen</div>{guide==="eduzh"&&<a className="moodle" href="https://moodle.kst-fdu.ch/" target="_blank" rel="noreferrer">Jetzt auf Moodle anmelden und Aufgaben lösen ↗</a>}</div>}
        <div className="actions"><button className="back" onClick={()=>go(current-1)} disabled={current===0}>← Zurück</button><button className="next" onClick={()=>go(current+1)} disabled={current===steps.length-1}>{current===steps.length-2?"Zum Abschluss":"Weiter"} <span>→</span></button></div>
        <a className="pdf-download" href={pdfHref}>↗ Aktuelle Anleitung als PDF öffnen</a>
        <p className="keyboard"><span className="desktop-hint">Mit den Pfeiltasten navigieren.</span><span className="mobile-hint">Nach links oder rechts wischen.</span></p>
      </article>
    </section>
    <img className="bottom-decoration" src="/glatt-linie-footer.png" alt="" aria-hidden="true"/>
    <footer><strong>© 2026 Cyril Blum</strong><span>Kantonsschule Stadelhofen · Filiale Dübendorf</span></footer>
    {zoom&&image&&<div className="lightbox" role="dialog" aria-modal="true" onClick={()=>setZoom(false)}><button aria-label="Schliessen">×</button><img src={image} alt=""/></div>}
  </main>;
}
