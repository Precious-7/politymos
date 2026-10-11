import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

output_path = "/Users/user/Desktop/POLITYMOS LTD/assets/Politymos_Price_List_October_2026.pdf"

doc = SimpleDocTemplate(
    output_path,
    pagesize=A4,
    leftMargin=36,
    rightMargin=36,
    topMargin=36,
    bottomMargin=36
)

page_width, page_height = A4
usable_width = page_width - 72 # 523.27 pt

# Color Palette
GOLD = colors.HexColor('#D97706')
GOLD_LIGHT = colors.HexColor('#FEF3C7')
GOLD_DARK = colors.HexColor('#92400E')
DARK_BG = colors.HexColor('#111827')
TEXT_DARK = colors.HexColor('#1F2937')
TEXT_MUTED = colors.HexColor('#4B5563')
BORDER_COLOR = colors.HexColor('#E5E7EB')
LINE_COLOR = colors.HexColor('#D97706')

styles = getSampleStyleSheet()

# Custom Paragraph Styles
style_header_top_left = ParagraphStyle(
    'HeaderTopLeft',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=14,
    leading=16,
    textColor=GOLD_DARK
)

style_header_top_right = ParagraphStyle(
    'HeaderTopRight',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8,
    leading=10,
    alignment=TA_RIGHT,
    textColor=GOLD_DARK
)

style_page_title = ParagraphStyle(
    'PageTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=18,
    leading=22,
    textColor=TEXT_DARK,
    spaceAfter=4
)

style_page_subtitle = ParagraphStyle(
    'PageSubtitle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9,
    leading=12,
    textColor=TEXT_MUTED,
    spaceAfter=12
)

style_section_heading = ParagraphStyle(
    'SectionHeading',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=9,
    leading=11,
    textColor=GOLD_DARK,
    spaceAfter=4
)

style_th_left = ParagraphStyle(
    'THLeft',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=7,
    leading=9,
    textColor=TEXT_MUTED
)

style_th_right = ParagraphStyle(
    'THRight',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=7,
    leading=9,
    alignment=TA_RIGHT,
    textColor=TEXT_MUTED
)

style_td_left = ParagraphStyle(
    'TDLeft',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8,
    leading=10,
    textColor=TEXT_DARK
)

style_td_left_bold = ParagraphStyle(
    'TDLeftBold',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8,
    leading=10,
    textColor=TEXT_DARK
)

style_td_right = ParagraphStyle(
    'TDRight',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8,
    leading=10,
    alignment=TA_RIGHT,
    textColor=TEXT_DARK
)

style_td_sub = ParagraphStyle(
    'TDSub',
    parent=styles['Normal'],
    fontName='Helvetica-Oblique',
    fontSize=7,
    leading=8,
    textColor=TEXT_MUTED
)

style_footer = ParagraphStyle(
    'FooterText',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=7.5,
    leading=10,
    textColor=TEXT_MUTED
)

def make_header(category_name):
    t = Table([
        [Paragraph("<b>POLITYMOS</b>", style_header_top_left), Paragraph(category_name.upper(), style_header_top_right)]
    ], colWidths=[usable_width*0.5, usable_width*0.5])
    t.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'BOTTOM'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    return [
        t,
        HRFlowable(width="100%", thickness=2, color=GOLD, spaceBefore=3, spaceAfter=10)
    ]

def make_2col_table(title, items, is_price_only=False):
    # items = list of tuples: (item_name, wash_iron_price, iron_only_price, subtext)
    # or if is_price_only=True: (item_name, price, subtext)
    story = [Paragraph(title.upper(), style_section_heading)]
    
    if not is_price_only:
        data = [[
            Paragraph("ITEM", style_th_left),
            Paragraph("WASH & IRON", style_th_right),
            Paragraph("IRON ONLY", style_th_right)
        ]]
        col_widths = [usable_width * 0.54, usable_width * 0.23, usable_width * 0.23]
        
        for item in items:
            name, wash, iron = item[0], item[1], item[2]
            sub = item[3] if len(item) > 3 else None
            
            p_name = Paragraph(f"{name}<br/><font size=6.5 color='#6B7280'><i>{sub}</i></font>" if sub else name, style_td_left)
            p_wash = Paragraph(wash, style_td_right)
            p_iron = Paragraph(iron, style_td_right)
            data.append([p_name, p_wash, p_iron])
            
    else:
        data = [[
            Paragraph("ITEM", style_th_left),
            Paragraph("PRICE", style_th_right)
        ]]
        col_widths = [usable_width * 0.7, usable_width * 0.3]
        
        for item in items:
            name, price = item[0], item[1]
            sub = item[2] if len(item) > 2 else None
            
            p_name = Paragraph(f"{name}<br/><font size=6.5 color='#6B7280'><i>{sub}</i></font>" if sub else name, style_td_left)
            p_price = Paragraph(price, style_td_right)
            data.append([p_name, p_price])
            
    t = Table(data, colWidths=col_widths)
    ts = [
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 2),
        ('RIGHTPADDING', (0,0), (-1,-1), 2),
        ('LINEBELOW', (0,0), (-1,0), 0.5, GOLD_DARK),
        ('LINEBELOW', (0,1), (-1,-1), 0.3, BORDER_COLOR),
    ]
    t.setStyle(TableStyle(ts))
    story.append(t)
    story.append(Spacer(1, 8))
    return story

