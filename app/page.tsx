"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Step = { image?: string; altImage?: string; phase: string; title: string; text: string; tip?: string; shortcut?: string };
type GuideKey = "eduzh" | "wlan" | "apps" | "challenge" | "shortcuts" | "profile";

const eduzh: Step[] = [
  { image:"/screenshots/appstore-01-suchen.png", altImage:"/screenshots/android-01-suchen.png", phase:"Vorbereiten", title:"Microsoft Authenticator suchen", text:"Öffnen Sie den App Store oder Google Play Store und suchen Sie nach «Microsoft Authenticator». Für die ganze Einrichtung benötigen Sie nur Ihr Smartphone – keinen Computer." },
  { image:"/screenshots/appstore-02-laden.jpg", altImage:"/screenshots/android-02-laden.jpg", phase:"Gerät wählen", title:"Welches Smartphone verwenden Sie?", text:"Wählen Sie Ihr Gerät aus. Die nächsten Screenshots passen sich automatisch an. Laden Sie danach «Microsoft Authenticator» und öffnen Sie die App." },
  { image:"/screenshots/appstore-03-annehmen.jpg", altImage:"/screenshots/android-03-annehmen.jpg", phase:"Vorbereiten", title:"Datenschutzbestimmungen annehmen", text:"Lesen Sie den Hinweis zu den erforderlichen Diagnosedaten und tippen Sie auf «Annehmen»." },
  { image:"/screenshots/appstore-04-weiter.jpg", altImage:"/screenshots/android-04-weiter.jpg", phase:"Vorbereiten", title:"Einführung fortsetzen", text:"Die freiwillige Freigabe zusätzlicher Nutzungsdaten können Sie ausgeschaltet lassen. Tippen Sie unten auf «Weiter»." },
  { image:"/screenshots/appstore-05-microsoft-anmelden.png", altImage:"/screenshots/appstore-05-microsoft-anmelden.png", phase:"Vorbereiten", title:"Schul- oder Unikonto hinzufügen", text:"Tippen Sie auf «Geschäfts-, Schul- oder Unikonto hinzufügen». Verwenden Sie danach Ihr EduZH-Schulkonto mit der Endung @stud.edu.zh.ch." },
  { image:"/screenshots/IMG_0677.PNG", altImage:"/screenshots/android-06-email.png", phase:"Anmelden", title:"Mit dem EduZH-Konto anmelden", text:"Geben Sie Ihre vollständige Schul-E-Mail-Adresse ein und verwenden Sie anschliessend das Startkennwort, das Sie von der Schule erhalten haben.", tip:"Achten Sie auf die Endung @stud.edu.zh.ch." },
  { image:"/screenshots/IMG_0678.PNG", altImage:"/screenshots/android-07-zusatzinfo.png", phase:"Authenticator", title:"Sicherheitsinformationen starten", text:"Microsoft benötigt weitere Sicherheitsinformationen. Tippen Sie auf «Weiter» und bleiben Sie im Browser." },
  { image:"/screenshots/IMG_0679.PNG", altImage:"/screenshots/android-08-koppeln.png", phase:"Authenticator", title:"Konto mit der App koppeln", text:"Tippen Sie auf den blauen Link zum Koppeln. Ihr Smartphone öffnet den Authenticator und richtet das Schulkonto ein." },
  { image:"/screenshots/IMG_0680.PNG", altImage:"/screenshots/android-09-konto.png", phase:"Authenticator", title:"Konto wurde hinzugefügt", text:"Das Schulkonto erscheint jetzt im Authenticator. Bestätigen Sie allfällige Hinweise und wechseln Sie zurück in den Browser." },
  { image:"/screenshots/IMG_0681.PNG", altImage:"/screenshots/android-10-zahl.png", phase:"Authenticator", title:"Anmeldung testen", text:"Im Browser erscheint eine zweistellige Zahl. Merken Sie sich diese Zahl – Sie benötigen sie gleich in der Authenticator-App." },
  { image:"/screenshots/IMG_0682.PNG", altImage:"/screenshots/android-11-bestaetigen.jpg", phase:"Authenticator", title:"Zahl eingeben und bestätigen", text:"Geben Sie im Authenticator die Zahl aus dem Browser ein, tippen Sie auf «Ja» und kehren Sie in den Browser zurück." },
  { image:"/screenshots/IMG_0683.PNG", altImage:"/screenshots/android-12-erfolgreich.png", phase:"Authenticator", title:"Authenticator abschliessen", text:"Die Testanmeldung war erfolgreich. Tippen Sie im Browser auf «Weiter»." },
  { image:"/screenshots/IMG_0684.PNG", altImage:"/screenshots/android-13-telefon.png", phase:"Telefon", title:"Telefonnummer hinzufügen", text:"Wählen Sie «Switzerland (+41)», geben Sie Ihre Mobilnummer ein und fordern Sie den Bestätigungscode per SMS an." },
  { image:"/screenshots/IMG_0685.PNG", altImage:"/screenshots/android-14-sms.png", phase:"Telefon", title:"SMS-Code eingeben", text:"Übertragen Sie den sechsstelligen Code aus der SMS und tippen Sie auf «Weiter»." },
  { image:"/screenshots/IMG_0686.PNG", altImage:"/screenshots/android-15-telefon-bestaetigt.png", phase:"Telefon", title:"Telefonnummer bestätigt", text:"Die Telefonnummer wurde erfolgreich hinzugefügt. Tippen Sie auf «Weiter» oder «Fertig»." },
  { image:"/screenshots/IMG_0687.PNG", altImage:"/screenshots/android-16-methoden.png", phase:"Telefon", title:"Sicherheitsmethoden prüfen", text:"Kontrollieren Sie, ob «Telefon» und «Microsoft Authenticator» aufgeführt sind. Tippen Sie dann auf «Fertig»." },
  { image:"/screenshots/IMG_0688.PNG", altImage:"/screenshots/android-17-kennwort.png", phase:"Kennwort", title:"Persönliches Kennwort setzen", text:"Geben Sie zuerst das Startkennwort ein. Legen Sie danach ein neues persönliches Kennwort fest und bestätigen Sie es.", tip:"Bewahren Sie Ihr Kennwort sicher auf und geben Sie es niemandem weiter." },
  { image:"/screenshots/eduzh/iphone-19-wlan-ktzh-s.png", altImage:"/screenshots/eduzh/android-19-wlan-ktzh-s.png", phase:"WLAN", title:"KTZH-S auf dem Smartphone einrichten", text:"Verbinden Sie Ihr Smartphone nun mit «KTZH-S». Verwenden Sie Ihre vollständige EduZH-Adresse @stud.edu.zh.ch und Ihr persönliches Kennwort. Falls beim Verbinden eine Zertifikatsabfrage erscheint, bestätigen beziehungsweise akzeptieren Sie diese.", tip:"Prüfen Sie zuerst, ob KTZH-S funktioniert. Entfernen Sie danach das temporäre WLAN über «Dieses Netzwerk ignorieren» auf dem iPhone beziehungsweise «Netzwerk vergessen» auf Android." },
  { image:"/screenshots/IMG_0689.PNG", altImage:"/screenshots/android-18-fertig.jpg", phase:"Fertig", title:"Ihr Konto ist bereit", text:"Authenticator, Telefonnummer und persönliches Kennwort sind eingerichtet. Öffnen Sie nun den Moodle-Kurs «IKT-Einführung» und melden Sie sich mit Ihrem EduZH-Konto an.", tip:"Moodle werden Sie künftig in vielen Kursen verwenden. In der IKT-Einführung markieren Sie fortlaufend, welche Bereiche Sie bereits erledigt haben. So können Ihre Lehrpersonen den Fortschritt aller Schülerinnen und Schüler sehen. Falls Moodle den Kurs nach der Anmeldung nicht direkt öffnet, wählen Sie oben im Menü «Meine Kurse» und klicken Sie auf «IKT-Einführung». Die Links im Kurs führen jeweils zurück zu den passenden Anleitungen auf dieser Seite." },
];

