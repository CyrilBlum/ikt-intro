#!/usr/bin/env python3
import html
import re
import shutil
from pathlib import Path

from PIL import Image
from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "app" / "page.tsx"
OUTPUT = ROOT / "output" / "pdf"
PUBLIC = ROOT / "public" / "pdfs"
PAPER = white
INK = HexColor("#132624")
TEAL = HexColor("#217c6f")
GREEN = HexColor("#a2b444")
BLUE = HexColor("#00adef")
PALE = HexColor("#e0e7bc")
LINE = HexColor("#d9dfd1")

def parse_steps(name):
    text = SOURCE.read_text(encoding="utf-8")
    block = re.search(rf"const {name}: Step\[\] = \[(.*?)\n\];", text, re.S).group(1)
    steps = []
    for raw in re.findall(r"\{[^\n]+\}", block):
        values = dict(re.findall(r'(\w+):"([^"]*)"', raw))
        steps.append(values)
    return steps

def safe(text):
    return html.escape(text).replace("–", "-").replace("—", "-")

BODY = ParagraphStyle("body", fontName="Helvetica", fontSize=8.6, leading=11.2, textColor=INK, alignment=TA_LEFT)
TIP = ParagraphStyle("tip", fontName="Helvetica", fontSize=7.2, leading=9.2, textColor=INK)
TITLE = ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=13, leading=14.5, textColor=INK)

def draw_footer(c, page_no, total):
    w, _ = A4
    c.setStrokeColor(LINE); c.setLineWidth(.5); c.line(12*mm, 11*mm, w-12*mm, 11*mm)
    c.setFillColor(TEAL); c.setFont("Helvetica", 6.5)
    c.drawString(12*mm, 6.5*mm, "© 2026 Cyril Blum · Kantonsschule Stadelhofen · Filiale Dübendorf")
    c.drawRightString(w-12*mm, 6.5*mm, f"Seite {page_no} / {total}")

def draw_next_steps(c, page_no, total, platform):
    """Draw the shared last page for pupils after their EduZH first login."""
    w, h = A4
    moodle_url = "https://moodle.kst-fdu.ch/course/view.php?id=4"
    wlan_url = "https://ikt.in-form-atik.ch/wlan"

    c.setFillColor(PAPER); c.rect(0, 0, w, h, fill=1, stroke=0)
    c.setFillColor(TEAL); c.rect(0, h-18*mm, w, 18*mm, fill=1, stroke=0)
    c.setFillColor(white); c.setFont("Helvetica-Bold", 10)
    c.drawString(12*mm, h-11*mm, "IKT-Einführung")
    c.setFont("Helvetica", 7); c.drawRightString(w-12*mm, h-11*mm, platform)

    c.setFillColor(INK); c.setFont("Helvetica-Bold", 23)
    c.drawString(12*mm, h-34*mm, "So geht es weiter")
    c.setFillColor(TEAL); c.setFont("Helvetica", 9.5)
    c.drawString(12*mm, h-42*mm, "Wähle den Weg, der zu deiner Abteilung gehört.")

    cards = [
        ("UNTERGYMNASIUM", "Auf dem Schullaptop weitermachen", [
            "1. Melde dich am Schullaptop an.",
            "2. Öffne Microsoft Edge.",
            "3. Öffne den Moodle-Kurs «IKT-Einführung»."
        ], moodle_url, "Moodle öffnen"),
        ("KURZZEITGYMNASIUM / HMS", "Laptop mit dem Schul-WLAN verbinden", [
            "1. Verbinde deinen Laptop mit «KTZH-S».",
            "2. Lies die WLAN-Anleitung auf deinem Handy.",
            "3. Folge dort den Schritten für Windows oder macOS."
        ], wlan_url, "WLAN-Anleitung auf dem Handy öffnen"),
    ]
    card_x, card_w, card_h = 12*mm, w-24*mm, 67*mm
    for index, (label, heading, steps, url, link_text) in enumerate(cards):
        card_y = h - (58 + index*75)*mm - card_h
        c.setFillColor(HexColor("#f1f5e3")); c.roundRect(card_x, card_y, card_w, card_h, 3*mm, fill=1, stroke=0)
        c.setFillColor(GREEN); c.roundRect(card_x+5*mm, card_y+card_h-13*mm, 47*mm, 7*mm, 1.2*mm, fill=1, stroke=0)
        c.setFillColor(white); c.setFont("Helvetica-Bold", 6.4)
        c.drawCentredString(card_x+28.5*mm, card_y+card_h-10.5*mm, label)
        c.setFillColor(INK); c.setFont("Helvetica-Bold", 14)
        c.drawString(card_x+5*mm, card_y+card_h-22*mm, heading)
        c.setFont("Helvetica", 8.8)
        for step_index, step in enumerate(steps):
            c.drawString(card_x+5*mm, card_y+card_h-(31 + step_index*7)*mm, step)
        link_y = card_y + 7*mm
        c.setFillColor(BLUE); c.roundRect(card_x+5*mm, link_y, 85*mm, 10*mm, 1.5*mm, fill=1, stroke=0)
        c.setFillColor(white); c.setFont("Helvetica-Bold", 7.3)
        c.drawString(card_x+9*mm, link_y+3.6*mm, link_text)
        c.linkURL(url, (card_x+5*mm, link_y, card_x+90*mm, link_y+10*mm), relative=0)
        c.setFillColor(TEAL); c.setFont("Helvetica", 6.9)
        c.drawString(card_x+95*mm, link_y+3.6*mm, url.replace("https://", ""))

    draw_footer(c, page_no, total)

