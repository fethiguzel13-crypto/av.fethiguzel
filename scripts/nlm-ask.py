#!/usr/bin/env python3
"""Uzun prompt'ları dosyadan okuyup NotebookLM'e sorar (Windows CLI arg limitini aşmak için).
Kullanım: python scripts/nlm-ask.py <notebook_id> <prompt.txt>
Stdout: JSON {"answer": "...", "conversation_id": "..."}
"""
from __future__ import annotations

import asyncio
import json
import sys
from pathlib import Path


async def main() -> int:
    if len(sys.argv) < 3:
        print("Kullanim: python nlm-ask.py <notebook_id> <prompt_dosyasi>", file=sys.stderr)
        return 2

    notebook_id = sys.argv[1]
    prompt_path = Path(sys.argv[2])
    if not prompt_path.is_file():
        print(f"Dosya yok: {prompt_path}", file=sys.stderr)
        return 2

    question = prompt_path.read_text(encoding="utf-8")
    if not question.strip():
        print("Bos prompt", file=sys.stderr)
        return 2

    try:
        from notebooklm import NotebookLMClient
    except ImportError as e:
        print(f"notebooklm import hatasi: {e}", file=sys.stderr)
        return 1

    import subprocess
    import time

    last_err: Exception | None = None
    for attempt in range(3):
        try:
            async with await NotebookLMClient.from_storage(timeout=300) as client:
                result = await client.chat.ask(notebook_id, question)
                out = {
                    "answer": (result.answer or "").strip(),
                    "conversation_id": getattr(result, "conversation_id", None),
                    "turn_number": getattr(result, "turn_number", None),
                }
                if out["answer"]:
                    sys.stdout.write(json.dumps(out, ensure_ascii=False))
                    sys.stdout.write("\n")
                    return 0
                # Bos cevap: kisa bekle, yeniden dene (yeni conversation otomatik)
                print(f"[retry] bos cevap, deneme {attempt + 1}/3", file=sys.stderr)
                last_err = RuntimeError("Bos cevap (answer bos)")
                time.sleep(8 * (attempt + 1))
                continue
        except Exception as e:
            last_err = e
            msg = str(e).lower()
            authish = any(
                k in msg
                for k in (
                    "auth",
                    "cookie",
                    "unauthor",
                    "401",
                    "403",
                    "login",
                    "session",
                    "expired",
                    "csrf",
                    "sid",
                )
            )
            if authish:
                print(f"[auth] oturum sorunu, cookie yenileniyor: {e}", file=sys.stderr)
                subprocess.run(
                    ["notebooklm", "auth", "refresh", "--quiet"],
                    check=False,
                    timeout=120,
                )
                # Kullanici yetki verdi: gerekirse login de dene (tarayici)
                if attempt == 1:
                    print("[auth] notebooklm login deneniyor...", file=sys.stderr)
                    subprocess.run(
                        ["notebooklm", "login"],
                        check=False,
                        timeout=300,
                    )
                time.sleep(5)
                continue
            print(f"[retry] hata deneme {attempt + 1}/3: {e}", file=sys.stderr)
            time.sleep(8 * (attempt + 1))
            continue

    print(json.dumps({"error": str(last_err)}, ensure_ascii=False), file=sys.stderr)
    return 1


if __name__ == "__main__":
    try:
        raise SystemExit(asyncio.run(main()))
    except Exception as e:
        print(json.dumps({"error": str(e)}, ensure_ascii=False), file=sys.stderr)
        raise SystemExit(1)