const wlanWindows: Step[] = [
  {image:"/screenshots/wlan/windows-01.png",phase:"Windows",title:"Netzwerke öffnen",text:"Klicken Sie unten rechts in der Taskleiste auf das Netzwerk- oder Erdkugel-Symbol."},
  {image:"/screenshots/wlan/windows-02.jpg",phase:"Windows",title:"KTZH-S auswählen",text:"Wählen Sie in der Liste der verfügbaren Netzwerke «KTZH-S»."},
  {image:"/screenshots/wlan/windows-03.jpg",phase:"Windows",title:"Automatisch verbinden",text:"Aktivieren Sie «Automatisch verbinden» und klicken Sie auf «Verbinden»."},
  {image:"/screenshots/wlan/windows-04.jpg",phase:"Windows",title:"EduZH-Login eingeben",text:"Geben Sie Ihre Adresse @stud.edu.zh.ch und Ihr persönliches Kennwort ein. Klicken Sie auf «OK»."},
  {image:"/screenshots/wlan/windows-05.jpg",phase:"Windows",title:"Verbindung bestätigen",text:"Bestätigen Sie mit «Verbinden». Ihr Gerät ist jetzt mit KTZH-S verbunden."},
];
const wlanMac: Step[] = [
  {image:"/screenshots/wlan/macos-01.jpg",phase:"macOS",title:"WLAN-Menü öffnen",text:"Klicken Sie oben in der Menüleiste auf das WLAN-Symbol."},
  {image:"/screenshots/wlan/macos-02.jpg",phase:"macOS",title:"KTZH-S auswählen",text:"Öffnen Sie «Andere Netzwerke» und wählen Sie «KTZH-S»."},
  {image:"/screenshots/wlan/macos-03.jpg",phase:"macOS",title:"EduZH-Login eingeben",text:"Geben Sie Ihre Adresse @stud.edu.zh.ch und Ihr persönliches Kennwort ein. Klicken Sie auf «OK»."},
  {image:"/screenshots/wlan/macos-04.jpg",phase:"macOS",title:"Zertifikat bestätigen",text:"macOS zeigt das Zertifikat des Netzwerks. Klicken Sie auf «Fortfahren» und bestätigen Sie bei Bedarf mit Ihrem Mac-Kennwort."},
  {image:"/screenshots/wlan/macos-05.jpg",phase:"macOS",title:"WLAN ist verbunden",text:"Ihr Mac ist jetzt mit KTZH-S verbunden."},
];

