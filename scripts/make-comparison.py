from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs("public/comparisons", exist_ok=True)
os.makedirs(r"C:\Users\vipin\.gemini\antigravity\brain\3b0db8d7-f7c8-4719-a29a-0bca32b694d1", exist_ok=True)

ref_img = Image.open("references/bentox-1920.png")
build_img = Image.open("public/screenshots/screenshot-1920.png")

# Scale both to width 1280 for manageable side-by-side or vertical view
w = 1440
ref_h = int(ref_img.height * (w / ref_img.width))
build_h = int(build_img.height * (w / build_img.width))

ref_resized = ref_img.resize((w, ref_h), Image.Resampling.LANCZOS)
build_resized = build_img.resize((w, build_h), Image.Resampling.LANCZOS)

# Stacked comparison: Top = Target Reference (bentox-1920), Bottom = Current Build (screenshot-1920)
header_h = 50
canvas_h = header_h * 2 + ref_h + build_h + 30
comp = Image.new("RGB", (w + 40, canvas_h), (11, 11, 11))
draw = ImageDraw.Draw(comp)

# Draw Target Reference
draw.text((20, 16), "TARGET REFERENCE (bentox-1920.png)", fill=(255, 255, 255))
comp.paste(ref_resized, (20, header_h))

# Draw Current Build
y_build = header_h + ref_h + 20
draw.text((20, y_build), "CURRENT BUILD (1920x1080 Headless Edge)", fill=(255, 255, 255))
comp.paste(build_resized, (20, y_build + header_h))

comp.save("public/comparisons/comparison-1920.png")
comp.save(r"C:\Users\vipin\.gemini\antigravity\brain\3b0db8d7-f7c8-4719-a29a-0bca32b694d1\comparison-1920.png")
print("Saved comparison-1920.png")
