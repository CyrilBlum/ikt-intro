#!/usr/bin/env python3
import os
import sys
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, HRFlowable, KeepTogether
)
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
SCREENSHOT_PATH = ROOT / "public" / "screenshots" / "printer" / "pixio-ipp-queue-01.png"
OUTPUT_PATH_1 = ROOT / "public" / "downloads" / "Anleitung_BYOD_Printing_macOS.pdf"
OUTPUT_PATH_2 = Path("/Users/cyrilwendl/Downloads/Druckertreiber_Mac/Anleitung_BYOD_Printing_macOS.pdf")

TEAL = HexColor("#217c6f")
DEEP_BLUE = HexColor("#00adef")
INK = HexColor("#132624")
PALE = HexColor("#edf6f3")
LINE_COLOR = HexColor("#c7d9d3")
LIME = HexColor("#b3c458")
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
        self.drawRightString(595.27 - 36, 818, "IKT-ANLEITUNG · BYOD PRINTING")

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

    tip_style = ParagraphStyle(
        "Tip",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=9,
        leading=13,
        textColor=INK
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

    story.append(Paragraph("BYOD macOS – Installation Druckerwarteschlange (FDU)", title_style))
    story.append(Paragraph("Einrichtung der persönlichen Follow-Me Druckerwarteschlange via Shell-Skript", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=DEEP_BLUE, spaceAfter=10))

    # Box 1: Intro & Recommendation
    intro_text = (
        "<b>Zweck:</b> Dieses Skript installiert eine persönliche Druckerwarteschlange (Name: <b>FDU</b>) "
        "auf einem macOS-BYOD-Gerät, damit Dokumente via Follow-Me direkt aus Programmen wie Microsoft Word gedruckt werden können.<br/><br/>"
        "<b>Empfehlung:</b> Für den einmaligen, einfachen Ausdruck empfiehlt sich primär die Web-Applikation "
        "<i>https://pixio.triboni.net/triboni/oauth2/pix1/edu/init?</i> (kein lokales Setup nötig)."
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
        "• macOS mind. Version 14 (Sonoma)<br/>"
        "• Aktive Internetverbindung<br/>"
        "• Administrator-Berechtigung auf dem Mac (Skript ruft <code>sudo</code> auf)<br/>"
        "• Beide Dateien im <b>selben Ordner</b>: <code>macOS-Printer-Connect.sh</code> und <code>HewlettPackardPrinterDrivers.pkg</code>"
    )
    story.append(Paragraph(prereqs, body_style))
    story.append(Spacer(1, 8))

    # Step 1
    story.append(Paragraph("Schritt 1: Persönliche Druckerwarteschlange (URL) kopieren", h2_style))
    step1_text = (
        "1. Im Browser die URL <i>https://pixio.triboni.net/triboni/oauth2/pix1/edu/init?</i> öffnen.<br/>"
        "2. Mit dem Windows-Account anmelden (<code>vorname.nachname@edu.zh.ch</code>).<br/>"
        "3. Auf der Pixio-Startseite unter <b>Mobile Print App</b> die gelb markierte URL bei <b>Persönliche IPP Queue</b> kopieren "
        "(Format: <code>https://pixio.triboni.net/triboni/ipp/pix1/...</code>)."
    )
    story.append(Paragraph(step1_text, body_style))
    story.append(Spacer(1, 6))

    # Embed Screenshot if available
    if SCREENSHOT_PATH.exists():
        img = Image(str(SCREENSHOT_PATH), width=480, height=296)
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
    story.append(Paragraph("Schritt 2: Skript im Terminal ausführen", h2_style))
    story.append(Paragraph("Im Terminal in den Ordner mit den beiden Dateien wechseln, das Skript ausführbar machen und ausführen:", body_style))

    code_content = "chmod +x macOS-Printer-Connect.sh\n./macOS-Printer-Connect.sh"
    code_table = Table([[Paragraph(code_content.replace('\n', '<br/>'), code_style)]], colWidths=[523])
    code_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), DARK_BG),
        ('PADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 1, TEAL)
    ]))
    story.append(code_table)
    story.append(Spacer(1, 8))

    story.append(Paragraph("Das Skript fragt nacheinander folgende Parameter ab:", body_style))

    table_data = [
        [Paragraph("<b>Abfrage</b>", body_style), Paragraph("<b>Beschreibung</b>", body_style)],
        [
            Paragraph("<b>URL der Queue</b>", body_style),
            Paragraph("Die in Schritt 1 kopierte IPP-URL einfügen und mit Enter bestätigen.", body_style)
        ],
        [
            Paragraph("<b>Druckername [FDU]</b>", body_style),
            Paragraph("Der lokale Anzeigename (Standard: <b>FDU</b>). Enter übernimmt <code>FDU</code>.", body_style)
        ],
        [
            Paragraph("<b>Refresh? [y/N]</b>", body_style),
            Paragraph("Falls der HP-Treiber vorhanden ist: mit <code>y</code> neu installieren, sonst überspringen.", body_style)
        ],
    ]
    t = Table(table_data, colWidths=[150, 373])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PALE),
        ('GRID', (0,0), (-1,-1), 0.5, LINE_COLOR),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP')
    ]))
    story.append(t)
    story.append(Spacer(1, 10))

    # Details
    story.append(Paragraph("Was das Skript im Detail macht", h2_style))
    details_text = (
        "1. Prüft die eingegebene IPP-Warteschlangen-URL.<br/>"
        "2. Fragt nach dem lokalen Druckernamen (Standard: <code>FDU</code>; Anzeigename: <code>FDU persönlich</code>).<br/>"
        "3. Prüft, ob der HP-Druckertreiber (<code>HP Color MFP E877-40-50-60-70.gz</code>) vorhanden ist:<br/>"
        "   &nbsp;&nbsp;• Falls nicht vorhanden: installiert <code>HewlettPackardPrinterDrivers.pkg</code> via <code>sudo installer</code>.<br/>"
        "4. Richtet den Drucker mit <code>lpadmin</code> ein (A4 Papierformat, Follow-Me HP-Optionen wie Hefter, Locher, Falzeinheit, Booklet-Maker).<br/>"
        "5. Der Drucker wird lokal eingerichtet (<code>printer-is-shared=false</code>)."
    )
    story.append(Paragraph(details_text, body_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF built successfully at {OUTPUT_PATH_1}")

    # Copy to Downloads folder as well
    if OUTPUT_PATH_2.parent.exists():
        import shutil
        shutil.copy(OUTPUT_PATH_1, OUTPUT_PATH_2)
        print(f"PDF copied to {OUTPUT_PATH_2}")

if __name__ == "__main__":
    build_pdf()
