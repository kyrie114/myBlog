# -*- coding: utf-8 -*-
"""Apply PUBLIC_MYBLOG_API_BASE envField to astro.config.mjs (idempotent)."""
from pathlib import Path
import re
import sys

TARGET = Path(sys.argv[1] if len(sys.argv) > 1 else "astro.config.mjs")
text = TARGET.read_text(encoding="utf-8")
if "PUBLIC_MYBLOG_API_BASE" in text:
    print("astro.config.mjs already has PUBLIC_MYBLOG_API_BASE")
    raise SystemExit(0)

needle = """      CODETIME_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },"""

insert = """      CODETIME_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      PUBLIC_MYBLOG_API_BASE: envField.string({
        context: "client",
        access: "public",
        optional: true,
        default: "http://127.0.0.1:8088",
      }),
    },
  },"""

if needle not in text:
    # fallback: insert before closing of env.schema
    m = re.search(r"(env:\s*\{\s*schema:\s*\{)([\s\S]*?)(\n\s*\},)", text)
    if not m:
        print("ERROR: could not locate env.schema in", TARGET)
        raise SystemExit(1)
    field = """
      PUBLIC_MYBLOG_API_BASE: envField.string({
        context: "client",
        access: "public",
        optional: true,
        default: "http://127.0.0.1:8088",
      }),"""
    text = text[: m.end(2)] + field + text[m.end(2) :]
else:
    text = text.replace(needle, insert, 1)

TARGET.write_text(text, encoding="utf-8")
print("patched", TARGET)
