"""
Split the three-pose sketch sheet into head-and-neck frames.

The sheet is one image with the same head drawn looking left, straight
ahead, and right. Those three drawings are the keyframes the loader
animates between, so each one has to come out on the same baseline and
at the same scale — otherwise the head appears to jump up and down as
well as turn, which reads as a glitch rather than a look.

So: find each drawing's ink box, align all three on the top of the
head, use one shared crop height, and cut just below the collar. The
cream is turned into alpha (ink darkness becomes opacity) so the
drawing can sit on any paper the page chooses, and the bottom is faded
so the neck dissolves instead of ending on a cut line.
"""

import sys

import numpy as np
from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else "sheet.png"
OUT = sys.argv[2] if len(sys.argv) > 2 else "/home/claude/diary/public/portrait"
COUNT = 3

img = Image.open(SRC).convert("RGB")
arr = np.asarray(img).astype(np.float32)
h, w, _ = arr.shape
print(f"sheet {w}x{h}")

# Paper is the most common bright value; ink is anything darker.
paper = np.percentile(arr.reshape(-1, 3), 96, axis=0)
lum = arr @ np.array([0.299, 0.587, 0.114])
paper_lum = float(paper @ np.array([0.299, 0.587, 0.114]))
ink = np.clip((paper_lum - lum) / max(1.0, paper_lum * 0.92), 0, 1)

# Ignore the paper's own grain when looking for the drawings.
solid = ink > 0.10

panel = w // COUNT
boxes = []
for i in range(COUNT):
    sub = solid[:, i * panel : (i + 1) * panel]
    cols = np.where(sub.any(axis=0))[0]
    rows = np.where(sub.any(axis=1))[0]
    if len(cols) == 0 or len(rows) == 0:
        raise SystemExit(f"panel {i}: found no drawing")
    boxes.append((i * panel + cols[0], rows[0], i * panel + cols[-1], rows[-1]))
    print(f"panel {i}: x {boxes[-1][0]}–{boxes[-1][2]}  y {boxes[-1][1]}–{boxes[-1][3]}")

# One shared geometry for all three, anchored on the top of the head.
head_tops = [b[1] for b in boxes]
full_h = max(b[3] for b in boxes) - min(head_tops)

# Head to just below the collar is a little over half the full bust.
crop_h = int(full_h * 0.60)
crop_w = int(crop_h * 1.02)

for i, (x0, y0, x1, y1) in enumerate(boxes):
    # Centre on the HEAD, not on the ink box. In the turned poses the
    # shoulder runs off one side, and centring on the box would slide
    # the face towards the opposite edge — the three frames would then
    # appear to slide sideways as well as turn.
    band = solid[y0 : y0 + int(full_h * 0.34), x0 : x1 + 1]
    weight = band.sum(axis=0).astype(np.float32)
    if weight.sum() > 0:
        cx = int(x0 + (weight * np.arange(len(weight))).sum() / weight.sum())
    else:
        cx = (x0 + x1) // 2

    left = max(0, min(w - crop_w, cx - crop_w // 2))
    top = max(0, y0 - int(crop_h * 0.09))
    bottom = min(h, top + crop_h)

    rgb = arr[top:bottom, left : left + crop_w]
    alpha = ink[top:bottom, left : left + crop_w].copy()

    # Lift the ink so the sketch keeps its weight once the paper is gone.
    alpha = np.clip(alpha * 1.28, 0, 1)

    ch, cw = alpha.shape
    yy = np.linspace(0, 1, ch)[:, None]
    xx = np.linspace(0, 1, cw)[None, :]
    # Dissolve the neck and the outer edges into the page.
    alpha *= np.clip(1.0 - (yy - 0.76) / 0.24, 0, 1)
    alpha *= np.clip(1.0 - (np.abs(xx - 0.5) * 2 - 0.88) / 0.12, 0, 1)

    out = np.dstack(
        [np.clip(rgb, 0, 255).astype(np.uint8), (alpha * 255).astype(np.uint8)]
    )
    path = f"{OUT}-{i}.png"
    Image.fromarray(out, "RGBA").save(path)
    print(f"wrote {path}  {cw}x{ch}")
