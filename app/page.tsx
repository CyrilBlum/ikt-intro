"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import defaultContent from "./content.json";

type GuideLink = { style?: "link" | "pdf" | "download" | "further" | "next"; label: string; href?: string; guide?: string; tag?: string; note?: string; boxed?: boolean };
type Step = { image?: string; phase: string; title: string; text: string; tip?: string; shortcut?: string; flow?: string[]; in2Mobile?: boolean; existingImage?: string; existingImage2?: string; existingText?: string; existingSummary?: string; existingCaption1?: string; existingCaption2?: string; legend?: [string, string][]; legendHead?: [string, string];
  links?: GuideLink[];
  callout?: { title?: string; text?: string; label?: string; href?: string; guide?: string };
  box?: { title?: string; code?: string; text?: string };
  launch?: { browserTitle?: string; browserText?: string; title?: string; intro?: string; code?: string; hint?: string; label?: string; href: string };
  downloads?: { title?: string; text?: string; items: { kind?: string; tag?: string; name: string; note?: string; href: string }[]; links?: { label: string; href: string }[] };
  terminal?: { title?: string; lines: { prompt?: string; code: string }[]; noteTitle?: string; note?: string };
};
type Visual = { flowLabel?: string; loop?: string; repeatFrom?: number; repeatTitle?: string; repeatNote?: string; cardLabel?: string; cardFooter?: string };
type Finish = { success?: string; title?: string; choices?: { label: string; guide: string }[]; moodle?: { label: string; href: string; text?: string } };
type GuideKey = "eduzh" | "eduzhNoPhone" | "ugWorkflow" | "kgWorkflow" | "officeMobile" | "intranetMobile" | "wlan" | "kgIntranet" | "printer" | "apps" | "challenge" | "shortcuts" | "profile" | "peerSupport" | "beamerAirserver" | "klpCalendar" | "klpFobizz" | "absSick" | "absJoker" | "absDisp" | "lpAttendance" | "klpAbsences" | "klpDisp";
type Content = { version: number; guides: Record<string, { name: string; description: string }>; lists: Record<string, { label: string; steps: Step[]; pdf?: string; finish?: Finish; visual?: Visual }> };
type Lists = Record<string, Step[]>;

// Texts of all guides. The edit GUI (admin portal of the Infomonitor, ikt.in-form-atik.ch/admin) saves
// changes on the server; the page loads them from CONTENT_URL and falls back to this bundled copy.
const CONTENT_URL = "/infomonitor/api/ikt/content";
const bundledContent = defaultContent as unknown as Content;

function mergeContent(base: Content, saved?: Partial<Content> | null): Content {
  if (!saved || typeof saved !== "object") return base;
  const lists = { ...base.lists };
  for (const [key, list] of Object.entries(saved.lists || {})) if (list && Array.isArray(list.steps) && list.steps.length) lists[key] = { ...base.lists[key], ...list };
  const guides = { ...base.guides };
  for (const [key, g] of Object.entries(saved.guides || {})) if (guides[key] && g) guides[key] = { ...guides[key], ...g };
  return { ...base, guides, lists };
}

const guidePaths: Record<GuideKey,string> = {eduzh:"/eduzh",eduzhNoPhone:"/eduzh-ohne-handy",ugWorkflow:"/untergymnasium",kgWorkflow:"/kurzzeitgymnasium-hms",officeMobile:"/ug/office-365-smartphone",intranetMobile:"/ug/intranet-smartphone",wlan:"/wlan",kgIntranet:"/kg/intranet",printer:"/kg/drucker-kopierer",apps:"/microsoft-365",profile:"/challenges/steckbrief",challenge:"/challenges/window-management",shortcuts:"/challenges/shortcuts",peerSupport:"/lehrpersonen/drucker-installation",beamerAirserver:"/lehrpersonen/beamer-airserver",klpCalendar:"/lehrpersonen/schulkalender",klpFobizz:"/lehrpersonen/fobizz",absSick:"/absenzen-sus/absenz-melden",absJoker:"/absenzen-sus/jokertag",absDisp:"/absenzen-sus/dispensation",lpAttendance:"/absenzen-lp/absenzenkontrolle",klpAbsences:"/absenzen-lp/klasse",klpDisp:"/absenzen-lp/dispensationen-jokertage"};
const pathGuides: Record<string,GuideKey> = {
  ...Object.fromEntries(Object.entries(guidePaths).map(([key,path])=>[path,key])),
  "/mfa-ohne-smartphone": "eduzhNoPhone",
  "/peer-supporter": "peerSupport",
  "/beamer-airserver": "beamerAirserver",
  "/klp/schulkalender": "klpCalendar",
  "/klp/fobizz": "klpFobizz"
} as Record<string,GuideKey>;