const apps: Step[] = [
  {phase:"Voraussetzung",title:"BYOD-Installation abschliessen",text:"Diese Anleitung richtet sich an KG- und HMS-Lernende. Bevor Sie Teams, Outlook und OneDrive einrichten, muss die vollständige BYOD-Softwareinstallation auf Ihrem Computer abgeschlossen sein.",tip:"Falls noch Programme fehlen, führen Sie zuerst die BYOD-Installation gemäss den verlinkten Installationsanleitungen durch.",shortcut:"BYOD ✓"},
  {image:"/screenshots/apps/step-009.jpg",phase:"Teams",title:"Schulkonto hinzufügen",text:"Öffnen Sie in Teams Ihr Profil und wählen Sie «Weiteres Konto hinzufügen»."},
  {image:"/screenshots/apps/step-012.png",phase:"Teams",title:"EduZH-Adresse eingeben",text:"Geben Sie Ihre Adresse @stud.edu.zh.ch ein und klicken Sie auf «Weiter»."},
  {image:"/screenshots/apps/step-013.jpg",phase:"Teams",title:"Anmelden",text:"Geben Sie Ihr Kennwort ein und bestätigen Sie die Anmeldung im Authenticator."},
  {image:"/screenshots/apps/step-019.png",phase:"Teams",title:"Kontoverwendung wählen",text:"Wählen Sie «Ja, alle Apps», damit Ihre Microsoft-Apps dieses Konto nutzen können."},
  {image:"/screenshots/apps/step-022.jpg",phase:"Teams",title:"Teams ist bereit",text:"Ihr EduZH-Konto ist nun in Teams hinterlegt."},
  {image:"/screenshots/apps/step-025.jpg",phase:"Outlook",title:"Outlook öffnen",text:"Öffnen Sie Outlook, geben Sie Ihre EduZH-Adresse ein und klicken Sie auf «Weiter»."},
  {image:"/screenshots/apps/step-029.jpg",phase:"Outlook",title:"Anmeldung bestätigen",text:"Geben Sie Ihr Kennwort ein und bestätigen Sie die Anfrage im Authenticator."},
  {image:"/screenshots/apps/step-032.png",phase:"Outlook",title:"Für alle Apps anmelden",text:"Wählen Sie «Ja, alle Apps». Damit wird Ihr Schulkonto auch in Outlook eingerichtet."},
  {image:"/screenshots/apps/step-035.png",phase:"Outlook",title:"Outlook ist bereit",text:"Ihr EduZH-Postfach ist jetzt mit Outlook verbunden."},
  {image:"/screenshots/apps/step-038.jpg",phase:"OneDrive",title:"OneDrive öffnen",text:"Klicken Sie in der Taskleiste mit der rechten Maustaste auf das OneDrive-Symbol."},
  {image:"/screenshots/apps/step-039.png",phase:"OneDrive",title:"Einstellungen öffnen",text:"Klicken Sie auf das Zahnrad und öffnen Sie die Einstellungen."},
  {image:"/screenshots/apps/step-040.jpg",phase:"OneDrive",title:"Konto hinzufügen",text:"Wählen Sie «Konto hinzufügen»."},
  {image:"/screenshots/apps/step-043.jpg",phase:"OneDrive",title:"EduZH-Adresse eingeben",text:"Geben Sie Ihre EduZH-Adresse ein und klicken Sie auf «Anmelden»."},
  {image:"/screenshots/apps/step-050.png",phase:"OneDrive",title:"Anmeldung bestätigen",text:"Geben Sie Ihr Kennwort ein, bestätigen Sie im Authenticator und wählen Sie «Ja, alle Apps»."},
  {image:"/screenshots/apps/step-053.jpg",phase:"OneDrive",title:"OneDrive-Ordner wählen",text:"Klicken Sie auf «Weiter» und wählen Sie, welche Ordner synchronisiert werden sollen."},
  {image:"/screenshots/apps/step-061.png",phase:"OneDrive",title:"OneDrive ist bereit",text:"Die Einrichtung ist abgeschlossen. Ihre Schuldateien werden jetzt synchronisiert."},
];

