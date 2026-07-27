"""
Rhythmic edge-tts: sentence-level synthesis + short pauses + slight rate variation.
Usage:
  py tts_edge_rhythmic.py <text> <voice> <rate> <pitch> <out_mp3> <pause_ms>
"""
import asyncio
import os
import re
import subprocess
import sys
import tempfile

import edge_tts


def split_sentences(t: str) -> list[str]:
    t = re.sub(r"\s+", " ", t.strip())
    parts = re.split(r"(?<=[.!?…])\s+", t)
    out = [p.strip() for p in parts if p and p.strip()]
    return out or [t]


def rate_variants(base: str) -> list[str]:
    m = re.match(r"([+-]?)(\d+)%", base.replace(" ", ""))
    if not m:
        return [base, base, base]
    sign = -1 if m.group(1) == "-" else 1
    n = int(m.group(2)) * sign
    vals = [n, n - 4, n + 2, n - 6, n + 1]
    fixed = []
    for v in vals:
        if v > 0:
            fixed.append(f"+{v}%")
        elif v < 0:
            fixed.append(f"{v}%")
        else:
            fixed.append("+0%")
    return fixed


async def synth_one(sentence: str, voice: str, rate: str, pitch: str, path: str) -> None:
    c = edge_tts.Communicate(sentence, voice, rate=rate, pitch=pitch)
    await c.save(path)


async def main() -> None:
    text, voice, base_rate, pitch, out, pause_ms = sys.argv[1:7]
    pause_ms = int(pause_ms)
    sents = split_sentences(text)
    rates = rate_variants(base_rate)
    ffmpeg = os.environ.get("FFMPEG_PATH") or "ffmpeg"
    tmp = tempfile.mkdtemp(prefix="yt_tts_")
    parts: list[str] = []

    for i, s in enumerate(sents):
        p = os.path.join(tmp, f"p{i:03d}.mp3")
        r = rates[i % len(rates)]
        await synth_one(s, voice, r, pitch, p)
        parts.append(p)

    sil = os.path.join(tmp, "sil.mp3")
    sec = max(0.08, pause_ms / 1000.0)
    subprocess.run(
        [
            ffmpeg,
            "-y",
            "-f",
            "lavfi",
            "-i",
            "anullsrc=r=24000:cl=mono",
            "-t",
            str(sec),
            "-q:a",
            "9",
            "-acodec",
            "libmp3lame",
            sil,
        ],
        check=True,
        capture_output=True,
    )

    list_path = os.path.join(tmp, "list.txt")
    with open(list_path, "w", encoding="utf-8") as f:
        for i, p in enumerate(parts):
            # ffmpeg concat requires escaped single quotes
            f.write(f"file '{p.replace(chr(39), chr(39) + chr(39))}'\n")
            if i < len(parts) - 1:
                f.write(f"file '{sil.replace(chr(39), chr(39) + chr(39))}'\n")

    subprocess.run(
        [ffmpeg, "-y", "-f", "concat", "-safe", "0", "-i", list_path, "-c", "copy", out],
        check=True,
        capture_output=True,
    )
    print(f"ok sentences={len(sents)} -> {out}", flush=True)


if __name__ == "__main__":
    asyncio.run(main())
