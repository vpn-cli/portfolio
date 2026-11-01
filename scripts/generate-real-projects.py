from PIL import Image, ImageDraw, ImageFilter, ImageFont
import os

os.makedirs("public/projects", exist_ok=True)

def create_appforge_card():
    # Card C is a wide 4x1 card (e.g. 1400x700)
    w, h = 1400, 700
    base = Image.new("RGB", (w, h), (14, 15, 18))
    draw = ImageDraw.Draw(base)

    # Ambient studio radial gradient
    for r in range(500, 0, -4):
        alpha = int(22 * (1 - r / 500))
        draw.ellipse([w//2 - r*2, h//2 - r, w//2 + r*2, h//2 + r], fill=(14 + alpha, 15 + alpha, 18 + alpha))

    # Patterned table surface at bottom
    for x in range(0, w, 24):
        draw.line([(x, h - 160), (x - 60, h)], fill=(22, 23, 27), width=1)
    draw.line([(0, h - 160), (w, h - 160)], fill=(28, 30, 36), width=2)

    # Load real AppForge AppBuilder screenshot
    appb = Image.open("D:/Projects/appforge/reference/appbuilder.png")
    
    # Laptop mockup chassis
    lw, lh = 920, 520
    lx, ly = (w - lw) // 2, 70
    
    # Laptop drop shadow
    draw.ellipse([lx + 60, ly + lh - 20, lx + lw - 60, ly + lh + 50], fill=(6, 7, 9))

    # Laptop Lid / Bezel
    draw.rounded_rectangle([lx, ly, lx + lw, ly + lh - 30], radius=18, fill=(34, 36, 42), outline=(58, 62, 72), width=2)
    # Camera notch / dot
    draw.ellipse([lx + lw//2 - 4, ly + 6, lx + lw//2 + 4, ly + 14], fill=(18, 19, 22))

    # Inner Screen Area
    sx, sy, sw, sh = lx + 16, ly + 22, lw - 32, lh - 66
    draw.rounded_rectangle([sx, sy, sx + sw, sy + sh], radius=8, fill=(0, 0, 0))

    # Resize AppForge screenshot to fit inner screen
    screen_shot = appb.resize((sw, sh), Image.Resampling.LANCZOS)
    base.paste(screen_shot, (sx, sy))

    # Laptop base / keyboard tray hinge
    draw.rounded_rectangle([lx - 40, ly + lh - 34, lx + lw + 40, ly + lh - 14], radius=10, fill=(44, 46, 54), outline=(62, 66, 76), width=1)
    draw.rounded_rectangle([lx + lw//2 - 60, ly + lh - 34, lx + lw//2 + 60, ly + lh - 26], radius=4, fill=(28, 30, 36))

    base = base.filter(ImageFilter.SMOOTH_MORE)
    base.save("public/projects/appforge.jpg", "JPEG", quality=95)
    print("Saved public/projects/appforge.jpg")

def create_llms_txt_card():
    # Card A is 3x1 (e.g. 1000x1200)
    w, h = 1000, 1200
    base = Image.new("RGB", (w, h), (16, 17, 20))
    draw = ImageDraw.Draw(base)

    # Ambient pedestal & concrete block
    for r in range(400, 0, -3):
        alpha = int(24 * (1 - r / 400))
        draw.ellipse([w//2 - r, h//2 - r, w//2 + r, h//2 + r], fill=(16 + alpha, 17 + alpha, 20 + alpha))

    draw.polygon([(180, 750), (820, 710), (880, 1140), (120, 1180)], fill=(28, 30, 35))
    draw.polygon([(180, 750), (820, 710), (760, 680), (240, 715)], fill=(40, 43, 50))

    # Phone chassis
    px, py, pw, ph = 290, 180, 420, 840
    # Phone shadow
    draw.rounded_rectangle([px + 12, py + 16, px + pw + 12, py + ph + 16], radius=56, fill=(8, 9, 11))
    draw.rounded_rectangle([px, py, px + pw, py + ph], radius=56, fill=(36, 38, 44), outline=(60, 64, 74), width=3)
    draw.rounded_rectangle([px + 12, py + 12, px + pw - 12, py + ph - 12], radius=46, fill=(12, 13, 16))

    # Screen elements
    # Dynamic Island
    draw.rounded_rectangle([px + 130, py + 22, px + pw - 130, py + 48], radius=14, fill=(0, 0, 0))

    # Title & Target
    draw.text((px + 36, py + 80), "LLMS.TXT AUDIT", fill=(130, 134, 148))
    draw.text((px + 36, py + 105), "infrasity.com", fill=(245, 245, 248))

    # Score Card
    draw.rounded_rectangle([px + 30, py + 150, px + pw - 30, py + 280], radius=20, fill=(20, 22, 27), outline=(38, 41, 50))
    draw.text((px + 50, py + 172), "AEO QUALITY SCORE", fill=(120, 125, 138))
    draw.text((px + 50, py + 200), "9.2 / 10", fill=(245, 245, 248))
    draw.text((px + 50, py + 242), "✓ Structurally Sound & Validated", fill=(160, 164, 175))

    # Pipeline Stages
    stages = [
        ("Fetch & Soft-404 Check", "200 OK (Clean)"),
        ("Markdown AST Parse", "Unified / Remark"),
        ("Concurrent Crawler", "10 URLs Checked"),
        ("DOM Text Analysis", "Cheerio Extracted"),
    ]
    for i, (title, val) in enumerate(stages):
        sy = py + 305 + i * 82
        draw.rounded_rectangle([px + 30, sy, px + pw - 30, sy + 68], radius=16, fill=(18, 19, 24), outline=(32, 34, 42))
        draw.text((px + 48, sy + 16), title, fill=(210, 212, 220))
        draw.text((px + 48, sy + 40), val, fill=(120, 124, 136))

    # Bottom status badge
    draw.rounded_rectangle([px + 30, py + ph - 80, px + pw - 30, py + ph - 30], radius=16, fill=(28, 30, 36))
    draw.text((px + 75, py + ph - 62), "100% Machine Consumable", fill=(240, 240, 245))

    base = base.filter(ImageFilter.SMOOTH)
    base.save("public/projects/llms-txt.jpg", "JPEG", quality=95)
    print("Saved public/projects/llms-txt.jpg")

def create_sockets_card():
    # Card B is 2x1 (e.g. 800x1200)
    w, h = 800, 1200
    base = Image.new("RGB", (w, h), (18, 17, 16))
    draw = ImageDraw.Draw(base)

    # Subtle grid background
    for y in range(0, h, 28):
        for x in range(0, w, 28):
            draw.ellipse([x + 6, y + 6, x + 22, y + 22], outline=(40, 37, 34), width=1)
            draw.line([(x, y + 14), (x + 28, y + 14)], fill=(32, 30, 28), width=1)
            draw.line([(x + 14, y), (x + 14, y + 28)], fill=(32, 30, 28), width=1)

    # Phone chassis
    px, py, pw, ph = 210, 200, 380, 800
    draw.rounded_rectangle([px + 10, py + 14, px + pw + 10, py + ph + 14], radius=54, fill=(10, 9, 8))
    draw.rounded_rectangle([px, py, px + pw, py + ph], radius=54, fill=(215, 215, 218), outline=(245, 245, 245), width=3)
    draw.rounded_rectangle([px + 12, py + 12, px + pw - 12, py + ph - 12], radius=44, fill=(250, 250, 252))

    # Dynamic Island
    draw.rounded_rectangle([px + 115, py + 22, px + pw - 115, py + 48], radius=14, fill=(20, 20, 22))

    # Screen Content (Light Mode terminal contrast matching reference style)
    draw.text((px + 34, py + 85), "SOCKET TELEMETRY", fill=(120, 120, 128))
    draw.text((px + 34, py + 112), "ws://localhost:8080", fill=(20, 20, 24))

    # Status Pill Card
    draw.rounded_rectangle([px + 28, py + 160, px + pw - 28, py + 270], radius=18, fill=(240, 241, 245), outline=(220, 222, 228))
    draw.text((px + 46, py + 182), "Active Connections: 1,420", fill=(30, 32, 38))
    draw.text((px + 46, py + 210), "Broadcast Latency: 2.4ms", fill=(40, 42, 48))
    draw.text((px + 46, py + 236), "State: OPEN (ReadyState: 1)", fill=(50, 52, 60))

    # Live Feed Stream
    draw.rounded_rectangle([px + 28, py + 290, px + pw - 28, py + 620], radius=18, fill=(18, 19, 24))
    draw.text((px + 44, py + 312), "> LIVE BROADCAST FEED", fill=(140, 144, 156))
    
    events = [
        "[00:04] Client #120 connected",
        "[00:05] Server Broadcast: ACK",
        "[00:06] Binary Payload: 1.2KB",
        "[00:07] Client #121 connected",
        "[00:08] Heartbeat ping (2ms)",
    ]
    for i, ev in enumerate(events):
        draw.text((px + 44, py + 355 + i * 45), ev, fill=(200, 204, 215))

    # Bottom action button
    draw.rounded_rectangle([px + 28, py + 650, px + pw - 28, py + 710], radius=16, fill=(20, 20, 24))
    draw.text((px + 78, py + 672), "Broadcast Stream Active", fill=(255, 255, 255))

    base = base.filter(ImageFilter.SMOOTH)
    base.save("public/projects/sockets.jpg", "JPEG", quality=95)
    print("Saved public/projects/sockets.jpg")

create_appforge_card()
create_llms_txt_card()
create_sockets_card()