const challengeWindows: Step[] = [
  {phase:"Tiling",title:"Zwei Fenster nebeneinander",text:"Öffnen Sie Browser und Datei-Explorer. Legen Sie den Browser links und den Explorer rechts ab.",shortcut:"Win + ← / →"},
  {phase:"Tiling",title:"Fenster in eine Ecke legen",text:"Drücken Sie zuerst Win + Pfeil links oder rechts und direkt danach Pfeil hoch oder runter. Ordnen Sie vier Fenster als Raster an.",shortcut:"Win + ←, dann ↑"},
  {phase:"Tiling",title:"Maximieren und verkleinern",text:"Maximieren Sie das aktive Fenster. Drücken Sie danach den Gegenbefehl zweimal, um es wiederherzustellen und zu minimieren.",shortcut:"Win + ↑ / ↓"},
  {phase:"Snap Layouts",title:"Ein Layout auswählen",text:"Öffnen Sie die Snap-Layouts, wählen Sie ein Dreispalten-Layout und verteilen Sie Browser, Teams und Explorer.",shortcut:"Win + Z"},
  {phase:"Apps",title:"Zwischen Programmen wechseln",text:"Halten Sie Alt gedrückt und tippen Sie wiederholt auf Tab. Wechseln Sie gezielt zwischen Browser, Teams und Explorer.",shortcut:"Alt + Tab"},
  {phase:"Desktops",title:"Virtuellen Desktop erstellen",text:"Erstellen Sie einen neuen Desktop und öffnen Sie dort Outlook.",shortcut:"Win + Ctrl + D"},
  {phase:"Desktops",title:"Zwischen Desktops wechseln",text:"Wechseln Sie ohne Maus zum vorherigen Desktop und wieder zurück.",shortcut:"Win + Ctrl + ← / →"},
  {phase:"Bildschirme",title:"Fenster auf einen anderen Monitor",text:"Falls ein zweiter Bildschirm vorhanden ist: verschieben Sie das aktive Fenster dorthin und wieder zurück.",shortcut:"Win + Shift + ← / →"},
  {phase:"Finale",title:"Windows-Tiling-Mission",text:"Bauen Sie ein Dreifenster-Layout, verschieben Sie Teams auf einen zweiten Desktop und kehren Sie nur mit der Tastatur zum Browser zurück.",shortcut:"Win + Z · Alt + Tab"},
];
const challengeMac: Step[] = [
  {phase:"Rectangle",title:"Zwei Fenster nebeneinander",text:"Öffnen Sie Safari und Finder. Legen Sie Safari in die linke und Finder in die rechte Bildschirmhälfte.",shortcut:"Ctrl + Option + ← / →",tip:"Dies sind die Rectangle-Standardkürzel. Sie können in Rectangle angepasst worden sein."},
  {phase:"Rectangle",title:"Fenster in die Ecken legen",text:"Ordnen Sie vier Fenster oben links, oben rechts, unten links und unten rechts an.",shortcut:"Ctrl + Option + U / I / J / K"},
  {phase:"Rectangle",title:"Fenster maximieren",text:"Maximieren Sie das aktive Fenster mit Rectangle und stellen Sie danach die vorherige Grösse wieder her.",shortcut:"Ctrl + Option + Return"},
  {phase:"Rectangle",title:"Fenster zentrieren",text:"Verkleinern Sie ein Fenster und setzen Sie es anschliessend exakt in die Bildschirmmitte.",shortcut:"Ctrl + Option + C"},
  {phase:"Rectangle",title:"Drei Spalten bauen",text:"Ordnen Sie Browser, Teams und Finder im linken, mittleren und rechten Drittel an.",shortcut:"Ctrl + Option + D / F / G"},
  {phase:"Apps",title:"Zwischen Programmen wechseln",text:"Halten Sie Command gedrückt und tippen Sie auf Tab. Wechseln Sie gezielt zwischen Safari, Teams und Finder.",shortcut:"Command + Tab"},
  {phase:"Spaces",title:"Neuen Schreibtisch nutzen",text:"Öffnen Sie Mission Control, erstellen Sie einen neuen Schreibtisch und öffnen Sie dort Outlook.",shortcut:"Ctrl + ↑"},
  {phase:"Spaces",title:"Zwischen Schreibtischen wechseln",text:"Wechseln Sie ohne Maus zum vorherigen Schreibtisch und wieder zurück.",shortcut:"Ctrl + ← / →"},
  {phase:"Bildschirme",title:"Fenster zum nächsten Monitor",text:"Falls ein zweiter Bildschirm vorhanden ist: verschieben Sie das aktive Fenster mit Rectangle dorthin.",shortcut:"Ctrl + Option + Command + →"},
  {phase:"Finale",title:"Rectangle-Tiling-Mission",text:"Bauen Sie ein Dreispalten-Layout, verschieben Sie Teams auf einen zweiten Schreibtisch und kehren Sie nur mit der Tastatur zu Safari zurück.",shortcut:"D / F / G · Command + Tab"},
];

