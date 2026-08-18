"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Step = { image?: string; phase: string; title: string; text: string; tip?: string; shortcut?: string; flow?: string[]; in2Mobile?: boolean; existingImage?: string; existingImage2?: string; existingText?: string };
type GuideKey = "eduzh" | "eduzhNoPhone" | "ugWorkflow" | "kgWorkflow" | "officeMobile" | "intranetMobile" | "wlan" | "kgIntranet" | "printer" | "apps" | "challenge" | "shortcuts" | "profile" | "peerSupport" | "beamerAirserver" | "klpCalendar" | "klpFobizz";

const eduzhIphone: Step[] = [
  {image:"/screenshots/appstore-01-suchen.png",phase:"Schritt 01 · Smartphone",title:"Microsoft Authenticator suchen",text:"Öffnen Sie den App Store und suchen Sie nach «Microsoft Authenticator». Für den ganzen EduZH-Erstlogin benötigen Sie nur Ihr iPhone – noch keinen Computer."},
  {image:"/screenshots/appstore-02-laden.jpg",phase:"Gerät wählen",title:"Welches Smartphone verwenden Sie?",text:"Wählen Sie Ihr Gerät aus. Die nächsten Screenshots passen sich automatisch an. Laden Sie danach «Microsoft Authenticator» und öffnen Sie die App."},
  {image:"/screenshots/appstore-03-annehmen.jpg",phase:"Vorbereiten",title:"Datenschutzbestimmungen annehmen",text:"Lesen Sie den Hinweis zu den erforderlichen Diagnosedaten und tippen Sie auf «Annehmen»."},
  {image:"/screenshots/appstore-04-weiter.jpg",phase:"Vorbereiten",title:"Einführung fortsetzen",text:"Die freiwillige Freigabe zusätzlicher Nutzungsdaten können Sie ausgeschaltet lassen. Tippen Sie unten auf «Weiter»."},
  {image:"/screenshots/eduzh-v2/iphone-05-school-or-university-account.png",existingImage:"/screenshots/eduzh-v2/iphone-05-existing-01-plus.jpg",existingImage2:"/screenshots/eduzh-v2/iphone-05-existing-02-school-account.jpg",existingText:"Falls im Authenticator bereits andere Konten eingerichtet sind: Tippen Sie oben rechts auf «+», wählen Sie «Geschäfts- oder Schulkonto» und danach «Anmelden».",phase:"Konto hinzufügen",title:"Geschäfts-, Schul- oder Unikonto hinzufügen",text:"Tippen Sie auf «Geschäfts-, Schul- oder Unikonto hinzufügen» – nicht auf «Bei Microsoft anmelden».",tip:"Falls bereits Konten eingerichtet sind: Tippen Sie oben rechts auf «+», wählen Sie «Geschäfts- oder Schulkonto» und danach «Anmelden». Auf der Webseite finden Sie dazu zwei ausklappbare Screenshots."},
  {image:"/screenshots/eduzh-v2/iphone-06-email.jpg",phase:"Anmelden",title:"EduZH-Adresse eingeben",text:"Geben Sie Ihre vollständige EduZH-Adresse ein und tippen Sie auf «Weiter».",tip:"Die Adresse endet auf @stud.edu.zh.ch."},
  {image:"/screenshots/eduzh-v2/iphone-07-start-password.jpg",phase:"Anmelden",title:"Startkennwort eingeben",text:"Geben Sie das Startkennwort ein, das Sie von der Schule erhalten haben, und tippen Sie auf «Anmelden»."},
  {image:"/screenshots/eduzh-v2/iphone-08-open-browser.jpg",phase:"Browser",title:"Einrichtung im Browser fortsetzen",text:"Der Authenticator verlangt für die weitere Einrichtung einen Webbrowser. Tippen Sie auf «Browser öffnen»."},
  {image:"/screenshots/eduzh-v2/iphone-09-select-account.jpg",phase:"Browser",title:"EduZH-Konto auswählen",text:"Wählen Sie Ihr EduZH-Konto aus. Falls es nicht angezeigt wird, tippen Sie auf «Anderes Konto verwenden» und melden Sie sich mit Ihrer EduZH-Adresse an."},
  {image:"/screenshots/eduzh-v2/iphone-10-protect-account.jpg",phase:"Sicherheit",title:"Kontoschutz starten",text:"Microsoft führt Sie durch die Einrichtung der Sicherheitsmethoden. Tippen Sie auf «Weiter»."},
  {image:"/screenshots/eduzh-v2/iphone-11-authenticator-ready.jpg",phase:"Authenticator",title:"Installierte App bestätigen",text:"Microsoft fordert Sie zum Installieren des Authenticators auf. Da Sie die App bereits installiert haben, tippen Sie einfach auf «Weiter»."},
  {image:"/screenshots/eduzh-v2/iphone-12-link-account.jpg",phase:"Authenticator",title:"Konto mit der App koppeln",text:"Tippen Sie auf den blauen Link «Koppeln Sie Ihr Konto mit der App, indem Sie auf diesen Link klicken». Der Authenticator öffnet sich automatisch."},
  {image:"/screenshots/eduzh-v2/iphone-13-account-added.jpg",phase:"Authenticator",title:"Konto wurde hinzugefügt",text:"Bestätigen Sie die Meldung mit «OK». Tippen Sie danach oben links auf «Safari», um in den Browser zurückzukehren."},
  {image:"/screenshots/eduzh-v2/iphone-14-continue-pairing.jpg",phase:"Authenticator",title:"Kopplung im Browser abschliessen",text:"Sie sind wieder im Browser. Tippen Sie nun auf «Weiter»."},
  {image:"/screenshots/eduzh-v2/iphone-15-number-test.jpg",phase:"Test",title:"Anmeldung testen",text:"Im Browser erscheint eine zweistellige Zahl. Öffnen Sie den Authenticator und merken Sie sich die angezeigte Zahl."},
  {image:"/screenshots/eduzh-v2/iphone-16-approve-number.jpg",phase:"Test",title:"Zahl eingeben und bestätigen",text:"Geben Sie im Authenticator die Zahl aus dem Browser ein und tippen Sie auf «Ja». Wechseln Sie danach wieder zurück zu Safari."},
  {image:"/screenshots/eduzh-v2/iphone-17-authenticator-added.jpg",phase:"Authenticator",title:"Authenticator abschliessen",text:"Der Authenticator wurde erfolgreich hinzugefügt und ist jetzt die Standardmethode. Tippen Sie auf «Fertig»."},
  {image:"/screenshots/eduzh-v2/iphone-18-phone-number.jpg",phase:"Telefon",title:"Telefonnummer hinzufügen",text:"Wählen Sie «Switzerland (+41)», geben Sie Ihre Mobilnummer ein und lassen Sie sich einen Code per SMS senden."},
  {image:"/screenshots/eduzh-v2/iphone-19-sms-code.jpg",phase:"Telefon",title:"SMS-Code eingeben",text:"Geben Sie den sechsstelligen Code aus der SMS ein und tippen Sie auf «Weiter»."},
  {image:"/screenshots/eduzh-v2/iphone-20-setup-complete.jpg",phase:"Sicherheit",title:"Einrichtung abschliessen",text:"Prüfen Sie, ob «Telefon» und «Microsoft Authenticator» aufgeführt sind. Tippen Sie anschliessend auf «Fertig»."},
  {image:"/screenshots/eduzh-v2/iphone-21-change-password.jpg",phase:"Kennwort",title:"Persönliches Kennwort setzen",text:"Geben Sie unter «Aktuelles Kennwort» nochmals das Startkennwort ein. Legen Sie danach ein neues persönliches Kennwort fest und bestätigen Sie es.",tip:"Bewahren Sie Ihr Kennwort sicher auf und geben Sie es niemandem weiter."},
  {image:"/screenshots/eduzh/iphone-19-wlan-ktzh-s.png",phase:"WLAN",title:"KTZH-S auf dem iPhone einrichten",text:"Verbinden Sie Ihr iPhone nun mit «KTZH-S». Verwenden Sie Ihre vollständige EduZH-Adresse und Ihr persönliches Kennwort. Falls beim Verbinden eine Zertifikatsabfrage erscheint, bestätigen beziehungsweise akzeptieren Sie diese.",tip:"Prüfen Sie zuerst, ob KTZH-S funktioniert. Entfernen Sie danach das temporäre WLAN über «Dieses Netzwerk ignorieren»."},
  {image:"/screenshots/eduzh-v2/iphone-23-account-ready.jpg",phase:"Fertig",title:"Ihr Konto ist bereit",text:"Authenticator, Telefonnummer und persönliches Kennwort sind eingerichtet. Wählen Sie auf der nächsten Seite Ihren Schulweg."},
];