def draw_image(c, path, x, y, max_w, max_h):
    with Image.open(path) as im:
        iw, ih = im.size
    scale = min(max_w/iw, max_h/ih)
    dw, dh = iw*scale, ih*scale
    ix = x + (max_w-dw)/2
    iy = y + (max_h-dh)/2
    c.setFillColor(HexColor("#f3f6ea")); c.roundRect(ix+1.5*mm, iy-1.5*mm, dw, dh, 1.5*mm, fill=1, stroke=0)
    c.drawImage(str(path), ix, iy, width=dw, height=dh, preserveAspectRatio=True, mask="auto")

def draw_step(c, step, idx, image_choice, platform, x, y, width, height):
    top = y + height
    c.setFillColor(GREEN); c.roundRect(x, top-8*mm, 24*mm, 6.5*mm, 1.2*mm, fill=1, stroke=0)
    c.setFillColor(white); c.setFont("Helvetica-Bold", 6.5)
    c.drawCentredString(x+12*mm, top-5.8*mm, f"SCHRITT {idx:02d}")
    c.setFillColor(TEAL); c.setFont("Helvetica-Bold", 6.5)
    c.drawString(x+28*mm, top-5.8*mm, step.get("phase", "").upper())

    image_x, image_y = x, y+5*mm
    image_w, image_h = 57*mm, height-17*mm
    image_rel = step.get(image_choice) or step.get("image")
    if image_rel:
        draw_image(c, ROOT / "public" / image_rel.lstrip("/"), image_x, image_y, image_w, image_h)
    else:
        box_h = min(38*mm, image_h)
        box_y = y + height - 17*mm - box_h
        c.setFillColor(HexColor("#eef4e5")); c.roundRect(image_x, box_y, image_w, box_h, 2*mm, fill=1, stroke=0)
        c.setFillColor(TEAL); c.setFont("Helvetica-Bold", 13)
        shortcut = step.get("shortcut") or ("MAC" if platform == "macOS" else "WIN")
        shortcut_p = Paragraph(safe(shortcut), ParagraphStyle("shortcut", fontName="Helvetica-Bold", fontSize=13, leading=15, textColor=TEAL, alignment=TA_LEFT))
        _, shortcut_h = shortcut_p.wrap(image_w-8*mm, box_h-8*mm)
        shortcut_p.drawOn(c, image_x+4*mm, box_y+box_h-5*mm-shortcut_h)

    text_x = x + 64*mm
    text_w = width - 64*mm
    cursor = top - 11*mm
    title_p = Paragraph(safe(step["title"]), TITLE)
    _, title_h = title_p.wrap(text_w, 24*mm)
    title_p.drawOn(c, text_x, cursor-title_h)
    cursor -= title_h + 3*mm

    body_p = Paragraph(safe(step["text"]), BODY)
    _, body_h = body_p.wrap(text_w, 44*mm)
    body_p.drawOn(c, text_x, cursor-body_h)
    cursor -= body_h

    if step.get("tip"):
        tip_p = Paragraph("<b>GUT ZU WISSEN</b><br/>" + safe(step["tip"]), TIP)
        _, tip_h = tip_p.wrap(text_w-7*mm, 45*mm)
        box_h = tip_h + 5*mm
        cursor -= 3*mm
        c.setFillColor(HexColor("#f1f5e3")); c.roundRect(text_x, cursor-box_h, text_w, box_h, 1.5*mm, fill=1, stroke=0)
        c.setFillColor(BLUE); c.rect(text_x, cursor-box_h, 2*mm, box_h, fill=1, stroke=0)
        tip_p.drawOn(c, text_x+5*mm, cursor-box_h+2.5*mm)
        cursor -= box_h

    if step.get("phase") == "Kennwort":
        cursor -= 3*mm
        box_h = 18*mm
        c.setFillColor(HexColor("#f1f5e3")); c.roundRect(text_x, cursor-box_h, text_w, box_h, 1.5*mm, fill=1, stroke=0)
        c.setFillColor(TEAL); c.setFont("Helvetica-Bold", 6.5); c.drawString(text_x+4*mm, cursor-5*mm, "BEISPIEL - BITTE EIN EIGENES KENNWORT VERWENDEN")
        c.setFont("Courier-Bold", 9.5); c.drawString(text_x+4*mm, cursor-11.5*mm, "Wolke!Kanu7Tisch-Lama")