const shortcutsWindows: Step[] = [
  {phase:"Vorbereitung",title:"Geeigneten Arbeitsort öffnen",text:"Öffnen Sie ein Dokument, in dem Sie schreiben und markieren dürfen. Sie können beispielsweise das Word-Dokument aus der Steckbrief-Challenge verwenden. Bewegen Sie den Cursor anschliessend fünf Wörter nach rechts und zwei Wörter zurück, ohne die Maus zu benutzen.",shortcut:"Ctrl + ← / →",tip:"Speichern Sie das Dokument zuerst unter einem eigenen Dateinamen, damit Ihre Vorlage unverändert bleibt."},
  {phase:"Markieren",title:"Wörter präzise markieren",text:"Markieren Sie die nächsten drei Wörter ab der Cursorposition. Kopieren Sie noch nichts.",shortcut:"Ctrl + Shift + →"},
  {phase:"Auswahl",title:"Alles auswählen",text:"Markieren Sie den gesamten Text mit einem einzigen Kürzel und heben Sie die Auswahl danach mit einer Pfeiltaste wieder auf.",shortcut:"Ctrl + A"},
  {phase:"Zwischenablage",title:"Kopieren, ausschneiden, einfügen",text:"Kopieren Sie einen Satz, fügen Sie ihn an einer neuen Stelle ein und verschieben Sie einen zweiten Satz per Ausschneiden.",shortcut:"Ctrl + C / X / V"},
  {phase:"Bearbeiten",title:"Fehler rückgängig machen",text:"Löschen Sie absichtlich ein Wort, machen Sie die Aktion rückgängig und führen Sie sie danach nochmals aus.",shortcut:"Ctrl + Z · Ctrl + Shift + Z"},
  {phase:"Dokument",title:"Suchen, speichern, drucken",text:"Suchen Sie im Dokument nach einem Wort, speichern Sie und öffnen Sie zuletzt den Druckdialog. Brechen Sie den Druckdialog wieder ab.",shortcut:"Ctrl + F / S / P"},
  {phase:"Programme",title:"Fenster wechseln und schliessen",text:"Wechseln Sie zu einem anderen Programm, kehren Sie zurück und schliessen Sie anschliessend ein nicht benötigtes Fenster.",shortcut:"Alt + Tab · Alt + F4"},
  {phase:"Sicherheit",title:"Computer sperren",text:"Sperren Sie den Computer und melden Sie sich danach wieder an.",shortcut:"Win + L"},
  {phase:"Browser",title:"Tabs steuern",text:"Öffnen Sie zwei neue Tabs, wechseln Sie zum rechten Tab, schliessen Sie ihn und stellen Sie ihn wieder her.",shortcut:"Ctrl + T / Tab / W · Ctrl + Shift + T"},
  {phase:"Code",title:"Code ein- und ausrücken",text:"Markieren Sie mehrere Codezeilen, rücken Sie sie einmal ein und danach wieder aus.",shortcut:"Tab · Shift + Tab"},
  {phase:"Finale",title:"Die 60-Sekunden-Mission",text:"Kopieren Sie Text, finden Sie ein Wort, wechseln Sie die App, öffnen Sie einen Browser-Tab und stellen Sie einen geschlossenen Tab wieder her - alles ohne Maus.",shortcut:"C · F · Tab · T · Shift + T"},
];
const shortcutsMac: Step[] = [
  {phase:"Vorbereitung",title:"Geeigneten Arbeitsort öffnen",text:"Öffnen Sie ein Dokument, in dem Sie schreiben und markieren dürfen. Sie können beispielsweise das Word-Dokument aus der Steckbrief-Challenge verwenden. Bewegen Sie den Cursor anschliessend fünf Wörter nach rechts und zwei Wörter zurück, ohne die Maus zu benutzen.",shortcut:"Option + ← / →",tip:"Speichern Sie das Dokument zuerst unter einem eigenen Dateinamen, damit Ihre Vorlage unverändert bleibt."},
  {phase:"Markieren",title:"Wörter präzise markieren",text:"Markieren Sie die nächsten drei Wörter ab der Cursorposition. Kopieren Sie noch nichts.",shortcut:"Option + Shift + →"},
  {phase:"Auswahl",title:"Alles auswählen",text:"Markieren Sie den gesamten Text mit einem einzigen Kürzel und heben Sie die Auswahl danach mit einer Pfeiltaste wieder auf.",shortcut:"Command + A"},
  {phase:"Zwischenablage",title:"Kopieren, ausschneiden, einfügen",text:"Kopieren Sie einen Satz und fügen Sie ihn neu ein. Verschieben Sie danach eine Datei mit Kopieren und der Einfügen-Variante zum Bewegen.",shortcut:"Command + C / V · Option + Command + V"},
  {phase:"Bearbeiten",title:"Fehler rückgängig machen",text:"Löschen Sie absichtlich ein Wort, machen Sie die Aktion rückgängig und führen Sie sie danach nochmals aus.",shortcut:"Command + Z · Command + Shift + Z"},
  {phase:"Dokument",title:"Suchen, speichern, drucken",text:"Suchen Sie im Dokument nach einem Wort, speichern Sie und öffnen Sie zuletzt den Druckdialog. Brechen Sie den Druckdialog wieder ab.",shortcut:"Command + F / S / P"},
  {phase:"Programme",title:"Programme und Fenster wechseln",text:"Wechseln Sie zu einer anderen App. Wechseln Sie danach zwischen zwei Fenstern derselben App und schliessen Sie die App.",shortcut:"Command + Tab · Command + < · Command + Q"},
  {phase:"Sicherheit",title:"Computer sperren",text:"Sperren Sie den Mac und melden Sie sich danach wieder an.",shortcut:"Command + Ctrl + Q"},
  {phase:"Browser",title:"Tabs steuern",text:"Öffnen Sie zwei neue Tabs, wechseln Sie zum rechten Tab, schliessen Sie ihn und stellen Sie ihn wieder her.",shortcut:"Command + T / Option + → / W · Command + Shift + T"},
  {phase:"Code",title:"Code ein- und ausrücken",text:"Markieren Sie mehrere Codezeilen, rücken Sie sie einmal ein und danach wieder aus.",shortcut:"Tab · Shift + Tab"},
  {phase:"Finale",title:"Die 60-Sekunden-Mission",text:"Kopieren Sie Text, finden Sie ein Wort, wechseln Sie die App, öffnen Sie einen Browser-Tab und stellen Sie einen geschlossenen Tab wieder her - alles ohne Maus.",shortcut:"C · F · Tab · T · Shift + T"},
];

