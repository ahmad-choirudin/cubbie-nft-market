"""Make 464px-wide thumbnails for every character image.

Needs Pillow:  pip install pillow
Run from the nft-market folder:  python3 scripts/make-thumbs.py
Cards and lists use the thumbnails; detail pages and the hero use the full image.
"""
import glob
import os

from PIL import Image

SRC = "src/assets/characters"
OUT = os.path.join(SRC, "thumbs")
WIDTH = 464

os.makedirs(OUT, exist_ok=True)

for path in sorted(glob.glob(os.path.join(SRC, "cubbie-*.webp"))):
    im = Image.open(path).convert("RGB")
    height = round(im.size[1] * WIDTH / im.size[0])
    im.resize((WIDTH, height), Image.LANCZOS).save(
        os.path.join(OUT, os.path.basename(path)), "WEBP", quality=80, method=6
    )
    print("thumb", os.path.basename(path))
