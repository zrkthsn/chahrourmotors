#!/usr/bin/env python3
import os
import time
from PIL import Image

WATCH_DIR = "/Users/saibaaworld/Downloads"

def convert_webp(filepath):
    try:
        # Wait a brief moment to ensure file finished downloading
        time.sleep(0.3)
        jpg_path = os.path.splitext(filepath)[0] + ".jpg"
        if not os.path.exists(jpg_path):
            with Image.open(filepath) as im:
                im.convert("RGB").save(jpg_path, "JPEG", quality=95)
            print(f"[Watcher] Converted {os.path.basename(filepath)} -> {os.path.basename(jpg_path)}", flush=True)
    except Exception as e:
        print(f"[Watcher] Error converting {filepath}: {e}", flush=True)

def scan_and_convert():
    for root, dirs, files in os.walk(WATCH_DIR):
        if root != WATCH_DIR and "chahrour motors" not in root:
            continue
        for f in files:
            if f.lower().endswith(".webp"):
                webp_path = os.path.join(root, f)
                jpg_path = os.path.splitext(webp_path)[0] + ".jpg"
                if not os.path.exists(jpg_path):
                    convert_webp(webp_path)

if __name__ == "__main__":
    print(f"[Watcher] Auto-converting .webp images in {WATCH_DIR}...", flush=True)
    scan_and_convert()
    while True:
        time.sleep(2)
        scan_and_convert()