const eduzhAndroid: Step[] = [
  {image:"/screenshots/android-01-suchen.png",phase:"Schritt 01 · Smartphone",title:"Microsoft Authenticator suchen",text:"Öffnen Sie den Google Play Store und suchen Sie nach «Microsoft Authenticator». Für den ganzen EduZH-Erstlogin benötigen Sie nur Ihr Smartphone – noch keinen Computer."},
  {image:"/screenshots/android-02-laden.jpg",phase:"Gerät wählen",title:"Welches Smartphone verwenden Sie?",text:"Wählen Sie Ihr Gerät aus. Die nächsten Screenshots passen sich automatisch an. Installieren Sie danach «Microsoft Authenticator» und öffnen Sie die App."},
  {image:"/screenshots/android-03-annehmen.jpg",phase:"Vorbereiten",title:"Datenschutzbestimmungen annehmen",text:"Lesen Sie den Hinweis zu den erforderlichen Diagnosedaten und tippen Sie auf «Annehmen»."},
  {image:"/screenshots/android-04-weiter.jpg",phase:"Vorbereiten",title:"Einführung fortsetzen",text:"Die freiwillige Freigabe zusätzlicher Nutzungsdaten können Sie ausgeschaltet lassen. Tippen Sie unten auf «Weiter»."},
  {image:"/screenshots/eduzh-v2/iphone-05-school-or-university-account.png",phase:"Konto hinzufügen",title:"Geschäfts-, Schul- oder Unikonto hinzufügen",text:"Tippen Sie auf «Geschäfts-, Schul- oder Unikonto hinzufügen» – nicht auf «Bei Microsoft anmelden»."},
  {image:"/screenshots/android-06-email.png",phase:"Anmelden",title:"Mit dem EduZH-Konto anmelden",text:"Geben Sie Ihre vollständige EduZH-Adresse ein und verwenden Sie anschliessend das Startkennwort, das Sie von der Schule erhalten haben.",tip:"Achten Sie auf die Endung @stud.edu.zh.ch."},
  {image:"/screenshots/android-07-zusatzinfo.png",phase:"Authenticator",title:"Sicherheitsinformationen starten",text:"Microsoft benötigt weitere Sicherheitsinformationen. Tippen Sie auf «Weiter» und bleiben Sie im Browser."},
  {image:"/screenshots/android-08-koppeln.png",phase:"Authenticator",title:"Konto mit der App koppeln",text:"Tippen Sie auf den blauen Link zum Koppeln. Ihr Smartphone öffnet den Authenticator und richtet das Schulkonto ein."},
  {image:"/screenshots/android-09-konto.png",phase:"Authenticator",title:"Konto wurde hinzugefügt",text:"Das Schulkonto erscheint jetzt im Authenticator. Bestätigen Sie allfällige Hinweise und wechseln Sie zurück in den Browser."},
  {image:"/screenshots/android-10-zahl.png",phase:"Authenticator",title:"Anmeldung testen",text:"Im Browser erscheint eine zweistellige Zahl. Merken Sie sich diese Zahl – Sie benötigen sie gleich in der Authenticator-App."},
  {image:"/screenshots/android-11-bestaetigen.jpg",phase:"Authenticator",title:"Zahl eingeben und bestätigen",text:"Geben Sie im Authenticator die Zahl aus dem Browser ein, tippen Sie auf «Ja» und kehren Sie in den Browser zurück."},
  {image:"/screenshots/android-12-erfolgreich.png",phase:"Authenticator",title:"Authenticator abschliessen",text:"Die Testanmeldung war erfolgreich. Tippen Sie im Browser auf «Weiter»."},
  {image:"/screenshots/android-13-telefon.png",phase:"Telefon",title:"Telefonnummer hinzufügen",text:"Wählen Sie «Switzerland (+41)», geben Sie Ihre Mobilnummer ein und fordern Sie den Bestätigungscode per SMS an."},
  {image:"/screenshots/android-14-sms.png",phase:"Telefon",title:"SMS-Code eingeben",text:"Übertragen Sie den sechsstelligen Code aus der SMS und tippen Sie auf «Weiter»."},
  {image:"/screenshots/android-15-telefon-bestaetigt.png",phase:"Telefon",title:"Telefonnummer bestätigt",text:"Die Telefonnummer wurde erfolgreich hinzugefügt. Tippen Sie auf «Weiter» oder «Fertig»."},
  {image:"/screenshots/android-16-methoden.png",phase:"Telefon",title:"Sicherheitsmethoden prüfen",text:"Kontrollieren Sie, ob «Telefon» und «Microsoft Authenticator» aufgeführt sind. Tippen Sie dann auf «Fertig»."},
  {image:"/screenshots/android-17-kennwort.png",phase:"Kennwort",title:"Persönliches Kennwort setzen",text:"Geben Sie zuerst das Startkennwort ein. Legen Sie danach ein neues persönliches Kennwort fest und bestätigen Sie es.",tip:"Bewahren Sie Ihr Kennwort sicher auf und geben Sie es niemandem weiter."},
  {image:"/screenshots/eduzh/android-19-wlan-ktzh-s.png",phase:"WLAN",title:"KTZH-S auf dem Smartphone einrichten",text:"Verbinden Sie Ihr Smartphone nun mit «KTZH-S». Verwenden Sie Ihre vollständige EduZH-Adresse und Ihr persönliches Kennwort. Falls beim Verbinden eine Zertifikatsabfrage erscheint, bestätigen beziehungsweise akzeptieren Sie diese.",tip:"Prüfen Sie zuerst, ob KTZH-S funktioniert. Entfernen Sie danach das temporäre WLAN über «Netzwerk vergessen»."},
  {image:"/screenshots/android-18-fertig.jpg",phase:"Fertig",title:"Ihr Konto ist bereit",text:"Authenticator, Telefonnummer und persönliches Kennwort sind eingerichtet. Wählen Sie auf der nächsten Seite Ihren Schulweg."},
];

