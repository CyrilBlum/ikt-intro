#!/usr/bin/env python3
import os
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, HRFlowable
)
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
SCREENSHOT_PATH = ROOT / "public" / "screenshots" / "printer" / "pixio-ipp-queue.png"
PROMPT_PATH = ROOT / "public" / "screenshots" / "printer" / "terminal-ipp-prompt.png"
OUTPUT_PATH_1 = ROOT / "public" / "downloads" / "Anleitung_BYOD_Printing_Windows.pdf"
OUTPUT_PATH_2 = Path("/Users/cyrilwendl/Downloads/Druckertreiber_Windows/Anleitung_Druckerinstallation_Windows.pdf")

TEAL = HexColor("#217c6f")
DEEP_BLUE = HexColor("#00adef")
INK = HexColor("#132624")
PALE = HexColor("#edf6f3")
LINE_COLOR = HexColor("#c7d9d3")
MUTED = HexColor("#49645e")
DARK_BG = HexColor("#182825")

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Header banner
        self.setFillColor(TEAL)
        self.rect(0, 802, 595.27, 40, fill=True, stroke=False)
        self.setFillColor(white)
        self.setFont("Helvetica-Bold", 10)
        self.drawString(36, 818, "KANTONSSCHULE STADELHOFEN · FILIALE DÜBENDORF")
        self.setFont("Helvetica", 9)
        self.drawRightString(595.27 - 36, 818, "IKT-ANLEITUNG · WINDOWS PRINTING")

        # Footer
        self.setStrokeColor(LINE_COLOR)
        self.setLineWidth(0.8)
        self.line(36, 42, 595.27 - 36, 42)

        self.setFont("Helvetica", 8)
        self.setFillColor(MUTED)
        self.drawString(36, 28, "© 2026 Kantonsschule Stadelhofen · Peer-Supporter Anleitung")
        self.drawRightString(595.27 - 36, 28, f"Seite {self._pageNumber} von {page_count}")
        self.restoreState()

def build_pdf():
    doc = SimpleDocTemplate(
        str(OUTPUT_PATH_1),
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=TEAL,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=15,
        textColor=DEEP_BLUE,
        spaceAfter=12
    )

    h2_style = ParagraphStyle(
        "H2",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=TEAL,
        spaceBefore=10,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13.5,
        textColor=INK,
        spaceAfter=6
    )

    code_style = ParagraphStyle(
        "Code",
        parent=styles["Normal"],
        fontName="Courier-Bold",
        fontSize=9,
        leading=12,
        textColor=white
    )

    story = []

    story.append(Paragraph("BYOD Windows – Installation Druckerwarteschlange (FDU)", title_style))
    story.append(Paragraph("Einrichtung der persönlichen Follow-Me Druckerwarteschlange unter Windows 10 / 11", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=DEEP_BLUE, spaceAfter=10))

    # Intro
    intro_text = (
        "<b>Zweck:</b> Diese Anleitung beschreibt die Installation der Follow-Me Druckerwarteschlange (Name: <b>FDU</b>) "
        "auf Windows BYOD-Geräten, damit Dokumente direkt aus Programmen wie Word gedruckt werden können.<br/><br/>"
        "<b>Empfehlung:</b> Für einmalige Ausdrucke empfiehlt sich primär das Pixio Web-Portal "
        "<i>https://pixio.triboni.net/triboni/oauth2/pix1/edu/init?</i> (keine lokale Treiberinstallation nötig)."
    )
    intro_table = Table([[Paragraph(intro_text, body_style)]], colWidths=[523])
    intro_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), PALE),
        ('BOX', (0,0), (-1,-1), 1, LINE_COLOR),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(intro_table)
    story.append(Spacer(1, 10))

    # Prerequisites
    story.append(Paragraph("Voraussetzungen", h2_style))
    prereqs = (
        "• Windows 10 oder Windows 11 (Home / Pro / Enterprise)<br/>"
        "• Aktive Internetverbindung<br/>"
        "• Administrator-Rechte auf dem Gerät<br/>"
        "• Das Paket <b>Win-Printer-Connect.zip</b> herunterladen und entpacken "
        "(enthält <code>Win-Printer-Connect.bat</code> und den Ordner <code>Win-HP-Treiber</code>)"
    )
    story.append(Paragraph(prereqs, body_style))
    story.append(Spacer(1, 8))

    # Step 1
    story.append(Paragraph("Schritt 1: Persönliche IPP-Warteschlange (URL) kopieren", h2_style))
    step1_text = (
        "1. Im Browser die Adresse <i>https://pixio.triboni.net/triboni/oauth2/pix1/edu/init?</i> aufrufen.<br/>"
        "2. Mit dem EduZH-Account anmelden (<code>vorname.nachname@edu.zh.ch</code>).<br/>"
        "3. Unter <b>Mobile Print App</b> die gelb markierte URL bei <b>Persönliche IPP Queue</b> markieren und kopieren (<code>Ctrl + C</code>)."
    )
    story.append(Paragraph(step1_text, body_style))
    story.append(Spacer(1, 6))

    if SCREENSHOT_PATH.exists():
        img = Image(str(SCREENSHOT_PATH), width=480, height=270)
        img_table = Table([[img]], colWidths=[523])
        img_table.setStyle(TableStyle([
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('BOX', (0,0), (-1,-1), 1, LINE_COLOR),
            ('PADDING', (0,0), (-1,-1), 4),
            ('BACKGROUND', (0,0), (-1,-1), white)
        ]))
        story.append(img_table)
        story.append(Spacer(1, 10))

    # Step 2
    story.append(Paragraph("Schritt 2: Batch-Datei ausführen", h2_style))
    step2_text = (
        "1. Den entpackten Ordner öffnen.<br/>"
        "2. Die Datei <b>Win-Printer-Connect.bat</b> mit einem Doppelklick (oder Rechtsklick &rarr; »Als Administrator ausführen«) starten.<br/>"
        "3. Im CMD-Fenster bei der Abfrage <code>Verbindungsname:</code> die kopierte IPP-URL mit <code>Ctrl + V</code> (oder Rechtsklick) einfügen.<br/>"
        "4. Drücken Sie <b>Enter</b>, um die Einrichtung der Druckerwarteschlange <b>FDU</b> abzuschliessen."
    )
    story.append(Paragraph(step2_text, body_style))
    story.append(Spacer(1, 6))

    code_content = "Win-Printer-Connect.bat\nVerbindungsname: https://pixio.triboni.net/triboni/ipp/pix1/..."
    code_table = Table([[Paragraph(code_content.replace('\n', '<br/>'), code_style)]], colWidths=[523])
    code_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), DARK_BG),
        ('PADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 1, TEAL)
    ]))
    story.append(code_table)
    story.append(Spacer(1, 10))

    # Summary
    story.append(Paragraph("Abschluss", h2_style))
    summary_text = (
        "Der Drucker wird unter dem Namen <b>FDU</b> installiert. Er steht danach in allen Programmen "
        "(z.B. Microsoft Word, Excel, Edge) als Standard-Drucker für den Follow-Me Druck bereit."
    )
    story.append(Paragraph(summary_text, body_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Windows PDF built successfully at {OUTPUT_PATH_1}")

    if OUTPUT_PATH_2.parent.exists():
        import shutil
        shutil.copy(OUTPUT_PATH_1, OUTPUT_PATH_2)
        print(f"Windows PDF copied to {OUTPUT_PATH_2}")

if __name__ == "__main__":
    build_pdf()
