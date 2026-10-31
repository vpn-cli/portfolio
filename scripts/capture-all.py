import subprocess
import time
import os

EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
VIEWPORTS = [
    ("1440", 1440, 900),
    ("1024", 1024, 768),
    ("768", 768, 1024),
    ("390", 390, 844),
]

os.makedirs("public/screenshots", exist_ok=True)

for name, w, h in VIEWPORTS:
    out_path = os.path.abspath(f"public/screenshots/screenshot-{name}.png")
    cmd = [
        EDGE,
        "--headless=new",
        "--disable-gpu",
        f"--window-size={w},{h}",
        f"--screenshot={out_path}",
        "http://127.0.0.1:3000"
    ]
    print(f"Capturing {name} ({w}x{h})...")
    subprocess.run(cmd)
    time.sleep(1)

print("Done capturing all screenshots!")
