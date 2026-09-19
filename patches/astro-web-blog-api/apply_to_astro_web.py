# -*- coding: utf-8 -*-
"""
Deploy blog API wire-up into a local Astro-star checkout.

Usage (on Win-20260408GLB):
  python apply_to_astro_web.py D:\\code\\python_code\\myBlog\\astro-web
"""
from pathlib import Path
import shutil
import sys

HERE = Path(__file__).resolve().parent

FILES = [
    "src/lib/myblog-api.ts",
    "src/lib/render-markdown.ts",
    "src/components/content/ApiMarkdownContent.astro",
    "src/pages/blog/index.astro",
    "src/pages/blog/[id].astro",
    "src/env.d.ts",
    ".env",
    ".env.example",
]

def main():
    if len(sys.argv) < 2:
        print("Usage: python apply_to_astro_web.py <astro-web-root>")
        raise SystemExit(2)
    dest_root = Path(sys.argv[1])
    if not dest_root.is_dir():
        print("Not a directory:", dest_root)
        raise SystemExit(1)

    for rel in FILES:
        src = HERE / rel
        dst = dest_root / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        if dst.exists() and rel == "src/env.d.ts":
            existing = dst.read_text(encoding="utf-8")
            addition = src.read_text(encoding="utf-8")
            if "PUBLIC_MYBLOG_API_BASE" not in existing:
                dst.write_text(existing.rstrip() + "\n\n" + addition, encoding="utf-8")
                print("merged", dst)
            else:
                print("skip (already present)", dst)
            continue
        if dst.exists() and rel.startswith(".env"):
            existing = dst.read_text(encoding="utf-8")
            if "PUBLIC_MYBLOG_API_BASE" not in existing:
                dst.write_text(
                    existing.rstrip() + "\nPUBLIC_MYBLOG_API_BASE=http://127.0.0.1:8088\n",
                    encoding="utf-8",
                )
                print("appended", dst)
            else:
                print("skip", dst)
            continue
        shutil.copy2(src, dst)
        print("wrote", dst)

    cfg = dest_root / "astro.config.mjs"
    if cfg.exists():
        import subprocess
        subprocess.check_call(
            [sys.executable, str(HERE / "apply_astro_config_env.py"), str(cfg)]
        )
    else:
        print("WARN: no astro.config.mjs at", cfg)

    print("Done. Restart: pnpm dev --host 127.0.0.1 --port 4321")

if __name__ == "__main__":
    main()
