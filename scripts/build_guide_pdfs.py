#!/usr/bin/env python3
import html
import re
import shutil
from pathlib import Path

from PIL import Image
from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import Paragraph
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "app" / "page.tsx"
OUTPUT = ROOT / "output" / "pdf"
PUBLIC = ROOT / "public" / "pdfs"
PAPER = HexColor("#fffef8")
INK = HexColor("#132624")
TEAL = HexColor("#217c6f")
GREEN = HexColor("#a2b444")
BLUE = HexColor("#00adef")
PALE = HexColor("#e0e7bc")

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

BODY = ParagraphStyle("body", fontName="Helvetica", fontSize=12, leading=18, textColor=INK, alignment=TA_LEFT)
TIP = ParagraphStyle("tip", fontName="Helvetica", fontSize=9.5, leading=14, textColor=INK)

def draw_footer(c, page_no, total):
    w, _ = landscape(A4)
    c.setFillColor(GREEN); c.rect(0, 0, w, 12*mm, fill=1, stroke=0)
    c.setFillColor(white); c.setFont("Helvetica-Bold", 7.5)
    c.drawString(14*mm, 4.5*mm, "© 2026 Cyril Blum · Kantonsschule Stadelhofen · Filiale Dübendorf")
    c.drawRightString(w-14*mm, 4.5*mm, f"{page_no} / {total}")

def draw_image(c, path, x, y, max_w, max_h):
    with Image.open(path) as im:
        iw, ih = im.size
    scale = min(max_w/iw, max_h/ih)
    dw, dh = iw*scale, ih*scale
    c.setFillColor(PALE); c.rect(x+3*mm, y-3*mm, dw, dh, fill=1, stroke=0)
    c.drawImage(str(path), x, y, width=dw, height=dh, preserveAspectRatio=True, mask="auto")

def make_pdf(filename, title, steps, image_choice="image", platform=""):
    OUTPUT.mkdir(parents=True, exist_ok=True); PUBLIC.mkdir(parents=True, exist_ok=True)
    out = OUTPUT / filename
    w, h = landscape(A4)
    c = canvas.Canvas(str(out), pagesize=(w,h), pageCompression=1)
    total = len(steps)
    for idx, step in enumerate(steps, 1):
        c.setFillColor(PAPER); c.rect(0,0,w,h,fill=1,stroke=0)
        c.setFillColor(TEAL); c.rect(0,h-22*mm,w,22*mm,fill=1,stroke=0)
        c.setFillColor(white); c.setFont("Helvetica-Bold",10); c.drawString(14*mm,h-9*mm,title)
        c.setFont("Helvetica",8); c.drawRightString(w-14*mm,h-9*mm,platform)
        c.setFillColor(GREEN); c.rect(14*mm,h-31*mm,27*mm,8*mm,fill=1,stroke=0)
        c.setFillColor(white); c.setFont("Helvetica-Bold",8); c.drawCentredString(27.5*mm,h-28.2*mm,f"SCHRITT {idx:02d}")
        c.setFillColor(BLUE); c.rect(44*mm,h-27.8*mm,10*mm,1.6*mm,fill=1,stroke=0)
        c.setFillColor(TEAL); c.setFont("Helvetica-Bold",8); c.drawString(58*mm,h-28.5*mm,step.get("phase","").upper())
        left_x, left_y, left_w, left_h = 14*mm, 23*mm, 116*mm, 142*mm
        image_rel = step.get(image_choice) or step.get("image")
        if image_rel:
            draw_image(c, ROOT / "public" / image_rel.lstrip("/"), left_x, left_y, left_w, left_h)
        else:
            c.setFillColor(TEAL); c.roundRect(left_x,left_y,left_w,left_h,4*mm,fill=1,stroke=0)
            shortcut = safe(step.get("shortcut") or ("MAC" if platform=="macOS" else "WIN"))
            shortcut_p = Paragraph(shortcut, ParagraphStyle("shortcut",fontName="Helvetica-Bold",fontSize=25,leading=30,textColor=PALE))
            _, sh = shortcut_p.wrap(92*mm,75*mm); shortcut_p.drawOn(c,left_x+12*mm,left_y+72*mm-sh/2)
            c.setFillColor(white); c.setFont("Helvetica-Bold",10)
            card_label = "WLAN · SMARTPHONE" if title.startswith("WLAN") else ("VORAUSSETZUNG · KG / HMS" if platform == "BYOD" else ("STECKBRIEF · KURZPROFIL" if title.startswith("Steckbrief") else ("SHORTCUT TRAINING" if title.startswith("Shortcut") else "WINDOW MANAGEMENT · KG / HMS")))
            c.drawString(left_x+12*mm,left_y+16*mm,card_label)
        rx = 143*mm
        title_p = Paragraph(safe(step["title"]), ParagraphStyle("title",fontName="Helvetica-Bold",fontSize=25,leading=27,textColor=INK))
        _, th = title_p.wrap(136*mm,55*mm); title_p.drawOn(c,rx,h-46*mm-th)
        body_p = Paragraph(safe(step["text"]), BODY); _, bh = body_p.wrap(136*mm,75*mm); body_p.drawOn(c,rx,h-57*mm-th-bh)
        if step.get("tip"):
            box_y = h-72*mm-th-bh
            c.setFillColor(PALE); c.rect(rx,box_y-25*mm,136*mm,25*mm,fill=1,stroke=0)
            c.setFillColor(BLUE); c.rect(rx,box_y-25*mm,3*mm,25*mm,fill=1,stroke=0)
            tip = Paragraph("<b>GUT ZU WISSEN</b><br/>"+safe(step["tip"]),TIP); tip.wrapOn(c,126*mm,20*mm); tip.drawOn(c,rx+7*mm,box_y-20*mm)
        if step.get("phase")=="Kennwort":
            py=42*mm; c.setFillColor(PALE); c.roundRect(rx,py,136*mm,32*mm,3*mm,fill=1,stroke=0)
            c.setFillColor(TEAL); c.setFont("Helvetica-Bold",9); c.drawString(rx+7*mm,py+22*mm,"KONKRETES BEISPIEL")
            c.setFont("Courier-Bold",14); c.drawString(rx+7*mm,py+12*mm,"Wolke!Kanu7Tisch-Lama")
            c.setFont("Helvetica",7.5); c.drawString(rx+7*mm,py+5*mm,"Bitte erfinden Sie ein eigenes Kennwort und verwenden Sie es nur für dieses Konto.")
        draw_footer(c,idx,total); c.showPage()
    c.save()
    shutil.copy2(out, PUBLIC / filename)
    return out

def main():
    made=[]
    made.append(make_pdf("eduzh-iphone.pdf","EduZH-Erstlogin",parse_steps("eduzh"),"image","iPhone"))
    made.append(make_pdf("eduzh-android.pdf","EduZH-Erstlogin",parse_steps("eduzh"),"altImage","Android"))
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