story = []

# ==================== PAGE 1 ====================
story.extend(make_header("BASE PRICE LIST · OCTOBER 2026"))
story.append(Paragraph("Laundry, ironing and dry cleaning", style_page_title))
story.append(Paragraph("Reliable pickup and delivery across Lagos. Listed prices are starting base rates. We count, inspect and confirm every item with you before anything is washed, so the price you agree is the price you pay.", style_page_subtitle))

# Split page 1 into 2 columns layout using Table
p1_col1 = []
p1_col1.extend(make_2col_table("EVERYDAY WEAR", [
    ("Shirt or polo", "1,000", "500"),
    ("T-shirt / round neck", "1,000", "500"),
    ("Sweatshirt", "1,000", "500"),
    ("Singlet", "800", "400"),
    ("Trouser or chinos", "1,000", "500"),
    ("Shorts", "700", "350"),
    ("Dress", "800", "400"),
    ("Long gown", "800", "400"),
    ("Two-piece, female", "1,500", "750"),
    ("Shirt & trouser set", "1,500", "750"),
    ("Leggings", "800", "400"),
    ("Beaded or embellished", "2,000", "1,000", "Hand-finished"),
    ("Face cap", "500", "-"),
    ("Linen garment", "1,000", "500"),
]))
p1_col1.extend(make_2col_table("OUTERWEAR", [
    ("Hoodie", "1,200", "600"),
    ("Jacket", "1,200", "600"),
    ("Sweater / warm clothing", "800", "400"),
]))

p1_col2 = []
p1_col2.extend(make_2col_table("BEDDING AND HOME", [
    ("Bedsheet", "1,000", "500"),
    ("Pillowcase", "300", "150"),
    ("Bed cover", "1,500", "750"),
    ("Bed cover, thick", "2,500", "1,250"),
    ("Duvet", "5,000", "-"),
    ("White bedding, thick", "3,000", "1,500"),
    ("White bedding, very thick", "3,500", "1,750"),
    ("Towel", "1,500", "-"),
    ("Table cloth", "1,200", "600"),
    ("Curtain, per panel", "5,000", "2,500"),
    ("Curtain, linen", "2,000", "1,000"),
    ("Centre rug", "8,000", "-"),
]))
p1_col2.extend(make_2col_table("BAGS AND BOXES", [
    ("Big bag, wash", "3,000"),
    ("Travelling box, wash", "5,000"),
    ("Laptop bag or backpack", "1,000"),
    ("Politymos laundry bag, to buy", "35,000", "Reusable, holds a full household load. Yours to keep, not a wash charge."),
], is_price_only=True))

table_p1 = Table([[p1_col1, p1_col2]], colWidths=[usable_width*0.485, usable_width*0.485])
table_p1.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('BOTTOMPADDING', (0,0), (-1,-1), 0),
]))
story.append(table_p1)
story.append(Spacer(1, 10))
story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceBefore=4, spaceAfter=6))
story.append(Paragraph("All prices in naira and valid from October 2026. Prices shown are starting base rates; final charges may vary based on item size, fabric delicacy, embellishments, or special care required. Items are confirmed prior to service.", style_footer))

story.append(PageBreak())

# ==================== PAGE 2 ====================
story.extend(make_header("GYM, SHOES AND NATIVE WEAR"))

