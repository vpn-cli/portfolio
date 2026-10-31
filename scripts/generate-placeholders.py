from PIL import Image, ImageDraw, ImageFilter
import math

def create_avatar():
    img = Image.new("RGB", (800, 800), (22, 24, 28))
    draw = ImageDraw.Draw(img)
    # Background subtle radial gradient
    for r in range(400, 0, -2):
        alpha = int(45 * (1 - r / 400))
        color = (22 + alpha, 24 + alpha, 28 + alpha)
        draw.ellipse([400 - r, 400 - r, 400 + r, 400 + r], fill=color)
    
    # Mountain/outdoor horizon silhouette
    draw.polygon([(0, 520), (220, 440), (450, 480), (800, 410), (800, 800), (0, 800)], fill=(16, 18, 22))
    draw.polygon([(0, 560), (300, 490), (600, 540), (800, 480), (800, 800), (0, 800)], fill=(12, 13, 16))

    # Outdoor portrait figure
    # Jacket
    draw.polygon([(260, 500), (400, 460), (540, 500), (640, 800), (160, 800)], fill=(38, 54, 76))
    draw.polygon([(340, 480), (400, 550), (460, 480)], fill=(20, 26, 36))
    # Head & face
    draw.ellipse([340, 310, 460, 450], fill=(210, 185, 165))
    # Hair
    draw.ellipse([335, 290, 465, 380], fill=(42, 38, 34))
    # Subtle eyes and smile
    draw.ellipse([370, 370, 382, 380], fill=(42, 38, 34))
    draw.ellipse([418, 370, 430, 380], fill=(42, 38, 34))
    draw.arc([385, 395, 415, 415], start=0, end=180, fill=(120, 80, 65), width=3)
    
    img = img.filter(ImageFilter.SMOOTH)
    img.save("public/avatar.jpg", "JPEG", quality=95)
    print("Saved public/avatar.jpg")

def create_project_a():
    # Vertical dark phone on stone (aspect ratio ~3:4, e.g. 900x1200)
    w, h = 900, 1200
    img = Image.new("RGB", (w, h), (18, 19, 22))
    draw = ImageDraw.Draw(img)
    
    # Concrete block pedestal
    draw.polygon([(180, 720), (720, 660), (780, 1080), (120, 1140)], fill=(32, 34, 38))
    draw.polygon([(180, 720), (720, 660), (660, 630), (240, 675)], fill=(48, 50, 56))

    # Phone chassis
    px, py, pw, ph = 300, 260, 320, 640
    draw.rounded_rectangle([px, py, px + pw, py + ph], radius=54, fill=(40, 42, 48), outline=(65, 68, 76), width=3)
    draw.rounded_rectangle([px + 14, py + 14, px + pw - 14, py + ph - 14], radius=44, fill=(11, 12, 14))

    # Screen UI
    draw.rounded_rectangle([px + 95, py + 26, px + pw - 95, py + 50], radius=12, fill=(0, 0, 0)) # Dynamic Island
    draw.text((px + 36, py + 90), "TOTAL BALANCE", fill=(120, 124, 136))
    draw.text((px + 36, py + 120), "$24,850.00", fill=(240, 240, 242))

    # Dark Card
    draw.rounded_rectangle([px + 30, py + 170, px + pw - 30, py + 290], radius=20, fill=(24, 25, 30), outline=(40, 42, 50))
    for i in range(7):
        bh = 30 + (i * 17) % 55
        draw.rounded_rectangle([px + 50 + i * 32, py + 270 - bh, px + 70 + i * 32, py + 270], radius=4, fill=(80, 84, 96) if i != 4 else (220, 220, 225))

    # Transactions
    for i, title in enumerate(["Cloud Cluster", "Design Asset", "Stripe Transfer"]):
        ty = py + 320 + i * 65
        draw.rounded_rectangle([px + 30, ty, px + pw - 30, ty + 50], radius=14, fill=(20, 21, 25))
        draw.text((px + 50, ty + 16), title, fill=(180, 182, 190))
        draw.text((px + pw - 100, ty + 16), "-$42.00" if i != 2 else "+$3,200", fill=(240, 240, 240))

    img = img.filter(ImageFilter.SMOOTH)
    img.save("public/projects/project-a.jpg", "JPEG", quality=95)
    print("Saved public/projects/project-a.jpg")

