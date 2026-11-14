#!/usr/bin/env python3
"""VO1 — what adding an algorithm changed (docs/research/01-ramec-vyzkumu.md, part 3).

Usage:
    python3 scripts/vo1_metrics.py <base> [<head>]        (head defaults to HEAD)
    python3 scripts/vo1_metrics.py core-freeze shell-sort  the case study: a branch after the freeze
    python3 scripts/vo1_metrics.py 4f37a12^ 4f37a12        a single commit
    python3 -m doctest scripts/vo1_metrics.py              checks the classification below

Only committed changes are measured. Every changed file falls into one category:
    module        src/algorithms/<category>/<slug>/ that does not exist in <base> — the new algorithm
    new-model     src/models/<model>/ that does not exist in <base> — a new type of model (claim T2)
    other-module  src/algorithms/<category>/<slug>/ that already existed (e.g. links to the new algorithm)
    registration  src/algorithms/registry.ts, content.ts, planned.ts
    tests         other *.test.ts(x) files (the contract tests)
    core          everything else in src/: core, models, components, lib, app
    outside       files outside src/ (documents, configuration)

ΔF_core = number of core files, ΔLOC_core = their added + removed lines,
ΔLOC_modul = added + removed lines of the new module(s). T1 holds when ΔF_core = 0.
ΔAPI and the time t are not in git; they are checked by hand (part 3.2).
"""

import re
import subprocess
import sys

REGISTRATION = {"src/algorithms/registry.ts", "src/algorithms/content.ts", "src/algorithms/planned.ts"}
MODULE = re.compile(r"^src/algorithms/[^/]+/[^/]+/")
MODEL = re.compile(r"^src/models/[^/]+/")
# What a new model may change in the core besides its own folder (claim T2).
MODEL_REGISTRATION = {"src/core/types.ts", "src/models/index.ts"}
CATEGORIES = ["module", "new-model", "other-module", "registration", "tests", "core", "outside"]


def git(*args):
    return subprocess.run(["git", *args], check=True, capture_output=True, text=True).stdout


def existed(rev, folder):
    """Did the folder exist in revision `rev`?"""
    return subprocess.run(["git", "cat-file", "-e", f"{rev}:{folder.rstrip('/')}"], capture_output=True).returncode == 0


def classify(path, is_new):
    """Category of a changed file; `is_new(folder)` says whether the folder is new.

    >>> new = lambda folder: folder in {"src/algorithms/sorting/shell-sort/", "src/models/contour/"}
    >>> classify("src/algorithms/sorting/shell-sort/trace.ts", new)
    'module'
    >>> classify("src/algorithms/sorting/insertion-sort/content.tsx", new)
    'other-module'
    >>> classify("src/models/contour/ContourView.tsx", new)
    'new-model'
    >>> classify("src/models/array/BarsView.tsx", new)
    'core'
    >>> classify("src/algorithms/registry.ts", new)
    'registration'
    >>> classify("src/algorithms/array-contract.test.ts", new)
    'tests'
    >>> classify("src/components/code/highlight.tsx", new)
    'core'
    >>> classify("docs/research/01-ramec-vyzkumu.md", new)
    'outside'
    """
    module = MODULE.match(path)
    if module:
        return "module" if is_new(module.group(0)) else "other-module"
    model = MODEL.match(path)
    if model and is_new(model.group(0)):
        return "new-model"
    if path in REGISTRATION:
        return "registration"
    if re.search(r"\.test\.tsx?$", path):
        return "tests"
    if path.startswith("src/"):
        return "core"
    return "outside"


def main():
    if len(sys.argv) not in (2, 3):
        sys.exit(__doc__)
    base = sys.argv[1]
    head = sys.argv[2] if len(sys.argv) == 3 else "HEAD"

    changes = []  # (category, added, removed, path)
    for row in git("diff", "--numstat", "--no-renames", base, head).splitlines():
        added, removed, path = row.split("\t")
        # Binary files have "-" instead of line counts.
        added, removed = (0 if added == "-" else int(added)), (0 if removed == "-" else int(removed))
        changes.append((classify(path, lambda folder: not existed(base, folder)), added, removed, path))

    print(f"VO1: {base}..{head}\n")
    print(f"{'category':<14}{'files':>6}{'+lines':>8}{'-lines':>8}")
    for category in CATEGORIES:
        rows = [c for c in changes if c[0] == category]
        if rows:
            print(f"{category:<14}{len(rows):>6}{sum(r[1] for r in rows):>8}{sum(r[2] for r in rows):>8}")

    core = [c for c in changes if c[0] == "core"]
    module = [c for c in changes if c[0] == "module"]
    modules = sorted({MODULE.match(c[3]).group(0) for c in module})
    print(f"\nnew modules: {', '.join(modules) or '—'}")
    print(f"ΔF_core    = {len(core)}")
    print(f"ΔLOC_core  = {sum(c[1] + c[2] for c in core)}")
    print(f"ΔLOC_modul = {sum(c[1] + c[2] for c in module)}")
    print(f"T1 (ΔF_core = 0): {'met' if not core else 'NOT met'}")

    if any(c[0] == "new-model" for c in changes):
        beyond = [c[3] for c in core if c[3] not in MODEL_REGISTRATION]
        print(f"T2 core files beyond the model registration: {', '.join(beyond) or 'none'} (plus ΔAPI = 0, by hand)")

    for category in ("core", "other-module", "registration", "tests", "outside"):
        rows = [c for c in changes if c[0] == category]
        if rows:
            print(f"\n{category}:")
            for _, added, removed, path in rows:
                print(f"  +{added:<5} -{removed:<5} {path}")
    print("\nΔAPI and t: by hand (part 3.2).")


if __name__ == "__main__":
    main()