const profile: Step[] = [
  {phase:"Auftrag",title:"Ihr digitales Kurzprofil",text:"Erstellen Sie ein digitales Kurzprofil über sich. Ihre Lehrpersonen sowie Ihre Mitschülerinnen und Mitschüler sollen einen ersten Eindruck davon erhalten, wer Sie sind und was Sie als Person ausmacht.",shortcut:"ICH"},
  {phase:"Grundangaben",title:"Wer sind Sie?",text:"Nennen Sie Ihren Vor- und Nachnamen sowie Ihre Klasse. Ergänzen Sie ein Foto von sich, drei Wörter, die Sie beschreiben, etwas, das man über Sie wissen sollte, etwas, das Sie motiviert, und eine Stärke, die Sie in die Klasse einbringen.",shortcut:"01"},
  {phase:"Persönliches",title:"Was passt zu Ihnen?",text:"Ergänzen Sie ein Ziel für dieses Schuljahr, einen Ort, an dem Sie sich wohlfühlen, und einen Gegenstand, Song, Film, ein Game, eine Sportart, ein Hobby oder ein Zitat, das zu Ihnen passt. Begründen Sie Ihre Wahl kurz und nennen Sie einen Fun Fact, den Sie teilen möchten.",shortcut:"02",tip:"Weitere passende Informationen dürfen Sie gerne ergänzen."},
  {phase:"Werkzeug",title:"Gestaltungsform wählen",text:"Sie entscheiden selbst über die Gestaltung. Möglich sind beispielsweise eine OneNote-Seite, Word, PowerPoint, Canva oder ein anderes vertrautes Programm. Wenn Sie mit Word noch unsicher sind, können Sie die vorbereitete Vorlage verwenden.",shortcut:"APP"},
  {phase:"Gestaltung",title:"Übersichtlich und persönlich",text:"Gestalten Sie Ihr Kurzprofil gut lesbar und ansprechend. Bilder, Symbole und Emojis sind ausdrücklich erwünscht und können unterhalb der Liste oder passend neben einzelnen Punkten eingefügt werden.",shortcut:"Aa"},
  {phase:"Sicherheit",title:"Privates bleibt privat",text:"Teilen Sie nur Informationen, die Lehrpersonen und die Klasse sehen dürfen. Adresse, Telefonnummer, private Social-Media-Profile und sehr persönliche Angaben gehören nicht in das Kurzprofil.",shortcut:"🔒"},
  {phase:"Eigenleistung",title:"Die Inhalte stammen von Ihnen",text:"Das Kurzprofil soll von Ihnen selbst erstellt werden. Vollständig KI-generierte Profile sind nicht erlaubt. Digitale Hilfsmittel für Gestaltung, Rechtschreibung oder Layout sind erlaubt; die persönlichen Inhalte müssen jedoch von Ihnen stammen und wirklich zu Ihnen passen.",shortcut:"✓"},
  {phase:"Abgabe",title:"Speichern und in Teams ablegen",text:"Speichern Sie die fertige Datei als Klasse_Nachname_Vorname_Kurzprofil. Legen Sie sie anschliessend im Klassen-Team im Kanal «Kursvorstellungen» ab.",shortcut:"SAVE",tip:"Kontrollieren Sie vor der Abgabe noch einmal Dateiname, Lesbarkeit und Inhalt."},
  {phase:"Bonus",title:"Bonus für schnelle Profis",text:"Fügen Sie ein passendes Symbol, Emoji oder kleines Bild ein, nutzen Sie passende Farben und schreiben Sie zu mindestens einem Punkt einen kurzen Satz statt nur eines Wortes. Wenn Sie fertig sind, helfen Sie einer Person in Ihrer Nähe.",shortcut:"+"},
];

const guideNames: Record<GuideKey,string> = {eduzh:"EduZH-Erstlogin",wlan:"WLAN verbinden",apps:"Teams, Outlook & OneDrive",profile:"Steckbrief-Challenge",challenge:"Window-Management-Challenge",shortcuts:"Shortcut-Challenge"};
const guidePaths: Record<GuideKey,string> = {eduzh:"/eduzh",wlan:"/wlan",apps:"/microsoft-365",profile:"/challenges/steckbrief",challenge:"/challenges/window-management",shortcuts:"/challenges/shortcuts"};
const pathGuides: Record<string,GuideKey> = Object.fromEntries(Object.entries(guidePaths).map(([key,path])=>[path,key])) as Record<string,GuideKey>;