def create_project_b():
    # Vertical light phone on rattan/wicker chair
    w, h = 800, 1200
    img = Image.new("RGB", (w, h), (26, 23, 20))
    draw = ImageDraw.Draw(img)

    # Rattan wicker pattern
    for y in range(0, h, 28):
        for x in range(0, w, 28):
            draw.ellipse([x + 6, y + 6, x + 22, y + 22], outline=(55, 48, 40), width=2)
            draw.line([(x, y + 14), (x + 28, y + 14)], fill=(44, 38, 32), width=1)
            draw.line([(x + 14, y), (x + 14, y + 28)], fill=(44, 38, 32), width=1)

    # Phone chassis
    px, py, pw, ph = 240, 260, 320, 640
    draw.rounded_rectangle([px, py, px + pw, py + ph], radius=54, fill=(225, 225, 228), outline=(255, 255, 255), width=3)
    draw.rounded_rectangle([px + 14, py + 14, px + pw - 14, py + ph - 14], radius=44, fill=(255, 255, 255))

    # Light Screen UI
    draw.rounded_rectangle([px + 95, py + 26, px + pw - 95, py + 50], radius=12, fill=(20, 20, 22))
    draw.text((px + 36, py + 95), "TRANSFER CONFIRMATION", fill=(130, 130, 135))
    draw.text((px + 36, py + 130), "$6,420.00", fill=(20, 20, 24))

    draw.rounded_rectangle([px + 30, py + 190, px + pw - 30, py + 330], radius=18, fill=(245, 245, 248), outline=(225, 225, 230))
    draw.text((px + 50, py + 220), "Recipient: Mono Pay Ltd", fill=(40, 40, 45))
    draw.text((px + 50, py + 250), "Fee: $0.00 (Instant)", fill=(80, 80, 85))
    draw.text((px + 50, py + 280), "Status: Verified on Ledger", fill=(46, 125, 50))

    draw.rounded_rectangle([px + 30, py + 370, px + pw - 30, py + 430], radius=16, fill=(18, 18, 20))
    draw.text((px + 80, py + 392), "Authorize Transfer", fill=(255, 255, 255))

    img = img.filter(ImageFilter.SMOOTH)
    img.save("public/projects/project-b.jpg", "JPEG", quality=95)
    print("Saved public/projects/project-b.jpg")

def create_project_c():
    # Horizontal laptop on desk
    w, h = 1200, 750
    img = Image.new("RGB", (w, h), (20, 18, 17))
    draw = ImageDraw.Draw(img)

    # Ambient warm glow from left
    for r in range(500, 0, -4):
        alpha = int(35 * (1 - r / 500))
        draw.ellipse([200 - r, 300 - r, 200 + r, 300 + r], fill=(20 + alpha, 18 + int(alpha * 0.9), 17 + int(alpha * 0.6)))

    # Table pattern
    for x in range(0, w, 50):
        draw.line([(x, 0), (x, h)], fill=(28, 25, 22), width=1)

    # Laptop Display
    lx, ly, lw, lh = 230, 80, 740, 480
    draw.rounded_rectangle([lx, ly, lx + lw, ly + lh], radius=22, fill=(28, 29, 34), outline=(48, 50, 58), width=2)
    draw.rounded_rectangle([lx + 16, ly + 16, lx + lw - 16, ly + lh - 16], radius=12, fill=(14, 15, 18))
    # Camera notch
    draw.rounded_rectangle([lx + lw // 2 - 40, ly + 16, lx + lw // 2 + 40, ly + 32], radius=6, fill=(28, 29, 34))

    # Dashboard UI
    draw.text((lx + 40, ly + 50), "nexus-telemetry.internal/overview", fill=(90, 92, 100))
    for i, (metric, val) in enumerate([("SYS UPTIME", "99.99%"), ("CLUSTER NODES", "128 Active"), ("AVG LATENCY", "8.4ms")]):
        bx = lx + 40 + i * 220
        draw.rounded_rectangle([bx, ly + 76, bx + 200, ly + 146], radius=10, fill=(22, 23, 28), outline=(36, 38, 46))
        draw.text((bx + 16, ly + 92), metric, fill=(120, 122, 132))
        draw.text((bx + 16, ly + 116), val, fill=(240, 240, 245))

    # Chart Canvas
    draw.rounded_rectangle([lx + 40, ly + 164, lx + lw - 40, ly + lh - 36], radius=12, fill=(20, 21, 26), outline=(34, 36, 44))
    points = [(lx + 60, ly + 380)]
    for i in range(1, 16):
        px = lx + 60 + i * 40
        py_pt = ly + 280 + int(math.sin(i * 0.8) * 50) + (i % 3) * 15
        points.append((px, py_pt))
    points.append((lx + lw - 60, ly + 250))
    
    for i in range(len(points) - 1):
        draw.line([points[i], points[i + 1]], fill=(220, 222, 230), width=3)

    # Laptop Base Chasis
    draw.polygon([(lx - 50, ly + lh), (lx + lw + 50, ly + lh), (lx + lw + 20, ly + lh + 22), (lx - 20, ly + lh + 22)], fill=(44, 46, 54), outline=(60, 62, 72))
    draw.rounded_rectangle([lx + lw // 2 - 45, ly + lh, lx + lw // 2 + 45, ly + lh + 7], radius=3, fill=(25, 26, 30))

    img = img.filter(ImageFilter.SMOOTH)
    img.save("public/projects/project-c.jpg", "JPEG", quality=95)
    print("Saved public/projects/project-c.jpg")

create_avatar()
create_project_a()
create_project_b()
create_project_c()