def make_pdf(filename, title, steps, image_choice="image", platform=""):
    OUTPUT.mkdir(parents=True, exist_ok=True); PUBLIC.mkdir(parents=True, exist_ok=True)
    out = OUTPUT / filename
    w, h = A4
    c = canvas.Canvas(str(out), pagesize=(w,h), pageCompression=1)
    document_title = f"{title} - {platform}" if platform else title
    c.setTitle(document_title)
    c.setAuthor("Cyril Blum · Kantonsschule Stadelhofen · Filiale Dübendorf")
    c.setSubject("IKT-Einführung")
    c.setCreator("IKT-Einführung KST FDU")
    step_pages = (len(steps)+1)//2
    total_pages = step_pages + (1 if filename.startswith("eduzh-") else 0)
    for page_idx in range(step_pages):
        c.setFillColor(PAPER); c.rect(0,0,w,h,fill=1,stroke=0)
        c.setFillColor(TEAL); c.rect(0,h-18*mm,w,18*mm,fill=1,stroke=0)
        c.setFillColor(white); c.setFont("Helvetica-Bold",10); c.drawString(12*mm,h-11*mm,title)
        c.setFont("Helvetica",7); c.drawRightString(w-12*mm,h-11*mm,platform)

        row_x, row_w, row_h = 12*mm, w-24*mm, 124*mm
        first = page_idx*2
        draw_step(c, steps[first], first+1, image_choice, platform, row_x, 146*mm, row_w, row_h)
        if first+1 < len(steps):
            c.setStrokeColor(LINE); c.setLineWidth(.7); c.line(row_x, 142*mm, row_x+row_w, 142*mm)
            draw_step(c, steps[first+1], first+2, image_choice, platform, row_x, 16*mm, row_w, row_h)
        draw_footer(c,page_idx+1,total_pages); c.showPage()
    if filename.startswith("eduzh-"):
        draw_next_steps(c, total_pages, total_pages, platform)
        c.showPage()
    c.save()
    shutil.copy2(out, PUBLIC / filename)
    return out

def main():
    made=[]
    made.append(make_pdf("eduzh-iphone.pdf","EduZH-Erstlogin",parse_steps("eduzhIphone"),"image","iPhone"))
    made.append(make_pdf("eduzh-android.pdf","EduZH-Erstlogin",parse_steps("eduzhAndroid"),"image","Android"))
    made.append(make_pdf("wlan-windows.pdf","WLAN mit KTZH-S verbinden",parse_steps("wlanWindows"),platform="Windows"))
    made.append(make_pdf("wlan-macos.pdf","WLAN mit KTZH-S verbinden",parse_steps("wlanMac"),platform="macOS"))
    made.append(make_pdf("microsoft-365.pdf","Teams, Outlook & OneDrive",parse_steps("apps"),platform="BYOD"))
    made.append(make_pdf("window-management-windows.pdf","Window-Management-Challenge",parse_steps("challengeWindows"),platform="Windows"))
    made.append(make_pdf("window-management-macos.pdf","Window-Management-Challenge",parse_steps("challengeMac"),platform="macOS"))
    made.append(make_pdf("shortcut-challenge-windows.pdf","Shortcut-Challenge",parse_steps("shortcutsWindows"),platform="Windows"))
    made.append(make_pdf("shortcut-challenge-macos.pdf","Shortcut-Challenge",parse_steps("shortcutsMac"),platform="macOS"))
    made.append(make_pdf("steckbrief-challenge.pdf","Steckbrief-Challenge",parse_steps("profile"),platform="KG / HMS"))
    print("\n".join(str(p) for p in made))

if __name__ == "__main__": main()
