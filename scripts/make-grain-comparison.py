import os
from PIL import Image, ImageDraw, ImageFont

COMPARISONS_DIR = 'public/comparisons'
os.makedirs(COMPARISONS_DIR, exist_ok=True)

def create_side_by_side(img1_path, img2_path, out_path, label1="BEFORE (No Grain)", label2="AFTER (With Film Grain)", zoom=False, crop_box=None):
    im1 = Image.open(img1_path).convert('RGB')
    im2 = Image.open(img2_path).convert('RGB')
    
    if crop_box:
        im1 = im1.crop(crop_box)
        im2 = im2.crop(crop_box)
        
    if zoom:
        im1 = im1.resize((im1.width * 2, im1.height * 2), Image.Resampling.NEAREST)
        im2 = im2.resize((im2.width * 2, im2.height * 2), Image.Resampling.NEAREST)

    w, h = im1.width, im1.height
    header_h = 44
    gap = 8
    
    canvas = Image.new('RGB', (w * 2 + gap, h + header_h), (18, 18, 18))
    draw = ImageDraw.Draw(canvas)
    
    # Paste images
    canvas.paste(im1, (0, header_h))
    canvas.paste(im2, (w + gap, header_h))
    
    # Headers
    draw.rectangle([0, 0, w, header_h], fill=(28, 28, 28))
    draw.rectangle([w + gap, 0, w * 2 + gap, header_h], fill=(28, 28, 28))
    
    # Simple font text
    draw.text((20, 14), label1, fill=(240, 240, 240))
    draw.text((w + gap + 20, 14), label2, fill=(240, 240, 240))
    
    canvas.save(out_path)
    print(f"Saved {out_path} ({canvas.width}x{canvas.height})")

# 1. Full viewports
create_side_by_side(
    'public/grain-test/before-dark.png',
    'public/grain-test/after-dark.png',
    f'{COMPARISONS_DIR}/grain-dark-viewport-comparison.png',
    label1="DARK THEME — BEFORE (Flat)",
    label2="DARK THEME — AFTER (--grain-opacity: 0.07, mix-blend: overlay)"
)

create_side_by_side(
    'public/grain-test/before-light.png',
    'public/grain-test/after-light.png',
    f'{COMPARISONS_DIR}/grain-light-viewport-comparison.png',
    label1="LIGHT THEME — BEFORE (Flat)",
    label2="LIGHT THEME — AFTER (--grain-opacity: 0.035, mix-blend: multiply)"
)

# 2. Intro tile crops (zoom 1.5x)
create_side_by_side(
    'public/grain-test/before-dark-intro.png',
    'public/grain-test/after-dark-intro.png',
    f'{COMPARISONS_DIR}/grain-dark-intro-comparison.png',
    label1="DARK INTRO — BEFORE",
    label2="DARK INTRO — AFTER (Analogue Grain)"
)

create_side_by_side(
    'public/grain-test/before-light-intro.png',
    'public/grain-test/after-light-intro.png',
    f'{COMPARISONS_DIR}/grain-light-intro-comparison.png',
    label1="LIGHT INTRO — BEFORE",
    label2="LIGHT INTRO — AFTER (Analogue Grain)"
)

# 3. Portrait crops (sitting over media)
create_side_by_side(
    'public/grain-test/before-dark-portrait.png',
    'public/grain-test/after-dark-portrait.png',
    f'{COMPARISONS_DIR}/grain-dark-portrait-comparison.png',
    label1="PORTRAIT PHOTO — BEFORE",
    label2="PORTRAIT PHOTO — AFTER (Unified Material)"
)

# 4. Zoomed 3x texture swatch comparison on cards
def make_macro_swatch():
    b_dark = Image.open('public/grain-test/before-dark-intro.png').convert('RGB')
    a_dark = Image.open('public/grain-test/after-dark-intro.png').convert('RGB')
    b_light = Image.open('public/grain-test/before-light-intro.png').convert('RGB')
    a_light = Image.open('public/grain-test/after-light-intro.png').convert('RGB')
    
    # 120x120 patch on the tile card surface
    box = (100, 100, 220, 220)
    
    p_b_dark = b_dark.crop(box).resize((360, 360), Image.Resampling.NEAREST)
    p_a_dark = a_dark.crop(box).resize((360, 360), Image.Resampling.NEAREST)
    p_b_light = b_light.crop(box).resize((360, 360), Image.Resampling.NEAREST)
    p_a_light = a_light.crop(box).resize((360, 360), Image.Resampling.NEAREST)
    
    header_h = 36
    canvas = Image.new('RGB', (360 * 4 + 24, 360 + header_h), (20, 20, 20))
    draw = ImageDraw.Draw(canvas)
    
    canvas.paste(p_b_dark, (0, header_h))
    canvas.paste(p_a_dark, (360 + 8, header_h))
    canvas.paste(p_b_light, (360 * 2 + 16, header_h))
    canvas.paste(p_a_light, (360 * 3 + 24, header_h))
    
    draw.text((10, 10), "DARK BEFORE (3x)", fill=(200, 200, 200))
    draw.text((360 + 18, 10), "DARK GRAIN (3x)", fill=(255, 255, 255))
    draw.text((360 * 2 + 26, 10), "LIGHT BEFORE (3x)", fill=(200, 200, 200))
    draw.text((360 * 3 + 34, 10), "LIGHT GRAIN (3x)", fill=(255, 255, 255))
    
    canvas.save(f'{COMPARISONS_DIR}/grain-macro-swatches-3x.png')
    print("Saved grain-macro-swatches-3x.png")

make_macro_swatch()