export default function Home() {
  const [intro,setIntro]=useState(true);
  const [guide,setGuide]=useState<GuideKey>("eduzh");
  const [current,setCurrent]=useState(0);
  const [phone,setPhone]=useState<"iphone"|"android">("iphone");
  const [computer,setComputer]=useState<"windows"|"mac">("windows");
  const [menu,setMenu]=useState(false);
  const [zoom,setZoom]=useState(false);
  const [qrOpen,setQrOpen]=useState(false);
  const [headerHidden,setHeaderHidden]=useState(false);
  const swipeStart=useRef<{x:number;y:number}|null>(null);
  const steps=useMemo(()=>guide==="eduzh"?eduzh:guide==="apps"?apps:guide==="profile"?profile:guide==="wlan"?(computer==="windows"?wlanWindows:wlanMac):guide==="challenge"?(computer==="windows"?challengeWindows:challengeMac):(computer==="windows"?shortcutsWindows:shortcutsMac),[guide,computer]);
  const step=steps[current]||steps[0];
  const image=guide==="eduzh"&&phone==="android"?step.altImage:step.image;
  const pdfHref=guide==="eduzh"?`/pdfs/eduzh-${phone}.pdf`:guide==="wlan"?`/pdfs/wlan-${computer==="mac"?"macos":"windows"}.pdf`:guide==="apps"?"/pdfs/microsoft-365.pdf":guide==="profile"?"/pdfs/steckbrief-challenge.pdf":guide==="challenge"?`/pdfs/window-management-${computer==="mac"?"macos":"windows"}.pdf`:`/pdfs/shortcut-challenge-${computer==="mac"?"macos":"windows"}.pdf`;
  const openGuide=(key:GuideKey,updateUrl=true)=>{setIntro(false);setGuide(key);setCurrent(0);setMenu(false);setZoom(false);if(updateUrl)window.history.pushState({},"",guidePaths[key]);window.scrollTo({top:0,behavior:"smooth"});};
  const go=(n:number)=>{setCurrent(Math.max(0,Math.min(n,steps.length-1)));window.scrollTo({top:0,behavior:"smooth"});};
  useEffect(()=>{setCurrent(0)},[computer]);
  useEffect(()=>{const timer=window.setTimeout(()=>setHeaderHidden(true),3600);return()=>window.clearTimeout(timer)},[]);
  useEffect(()=>{const applyPath=()=>{const key=pathGuides[window.location.pathname.replace(/\/$/,"")||"/"];if(key)openGuide(key,false);else setIntro(true)};applyPath();window.addEventListener("popstate",applyPath);return()=>window.removeEventListener("popstate",applyPath)},[]);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(!intro&&e.key==="ArrowRight")setCurrent(n=>Math.min(n+1,steps.length-1));if(!intro&&e.key==="ArrowLeft")setCurrent(n=>Math.max(n-1,0));if(e.key==="Escape"){setZoom(false);setQrOpen(false);setMenu(false)}};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)},[intro,steps.length]);
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
      <button className={intro?"active":""} onClick={()=>{setIntro(true);setMenu(false);window.history.pushState({},"","/");window.scrollTo({top:0,behavior:"smooth"})}}><span>00</span><b>Startseite</b></button>
      {(Object.keys(guideNames) as GuideKey[]).map((key,i)=>{
        const isChallenge=key==="challenge"||key==="shortcuts"||key==="profile";
        return <button key={key} className={`${!intro&&guide===key?"active":""} ${isChallenge?"challenge-entry":""}`} onClick={()=>openGuide(key)}><span>0{i+1}</span><b>{isChallenge&&<em>Challenge</em>}{guideNames[key]}</b></button>
      })}
      <a href="https://cyrilblum.github.io/KSTFDue/" target="_blank" rel="noreferrer">BYOD-Software & weitere Anleitungen ↗</a>
    </aside>

    {intro?<section className="intro" id="top">
      <img className="intro-photo" src="/fdu-campus.jpg" alt="Schulhaus der Kantonsschule Stadelhofen, Filiale Dübendorf"/>
      <div className="intro-shade"/>
      <div className="intro-copy">
        <img src="/fdu-logo-weiss.svg" alt="Kantonsschule Stadelhofen – Filiale Dübendorf"/>
        <h1>IKT-Einführung</h1>
        <p>Wählen Sie eine Anleitung im Menü oder beginnen Sie mit dem EduZH-Erstlogin.</p>
        <button onClick={()=>openGuide("eduzh")}>Mit EduZH beginnen <span>→</span></button>
      </div>
      <aside className="wifi-card">
        <img src="/wifi.svg" alt="QR-Code für das WLAN"/>
        <div><strong>Kein mobiles Internet?</strong><p>Scannen Sie diesen QR-Code, um sich zuerst mit dem bereitgestellten WLAN zu verbinden.</p><button onClick={()=>setQrOpen(true)}>Beide QR-Codes gross anzeigen</button></div>
      </aside>
      <p className="intro-menu-hint">Alle Anleitungen finden Sie über das Menü oben links.</p>
    </section>:<>
    <nav className="progress" aria-label="Fortschritt">
      <div className="progress-copy"><span>{guideNames[guide]}</span><strong>{current+1} / {steps.length}</strong></div>
      <div className="bar"><i style={{width:`${((current+1)/steps.length)*100}%`}}/></div>
    </nav>

    <section className={`guide ${!image?"challenge-guide":""}`} id="top" onPointerDown={e=>{if((e.target as HTMLElement).closest("button,a"))return;swipeStart.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerUp={finishSwipe} onPointerCancel={()=>{swipeStart.current=null}}>
      <div className="visual-wrap">
        {image?<button className="screenshot" onClick={()=>setZoom(true)} aria-label="Screenshot vergrössern"><img src={image} alt={`Screenshot zu ${step.title}`}/><span className="zoom-label">＋ Vergrössern</span></button>:<div className="challenge-card"><small>{guide==="apps"||guide==="profile"?"KG / HMS":computer==="windows"?"WINDOWS":"macOS"}</small><span>{String(current+1).padStart(2,"0")}</span><b>{step.shortcut|| (current===steps.length-1?"✓":"GO")}</b><p>{guide==="apps"?"VORAUSSETZUNG":guide==="profile"?"STECKBRIEF · KURZPROFIL":guide==="shortcuts"?"SHORTCUT TRAINING":"WINDOW MANAGEMENT · KG / HMS"}</p></div>}
        <div className="swipe-hint">{image?"Screenshot antippen zum Vergrössern":"Praxisaufgabe am eigenen BYOD-Gerät"}</div>
      </div>
      <article className="instruction">
        <div className="step-label"><span>Schritt {String(current+1).padStart(2,"0")}</span><i/>{step.phase}</div>
        <h2>{step.title}</h2><p>{step.text}</p>
        {guide==="eduzh"&&current===1&&<div className="device-picker"><button className={phone==="iphone"?"selected":""} onClick={()=>setPhone("iphone")}><b>iPhone</b><span>App Store</span></button><button className={phone==="android"?"selected":""} onClick={()=>setPhone("android")}><b>Android</b><span>Google Play</span></button></div>}
        {(guide==="wlan"||guide==="challenge"||guide==="shortcuts")&&<div className="device-picker"><button className={computer==="windows"?"selected":""} onClick={()=>setComputer("windows")}><b>Windows</b><span>PC</span></button><button className={computer==="mac"?"selected":""} onClick={()=>setComputer("mac")}><b>macOS</b><span>MacBook</span></button></div>}
        {step.tip&&<aside className="tip"><strong>Gut zu wissen</strong>{step.tip}</aside>}
        {guide==="apps"&&current===0&&<a className="byod-link" href="https://cyrilblum.github.io/KSTFDue/" target="_blank" rel="noreferrer">BYOD-Installationsanleitungen öffnen ↗</a>}
        {guide==="profile"&&current===0&&<a className="template-download" href="/downloads/mein-kurzprofil-vorlage.docx" download>Word-Gestaltungsvorlage herunterladen ↓</a>}
        {guide==="shortcuts"&&current===steps.length-1&&<a className="further-tasks" href="/downloads/shortcut-uebersicht-programmieren.pdf" target="_blank" rel="noreferrer">Weitere Shortcut-Aufgaben und Übersicht als PDF öffnen ↗</a>}
        {guide==="eduzh"&&step.phase==="Kennwort"&&<aside className="password-box"><strong>Konkretes Beispiel</strong><code>Wolke!Kanu7Tisch-Lama</code><p>Vier unerwartete Wörter, Gross-/Kleinbuchstaben, Zahl und Sonderzeichen. Erfinden Sie unbedingt Ihr eigenes Beispiel und verwenden Sie es nur für dieses Konto.</p></aside>}
        {current===steps.length-1&&<div className="finish-block"><div className="success">✓ Anleitung abgeschlossen</div>{guide==="eduzh"&&<a className="moodle" href="https://moodle.kst-fdu.ch/course/view.php?id=4" target="_blank" rel="noreferrer">Moodle-Kurs «IKT-Einführung» öffnen ↗</a>}</div>}
        <div className="actions"><button className="back" onClick={()=>go(current-1)} disabled={current===0}>← Zurück</button><button className="next" onClick={()=>go(current+1)} disabled={current===steps.length-1}>{current===steps.length-2?"Zum Abschluss":"Weiter"} <span>→</span></button></div>
        <a className="pdf-download" href={pdfHref}>↗ Aktuelle Anleitung als PDF öffnen</a>
        <p className="keyboard"><span className="desktop-hint">Mit den Pfeiltasten navigieren.</span><span className="mobile-hint">Nach links oder rechts wischen.</span></p>
      </article>
    </section>
    </>}
    <img className="bottom-decoration" src="/glatt-linie-footer.png" alt="" aria-hidden="true"/>
    <footer><strong>© 2026 Cyril Blum</strong><span>Kantonsschule Stadelhofen · Filiale Dübendorf</span></footer>
    {zoom&&image&&<div className="lightbox" role="dialog" aria-modal="true" onClick={()=>setZoom(false)}><button aria-label="Schliessen">×</button><img src={image} alt=""/></div>}
    {qrOpen&&<div className="qr-lightbox" role="dialog" aria-modal="true" aria-label="QR-Codes für WLAN und IKT-Webseite" onClick={()=>setQrOpen(false)}>
      <button className="qr-close" aria-label="QR-Codes schliessen">×</button>
      <div className="qr-stage" onClick={e=>e.stopPropagation()}>
        <article><span>01</span><h2>WLAN verbinden</h2><img src="/wifi.svg" alt="QR-Code für das bereitgestellte WLAN"/><p>Für Schülerinnen und Schüler ohne mobile Daten.</p></article>
        <article><span>02</span><h2>Anleitung öffnen</h2><img src="/ikt-in-form-atik-ch.svg" alt="QR-Code für ikt.in-form-atik.ch"/><p>Öffnet <strong>ikt.in-form-atik.ch</strong> auf dem Smartphone.</p></article>
      </div>
    </div>}
  </main>;
}
