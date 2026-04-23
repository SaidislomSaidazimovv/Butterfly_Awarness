"""
Generate Spanish translation deliverables from src/i18n/locales/{en,es}.json.
Outputs to deliverables/:
  - butterfly-challenge-spanish.docx   (side-by-side EN / ES by section)
  - butterfly-challenge-spanish.xlsx   (Section / Key / English / Spanish grid)
"""
import json
import os
from pathlib import Path

from docx import Document
from docx.shared import Pt, RGBColor, Inches, Cm
from docx.enum.table import WD_ALIGN_VERTICAL
from docx.enum.text import WD_ALIGN_PARAGRAPH

from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

ROOT = Path(__file__).resolve().parents[1]
EN = json.loads((ROOT / "src/i18n/locales/en.json").read_text(encoding="utf-8"))
ES = json.loads((ROOT / "src/i18n/locales/es.json").read_text(encoding="utf-8"))
OUT = ROOT / "deliverables"
OUT.mkdir(exist_ok=True)

# Human-readable labels per top-level key
SECTION_TITLES = {
    "nav": "Navigation Bar",
    "home": "Home Page",
    "live": "Live Feed (Home & Live Page)",
    "footer": "Footer",
    "language": "Language Switcher",
    "faq": "FAQ",
    "highlights": "Highlights Carousel",
    "stepTabs": "How It Works — Step Tabs",
    "signBuilder": "Sign Builder Tutorial",
    "chain": "Butterfly Effect Chain",
    "popups": "Popups & Modals",
    "countdown": "Countdown Timer",
    "joinC": "Join the Challenge — Popup",
    "reminderC": "Reminder Popup",
    "support": "Get Support Panel",
    "visualTimeline": "Visual Timeline (Story Page)",
    "shareC": "Share Sheet",
    "livePage": "Live Page",
    "story": "Story Page",
    "science": "Science Page",
    "alliancePage": "Alliance Page",
    "workingProgress": "Working Progress Holding Page",
    "toast": "Toast Messages",
}


def flatten(obj, prefix=""):
    """Walk the nested JSON and yield (key_path, value) pairs for every leaf string."""
    if isinstance(obj, dict):
        for k, v in obj.items():
            child = f"{prefix}.{k}" if prefix else k
            yield from flatten(v, child)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from flatten(v, f"{prefix}[{i}]")
    else:
        yield (prefix, obj)


def rows_for_section(section_key):
    en_sec = EN.get(section_key, {})
    es_sec = ES.get(section_key, {})
    en_flat = dict(flatten(en_sec))
    es_flat = dict(flatten(es_sec))
    keys = list(en_flat.keys())
    out = []
    for k in keys:
        out.append((k, str(en_flat[k]), str(es_flat.get(k, ""))))
    return out


# ---------- Word (.docx) ----------
def build_docx():
    doc = Document()
    # Narrower margins for more horizontal room
    for section in doc.sections:
        section.left_margin = Cm(1.6)
        section.right_margin = Cm(1.6)
        section.top_margin = Cm(1.8)
        section.bottom_margin = Cm(1.8)

    # Title
    title = doc.add_heading("Butterfly Challenge — Spanish Translation", level=0)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    subtitle = doc.add_paragraph()
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = subtitle.add_run("Side-by-side English / Español, organised by page section")
    run.italic = True
    run.font.size = Pt(11)
    run.font.color.rgb = RGBColor(0x6E, 0x6E, 0x73)
    doc.add_paragraph()

    for section_key, section_title in SECTION_TITLES.items():
        rows = rows_for_section(section_key)
        if not rows:
            continue
        doc.add_heading(section_title, level=1)

        table = doc.add_table(rows=1, cols=2)
        table.style = "Light Grid Accent 1"
        # Header
        hdr = table.rows[0].cells
        hdr[0].text = "English"
        hdr[1].text = "Español"
        for cell in hdr:
            for p in cell.paragraphs:
                for run in p.runs:
                    run.font.bold = True
                    run.font.size = Pt(11)

        for key, en_text, es_text in rows:
            row = table.add_row().cells
            row[0].text = en_text
            row[1].text = es_text
            for cell in row:
                cell.vertical_alignment = WD_ALIGN_VERTICAL.TOP
                for p in cell.paragraphs:
                    for run in p.runs:
                        run.font.size = Pt(10.5)

        # Equal column widths
        for col in table.columns:
            for cell in col.cells:
                cell.width = Inches(3.2)

        doc.add_paragraph()

    path = OUT / "butterfly-challenge-spanish.docx"
    doc.save(path)
    return path


# ---------- Excel (.xlsx) ----------
def build_xlsx():
    wb = Workbook()
    ws = wb.active
    ws.title = "Translations"

    header_fill = PatternFill("solid", fgColor="0A7B77")
    header_font = Font(bold=True, color="FFFFFF", size=11)
    thin = Side(border_style="thin", color="E5E5EA")
    border = Border(left=thin, right=thin, top=thin, bottom=thin)
    wrap = Alignment(wrap_text=True, vertical="top", horizontal="left")

    headers = ["Section", "Key", "English", "Español", "Status", "Notes"]
    for col, h in enumerate(headers, start=1):
        c = ws.cell(row=1, column=col, value=h)
        c.fill = header_fill
        c.font = header_font
        c.alignment = Alignment(horizontal="left", vertical="center")
        c.border = border

    row = 2
    for section_key, section_title in SECTION_TITLES.items():
        for key, en_text, es_text in rows_for_section(section_key):
            ws.cell(row=row, column=1, value=section_title)
            ws.cell(row=row, column=2, value=key)
            ws.cell(row=row, column=3, value=en_text)
            ws.cell(row=row, column=4, value=es_text)
            ws.cell(row=row, column=5, value="")
            ws.cell(row=row, column=6, value="")
            for col in range(1, 7):
                c = ws.cell(row=row, column=col)
                c.alignment = wrap
                c.border = border
            row += 1

    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:F{row - 1}"
    widths = {1: 32, 2: 34, 3: 60, 4: 60, 5: 14, 6: 28}
    for col, w in widths.items():
        ws.column_dimensions[get_column_letter(col)].width = w

    path = OUT / "butterfly-challenge-spanish.xlsx"
    wb.save(path)
    return path


if __name__ == "__main__":
    docx_path = build_docx()
    xlsx_path = build_xlsx()
    print(f"Wrote {docx_path}  ({os.path.getsize(docx_path)//1024} KB)")
    print(f"Wrote {xlsx_path}  ({os.path.getsize(xlsx_path)//1024} KB)")
