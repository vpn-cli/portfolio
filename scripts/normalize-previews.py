import os
from PIL import Image, ImageOps

TARGET_W = 1600
TARGET_H = 900

def process_image(src_path, out_base, fit_mode="crop", bg_color=(15, 17, 23)):
    if not os.path.exists(src_path):
        print(f"Warning: {src_path} does not exist!")
        return

    im = Image.open(src_path).convert("RGB")
    src_w, src_h = im.size
    print(f"Processing {src_path} ({src_w}x{src_h})...")

    if fit_mode == "crop":
        # Target aspect ratio is 16:9
        target_aspect = TARGET_W / TARGET_H
        src_aspect = src_w / src_h

        if src_aspect > target_aspect:
            # Source is wider, crop sides
            new_w = int(src_h * target_aspect)
            offset_x = (src_w - new_w) // 2
            im_cropped = im.crop((offset_x, 0, offset_x + new_w, src_h))
        else:
            # Source is taller, crop from top/center
            new_h = int(src_w / target_aspect)
            offset_y = max(0, int((src_h - new_h) * 0.2)) # crop slightly towards top
            im_cropped = im.crop((0, offset_y, src_w, offset_y + new_h))

        im_resized = im_cropped.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)
    elif fit_mode == "contain":
        im_resized = ImageOps.pad(im, (TARGET_W, TARGET_H), color=bg_color, method=Image.Resampling.LANCZOS)
    else:
        im_resized = im.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)

    # Save as PNG
    out_png = f"public/projects/{out_base}.png"
    im_resized.save(out_png, "PNG", optimize=True)
    print(f"Saved {out_png}")

    # Save as WebP (2x quality 90)
    out_webp = f"public/projects/{out_base}.webp"
    im_resized.save(out_webp, "WEBP", quality=90)
    print(f"Saved {out_webp} ({os.path.getsize(out_webp)} bytes)")

# 1. AppForge: Crop of actual generated-app UI
# From appforge-generated-app.png or appforge-hero-full.png
# Let's inspect appforge-generated-app.png
process_image("public/projects/appforge-generated-app.png", "teaser-appforge", fit_mode="crop")

# 2. Sportz: Live dashboard UI
process_image("public/projects/sportz-matches.png", "teaser-sportz", fit_mode="crop")

# 3. StreamMart: Event flow diagram & console
process_image("public/projects/stream-mart-teaser.png", "teaser-stream-mart", fit_mode="crop")

print("All teaser previews normalized successfully!")

