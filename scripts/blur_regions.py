"""Blur personal data in intranet screenshots.

Usage: python scripts/blur_regions.py IN OUT x,y,w,h [x,y,w,h ...]
Coordinates refer to the input image in pixels. The IN2 profile picture
(top right) is always blurred.
"""
import sys

from PIL import Image, ImageFilter


def blur(img: Image.Image, box: tuple[int, int, int, int]) -> None:
    x, y, w, h = box
    region = img.crop((x, y, x + w, y + h))
    # Pixelate first so that short names stay unreadable even with a light blur.
    small = region.resize((max(1, w // 12), max(1, h // 12)), Image.BILINEAR)
    region = small.resize((w, h), Image.NEAREST).filter(ImageFilter.GaussianBlur(6))
    img.paste(region, (x, y))


def main() -> None:
    src, dst, *boxes = sys.argv[1:]
    img = Image.open(src).convert("RGB")
    width, _ = img.size
    blur(img, (width - 70, 4, 66, 50))  # profile picture in the header
    for spec in boxes:
        blur(img, tuple(int(v) for v in spec.split(",")))
    img.save(dst, optimize=True)


if __name__ == "__main__":
    main()