p2_col1 = []
p2_col1.extend(make_2col_table("GYM AND ACTIVEWEAR", [
    ("Gym top or dri-fit", "1,000"),
    ("Gym shorts", "800"),
    ("Leggings or compression wear", "1,000"),
    ("Sports bra", "700"),
    ("Gym towel", "800"),
    ("Socks, per pair", "300"),
    ("Full session kit", "1,500", "Top, bottom, towel and socks. Normally 2,900."),
], is_price_only=True))

# Note box for gym activewear
note_gym = Paragraph("<i>Cold wash, enzyme treatment for odour at the fibre, no fabric softener and no high heat, so the moisture-wicking survives. Monthly plans for coaches and studios on request.</i>", ParagraphStyle('NoteGym', parent=styles['Normal'], fontSize=6.5, leading=8.5, textColor=TEXT_MUTED))
p2_col1.append(note_gym)
p2_col1.append(Spacer(1, 10))

p2_col1.extend(make_2col_table("SNEAKERS AND SHOES", [
    ("Slides or sandals", "1,500"),
    ("Canvas shoes", "2,000"),
    ("Sneakers, standard clean", "2,500", "Uppers, laces, midsole"),
    ("Leather shoes, clean and polish", "3,000"),
    ("Sneakers, deep clean", "4,000", "Insoles, outsole, deodorised"),
    ("Suede or nubuck", "4,500"),
    ("Boots", "4,500"),
    ("Sole whitening, add-on", "1,500"),
], is_price_only=True))

p2_col2 = []
p2_col2.extend(make_2col_table("NATIVE AND TRADITIONAL", [
    ("Iro and buba", "1,600"),
    ("Bubu gown", "800"),
    ("Adire, per piece", "1,600"),
    ("Aso oke, single", "1,500"),
    ("Aso oke, two in a set", "1,500"),
    ("Native wear, men", "2,000"),
    ("Native wear, men, white", "2,500"),
    ("Complete agbada, white", "3,500"),
    ("Native wear, men, white, express", "5,000", "Ready in 24 hours"),
], is_price_only=True))

p2_col2.extend(make_2col_table("ADD-ONS", [
    ("Express, ready in 24 hours", "+50%"),
    ("Ironing only, no wash", "Half price"),
    ("Stain treatment, per garment", "500"),
    ("Home upholstery dry cleaning", "Discussed", "One 3-seater sofa, one 2-seater sofa, one single seater and 13 pillows. Price discussed after a site visit."),
], is_price_only=True))

table_p2 = Table([[p2_col1, p2_col2]], colWidths=[usable_width*0.485, usable_width*0.485])
table_p2.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('BOTTOMPADDING', (0,0), (-1,-1), 0),
]))
story.append(table_p2)

story.append(PageBreak())

# ==================== PAGE 3 ====================
story.extend(make_header("BUNDLES AND DELIVERY"))
story.append(Paragraph("Bulk bundles", style_page_title))
story.append(Paragraph("₦800 a piece for everyday clothing, whatever the item, from 20 pieces up. A shirt is ₦1,000 on its own and ₦800 in a bulk load. Pieces do not have to belong to one person, so flatmates and colleagues can combine a load.", style_page_subtitle))

# Callout Box
callout_p = Paragraph("<b>Not included in bulk:</b> gowns, suits, beaded or embellished wear, duvets and curtains. These are charged at their individual prices above.", ParagraphStyle('Callout', parent=styles['Normal'], fontSize=8, leading=11, textColor=GOLD_DARK))
callout_box = Table([[callout_p]], colWidths=[usable_width])
callout_box.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), GOLD_LIGHT),
    ('BOX', (0,0), (-1,-1), 1, GOLD),
    ('TOPPADDING', (0,0), (-1,-1), 8),
    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ('LEFTPADDING', (0,0), (-1,-1), 10),
    ('RIGHTPADDING', (0,0), (-1,-1), 10),
]))
story.append(callout_box)
story.append(Spacer(1, 10))

