from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

OUT_PATH = "output/pdf/nanji_japan_app_summary.pdf"


def build_pdf() -> None:
    doc = SimpleDocTemplate(
        OUT_PATH,
        pagesize=LETTER,
        leftMargin=42,
        rightMargin=42,
        topMargin=40,
        bottomMargin=38,
        title="Nanji Japan App Summary",
        author="Codex",
    )

    title_style = ParagraphStyle(
        "Title",
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=21,
        textColor=colors.HexColor("#8B1E1E"),
        spaceAfter=8,
    )
    subtitle_style = ParagraphStyle(
        "Subtitle",
        fontName="Helvetica",
        fontSize=8.7,
        leading=11,
        textColor=colors.HexColor("#4b5563"),
        spaceAfter=10,
    )
    heading_style = ParagraphStyle(
        "Heading",
        fontName="Helvetica-Bold",
        fontSize=10.8,
        leading=13,
        textColor=colors.HexColor("#111827"),
        spaceBefore=4,
        spaceAfter=2,
    )
    body_style = ParagraphStyle(
        "Body",
        fontName="Helvetica",
        fontSize=9.2,
        leading=12,
        textColor=colors.HexColor("#1f2937"),
        spaceAfter=2,
    )

    story = [
        Paragraph("Nanji Japan App Summary", title_style),
        Paragraph(
            "Repo-based summary from README, app/, src/, and package.json only.",
            subtitle_style,
        ),
    ]

    story.append(Paragraph("What it is", heading_style))
    story.append(
        Paragraph(
            "Nanji Japan is an Expo + React Native application that presents a multilingual,"
            " section-based corporate showcase for Nanji Japan Co. Ltd. It focuses on company"
            " profile, services, mission, founder message, and contact details in one long-scroll page.",
            body_style,
        )
    )

    story.append(Paragraph("Who it is for", heading_style))
    story.append(
        Paragraph(
            "Primary persona: Japanese SME and apparel brand decision-makers seeking one-stop"
            " supply-chain support and company information before partnership discussions.",
            body_style,
        )
    )

    story.append(Paragraph("What it does", heading_style))
    story.append(
        Paragraph(
            "- Renders a single-page experience with Hero, About, Services, Handbook, Founder, Contact, and Footer sections.<br/>"
            "- Provides responsive navigation with desktop links plus a mobile menu modal.<br/>"
            "- Supports Chinese, English, and Japanese via i18next locale JSON files.<br/>"
            "- Persists selected language in AsyncStorage (@nanji.lang) and falls back to device locale.<br/>"
            "- Uses animations: hero fade/slide, scroll-linked background motion, section reveal, and interactive service cards.<br/>"
            "- Displays static text and images from local repo assets (no runtime API fetch shown).<br/>"
            "- Includes contact phone/email CTA UI and footer back-to-top action.",
            body_style,
        )
    )

    story.append(Paragraph("How it works (architecture)", heading_style))
    story.append(
        Paragraph(
            "- Entry and routing: expo-router entry -> app/_layout.tsx -> I18nProvider wraps Stack.<br/>"
            "- Page composition: app/index.tsx assembles section components inside an AnimatedScrollView.<br/>"
            "- Navigation data flow: each section reports layout Y offset; Header sends target IDs; scrollTo(y) navigates.<br/>"
            "- Content data flow: useTranslation() reads src/i18n/locales/*.json; sections render local strings and src/assets images.<br/>"
            "- Localization service: src/i18n/i18n.ts initializes i18next with expo-localization; provider syncs language state and AsyncStorage.<br/>"
            "- Backend/API services: Not found in repo.",
            body_style,
        )
    )

    story.append(Paragraph("How to run", heading_style))
    story.append(
        Paragraph(
            "1. Install dependencies: <font name='Courier'>npm i</font><br/>"
            "2. Start web build: <font name='Courier'>npm run web</font><br/>"
            "3. Alternative start path (README): <font name='Courier'>npm run start</font> then choose web.<br/>"
            "4. Required Node.js version and env vars: Not found in repo.",
            body_style,
        )
    )

    story.append(Spacer(1, 2))
    story.append(
        Paragraph(
            "Last verified against repository state on 2026-02-09.",
            subtitle_style,
        )
    )

    doc.build(story)


if __name__ == "__main__":
    build_pdf()
    print(OUT_PATH)