const absenceGuides: GuideKey[] = ["absSick","absJoker","absDisp","lpAttendance","klpAbsences","klpDisp"];

const navigationGroups: { number: string; title: string; subtitle: string; path: string; guides: GuideKey[] }[] = [
  {number:"2a",title:"UG",subtitle:"Schul-Computer",path:"/ug",guides:["officeMobile","intranetMobile"]},
  {number:"2b",title:"KG / HMS",subtitle:"eigene BYOD-Geräte",path:"/kg",guides:["wlan","apps","kgIntranet","printer"]},
  {number:"3",title:"Challenges",subtitle:"für alle Schulstufen",path:"/challenges",guides:["profile","challenge","shortcuts"]},
  {number:"LP",title:"Lehrpersonen",subtitle:"Organisation & Medientechnik",path:"/lehrpersonen",guides:["klpCalendar","klpFobizz","peerSupport","beamerAirserver"]},
  {number:"A",title:"Absenzen SuS",subtitle:"Absenzen, Jokertage & Dispensationen für Schüler*innen",path:"/absenzen-sus",guides:["absSick","absJoker","absDisp"]},
  {number:"B",title:"Absenzen LP",subtitle:"Absenzenkontrolle für Lehrpersonen & Klassenlehrpersonen",path:"/absenzen-lp",guides:["lpAttendance","klpAbsences","klpDisp"]},
];

function getGuideListKey(key: GuideKey, computer: "windows" | "mac", phone: "iphone" | "android"): string {
  switch (key) {
    case "eduzh": return phone === "android" ? "eduzhAndroid" : "eduzhIphone";
    case "eduzhNoPhone": return "eduzhNoPhone";
    case "ugWorkflow": return "ugWorkflow";
    case "kgWorkflow": return "kgWorkflow";
    case "officeMobile": return phone === "android" ? "officeMobileAndroid" : "officeMobileIphone";
    case "intranetMobile": return "intranetMobile";
    case "kgIntranet": return "kgIntranet";
    case "printer": return "printer";
    case "apps": return "apps";
    case "beamerAirserver": return "beamerAirserver";
    case "peerSupport": return computer === "windows" ? "peerSupportWindows" : "peerSupportMac";
    case "profile": return "profile";
    case "klpCalendar": return "klpCalendar";
    case "klpFobizz": return "klpFobizz";
    case "absSick": return "absSick";
    case "absJoker": return "absJoker";
    case "absDisp": return "absDisp";
    case "lpAttendance": return "lpAttendance";
    case "klpAbsences": return "klpAbsences";
    case "klpDisp": return "klpDisp";
    case "wlan": return computer === "windows" ? "wlanWindows" : "wlanMac";
    case "challenge": return computer === "windows" ? "challengeWindows" : "challengeMac";
    case "shortcuts": return computer === "windows" ? "shortcutsWindows" : "shortcutsMac";
    default: return "eduzhIphone";
  }
}
function getGuideSteps(key: GuideKey, computer: "windows" | "mac", phone: "iphone" | "android", L: Lists): Step[] {
  return L[getGuideListKey(key, computer, phone)] || [];
}