# Bulk Bundles Table
bulk_data = [
    [Paragraph("PIECES", style_th_left), Paragraph("PER PIECE", style_th_right), Paragraph("YOU PAY", style_th_right)],
    [Paragraph("20 pieces<br/><font size=6.5 color='#6B7280'><i>Minimum for the bulk rate</i></font>", style_td_left), Paragraph("800", style_td_right), Paragraph("16,000", style_td_right)],
    [Paragraph("30 pieces", style_td_left), Paragraph("800", style_td_right), Paragraph("24,000", style_td_right)],
    [Paragraph("40 pieces", style_td_left), Paragraph("800", style_td_right), Paragraph("32,000", style_td_right)],
    [Paragraph("50 pieces", style_td_left), Paragraph("800", style_td_right), Paragraph("40,000", style_td_right)],
    [Paragraph("100 pieces", style_td_left), Paragraph("800", style_td_right), Paragraph("80,000", style_td_right)],
]
t_bulk = Table(bulk_data, colWidths=[usable_width*0.5, usable_width*0.25, usable_width*0.25])
t_bulk.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('LEFTPADDING', (0,0), (-1,-1), 4),
    ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ('LINEBELOW', (0,0), (-1,0), 0.5, GOLD_DARK),
    ('LINEBELOW', (0,1), (-1,-1), 0.3, BORDER_COLOR),
]))
story.append(t_bulk)
story.append(Spacer(1, 16))

# Pickup and Delivery
story.append(Paragraph("Pickup and delivery", style_page_title))
story.append(Paragraph("Measured from our base in Sabo, Yaba. Every price covers both legs: we collect from you and bring it back. Collections run on fixed days per zone.", style_page_subtitle))

delivery_data = [
    [Paragraph("ZONE", style_th_left), Paragraph("AREAS", style_th_left), Paragraph("ROUND TRIP", style_th_right)],
    [Paragraph("Zone 1<br/><font size=6.5 color='#6B7280'>Under 5km</font>", style_td_left_bold), Paragraph("Yaba, Sabo, Akoka, Ebute Metta, Onike, Iwaya, Jibowu, Alagomeji, Fadeyi", style_td_left), Paragraph("3,000", style_td_right)],
    [Paragraph("Zone 2<br/><font size=6.5 color='#6B7280'>5 to 12km</font>", style_td_left_bold), Paragraph("Surulere, Shomolu, Bariga, Gbagada, Maryland, Palmgrove, Anthony, Lagos Island", style_td_left), Paragraph("4,500", style_td_right)],
    [Paragraph("Zone 3<br/><font size=6.5 color='#6B7280'>12 to 18km</font>", style_td_left_bold), Paragraph("Ikeja, Ikoyi, Victoria Island, Ogudu, Ketu, Oshodi, Apapa, Mushin", style_td_left), Paragraph("7,000", style_td_right)],
    [Paragraph("Zone 4<br/><font size=6.5 color='#6B7280'>Over 18km</font>", style_td_left_bold), Paragraph("Lekki Phase 1, Ajah, Sangotedo, Festac, Egbeda, Ikotun, Agege, Ikorodu", style_td_left), Paragraph("10,000", style_td_right)],
    [Paragraph("Drop off yourself<br/><font size=6.5 color='#6B7280'>4 Oyekan Street, Sabo</font>", style_td_left_bold), Paragraph("Bring it in and collect when ready. No minimum, no fee.", style_td_left), Paragraph("Free", style_td_right)],
]
t_delivery = Table(delivery_data, colWidths=[usable_width*0.2, usable_width*0.6, usable_width*0.2])
t_delivery.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 4),
    ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ('LINEBELOW', (0,0), (-1,0), 0.5, GOLD_DARK),
    ('LINEBELOW', (0,1), (-1,-1), 0.3, BORDER_COLOR),
]))
story.append(t_delivery)
story.append(Spacer(1, 10))
story.append(Paragraph("<i>For a small order, dropping off at the shop is almost always cheaper than paying for the round trip.</i>", ParagraphStyle('DelNote', parent=styles['Normal'], fontSize=7.5, leading=9.5, textColor=TEXT_MUTED)))

story.append(PageBreak())

# ==================== PAGE 4 ====================
story.extend(make_header("HOW IT WORKS, AND OFFERS"))
story.append(Paragraph("How it works", style_page_title))

steps = [
    ("1", "Book.", "Message us on WhatsApp or go to politymos.com, and tell us your area."),
    ("2", "We collect.", "We pick up from your address, or you drop off at the shop for free."),
    ("3", "We count and confirm.", "We send you the item list and the price before anything is washed."),
    ("4", "We return.", "Within 48 to 72 hours as standard, or 24 hours on express."),
    ("5", "You pay on delivery,", "by transfer or cash.")
]