const eduzhNoPhone: Step[] = [
  {phase:"Schritt 01 · Voraussetzung",title:"Anforderungen an den USB-Hauptschlüssel",text:"Für das Erstlogin ohne Smartphone benötigen Sie einen FIDO2 / Passkey-kompatiblen USB-Hauptschlüssel (z. B. Yubico Security Key C NFC oder YubiKey 5). Achten Sie darauf, dass der USB-Stecker (USB-C oder USB-A) zu den Anschlüssen Ihres Laptops passt.",tip:"Der Key muss FIDO2 / Passkey unterstützen und einen physischen Touch-Sensor (Goldkontakt) besitzen. Es sind keine Treiber erforderlich – die Einrichtung erfolgt direkt im Browser (Chrome oder Edge).",shortcut:"FIDO2 / USB"},
  {phase:"Schritt 02 · Schullaptop",title:"Schullaptop & Browser öffnen",text:"Starten Sie den Schullaptop (oder PC) und verbinden Sie ihn falls nötig mit dem Netzwerk. Öffnen Sie danach Google Chrome oder Microsoft Edge.",shortcut:"Chrome / Edge"},
  {phase:"Schritt 03 · Portal",title:"Microsoft-Sicherheitsseite aufrufen",text:"Öffnen Sie im Browser die Adresse mysignins.microsoft.com/security-info (oder aka.ms/mfasetup).",shortcut:"mysignins.microsoft.com"},
  {phase:"Schritt 04 · Anmelden",title:"EduZH-Adresse & Startkennwort eingeben",text:"Geben Sie Ihre vollständige EduZH-Adresse (@stud.edu.zh.ch) und das erhaltene Startkennwort ein.",tip:"Achten Sie auf die genaue Schreibweise der E-Mail-Adresse."},
  {image:"/screenshots/eduzh-v2/eduzh-no-phone-hauptschluessel.png",phase:"Schritt 05 · Methode",title:"«Anmeldemethode hinzufügen» & «Hauptschlüssel» wählen",text:"Klicken Sie auf den Button «Anmeldemethode hinzufügen». Wählen Sie in der Auswahl die Option «Hauptschlüssel» (Mit Gesicht, Fingerabdruck, PIN oder Sicherheitsschlüssel anmelden)."},
  {phase:"Schritt 06 · Key-Typ",title:"«Passkey oder Sicherheitsschlüssel» wählen",text:"Wählen Sie im Anmeldedialog den Typ «Passkey oder Sicherheitsschlüssel» aus und klicken Sie auf «Weiter». Halten Sie Ihren USB-Hauptschlüssel bereit."},
  {phase:"Schritt 07 · Einrichtung",title:"USB-Stick einstecken & Sensor berühren",text:"Stecken Sie den USB-Hauptschlüssel (z. B. Yubico Key C NFC) in den USB-Anschluss des Laptops. Folgen Sie den Browser-Anweisungen: Legen Sie eine PIN fest und berühren Sie den Gold-Sensor des Sticks."},
  {phase:"Schritt 08 · Benennen",title:"Hauptschlüssel benennen",text:"Geben Sie dem Hauptschlüssel einen eindeutigen Namen (z. B. «Schul-USB-Key») und klicken Sie auf «Weiter» und anschliessend «Fertig»."},
  {phase:"Schritt 09 · Kennwort",title:"Persönliches Kennwort setzen",text:"Geben Sie unter «Aktuelles Kennwort» nochmals das Startkennwort ein. Legen Sie danach ein neues persönliches Kennwort fest und bestätigen Sie es.",tip:"Bewahren Sie Ihr Kennwort sicher auf und geben Sie es niemandem weiter."},
  {phase:"Schritt 10 · Fertig",title:"Ihr Konto ist bereit",text:"Die MFA wurde erfolgreich mit dem USB-Hauptschlüssel eingerichtet. Wählen Sie unten Ihren weiteren Schulweg."},
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

const officeMobileIphone: Step[] = [
  {image:"/screenshots/ug-mobile/office-apps-ios-android.png",phase:"Schritt 02 · UG",title:"Teams, Outlook und OneNote laden",text:"Öffnen Sie diese Anleitung jetzt am Schul-Computer. Suchen und installieren Sie auf Ihrem iPhone nacheinander Microsoft Teams, Microsoft Outlook und Microsoft OneNote."},
  {image:"/screenshots/eduzh-v2/iphone-06-email.jpg",phase:"iPhone · Anmelden",title:"Mit dem EduZH-Konto anmelden",text:"Öffnen Sie jede der drei Apps mindestens einmal. Melden Sie sich mit Ihrer vollständigen EduZH-Adresse und Ihrem persönlichen Kennwort an. Bestätigen Sie die Anmeldung im Microsoft Authenticator.",tip:"Falls eine App bereits mit einem privaten Konto geöffnet wird, wählen Sie «Konto hinzufügen» und danach Ihr Schulkonto."},
  {phase:"Schul-Laptop · Prüfen",title:"Die drei Apps am Schul-Laptop öffnen",text:"Öffnen Sie auf einem Schul-Laptop Teams, Outlook und OneNote je einmal. Eine erneute Anmeldung ist nicht nötig.",shortcut:"✓",tip:"Prüfen Sie Ihre Schul-E-Mails in Outlook und Ihre Teams-Nachrichten jeden Tag. Wichtige Informationen und Aufträge werden dort kommuniziert."},
];

const officeMobileAndroid: Step[] = [
  {image:"/screenshots/ug-mobile/office-apps-ios-android.png",phase:"Schritt 02 · UG",title:"Teams, Outlook und OneNote laden",text:"Öffnen Sie diese Anleitung jetzt am Schul-Computer. Suchen und installieren Sie auf Ihrem Android-Smartphone nacheinander Microsoft Teams, Microsoft Outlook und Microsoft OneNote."},
  {image:"/screenshots/android-06-email.png",phase:"Android · Anmelden",title:"Mit dem EduZH-Konto anmelden",text:"Öffnen Sie jede der drei Apps mindestens einmal. Melden Sie sich mit Ihrer vollständigen EduZH-Adresse und Ihrem persönlichen Kennwort an. Bestätigen Sie die Anmeldung im Microsoft Authenticator.",tip:"Falls eine App bereits mit einem privaten Konto geöffnet wird, wählen Sie «Konto hinzufügen» und danach Ihr Schulkonto."},
  {phase:"Schul-Laptop · Prüfen",title:"Die drei Apps am Schul-Laptop öffnen",text:"Öffnen Sie auf einem Schul-Laptop Teams, Outlook und OneNote je einmal. Eine erneute Anmeldung ist nicht nötig.",shortcut:"✓",tip:"Prüfen Sie Ihre Schul-E-Mails in Outlook und Ihre Teams-Nachrichten jeden Tag. Wichtige Informationen und Aufträge werden dort kommuniziert."},
];

const intranetMobile: Step[] = [
  {phase:"UG · Intranet",title:"IN2 Mobile installieren",text:"Lesen Sie diese Anleitung am Schulcomputer. Öffnen Sie dort das Intranet unter in2.tam.ch. Installieren Sie anschliessend IN2 Mobile auf Ihrem Smartphone. Die App ermöglicht Ihnen, wichtige Funktionen des Intranets auch unterwegs auf dem Smartphone zu nutzen.",in2Mobile:true,tip:"Scannen Sie den passenden QR-Code für Ihr Gerät und lassen Sie die App nach der Installation auf dem Smartphone. Das Intranet im Browser erreichen Sie unter in2.tam.ch."},
  {image:"/screenshots/kg-intranet/real/dashboard.png",phase:"UG · Intranet",title:"Das Intranet am Schulcomputer öffnen",text:"Öffnen Sie in2.tam.ch am Schulcomputer. Nach der Anmeldung sehen Sie das Dashboard. Links finden Sie die wichtigsten Bereiche; rechts liegen zum Beispiel Ihr Stundenplan, Ihre Klasse und die Schulbestätigung."},
  {image:"/screenshots/kg-intranet/real/stundenplan.png",phase:"UG · Stundenplan",title:"Stundenplan anschauen",text:"Im Bereich «Stundenplan» sehen Sie Ihre Lektionen in der Wochenansicht. Schauen Sie sich einmal an, wie Sie zwischen Tagen, Wochen und dem Semester wechseln."},
  {image:"/screenshots/kg-intranet/real/stundenplan-abonnieren.png",phase:"UG · Stundenplan",title:"Stundenplan abonnieren",text:"Über das RSS-Symbol bei «Termine» können Sie Ihren Stundenplan und die Schultermine in einer Kalender-App abonnieren (nur relevant, falls Sie einen digitalen Kalender verwenden). Sie müssen sich dabei nichts merken: Fragen Sie bei Unklarheiten Ihre Lehrperson. Sie können selbstverständlich auch einfach einen Papierkalender verwenden."},
  {image:"/screenshots/kg-intranet/real/absenzen.png",phase:"UG · Absenzen",title:"Absenzenerfassung kennenlernen",text:"Unter «Absenzen» sehen Sie Ihre erfassten Absenzen. Hier können Sie auch Joker-Tags-Gesuche sowie Dispensationsgesuche bis 1 Tag und über 1 Tag einreichen. Schauen Sie sich den Bereich an, senden Sie aber keine Testabsenz ab."},
  {image:"/screenshots/kg-intranet/real/notenbuechlein.png",phase:"UG · Noten",title:"Notenbüchlein anschauen",text:"Im Menü «Noten» finden Sie das Notenbüchlein. Öffnen Sie die Übersicht einmal, damit Sie später wissen, wo Ihre Noten angezeigt werden."},
  {image:"/screenshots/kg-intranet/real/schulbestaetigung.png",phase:"UG · Dokumente",title:"Schulbestätigung finden",text:"Unter «Dokumente & Dateien» finden Sie die Schulbestätigung. Öffnen Sie das Menü einmal, damit Sie bei Bedarf rasch wissen, wo das Dokument abgelegt ist."},
];

const kgIntranet: Step[] = [
  {phase:"KG / HMS · Intranet",title:"IN2 Mobile installieren",text:"Installieren Sie IN2 Mobile auf Ihrem Smartphone. Die App ermöglicht Ihnen, wichtige Funktionen des Intranets auch unterwegs auf dem Smartphone zu nutzen.",in2Mobile:true,tip:"Scannen Sie den passenden QR-Code für Ihr Gerät und lassen Sie die App nach der Installation auf dem Smartphone. Das Intranet im Browser erreichen Sie unter in2.tam.ch."},
  {image:"/screenshots/kg-intranet/real/dashboard.png",phase:"KG · Intranet",title:"Das Intranet auf dem Laptop öffnen",text:"Öffnen Sie in2.tam.ch auf Ihrem Laptop. Nach der Anmeldung sehen Sie das Dashboard. Links finden Sie die wichtigsten Bereiche; rechts liegen zum Beispiel Ihr Stundenplan, Ihre Klasse und die Schulbestätigung."},
  {image:"/screenshots/kg-intranet/real/stundenplan.png",phase:"KG · Stundenplan",title:"Stundenplan anschauen",text:"Im Bereich «Stundenplan» sehen Sie Ihre Lektionen in der Wochenansicht. Schauen Sie sich einmal an, wie Sie zwischen Tagen, Wochen und dem Semester wechseln."},
  {image:"/screenshots/kg-intranet/real/stundenplan-abonnieren.png",phase:"KG · Stundenplan",title:"Stundenplan abonnieren",text:"Über das RSS-Symbol bei «Termine» können Sie Ihren Stundenplan und die Schultermine in einer Kalender-App abonnieren (nur relevant, falls Sie einen digitalen Kalender verwenden). Sie müssen sich dabei nichts merken: Fragen Sie bei Unklarheiten Ihre Lehrperson. Sie können selbstverständlich auch einfach einen Papierkalender verwenden."},
  {image:"/screenshots/kg-intranet/real/absenzen.png",phase:"KG · Absenzen",title:"Absenzenerfassung kennenlernen",text:"Unter «Absenzen» sehen Sie Ihre erfassten Absenzen. Hier können Sie auch Joker-Tags-Gesuche sowie Dispensationsgesuche bis 1 Tag und über 1 Tag einreichen. Schauen Sie sich den Bereich an, senden Sie aber keine Testabsenz ab."},
  {image:"/screenshots/kg-intranet/real/notenbuechlein.png",phase:"KG · Noten",title:"Notenbüchlein anschauen",text:"Im Menü «Noten» finden Sie das Notenbüchlein. Öffnen Sie die Übersicht einmal, damit Sie später wissen, wo Ihre Noten angezeigt werden."},
  {image:"/screenshots/kg-intranet/real/schulbestaetigung.png",phase:"KG · Dokumente",title:"Schulbestätigung finden",text:"Unter «Dokumente & Dateien» finden Sie die Schulbestätigung. Öffnen Sie das Menü einmal, damit Sie bei Bedarf rasch wissen, wo das Dokument abgelegt ist."},
];

const printer: Step[] = [
  {image:"/screenshots/printer/qr-anmeldung.png",phase:"KG / HMS · Erstanmeldung",title:"Am Drucker per QR-Code anmelden",text:"Gehen Sie zu einem Multifunktionsdrucker und scannen Sie den QR-Code auf dem Display mit Ihrem Smartphone. Öffnen Sie den Link, melden Sie sich mit Ihrem EduZH-Konto an und bestätigen Sie bei Bedarf im Authenticator.",tip:"Falls der Drucker nach der Anmeldung noch den QR-Code zeigt, scannen Sie ihn einfach ein zweites Mal."},
  {image:"/screenshots/printer/pixio-uebersicht.png",phase:"KG / HMS · Druckauftrag",title:"Datei in Pixio hochladen",text:"Öffnen Sie auf Ihrem BYOD-Gerät das Pixio-Portal und melden Sie sich mit Ihrem Schulaccount an. Über das Pluszeichen erstellen Sie einen neuen Druckauftrag und wählen Ihre Datei aus.",tip:"Das Web-Portal funktioniert auf BYOD-Geräten."},
  {image:"/screenshots/printer/druckauftrag-erstellen.png",phase:"KG / HMS · Einstellungen",title:"Druckeinstellungen wählen",text:"Wählen Sie bei Bedarf Schwarz-Weiss oder Farbe, ein- oder doppelseitig und die Anzahl Kopien. Klicken Sie anschliessend auf «Erstellen»; der Auftrag landet in Ihrer persönlichen Warteschlange."},
  {image:"/screenshots/printer/druckauftrag-abholen.png",phase:"KG / HMS · Abholen",title:"Auftrag am Drucker freigeben",text:"Melden Sie sich am gewünschten Drucker per QR-Code an. Wählen Sie den Auftrag in «Queue Print» und tippen Sie auf «Drucken» – erst dann wird das Dokument ausgegeben.",tip:"Nehmen Sie Ausdrucke sofort mit und lassen Sie keine vertraulichen Dokumente am Gerät liegen."},
];

const ugWorkflow: Step[] = [
  {phase:"Untergymnasium · Ablauf",title:"So geht es jetzt weiter",text:"Melden Sie sich zuerst am Schul-Computer mit Ihrer vollständigen EduZH-Adresse und Ihrem persönlichen Kennwort an. Öffnen Sie danach Moodle und die Aufgabenliste. Klicken Sie beim jeweiligen Auftrag auf den Link; er öffnet diese Anleitung in einem neuen Tab. Nach dem Abschluss markieren Sie die Aufgabe in Moodle als erledigt und gehen zur nächsten Aufgabe weiter.",tip:"Moodle werden Sie künftig in vielen Kursen verwenden. Verwenden Sie für die Anmeldung den Button «EduZH-Login» unterhalb der beiden Felder für Benutzername und Passwort. Falls der Kurs nach der Anmeldung nicht direkt erscheint, wählen Sie oben «Meine Kurse» und danach «IKT-Einführung».",flow:["Am Schul-Computer mit EduZH-Adresse und persönlichem Kennwort anmelden","In Moodle anmelden und Aufgabenliste öffnen","Link im neuen Tab öffnen und Aufgabe bearbeiten","In Moodle als erledigt markieren","Nächste Aufgabe öffnen"]},
];

const kgWorkflow: Step[] = [
  {phase:"Kurzzeitgymnasium / HMS · Ablauf",title:"So geht es jetzt weiter",text:"Melden Sie sich auf Ihrem BYOD-Gerät in Moodle an und öffnen Sie die Aufgabenliste. Klicken Sie beim jeweiligen Auftrag auf den Link; er öffnet diese Anleitung in einem neuen Tab. Nach dem Abschluss markieren Sie die Aufgabe in Moodle als erledigt und gehen zur nächsten Aufgabe weiter.",tip:"Moodle werden Sie künftig in vielen Kursen verwenden. Verwenden Sie für die Anmeldung den Button «EduZH-Login» unterhalb der beiden Felder für Benutzername und Passwort. Falls der Kurs nach der Anmeldung nicht direkt erscheint, wählen Sie oben «Meine Kurse» und danach «IKT-Einführung».",flow:["In Moodle anmelden und Aufgabenliste öffnen","Link im neuen Tab öffnen und Aufgabe bearbeiten","In Moodle als erledigt markieren","Nächste Aufgabe öffnen"]},
];

const peerSupportMac: Step[] = [
  {phase:"Lehrpersonen · macOS Druckertreiber",title:"Installation Druckerwarteschlange (FDU)",text:"Dieses Skript richtet eine persönliche Follow-Me Druckerwarteschlange (z.B. «FDU») auf einem macOS-BYOD-Gerät ein, damit direkt aus Anwendungen wie Microsoft Word gedruckt werden kann, ohne Pixio zu verwenden.",tip:"Voraussetzungen: macOS Sonoma (14+), Internetverbindung & Admin-Rechte (sudo). Speichern Sie das Skript (.sh) und das Treiberpaket (.pkg) im selben Ordner.",shortcut:"sh + pkg",flow:["Skript (.sh) & Treiberpaket (.pkg) herunterladen","Persönliche IPP-URL aus Pixio kopieren","Skript im Terminal ausführbar machen & starten","IPP-URL einfügen & Admin-Passwort eingeben"]},
  {image:"/screenshots/printer/pixio-ipp-queue.png",phase:"Schritt 01 · Pixio Portal",title:"Persönliche IPP-Warteschlange kopieren",text:"Öffnen Sie im Browser das Pixio-Portal (pixio.triboni.net) und melden Sie sich mit Ihrem Windows-Account (vorname.nachname@edu.zh.ch) an. Kopieren Sie unter «Mobile Print App» die gelb markierte URL bei «Persönliche IPP Queue».",tip:"Format: https://pixio.triboni.net/triboni/ipp/pix1/... — Hinweistipp: Pixio-Queues können ablaufen; bei späteren Verbindungsproblemen Schritt 1 wiederholen.",shortcut:"01"},
  {image:"/screenshots/printer/terminal-ipp-prompt.png",phase:"Schritt 02 · Terminal",title:"Skript im Terminal ausführen",text:"Wechseln Sie im Terminal in den Ordner mit den beiden Dateien. Machen Sie das Skript mit «chmod +x macOS-Printer-Connect.sh» ausführbar und starten Sie es mit «./macOS-Printer-Connect.sh».",tip:"Abfragen im Terminal: 1. IPP-URL einfügen · 2. Name wählen (Enter für FDU) · 3. Refresh (y/N) bei Neuinstallation · 4. Admin-Passwort für sudo eingeben.",shortcut:"zsh"}
];

const peerSupportWindows: Step[] = [
  {phase:"Lehrpersonen · Windows Druckertreiber",title:"Installation Druckerwarteschlange (FDU)",text:"Diese Batch-Datei richtet eine persönliche Follow-Me Druckerwarteschlange (z.B. «FDU») auf einem Windows-BYOD-Gerät ein, damit direkt aus Anwendungen wie Microsoft Word gedruckt werden kann, ohne Pixio zu verwenden.",tip:"Voraussetzungen: Windows 10 / 11, Internetverbindung & Administrator-Rechte. Laden Sie das ZIP-Archiv herunter und entpacken Sie es vor dem Start.",shortcut:"bat + zip",flow:["ZIP-Archiv (Win-Printer-Connect.zip) herunterladen & entpacken","Persönliche IPP-URL aus Pixio kopieren","Win-Printer-Connect.bat per Doppelklick starten","IPP-URL mit Ctrl+V einfügen & Enter drücken"]},
  {image:"/screenshots/printer/pixio-ipp-queue.png",phase:"Schritt 01 · Pixio Portal",title:"Persönliche IPP-Warteschlange kopieren",text:"Öffnen Sie im Browser das Pixio-Portal (pixio.triboni.net) und melden Sie sich mit Ihrem Windows-Account (vorname.nachname@edu.zh.ch) an. Kopieren Sie unter «Mobile Print App» die gelb markierte URL bei «Persönliche IPP Queue».",tip:"Format: https://pixio.triboni.net/triboni/ipp/pix1/... — Hinweistipp: Pixio-Queues können ablaufen; bei späteren Verbindungsproblemen Schritt 1 wiederholen.",shortcut:"01"},
  {image:"/screenshots/printer/terminal-ipp-prompt.png",phase:"Schritt 02 · Batch-Datei",title:"Win-Printer-Connect.bat ausführen",text:"Öffnen Sie den entpackten Ordner und führen Sie «Win-Printer-Connect.bat» aus (Rechtsklick → Als Administrator ausführen). Füge bei der Abfrage «Verbindungsname:» die kopierte IPP-URL ein und drücke Enter.",tip:"Der Drucker wird anschliessend unter dem Namen «FDU» auf Ihrem PC eingerichtet.",shortcut:"CMD"}
];

const beamerAirserver: Step[] = [
  {phase:"Lehrpersonen · Medientechnik",title:"Beamer- & AirServer-Anleitung",text:"Hier finden Sie die Anleitung für die Medientechnik in den Unterrichtsräumen: Steuerung von Anlage, Quellenwahl, Projektor, Monitor und AirServer.",tip:"Die PDF-Anleitung fasst alle Funktionen im Unterrichtsraum auf 2 Seiten übersichtlich zusammen.",shortcut:"PDF",flow:["Beamer und AirServer bedienen","Medientechnik im Unterrichtsraum steuern"]}
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
  {phase:"Abgabe",title:"Speichern und in Teams ablegen",text:"Speichern Sie die fertige Datei als Klasse_Nachname_Vorname_Kurzprofil. Legen Sie sie anschliessend im Kanal «Steckbrief» des Klassenteams (z. B. «K26b (FDU)») unter «Freigegeben» in den Ordner «Steckbriefe» hoch.",shortcut:"SAVE",tip:"Kontrollieren Sie vor der Abgabe noch einmal Dateiname, Lesbarkeit und Inhalt."},
  {phase:"Bonus",title:"Bonus für schnelle Profis",text:"Fügen Sie ein passendes Symbol, Emoji oder kleines Bild ein, nutzen Sie passende Farben und schreiben Sie zu mindestens einem Punkt einen kurzen Satz statt nur eines Wortes. Wenn Sie fertig sind, helfen Sie einer Person in Ihrer Nähe.",shortcut:"+"},
];

const klpCalendar: Step[] = [
  {image:"/screenshots/kg-intranet/real/stundenplan-abonnieren.png",phase:"Intranet",title:"Kalender-Link im Stundenplan öffnen",text:"Öffnen Sie im Intranet den Bereich «Stundenplan». Beim Abschnitt «Termine» klicken Sie auf das RSS-/Abo-Symbol. Kopieren Sie den angezeigten Kalender-Link – Sie brauchen ihn nur einmal.",tip:"Das Abonnement ist nur relevant, falls Sie einen digitalen Kalender (z. B. Outlook, Apple Kalender, Google Kalender) nutzen."},
  {phase:"Google Kalender",title:"Schulkalender in Google Kalender abonnieren",text:"Öffnen Sie Google Kalender im Browser. Klicken Sie links neben «Weitere Kalender» auf «+» und wählen Sie «Per URL». Fügen Sie den kopierten Kalender-Link ein und bestätigen Sie mit «Kalender hinzufügen».",tip:"Änderungen im Schulkalender werden danach automatisch übernommen. Die erste Aktualisierung kann etwas dauern."},
  {phase:"Apple Kalender · Mac",title:"Schulkalender auf dem Mac abonnieren",text:"Öffnen Sie die App «Kalender». Wählen Sie in der Menüleiste «Ablage» → «Neues Kalenderabonnement», fügen Sie den Kalender-Link ein und klicken Sie auf «Abonnieren». Wählen Sie anschliessend, wie oft der Kalender aktualisiert werden soll."},
  {phase:"Apple Kalender · iPhone/iPad",title:"Schulkalender auf iPhone oder iPad abonnieren",text:"Öffnen Sie «Einstellungen» → «Apps» → «Kalender» → «Kalenderaccounts» → «Account hinzufügen» → «Andere» → «Kalenderabo hinzufügen». Fügen Sie den Kalender-Link ein, bestätigen Sie und speichern Sie das Abo."},
  {phase:"Kontrolle",title:"Termine prüfen",text:"Öffnen Sie die Kalender-App und blenden Sie den neuen Schulkalender ein. Prüfen Sie, ob die nächsten Schultermine sichtbar sind. Der Kalender ist ein Abo: Änderungen im Intranet erscheinen automatisch, Sie müssen ihn nicht erneut importieren."},
];

const klpFobizz: Step[] = [
  {image:"/screenshots/klp/fobizz/01-mein-fobizz.png",phase:"Start",title:"«Mein fobizz» öffnen",text:"Melden Sie sich bei fobizz an. Klicken Sie oben rechts auf Ihr Profilbild und öffnen Sie «Mein fobizz». Von hier aus erreichen Sie die Bereiche für Ihren Unterricht."},
  {image:"/screenshots/klp/fobizz/02-klassenraeume-menu.png",phase:"Klassenräume",title:"Zu «Klassenräume» wechseln",text:"Wählen Sie im Menü «Klassenräume». Ein Klassenraum bildet eine Lerngruppe ab und bleibt bei der Jahresvariante für das ganze Schuljahr bestehen."},
  {image:"/screenshots/klp/fobizz/03-klassenraum-auswahl.png",phase:"Klassenräume",title:"Passende Laufzeit wählen",text:"Klicken Sie auf «Anlegen». Verwenden Sie «Klassenraum · 1 Jahr» für Ihre Klasse. «Klassenraum · 24 h» eignet sich für einen einmaligen, kurzen Einsatz."},
  {image:"/screenshots/klp/fobizz/04-klassenraum-anlegen.png",phase:"Klassenraum anlegen",title:"Klasse benennen und Anzahl Zugänge festlegen",text:"Geben Sie dem Klassenraum einen eindeutigen Namen, zum Beispiel «K26b». Tragen Sie die Anzahl Schüler*innen ein und klicken Sie auf «Klassenraum anlegen». Kolleg*innen können Sie später im Reiter «Lehrkräfte» einladen."},
  {image:"/screenshots/klp/fobizz/05-zugang-projekt.png",phase:"Zugang & Projekt",title:"Zugangscodes und erstes Projekt vorbereiten",text:"Über «Zugangscodes anzeigen» erhalten Sie die anonymen Codes für Ihre Schüler*innen. Mit «Neues Projekt anlegen» erstellen Sie eine konkrete Unterrichtsaktivität und fügen dort Arbeitsauftrag, Materialien oder Tools hinzu.",tip:"Notieren Sie die Zuordnung zwischen Code und Person nur dann, wenn Sie individuelle Aktivitäten nachvollziehen möchten."},
  {image:"/screenshots/klp/fobizz/09-zugangscodes-drucken.png",phase:"Zugangscodes",title:"Codes ausdrucken und verteilen",text:"Wählen Sie beim Ausdruck der Zugangscodes «Drucken». Verteilen Sie jeder Person genau einen Code. Die Schüler*innen öffnen go.fobizz.com beziehungsweise scannen den QR-Code – ein eigenes fobizz-Konto ist dafür nicht nötig."},
  {image:"/screenshots/klp/fobizz/06-assistenten-uebersicht.png",phase:"KI-Assistenten",title:"Eigenen Assistenten starten",text:"Öffnen Sie «Tools» → «KI Assistenten» und wählen Sie links «Eigene Assistenten». Klicken Sie anschliessend auf «Assistent anlegen». Ein Assistent ist ein vorkonfigurierter Chatbot für eine klar definierte Unterrichtsaufgabe."},
  {image:"/screenshots/klp/fobizz/07-assistent-anlegen.png",phase:"KI-Assistenten",title:"Rolle und Regeln festlegen",text:"Geben Sie Name und kurze Beschreibung ein. Beschreiben Sie unter «Rolle und Instruktionen» konkret, wobei der Assistent hilft, was er nicht tun soll und wie er antwortet. Beispielsweise: zuerst eine Rückfrage stellen, dann nur einen Hinweis geben und keine vollständige Lösung liefern."},
  {image:"/screenshots/klp/fobizz/08-assistent-teilen.png",phase:"Im Unterricht einsetzen",title:"Assistent in ein Projekt teilen",text:"Öffnen Sie beim fertigen Assistenten «Teilen». Unter «Im Klassenraum» wählen Sie den Klassenraum und das gewünschte Projekt. So steht der Assistent den Schüler*innen innerhalb der zeitlich freigeschalteten Unterrichtsaktivität zur Verfügung."},
];

const guideNames: Record<GuideKey,string> = {eduzh:"EduZH-Erstlogin",eduzhNoPhone:"EduZH-Erstlogin (ohne Smartphone)",ugWorkflow:"Untergymnasium",kgWorkflow:"Kurzzeitgymnasium / HMS",officeMobile:"Office 365 auf dem Smartphone",intranetMobile:"Intranet",wlan:"WLAN verbinden",kgIntranet:"Intranet",printer:"Drucker & Kopierer",apps:"BYOD-Software installieren",profile:"Steckbrief-Challenge",challenge:"Window-Management-Challenge",shortcuts:"Shortcut-Challenge",peerSupport:"Drucker-Installation (BYOD)",beamerAirserver:"Beamer & AirServer",klpCalendar:"Schulkalender abonnieren",klpFobizz:"fobizz im Unterricht"};
const guidePaths: Record<GuideKey,string> = {eduzh:"/eduzh",eduzhNoPhone:"/eduzh-ohne-handy",ugWorkflow:"/untergymnasium",kgWorkflow:"/kurzzeitgymnasium-hms",officeMobile:"/ug/office-365-smartphone",intranetMobile:"/ug/intranet-smartphone",wlan:"/wlan",kgIntranet:"/kg/intranet",printer:"/kg/drucker-kopierer",apps:"/microsoft-365",profile:"/challenges/steckbrief",challenge:"/challenges/window-management",shortcuts:"/challenges/shortcuts",peerSupport:"/lehrpersonen/drucker-installation",beamerAirserver:"/lehrpersonen/beamer-airserver",klpCalendar:"/lehrpersonen/schulkalender",klpFobizz:"/lehrpersonen/fobizz"};
const pathGuides: Record<string,GuideKey> = {
  ...Object.fromEntries(Object.entries(guidePaths).map(([key,path])=>[path,key])),
  "/mfa-ohne-smartphone": "eduzhNoPhone",
  "/peer-supporter": "peerSupport",
  "/beamer-airserver": "beamerAirserver",
  "/klp/schulkalender": "klpCalendar",
  "/klp/fobizz": "klpFobizz"
} as Record<string,GuideKey>;
const guideDescriptions: Record<GuideKey, string> = {
  eduzh: "Ersteinrichtung des EduZH-Kontos und Kopplung der Microsoft Authenticator App für die Zwei-Faktor-Authentifizierung.",
  eduzhNoPhone: "Ersteinrichtung des EduZH-Kontos ohne Smartphone mittels USB-Hauptschlüssel (FIDO2 / YubiKey) im Browser am Schullaptop.",
  ugWorkflow: "Ablauf der IKT-Einführung für Schüler*innen des Untergymnasiums am Schul-Computer.",
  kgWorkflow: "Ablauf der IKT-Einführung für Schüler*innen des Kurzzeitgymnasiums und der HMS am eigenen BYOD-Gerät.",
  officeMobile: "Installation und Konfiguration der Microsoft 365 Apps (Outlook, Teams, OneDrive) auf dem Smartphone.",
  intranetMobile: "Einrichtung des Intranet-Zugangs (in2.tam.ch) und der IN2 Mobile App auf dem Smartphone.",
  wlan: "Einrichtung des verschlüsselten Schul-WLANs (KTZH-S) auf Windows-PCs und MacBooks.",
  kgIntranet: "Zugang zum Schulintranet, Stundenplan, Absenzenverwaltung und digitalen Services am Laptop.",
  printer: "Einführung in das Drucksystem: Druckaufträge über Pixio erstellen, Badge verknüpfen und abholen.",
  apps: "Anleitungen zur Installation der erforderlichen Schul-Software und Programme für BYOD-Geräte.",
  profile: "Erstellung und Gestaltung des eigenen Steckbrief-Kurzprofils mit der offiziellen Word-Vorlage.",
  challenge: "Training von Tastaturkürzeln zur schnellen Fensteranordnung (Tiling / Snap Layouts) unter Windows und macOS.",
  shortcuts: "Interaktives Shortcut-Training für schnelles Navigieren im Browser, Dateimanager und in Editoren.",
  peerSupport: "Installation der persönlichen Follow-Me Druckerwarteschlange (FDU) auf Windows-PCs und MacBooks zum direkten Drucken aus Programmen.",
  beamerAirserver: "Schritt-für-Schritt Anleitung zur Bedienung der Medientechnik im Unterrichtsraum: Beamer, Audio/Video-Anlage, Monitor und drahtloser AirServer.",
  klpCalendar: "Automatisches Abonnement des Schulkalenders in Outlook, Google Kalender oder Apple Kalender zur Synchronisation aller Termine.",
  klpFobizz: "Erstellung digitaler Klassenräume, Verwaltung anonymer Schüler-Zugangscodes und Einsatz eigener KI-Assistenten im Unterricht."
};

const navigationGroups: { number: string; title: string; subtitle: string; path: string; guides: GuideKey[] }[] = [
  {number:"2a",title:"UG",subtitle:"Schul-Computer",path:"/ug",guides:["officeMobile","intranetMobile"]},
  {number:"2b",title:"KG / HMS",subtitle:"eigene BYOD-Geräte",path:"/kg",guides:["wlan","apps","kgIntranet","printer"]},
  {number:"3",title:"Challenges",subtitle:"für alle Schulstufen",path:"/challenges",guides:["profile","challenge","shortcuts"]},
  {number:"LP",title:"Lehrpersonen",subtitle:"Organisation & Medientechnik",path:"/lehrpersonen",guides:["klpCalendar","klpFobizz","peerSupport","beamerAirserver"]},
];

function getGuideSteps(key: GuideKey, computer: "windows" | "mac", phone: "iphone" | "android"): Step[] {
  switch (key) {
    case "eduzh": return phone === "android" ? eduzhAndroid : eduzhIphone;
    case "eduzhNoPhone": return eduzhNoPhone;
    case "ugWorkflow": return ugWorkflow;
    case "kgWorkflow": return kgWorkflow;
    case "officeMobile": return phone === "android" ? officeMobileAndroid : officeMobileIphone;
    case "intranetMobile": return intranetMobile;
    case "kgIntranet": return kgIntranet;
    case "printer": return printer;
    case "apps": return apps;
    case "beamerAirserver": return beamerAirserver;
    case "peerSupport": return computer === "windows" ? peerSupportWindows : peerSupportMac;
    case "profile": return profile;
    case "klpCalendar": return klpCalendar;
    case "klpFobizz": return klpFobizz;
    case "wlan": return computer === "windows" ? wlanWindows : wlanMac;
    case "challenge": return computer === "windows" ? challengeWindows : challengeMac;
    case "shortcuts": return computer === "windows" ? shortcutsWindows : shortcutsMac;
    default: return eduzhIphone;
  }
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
  const steps=useMemo(()=>guide==="eduzh"?(phone==="android"?eduzhAndroid:eduzhIphone):guide==="eduzhNoPhone"?eduzhNoPhone:guide==="ugWorkflow"?ugWorkflow:guide==="kgWorkflow"?kgWorkflow:guide==="officeMobile"?(phone==="android"?officeMobileAndroid:officeMobileIphone):guide==="intranetMobile"?intranetMobile:guide==="kgIntranet"?kgIntranet:guide==="printer"?printer:guide==="apps"?apps:guide==="beamerAirserver"?beamerAirserver:guide==="peerSupport"?(computer==="windows"?peerSupportWindows:peerSupportMac):guide==="profile"?profile:guide==="klpCalendar"?klpCalendar:guide==="klpFobizz"?klpFobizz:guide==="wlan"?(computer==="windows"?wlanWindows:wlanMac):guide==="challenge"?(computer==="windows"?challengeWindows:challengeMac):(computer==="windows"?shortcutsWindows:shortcutsMac),[guide,computer,phone]);
  const step=steps[current]||steps[0];
  const image=step.image;
  const desktopAppGuide=["intranetMobile","kgIntranet","printer","klpCalendar","klpFobizz","beamerAirserver"].includes(guide);
  const pdfHref=guide==="eduzh"?`/pdfs/eduzh-${phone}.pdf`:guide==="eduzhNoPhone"?"/pdfs/eduzh-ohne-handy.pdf":guide==="wlan"?`/pdfs/wlan-${computer==="mac"?"macos":"windows"}.pdf`:guide==="apps"?"/pdfs/microsoft-365.pdf":guide==="profile"?"/pdfs/steckbrief-challenge.pdf":guide==="challenge"?`/pdfs/window-management-${computer==="mac"?"macos":"windows"}.pdf`:guide==="shortcuts"?`/pdfs/shortcut-challenge-${computer==="mac"?"macos":"windows"}.pdf`:guide==="peerSupport"?`/downloads/Anleitung_BYOD_Printing_${computer==="mac"?"macOS":"Windows"}.pdf`:guide==="beamerAirserver"?"/downloads/anleitung-beamer-unterrichtsraum.pdf":null;
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
        {image?<button className="screenshot" onClick={()=>setZoom(true)} aria-label="Screenshot vergrössern"><img src={image} alt={`Screenshot zu ${step.title}`}/><span className="zoom-label">＋ Vergrössern</span></button>:step.in2Mobile?<div className="in2-visual"><small>IN2 MOBILE</small><b>App installieren</b><span>iPhone oder Android</span></div>:step.flow?<div className={`flow-visual ${guide==="ugWorkflow"?"workflow-loop ug-loop":guide==="kgWorkflow"?"workflow-loop kg-loop":""}`}><small>{guide==="peerSupport"?"ABLAUF · ANLEITUNG":"START-ABLAUF"}</small>{step.flow.map((item,index)=>{const repeats=guide==="ugWorkflow"?index>=2:guide==="kgWorkflow"?index>=1:false;const startsRepeat=guide==="ugWorkflow"?index===2:guide==="kgWorkflow"?index===1:false;return <div key={item} className={repeats?"repeat-step":""}>{startsRepeat&&<em>Für jede weitere Aufgabe</em>}<span>{String(index+1).padStart(2,"0")}</span><b>{item}{guide==="kgWorkflow"&&index===3&&<> <u>in Moodle</u></>}</b>{index<step.flow!.length-1&&<i>↓</i>}</div>})}{guide==="ugWorkflow"&&<p className="repeat-note">↻ Danach wieder bei Schritt 03 beginnen</p>}{guide==="kgWorkflow"&&<p className="repeat-note">↻ Danach wieder bei Schritt 02 beginnen</p>}</div>:<div className="challenge-card"><small>{guide==="peerSupport"?"PEER-SUPPORTER":guide==="apps"||guide==="profile"?"KG / HMS":computer==="windows"?"WINDOWS":"macOS"}</small><span>{String(current+1).padStart(2,"0")}</span><b>{step.shortcut|| (current===steps.length-1?"✓":"GO")}</b><p>{guide==="apps"?"VORAUSSETZUNG":guide==="profile"?"STECKBRIEF · KURZPROFIL":guide==="shortcuts"?"SHORTCUT TRAINING":guide==="peerSupport"?"PEER-SUPPORTER · MACOS PRINT":"WINDOW MANAGEMENT · KG / HMS"}</p></div>}
        <div className="swipe-hint">{image?"Screenshot antippen zum Vergrössern":"Praxisaufgabe am eigenen BYOD-Gerät"}</div>
      </div>
      <article className="instruction">
        <div className="step-label"><span>Schritt {String(current+1).padStart(2,"0")}</span><i/>{step.phase}</div>
        <h2>{step.title}</h2><p>{step.text}</p>
        {(guide==="ugWorkflow"||guide==="kgWorkflow")&&<section className="workflow-launch" aria-label="Moodle starten"><div className="browser-launch"><p><strong>1. Browser öffnen</strong><span>{guide==="ugWorkflow"?"Am Schul-Computer Microsoft Edge öffnen.":"Auf Ihrem Laptop einen Browser Ihrer Wahl öffnen, z. B. Edge, Chrome oder Safari."}</span></p></div><a href="https://moodle.kst-fdu.ch/course/view.php?id=4" target="_blank" rel="noreferrer"><b>2. Moodle öffnen</b><span>Diese Adresse eintippen:</span><code>moodle.kst-fdu.ch</code><span className="moodle-hint">Login-Hinweis: Nutzen Sie den Button «EduZH-Login» unterhalb der beiden Felder für Benutzername und Passwort.</span><span>Aufgabenliste «IKT-Einführung» ↗</span></a></section>}
        {(guide==="eduzh"&&current===0||guide==="officeMobile"&&current===0)&&<div className="device-picker"><button className={phone==="iphone"?"selected":""} onClick={()=>setPhone("iphone")}><b>iPhone</b><span>App Store</span></button><button className={phone==="android"?"selected":""} onClick={()=>setPhone("android")}><b>Android</b><span>Google Play</span></button></div>}
        {guide==="eduzh"&&current===0&&<aside className="tip" style={{marginTop:"10px"}}><strong>Kein Smartphone vorhanden?</strong> Sie können Ihr Konto auch am Schullaptop ohne Smartphone einrichten: <a href={guidePaths.eduzhNoPhone} onClick={e=>{e.preventDefault();openGuide("eduzhNoPhone")}}>Zur Anleitung Erstlogin ohne Smartphone (USB-Key) ↗</a></aside>}
        {guide==="eduzh"&&phone==="iphone"&&step.existingImage&&<details className="alternate-path"><summary>Authenticator enthält bereits Konten?</summary><p>{step.existingText}</p><div><figure><img src={step.existingImage} alt="Im Authenticator auf das Pluszeichen tippen"/><figcaption>1. Oben rechts auf «+» tippen</figcaption></figure><figure><img src={step.existingImage2} alt="Geschäfts- oder Schulkonto und danach Anmelden wählen"/><figcaption>2. Schulkonto und «Anmelden» wählen</figcaption></figure></div></details>}
        {(guide==="wlan"||guide==="challenge"||guide==="shortcuts"||guide==="peerSupport")&&<div className="device-picker"><button className={computer==="windows"?"selected":""} onClick={()=>setComputer("windows")}><b>Windows</b><span>PC</span></button><button className={computer==="mac"?"selected":""} onClick={()=>setComputer("mac")}><b>macOS</b><span>MacBook</span></button></div>}
        {step.tip&&<aside className="tip"><strong>Gut zu wissen</strong>{step.tip}</aside>}
        {guide==="eduzhNoPhone"&&current===0&&<a className="byod-link" href="https://www.galaxus.ch/de/s1/product/yubico-key-c-nfc-notebook-security-20667831" target="_blank" rel="noreferrer">Beispiel-Gerät auf Galaxus anzeigen (Yubico Key C NFC) ↗</a>}
        {guide==="eduzhNoPhone"&&(current===1||current===2)&&<a className="byod-link" href="https://mysignins.microsoft.com/security-info" target="_blank" rel="noreferrer">Microsoft Sicherheits-Info öffnen (mysignins.microsoft.com) ↗</a>}
        {(guide==="intranetMobile"||guide==="kgIntranet")&&(current===0||current===1)&&<a className="byod-link" href="https://in2.tam.ch" target="_blank" rel="noreferrer">Intranet öffnen (in2.tam.ch) ↗</a>}
        {guide==="apps"&&current===0&&<a className="byod-link" href="https://cyrilblum.github.io/KSTFDue/" target="_blank" rel="noreferrer">BYOD-Installationsanleitungen öffnen ↗</a>}
        {guide==="printer"&&current===1&&<a className="byod-link" href="https://pixio.triboni.net/triboni/oauth2/pix1/edu/init?" target="_blank" rel="noreferrer">https://pixio.triboni.net/triboni/oauth2/pix1/edu/init? ↗</a>}
        {guide==="peerSupport"&&current===0&&computer==="mac"&&<div className="peer-download-container">
          <div className="peer-download-header">
            <strong>Erforderliche Downloads (macOS)</strong>
            <span>Beide Dateien vor dem Ausführen im selben Ordner speichern:</span>
          </div>
          <div className="peer-download-cards">
            <a className="peer-dl-card sh-card" href="/downloads/macOS-Printer-Connect.sh" download>
              <div className="peer-dl-info">
                <span className="peer-dl-tag">SHELL-SKRIPT · 1.4 KB</span>
                <strong>macOS-Printer-Connect.sh</strong>
                <small>Einrichtungsskript für Terminal ↓</small>
              </div>
            </a>
            <a className="peer-dl-card pkg-card" href="/downloads/HewlettPackardPrinterDrivers.pkg" download>
              <div className="peer-dl-info">
                <span className="peer-dl-tag">TREIBERPAKET · 263 MB</span>
                <strong>HewlettPackardPrinterDrivers.pkg</strong>
                <small>HP Druckertreiber für macOS ↓</small>
              </div>
            </a>
          </div>
          <div className="peer-quick-links">
            <a className="peer-quick-link" href="/downloads/Anleitung_BYOD_Printing_macOS.pdf" target="_blank" rel="noreferrer">
              PDF-Anleitung Drucker ↗
            </a>
            <a className="peer-quick-link" href="https://pixio.triboni.net/triboni/oauth2/pix1/edu/init?" target="_blank" rel="noreferrer">
              Pixio Web-App öffnen ↗
            </a>
          </div>
        </div>}
        {guide==="peerSupport"&&current===0&&computer==="windows"&&<div className="peer-download-container">
          <div className="peer-download-header">
            <strong>Erforderliche Downloads (Windows)</strong>
            <span>Archiv herunterladen und vor dem Start entpacken:</span>
          </div>
          <div className="peer-download-cards">
            <a className="peer-dl-card zip-card" href="/downloads/Win-Printer-Connect.zip" download>
              <div className="peer-dl-info">
                <span className="peer-dl-tag">ZIP-ARCHIV · 31 MB</span>
                <strong>Win-Printer-Connect.zip</strong>
                <small>Batch-Skript & HP Treiber für Windows ↓</small>
              </div>
            </a>
          </div>
          <div className="peer-quick-links">
            <a className="peer-quick-link" href="/downloads/Anleitung_BYOD_Printing_Windows.pdf" target="_blank" rel="noreferrer">
              PDF-Anleitung Drucker ↗
            </a>
            <a className="peer-quick-link" href="https://pixio.triboni.net/triboni/oauth2/pix1/edu/init?" target="_blank" rel="noreferrer">
              Pixio Web-App öffnen ↗
            </a>
          </div>
        </div>}
        {guide==="peerSupport"&&current===1&&<div className="peer-step-box"><a className="byod-link" href="https://pixio.triboni.net/triboni/oauth2/pix1/edu/init?" target="_blank" rel="noreferrer">Pixio Web-Portal öffnen (pixio.triboni.net) ↗</a></div>}
        {guide==="peerSupport"&&current===2&&computer==="mac"&&<div className="terminal-box">
          <div className="terminal-header">
            <div className="terminal-dots"><span/><span/><span/></div>
            <span>macOS Terminal — zsh</span>
          </div>
          <div className="terminal-body">
            <div className="terminal-line"><span className="prompt">$</span> <code>chmod +x macOS-Printer-Connect.sh</code></div>
            <div className="terminal-line"><span className="prompt">$</span> <code>./macOS-Printer-Connect.sh</code></div>
          </div>
          <div className="terminal-footer">
            <p><strong>Funktionsweise:</strong> Prüft HP-Treiber &rarr; installiert <code>HewlettPackardPrinterDrivers.pkg</code> via <code>sudo installer</code> &rarr; richtet Drucker mit <code>lpadmin</code> ein (A4, Follow-Me Finisher).</p>
          </div>
        </div>}
        {guide==="peerSupport"&&current===2&&computer==="windows"&&<div className="terminal-box">
          <div className="terminal-header">
            <div className="terminal-dots"><span/><span/><span/></div>
            <span>Windows Eingabeaufforderung / PowerShell</span>
          </div>
          <div className="terminal-body">
            <div className="terminal-line"><span className="prompt">C:\&gt;</span> <code>Win-Printer-Connect.bat</code></div>
          </div>
          <div className="terminal-footer">
            <p><strong>Funktionsweise:</strong> Führt <code>install.ps1</code> aus (HP Universal Driver PCL 6) &rarr; richtet Drucker über <code>printui.dll</code> ein (Druckername: <code>FDU</code>).</p>
          </div>
        </div>}
        {guide==="beamerAirserver"&&<a className="peer-pdf" href="/downloads/anleitung-beamer-unterrichtsraum.pdf" target="_blank" rel="noreferrer"><span>PDF · 2 SEITEN</span><strong>Beamer- und AirServer-Anleitung öffnen ↗</strong><small>Anlage, Quellenwahl, Projektor, Monitor und AirServer im Unterrichtsraum</small></a>}
        {guide==="profile"&&current===0&&<a className="template-download" href="/downloads/mein-kurzprofil-vorlage.docx" download>Word-Gestaltungsvorlage herunterladen ↓</a>}
        {guide==="shortcuts"&&current===steps.length-1&&<a className="further-tasks" href="/downloads/shortcut-uebersicht-programmieren.pdf" target="_blank" rel="noreferrer">Weitere Shortcut-Aufgaben und Übersicht als PDF öffnen ↗</a>}
        {guide==="ugWorkflow"&&<button className="workflow-next" onClick={()=>openGuide("officeMobile")}>Mit Schritt 02 weiter <span>→</span></button>}
        {guide==="kgWorkflow"&&<button className="workflow-next" onClick={()=>openGuide("wlan")}>Mit Schritt 02 weiter <span>→</span></button>}
        {step.in2Mobile&&<section className="in2-codes" aria-label="IN2 Mobile herunterladen"><a href="https://apps.apple.com/ch/app/in2-mobile/id1560963697" target="_blank" rel="noreferrer"><img src="/screenshots/kg-intranet/in2-mobile-iphone-qr.png" alt="QR-Code für IN2 Mobile im Apple App Store"/><strong>iPhone</strong><span>App Store öffnen ↗</span></a><a href="https://play.google.com/store/apps/details?id=net.gyselroth.in2mobile&hl=de_CH" target="_blank" rel="noreferrer"><img src="/screenshots/kg-intranet/in2-mobile-android-qr.png" alt="QR-Code für IN2 Mobile bei Google Play"/><strong>Android</strong><span>Google Play öffnen ↗</span></a></section>}
        {(guide==="eduzh"||guide==="eduzhNoPhone")&&step.phase==="Kennwort"&&<aside className="password-box"><strong>Konkretes Beispiel</strong><code>Wolke!Kanu7Tisch-Lama</code><p>Vier unerwartete Wörter, Gross-/Kleinbuchstaben, Zahl und Sonderzeichen. Erfinden Sie unbedingt Ihr eigenes Beispiel und verwenden Sie es nur für dieses Konto.</p></aside>}
        {current===steps.length-1&&<div className="finish-block"><div className="success">Anleitung abgeschlossen</div>{(guide==="eduzh"||guide==="eduzhNoPhone")?<div className="path-choice"><strong>Wählen Sie Ihren Schulweg</strong><div><a href={guidePaths.ugWorkflow} onClick={event=>{event.preventDefault();openGuide("ugWorkflow")}}>Untergymnasium →</a><a href={guidePaths.kgWorkflow} onClick={event=>{event.preventDefault();openGuide("kgWorkflow")}}>Kurzzeitgymnasium / HMS →</a></div></div>:!["klpCalendar","klpFobizz","peerSupport","beamerAirserver"].includes(guide)&&<><a className="moodle" href="https://moodle.kst-fdu.ch/course/view.php?id=4" target="_blank" rel="noreferrer">In Moodle als erledigt markieren ↗</a><p className="moodle-flow">Öffnen Sie in Moodle den nächsten Link. Er führt Sie zurück zu dieser Seite zum nächsten Schritt.</p></>}</div>}
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
