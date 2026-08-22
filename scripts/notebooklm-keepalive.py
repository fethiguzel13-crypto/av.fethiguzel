#!/usr/bin/env python3
"""NotebookLM oturumunu canlı tutar.

Google çerezleri sessizce düşer. Bu betik:
  1. `notebooklm auth refresh` dener
  2. Hâlâ bozuksa `notebooklm login` açar (kullanıcı 22.08.2026'da
     tarayıcıyı otomatik açma yetkisi verdi)

Kullanım:
  python scripts/notebooklm-keepalive.py
  python scripts/notebooklm-keepalive.py --check-only
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOG = ROOT / "logs" / "notebooklm-keepalive.log"


def log(msg: str) -> None:
    LOG.parent.mkdir(parents=True, exist_ok=True)
    line = f"{datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')} {msg}"
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line + "\n")
    print(line)


def run(args: list[str], timeout: int) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        args,
        capture_output=True,
        text=True,
        timeout=timeout,
        encoding="utf-8",
        errors="replace",
    )


def auth_ok() -> tuple[bool, str]:
    try:
        p = run(["notebooklm", "auth", "check", "--json"], timeout=60)
    except (FileNotFoundError, subprocess.TimeoutExpired) as e:
        return False, str(e)
    raw = (p.stdout or "").strip()
    if p.returncode != 0:
        return False, (p.stderr or raw or f"exit {p.returncode}")[:400]
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return False, raw[:400]
    status = data.get("status")
    checks = data.get("checks") or {}
    sid = checks.get("sid_cookie")
    cookies = checks.get("cookies_present")
    ok = status == "ok" and bool(sid or cookies)
    return ok, raw[:300]


def refresh() -> bool:
    try:
        p = run(["notebooklm", "auth", "refresh", "--quiet"], timeout=120)
    except (FileNotFoundError, subprocess.TimeoutExpired) as e:
        log(f"refresh hata: {e}")
        return False
    if p.returncode != 0:
        log(f"refresh exit {p.returncode}: {(p.stderr or p.stdout or '')[:300]}")
        return False
    return True


def login() -> bool:
    log("oturum düşmüş — notebooklm login açılıyor (tarayıcı)")
    try:
        p = run(["notebooklm", "login"], timeout=300)
    except subprocess.TimeoutExpired:
        log("login zaman aşımı (300s)")
        return False
    except FileNotFoundError:
        log("notebooklm CLI yok")
        return False
    if p.returncode != 0:
        log(f"login exit {p.returncode}: {(p.stderr or p.stdout or '')[:400]}")
        return False
    return True


def ensure(check_only: bool = False) -> int:
    ok, detail = auth_ok()
    if ok:
        log("oturum sağlam")
        return 0
    log(f"oturum zayıf: {detail[:200]}")
    if check_only:
        return 2
    if refresh():
        ok, detail = auth_ok()
        if ok:
            log("refresh sonrası oturum sağlam")
            return 0
        log(f"refresh yetmedi: {detail[:200]}")
    if login():
        ok, detail = auth_ok()
        if ok:
            log("login sonrası oturum sağlam")
            return 0
        log(f"login sonrası hâlâ bozuk: {detail[:200]}")
        return 1
    return 1


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check-only", action="store_true")
    args = parser.parse_args()
    try:
        return ensure(check_only=args.check_only)
    except Exception as e:
        log(f"beklenmeyen: {e}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