export default function Home() {
  const [intro,setIntro]=useState(true);
  const [categoryGroup,setCategoryGroup]=useState<string|null>(null);
  const [guide,setGuide]=useState<GuideKey>("eduzh");
  const [current,setCurrent]=useState(0);
  const [phone,setPhone]=useState<"iphone"|"android">("iphone");
  const [computer,setComputer]=useState<"windows"|"mac">("windows");
  const [menu,setMenu]=useState(false);
  const [zoom,setZoom]=useState(false);
  const [qrOpen,setQrOpen]=useState(false);
  const [headerHidden,setHeaderHidden]=useState(false);
  const swipeStart=useRef<{x:number;y:number}|null>(null);
  const [content,setContent]=useState<Content>(bundledContent);
  useEffect(()=>{fetch(CONTENT_URL,{cache:"no-store"}).then(r=>r.ok?r.json():null).then(saved=>{if(saved)setContent(mergeContent(bundledContent,saved))}).catch(()=>{})},[]);
  const lists=useMemo<Lists>(()=>Object.fromEntries(Object.entries(content.lists).map(([k,v])=>[k,v.steps])),[content]);
  const guideNames=useMemo(()=>Object.fromEntries(Object.entries(content.guides).map(([k,v])=>[k,v.name])) as Record<GuideKey,string>,[content]);
  const guideDescriptions=useMemo(()=>Object.fromEntries(Object.entries(content.guides).map(([k,v])=>[k,v.description])) as Record<GuideKey,string>,[content]);
  const steps=useMemo(()=>getGuideSteps(guide,computer,phone,lists),[guide,computer,phone,lists]);
  const step=steps[current]||steps[0];
  const image=step.image;
  const desktopAppGuide=["intranetMobile","kgIntranet","printer","klpCalendar","klpFobizz","beamerAirserver",...absenceGuides].includes(guide);
  const listKey=getGuideListKey(guide,computer,phone);
  const list=content.lists[listKey];
  const pdfHref=list?.pdf||null;
  const finish=list?.finish||{};
  const visual=list?.visual||{};
  const withMarks=(t:string)=>t.split(/(__[^_]+__)/).map((part,k)=>part.startsWith("__")&&part.endsWith("__")?<u key={k}>{part.slice(2,-2)}</u>:part);
  const guideTarget=(key:string)=>({href:guidePaths[key as GuideKey]||"/",onClick:(e:React.MouseEvent)=>{e.preventDefault();if(guidePaths[key as GuideKey])openGuide(key as GuideKey)}});
  const linkProps=(l:{href?:string;guide?:string})=>l.guide?guideTarget(l.guide):{href:l.href,target:"_blank",rel:"noreferrer"};
  const withCode=(t:string)=>t.split(/(`[^`]+`)/).map((part,k)=>part.startsWith("`")&&part.endsWith("`")?<code key={k}>{part.slice(1,-1)}</code>:part);
  const openCategoryGroup=(path:string,updateUrl=true)=>{const grp=navigationGroups.find(g=>g.path===path||g.path===path.replace(/\/$/,""));if(grp){setIntro(false);setCategoryGroup(grp.number);setMenu(false);setZoom(false);if(updateUrl)window.history.pushState({},"",grp.path);window.scrollTo({top:0,behavior:"smooth"});}};
  const openGuide=(key:GuideKey,updateUrl=true)=>{setIntro(false);setCategoryGroup(null);setGuide(key);setCurrent(0);setMenu(false);setZoom(false);if(updateUrl)window.history.pushState({},"",guidePaths[key]);window.scrollTo({top:0,behavior:"smooth"});};
  const go=(n:number)=>{setCurrent(Math.max(0,Math.min(n,steps.length-1)));window.scrollTo({top:0,behavior:"smooth"});};
  useEffect(()=>{setCurrent(0)},[computer]);
  useEffect(()=>{const timer=window.setTimeout(()=>setHeaderHidden(true),3600);return()=>window.clearTimeout(timer)},[]);
  useEffect(()=>{const applyPath=()=>{const rawPath=window.location.pathname;const cleanPath=rawPath.replace(/\/$/,"")||"/";const grp=navigationGroups.find(g=>g.path===cleanPath||g.path+"/"===rawPath);if(grp){openCategoryGroup(grp.path,false);return;}const key=pathGuides[cleanPath];if(key){openGuide(key,false);return;}setIntro(true);setCategoryGroup(null);};applyPath();window.addEventListener("popstate",applyPath);return()=>window.removeEventListener("popstate",applyPath)},[]);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(!intro&&!categoryGroup&&e.key==="ArrowRight")setCurrent(n=>Math.min(n+1,steps.length-1));if(!intro&&!categoryGroup&&e.key==="ArrowLeft")setCurrent(n=>Math.max(n-1,0));if(e.key==="Escape"){setZoom(false);setQrOpen(false);setMenu(false)}};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)},[intro,categoryGroup,steps.length]);
  const finishSwipe=(event:React.PointerEvent)=>{
    if(!swipeStart.current)return;
    const dx=event.clientX-swipeStart.current.x,dy=event.clientY-swipeStart.current.y;
    swipeStart.current=null;
    if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.2)go(current+(dx<0?1:-1));
  };

  return <main>
    <button className={`menu-button ${headerHidden&&!intro?"on-paper":""}`} onClick={()=>setMenu(true)} aria-label="Anleitungen öffnen"><span>☰</span><b>Anleitungen</b></button>
    {!intro&&<header className={`topbar ${headerHidden?"hidden":""}`} onClick={()=>setHeaderHidden(false)}>
      <a className="brand" href="#top"><img className="official-logo" src="/fdu-logo-weiss.svg" alt="Kantonsschule Stadelhofen – Filiale Dübendorf"/></a>
      <div className="header-info"><span>IKT-Einführung</span><strong><span className="desktop-hint">← → navigieren</span><span className="mobile-hint">↔ wischen</span></strong></div>
    </header>}
    <div className={`drawer-shade ${menu?"open":""}`} onClick={()=>setMenu(false)}/>
    <aside className={`drawer ${menu?"open":""}`} aria-hidden={!menu}>
      <button className="drawer-close" onClick={()=>setMenu(false)} aria-label="Menü schliessen">×</button>
      <small>IKT-EINFÜHRUNG</small><h1>Was möchten Sie einrichten?</h1>
      <button className={intro?"active":""} onClick={()=>{setIntro(true);setCategoryGroup(null);setMenu(false);window.history.pushState({},"","/");window.scrollTo({top:0,behavior:"smooth"})}}><span>00</span><b>Startseite</b></button>
      <button className={!intro&&!categoryGroup&&guide==="eduzh"?"active":""} onClick={()=>openGuide("eduzh")}><span>01a</span><b>EduZH-Erstlogin (mit Smartphone)</b></button>
      <button className={!intro&&!categoryGroup&&guide==="eduzhNoPhone"?"active":""} onClick={()=>openGuide("eduzhNoPhone")}><span>01b</span><b>EduZH-Erstlogin (ohne Smartphone)</b></button>
      {navigationGroups.map(group=><section className={`nav-group group-${group.number.toLowerCase()}`} key={group.title}><h2 className={`clickable-category-header ${!intro&&categoryGroup===group.number?"active":""}`} onClick={()=>openCategoryGroup(group.path)} title={`${group.title} Übersicht öffnen`}><span>{group.number}</span><b>{group.title} ↗</b></h2>{group.guides.map((key,i)=>{
        const isChallenge=key==="challenge"||key==="shortcuts"||key==="profile";
        return <button key={key} className={`${!intro&&!categoryGroup&&guide===key?"active":""} ${isChallenge?"challenge-entry":""}`} onClick={()=>openGuide(key)}><span>{group.number}.{i+1}</span><b>{guideNames[key]}</b></button>
      })}</section>)}
      <a href="https://cyrilblum.github.io/KSTFDue/" target="_blank" rel="noreferrer">BYOD-Software & weitere Anleitungen ↗</a>
      <section className="drawer-about" aria-labelledby="about-title">
        <small id="about-title">ÜBER DIESE SEITE</small>
        <p>Erstellt von <strong>Cyril Blum</strong></p>
        <div><a href="https://cblum.ch/" target="_blank" rel="noreferrer">cblum.ch ↗</a><a href="https://github.com/CyrilBlum/ikt-intro" target="_blank" rel="noreferrer">GitHub-Repository ↗</a></div>
      </section>
    </aside>

    {intro?<section className="intro" id="top">
      <img className="intro-photo" src="/fdu-campus.jpg" alt="Schulhaus der Kantonsschule Stadelhofen, Filiale Dübendorf"/>
      <div className="intro-shade"/>
      <div className="intro-copy">
        <img src="/fdu-logo-weiss.svg" alt="Kantonsschule Stadelhofen – Filiale Dübendorf"/>
        <h1>IKT-Einführung</h1>
        <p>Alle beginnen mit dem EduZH-Erstlogin auf dem Smartphone. Danach wählen Sie Ihren weiteren Schulweg.</p>
        <button onClick={()=>openGuide("eduzh")}>Mit EduZH beginnen <span>→</span></button>
        <div className="intro-sub-action">
          <button className="intro-no-phone-btn" onClick={()=>openGuide("eduzhNoPhone")}>Kein Smartphone? Erstlogin ohne Handy (USB-Hauptschlüssel) ↗</button>
        </div>
      </div>
      <aside className="wifi-card">
        <img src="/wifi.svg" alt="QR-Code für das WLAN"/>
        <div>
          <strong>WLAN &amp; Einstieg wählen</strong>
          <div className="wifi-branch-mini">
            <div className="wifi-case case-laptop">
              <span className="case-badge">FALL 1 · AUTHENTICATOR BEREITS BEREIT</span>
              <p>💻 <strong>Zuerst am Laptop:</strong> Zuerst mit WLAN <code>KTZH-S</code> verbinden (Schulaccount <code>vorname.nachname@stud.edu.zh.ch</code> + Passwort). <em>Erst danach</em> <code>ikt.in-form-atik.ch</code> auf dem Laptop öffnen.</p>
            </div>
            <div className="wifi-case case-mobile">
              <span className="case-badge">FALL 2 · ERSTLOGIN</span>
              <p>📱 <strong>Am Handy:</strong> Zuerst mit <code>KTZH-Schulstart</code> oder mobilem Netz verbinden, <em>danach</em> <code>ikt.in-form-atik.ch</code> auf dem Handy öffnen – oder direkt mit der ausgedruckten Papier-Anleitung arbeiten.</p>
            </div>
          </div>
          <button onClick={()=>setQrOpen(true)}>🔍 Beide QR-Codes gross anzeigen</button>
        </div>
      </aside>
      <p className="intro-menu-hint">Alle Anleitungen finden Sie über das Menü oben links.</p>
    </section>:categoryGroup!==null?(()=>{
      const activeGrp=navigationGroups.find(g=>g.number===categoryGroup)||navigationGroups[0];
      return <div className="category-overview" id="top">
        <div className="category-header">
          <div className={`category-badge badge-${activeGrp.number.toLowerCase()}`}>
            <span>RUBRIK {activeGrp.number}</span>
          </div>
          <h1>{activeGrp.title}</h1>
          <p>{activeGrp.subtitle}</p>
        </div>

        <div className="category-grid">
          {activeGrp.guides.map((key,i)=>{
            return <div key={key} className="category-card" onClick={()=>openGuide(key)}>
              <span className="category-card-number">{activeGrp.number}.{i+1} · ANLEITUNG</span>
              <h3>{guideNames[key]}</h3>
              <p>{guideDescriptions[key]}</p>
              <button className="category-card-btn">
                <span>Anleitung öffnen</span>
                <span>→</span>
              </button>
            </div>
          })}
        </div>

        <button className="category-back-btn" onClick={()=>{setIntro(true);setCategoryGroup(null);window.history.pushState({},"","/");window.scrollTo({top:0,behavior:"smooth"})}}>
          <span>←</span> Zurück zur Startseite
        </button>
      </div>
    })():<>
    <nav className="progress" aria-label="Fortschritt">
      <div className="progress-copy"><span>{guideNames[guide]}</span><strong>{current+1} / {steps.length}</strong></div>
      <div className="bar"><i style={{width:`${((current+1)/steps.length)*100}%`}}/></div>
    </nav>

    <section className={`guide ${!image?"challenge-guide":""} ${desktopAppGuide?"desktop-app-guide":""}`} id="top" onPointerDown={e=>{if((e.target as HTMLElement).closest("button,a,details"))return;swipeStart.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerUp={finishSwipe} onPointerCancel={()=>{swipeStart.current=null}}>
      <div className={`visual-wrap ${image?.toLowerCase().endsWith(".png")?"png-visual":""}`}>
        {image?<button className="screenshot" onClick={()=>setZoom(true)} aria-label="Screenshot vergrössern"><img src={image} alt={`Screenshot zu ${step.title}`}/><span className="zoom-label">＋ Vergrössern</span></button>:step.in2Mobile?<div className="in2-visual"><small>IN2 MOBILE</small><b>App installieren</b><span>iPhone oder Android</span></div>:step.flow?<div className={`flow-visual ${visual.loop?`workflow-loop ${visual.loop}-loop`:""}`}><small>{visual.flowLabel||"ABLAUF"}</small>{step.flow.map((item,index)=>{const repeats=!!visual.repeatFrom&&index+1>=visual.repeatFrom;const startsRepeat=!!visual.repeatFrom&&index+1===visual.repeatFrom;return <div key={item} className={repeats?"repeat-step":""}>{startsRepeat&&visual.repeatTitle&&<em>{visual.repeatTitle}</em>}<span>{String(index+1).padStart(2,"0")}</span><b>{withMarks(item)}</b>{index<step.flow!.length-1&&<i>↓</i>}</div>})}{visual.repeatNote&&<p className="repeat-note">{visual.repeatNote}</p>}</div>:<div className="challenge-card"><small>{visual.cardLabel}</small><span>{String(current+1).padStart(2,"0")}</span><b>{step.shortcut|| (current===steps.length-1?"✓":"GO")}</b><p>{visual.cardFooter}</p></div>}
        <div className="swipe-hint">{image?"Screenshot antippen zum Vergrössern":"Praxisaufgabe am eigenen BYOD-Gerät"}</div>
      </div>
      <article className="instruction">
        <div className="step-label"><span>Schritt {String(current+1).padStart(2,"0")}</span><i/>{step.phase}</div>
        <h2>{step.title}</h2><p>{step.text}</p>
        {step.legend&&<table className="legend-table"><thead><tr><th>{step.legendHead?.[0]??"Kürzel"}</th><th>{step.legendHead?.[1]??"Bedeutung"}</th></tr></thead><tbody>{step.legend.map(([code,label])=><tr key={code}><td>{code}</td><td>{label}</td></tr>)}</tbody></table>}
        {step.launch&&<section className="workflow-launch" aria-label="Moodle starten"><div className="browser-launch"><p><strong>{step.launch.browserTitle}</strong><span>{step.launch.browserText}</span></p></div><a href={step.launch.href} target="_blank" rel="noreferrer"><b>{step.launch.title}</b>{step.launch.intro&&<span>{step.launch.intro}</span>}{step.launch.code&&<code>{step.launch.code}</code>}{step.launch.hint&&<span className="moodle-hint">{step.launch.hint}</span>}{step.launch.label&&<span>{step.launch.label}</span>}</a></section>}
        {(guide==="eduzh"&&current===0||guide==="officeMobile"&&current===0)&&<div className="device-picker"><button className={phone==="iphone"?"selected":""} onClick={()=>setPhone("iphone")}><b>iPhone</b><span>App Store</span></button><button className={phone==="android"?"selected":""} onClick={()=>setPhone("android")}><b>Android</b><span>Google Play</span></button></div>}
        {step.callout&&<aside className="tip" style={{marginTop:"10px"}}>{step.callout.title&&<strong>{step.callout.title}</strong>} {step.callout.text} {step.callout.label&&<a {...linkProps(step.callout)}>{step.callout.label}</a>}</aside>}
        {step.existingImage&&<details className="alternate-path"><summary>{step.existingSummary||"Alternative"}</summary><p>{step.existingText}</p><div><figure><img src={step.existingImage} alt={step.existingCaption1||""}/><figcaption>{step.existingCaption1}</figcaption></figure>{step.existingImage2&&<figure><img src={step.existingImage2} alt={step.existingCaption2||""}/><figcaption>{step.existingCaption2}</figcaption></figure>}</div></details>}
        {(guide==="wlan"||guide==="challenge"||guide==="shortcuts"||guide==="peerSupport")&&<div className="device-picker"><button className={computer==="windows"?"selected":""} onClick={()=>setComputer("windows")}><b>Windows</b><span>PC</span></button><button className={computer==="mac"?"selected":""} onClick={()=>setComputer("mac")}><b>macOS</b><span>MacBook</span></button></div>}
        {step.tip&&<aside className="tip"><strong>Gut zu wissen</strong>{step.tip}</aside>}
        {(step.links||[]).filter(l=>l.style!=="next").map((l,k)=>{
          const style=l.style||"link";
          if(style==="pdf")return <a key={k} className="peer-pdf" {...linkProps(l)}>{l.tag&&<span>{l.tag}</span>}<strong>{l.label} ↗</strong>{l.note&&<small>{l.note}</small>}</a>;
          if(style==="download")return <a key={k} className="template-download" href={l.href} download>{l.label} ↓</a>;
          if(style==="further")return <a key={k} className="further-tasks" {...linkProps(l)}>{l.label} ↗</a>;
          const a=<a key={k} className="byod-link" {...linkProps(l)}>{l.label}{l.guide?" →":" ↗"}</a>;
          return l.boxed?<div key={k} className="peer-step-box">{a}</div>:a;
        })}
        {step.downloads&&<div className="peer-download-container">
          <div className="peer-download-header">{step.downloads.title&&<strong>{step.downloads.title}</strong>}{step.downloads.text&&<span>{step.downloads.text}</span>}</div>
          <div className="peer-download-cards">{step.downloads.items.map((d,k)=><a key={k} className={`peer-dl-card ${d.kind||"zip"}-card`} href={d.href} download><div className="peer-dl-info">{d.tag&&<span className="peer-dl-tag">{d.tag}</span>}<strong>{d.name}</strong>{d.note&&<small>{d.note}</small>}</div></a>)}</div>
          {!!step.downloads.links?.length&&<div className="peer-quick-links">{step.downloads.links.map((l,k)=><a key={k} className="peer-quick-link" href={l.href} target="_blank" rel="noreferrer">{l.label}</a>)}</div>}
        </div>}
        {step.terminal&&<div className="terminal-box">
          <div className="terminal-header"><div className="terminal-dots"><span/><span/><span/></div><span>{step.terminal.title}</span></div>
          <div className="terminal-body">{step.terminal.lines.map((t,k)=><div key={k} className="terminal-line"><span className="prompt">{t.prompt||"$"}</span> <code>{t.code}</code></div>)}</div>
          {step.terminal.note&&<div className="terminal-footer"><p>{step.terminal.noteTitle&&<strong>{step.terminal.noteTitle}</strong>} {withCode(step.terminal.note)}</p></div>}
        </div>}
        {(step.links||[]).filter(l=>l.style==="next"&&l.guide).map((l,k)=><button key={k} className="workflow-next" onClick={()=>openGuide(l.guide as GuideKey)}>{l.label} <span>→</span></button>)}
        {step.in2Mobile&&<section className="in2-codes" aria-label="IN2 Mobile herunterladen"><a href="https://apps.apple.com/ch/app/in2-mobile/id1560963697" target="_blank" rel="noreferrer"><img src="/screenshots/kg-intranet/in2-mobile-iphone-qr.png" alt="QR-Code für IN2 Mobile im Apple App Store"/><strong>iPhone</strong><span>App Store öffnen ↗</span></a><a href="https://play.google.com/store/apps/details?id=net.gyselroth.in2mobile&hl=de_CH" target="_blank" rel="noreferrer"><img src="/screenshots/kg-intranet/in2-mobile-android-qr.png" alt="QR-Code für IN2 Mobile bei Google Play"/><strong>Android</strong><span>Google Play öffnen ↗</span></a></section>}
        {step.box&&<aside className="password-box">{step.box.title&&<strong>{step.box.title}</strong>}{step.box.code&&<code>{step.box.code}</code>}{step.box.text&&<p>{step.box.text}</p>}</aside>}
        {current===steps.length-1&&<div className="finish-block"><div className="success">{finish.success||"Anleitung abgeschlossen"}</div>{!!finish.choices?.length&&<div className="path-choice">{finish.title&&<strong>{finish.title}</strong>}<div>{finish.choices.map((c,k)=><a key={k} {...guideTarget(c.guide)}>{c.label}</a>)}</div></div>}{finish.moodle&&<><a className="moodle" href={finish.moodle.href} target="_blank" rel="noreferrer">{finish.moodle.label}</a>{finish.moodle.text&&<p className="moodle-flow">{finish.moodle.text}</p>}</>}</div>}
        <div className="actions"><button className="back" onClick={()=>go(current-1)} disabled={current===0}>← Zurück</button><button className="next" onClick={()=>go(current+1)} disabled={current===steps.length-1}>{current===steps.length-2?"Zum Abschluss":"Weiter"} <span>→</span></button></div>
        {pdfHref&&<a className="pdf-download" href={pdfHref}>↗ Aktuelle Anleitung als PDF öffnen</a>}
        <p className="keyboard"><span className="desktop-hint">Mit den Pfeiltasten navigieren.</span><span className="mobile-hint">Nach links oder rechts wischen.</span></p>
      </article>
    </section>
    </>}
    <img className="bottom-decoration" src="/glatt-linie-footer-20260814.png" alt="" aria-hidden="true"/>
    <footer><strong>© 2026 Cyril Blum</strong><span>Kantonsschule Stadelhofen · Filiale Dübendorf</span></footer>
    {zoom&&image&&<div className="lightbox" role="dialog" aria-modal="true" onClick={()=>setZoom(false)}><button aria-label="Schliessen">×</button><img src={image} alt=""/></div>}
    {qrOpen&&<div className="qr-lightbox" role="dialog" aria-modal="true" aria-label="QR-Codes für WLAN und IKT-Webseite" onClick={()=>setQrOpen(false)}>
      <button className="qr-close" aria-label="QR-Codes schliessen">×</button>
      <div className="qr-stage-wrap" onClick={e=>e.stopPropagation()}>
        <div className="qr-branch-header">
          <div className="qr-branch-card branch-laptop">
            <div className="card-header-badge">FALL 1 · AUTHENTICATOR BEREITS EINGERICHTET</div>
            <h3>💻 Auf dem Laptop arbeiten</h3>
            <ol className="branch-steps">
              <li><strong>1. Zuerst WLAN verbinden:</strong> Verbinden Sie Ihren Laptop zuerst mit dem Schul-WLAN <code>KTZH-S</code> (Login: <code>vorname.nachname@stud.edu.zh.ch</code> + Passwort).</li>
              <li><strong>2. Erst danach Webseite öffnen:</strong> Sobald KTZH-S verbunden ist, öffnen Sie im Browser auf dem Laptop <code>ikt.in-form-atik.ch</code>.</li>
            </ol>
          </div>

          <div className="qr-branch-card branch-mobile">
            <div className="card-header-badge">FALL 2 · ERSTLOGIN / NEUES GERÄT</div>
            <h3>📱 Auf dem Handy (oder mit Papier-Anleitung)</h3>
            <ol className="branch-steps">
              <li><strong>1. Zuerst WLAN verbinden:</strong> Smartphone zuerst mit WLAN <code>KTZH-Schulstart</code> (QR-Code 01 unten) oder mobilem Netz verbinden.</li>
              <li><strong>2. Erst danach Webseite öffnen:</strong> Scannen Sie QR-Code 02 unten, um <code>ikt.in-form-atik.ch</code> auf dem Handy zu öffnen.</li>
            </ol>
            <p className="paper-hint">📄 <em>Alternativ: Sie können für die Ersteinrichtung auch direkt mit der ausgedruckten Papier-Anleitung arbeiten.</em></p>
          </div>
        </div>

        <div className="qr-stage">
          <article><span>01</span><h2>Temporäres WLAN (Erstlogin)</h2><img src="/wifi.svg" alt="QR-Code für das bereitgestellte WLAN KTZH-Schulstart"/><div className="qr-details"><p><strong>SSID:</strong> <code>KTZH-Schulstart</code></p><p><strong>Passwort (PSK):</strong> <code>*Schul$t@rt_2026!%</code></p></div></article>
          <article><span>02</span><h2>Anleitung auf dem Handy öffnen</h2><img src="/ikt-in-form-atik-ch.svg" alt="QR-Code für ikt.in-form-atik.ch"/><div className="qr-details"><p><strong>URL:</strong></p><p><a href="https://ikt.in-form-atik.ch/">https://ikt.in-form-atik.ch</a></p></div></article>
        </div>
      </div>
    </div>}
  </main>;
}