step_rows = []
for num, btitle, desc in steps:
    p_num = Paragraph(f"<b>{num}</b>", ParagraphStyle('StepNum', parent=styles['Normal'], fontSize=9, leading=11, alignment=TA_CENTER, textColor=colors.white))
    t_num = Table([[p_num]], colWidths=[18], rowHeights=[18])
    t_num.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), GOLD),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    
    p_text = Paragraph(f"<b>{btitle}</b> {desc}", ParagraphStyle('StepText', parent=styles['Normal'], fontSize=9, leading=12, textColor=TEXT_DARK))
    step_rows.append([t_num, p_text])

t_steps = Table(step_rows, colWidths=[24, usable_width - 24])
t_steps.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
]))
story.append(t_steps)
story.append(Spacer(1, 14))

# Offers
story.append(Paragraph("New customer offers", style_page_title))
offer1 = Paragraph("<b>20% off your first order</b><br/><font size=8 color='#4B5563'>No minimum, no code required. Applies once per customer.</font>", ParagraphStyle('Off1', parent=styles['Normal'], fontSize=11, leading=14, textColor=GOLD_DARK))
offer2 = Paragraph("<b>Try us for ₦5,000</b><br/><font size=8 color='#4B5563'>Ten everyday pieces washed, ironed and delivered within 48 to 72 hours. Normally ₦8,500. One per household.</font>", ParagraphStyle('Off2', parent=styles['Normal'], fontSize=11, leading=14, textColor=GOLD_DARK))

box1 = Table([[offer1]], colWidths=[usable_width*0.48])
box1.setStyle(TableStyle([
    ('BOX', (0,0), (-1,-1), 1, GOLD),
    ('BACKGROUND', (0,0), (-1,-1), GOLD_LIGHT),
    ('TOPPADDING', (0,0), (-1,-1), 10),
    ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ('LEFTPADDING', (0,0), (-1,-1), 10),
    ('RIGHTPADDING', (0,0), (-1,-1), 10),
]))

box2 = Table([[offer2]], colWidths=[usable_width*0.48])
box2.setStyle(TableStyle([
    ('BOX', (0,0), (-1,-1), 1, GOLD),
    ('BACKGROUND', (0,0), (-1,-1), GOLD_LIGHT),
    ('TOPPADDING', (0,0), (-1,-1), 10),
    ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ('LEFTPADDING', (0,0), (-1,-1), 10),
    ('RIGHTPADDING', (0,0), (-1,-1), 10),
]))

t_offers = Table([[box1, box2]], colWidths=[usable_width*0.495, usable_width*0.495])
t_offers.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
]))
story.append(t_offers)
story.append(Spacer(1, 16))

# CTA Banner Box
cta_left = Paragraph("<b>Book your first pickup today</b><br/><font size=8 color='#E5E7EB'>Message us on WhatsApp with your area and we will tell you the next collection day.</font>", ParagraphStyle('CtaL', parent=styles['Normal'], fontSize=13, leading=16, textColor=colors.white))
cta_right = Paragraph("<font size=13 color='#FBBF24'><b>0816 081 4084</b></font><br/><font size=8 color='#D1D5DB'>politymos.com</font>", ParagraphStyle('CtaR', parent=styles['Normal'], alignment=TA_RIGHT))

t_cta = Table([[cta_left, cta_right]], colWidths=[usable_width*0.65, usable_width*0.35])
t_cta.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), DARK_BG),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 12),
    ('BOTTOMPADDING', (0,0), (-1,-1), 12),
    ('LEFTPADDING', (0,0), (-1,-1), 12),
    ('RIGHTPADDING', (0,0), (-1,-1), 12),
]))
story.append(t_cta)
story.append(Spacer(1, 16))

# Page 4 Footer
foot_left = Paragraph("<b>4 Oyekan Street, Sabo, Yaba, Lagos</b><br/>politymos@gmail.com · politymos.com", ParagraphStyle('F4L', parent=styles['Normal'], fontSize=8, leading=10, textColor=TEXT_DARK))
foot_right = Paragraph("Prices valid from October 2026 and<br/>reviewed quarterly. Items counted and<br/>confirmed at pickup.", ParagraphStyle('F4R', parent=styles['Normal'], fontSize=7.5, leading=9.5, alignment=TA_RIGHT, textColor=TEXT_MUTED))

t_foot4 = Table([[foot_left, foot_right]], colWidths=[usable_width*0.6, usable_width*0.4])
t_foot4.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
]))
story.append(t_foot4)

doc.build(story)
print(f"Successfully generated {output_path}")
