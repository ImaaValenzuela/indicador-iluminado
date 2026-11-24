#!/usr/bin/env python3
"""Static validator for Pine Script v6 syntax, rules, and SPEC compliance."""

from __future__ import annotations

import re
import sys
from pathlib import Path


def strip_comment(line: str) -> str:
    in_str = False
    esc = False
    for idx, ch in enumerate(line):
        if esc:
            esc = False
            continue
        if ch == "\\" and in_str:
            esc = True
            continue
        if ch == '"':
            in_str = not in_str
        elif not in_str and ch == "/" and idx + 1 < len(line) and line[idx + 1] == "/":
            return line[:idx]
    return line


def validate_file(path: Path) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    raw_lines = path.read_text(encoding="utf-8").splitlines()
    if not raw_lines:
        return ["File is empty."], warnings

    # 1. Version directive
    if raw_lines[0].strip() != "//@version=6":
        errors.append("Line 1: Must start with `//@version=6`.")

    # 2. Balanced parentheses & brackets outside strings/comments
    paren_depth = 0
    bracket_depth = 0
    for lineno, raw in enumerate(raw_lines, start=1):
        code = strip_comment(raw)
        in_str = False
        esc = False
        for ch in code:
            if esc:
                esc = False
                continue
            if ch == "\\" and in_str:
                esc = True
                continue
            if ch == '"':
                in_str = not in_str
            elif not in_str:
                if ch == "(":
                    paren_depth += 1
                elif ch == ")":
                    paren_depth -= 1
                elif ch == "[":
                    bracket_depth += 1
                elif ch == "]":
                    bracket_depth -= 1
        if in_str:
            errors.append(f"Line {lineno}: Unclosed string literal.")
        if paren_depth < 0:
            errors.append(f"Line {lineno}: Unmatched closing ')'.")
            paren_depth = 0
        if bracket_depth < 0:
            errors.append(f"Line {lineno}: Unmatched closing ']'.")
            bracket_depth = 0

    if paren_depth != 0:
        errors.append(f"EOF: Unbalanced parentheses (remaining depth={paren_depth}).")
    if bracket_depth != 0:
        errors.append(f"EOF: Unbalanced brackets (remaining depth={bracket_depth}).")

    # 3. Line-by-line Pine Script v6 checks
    full_code = "\n".join(strip_comment(l) for l in raw_lines)
    bool_vars: set[str] = set()

    for lineno, raw in enumerate(raw_lines, start=1):
        code = strip_comment(raw)
        stripped = code.strip()
        if not stripped:
            continue

        # Collect bool declarations
        m_bool = re.match(r"^(?:var\s+)?bool\s+(\w+)\s*=", stripped)
        if m_bool:
            var_name = m_bool.group(1)
            bool_vars.add(var_name)
            if re.search(r"=\s*na(?:\s|$)", stripped):
                errors.append(f"Line {lineno}: Pine v6 forbids initializing bool `{var_name}` to `na`.")

        # Deprecated `transp=` parameter removed in v6
        if re.search(r"\btransp\s*=", stripped):
            errors.append(f"Line {lineno}: `transp=` parameter was removed in Pine Script v6; use `color.new()`.")

        # Deprecated v4 functions
        if re.search(r"\b(study|security|tostring|pivothigh|pivotlow|sma|ema|atr)\s*\(", stripped):
            if not re.search(r"\b(ta|str|request)\.(pivothigh|pivotlow|sma|ema|atr|tostring)\s*\(", stripped):
                # Allow indicator/input etc., only flag bare v4 calls
                for fn in ("study", "security", "tostring", "pivothigh", "pivotlow", "sma", "ema", "atr"):
                    if re.search(rf"(?<![\.\w]){fn}\s*\(", stripped):
                        errors.append(f"Line {lineno}: Bare v4 function `{fn}()` detected; use v6 namespace.")

        # `ta.*` called inside indented block (risky with v6 lazy evaluation / conditional execution)
        indent = len(code) - len(code.lstrip(" "))
        if indent > 0 and re.search(r"\bta\.(atr|sma|ema|pivothigh|pivotlow)\s*\(", stripped):
            warnings.append(f"Line {lineno}: `ta.*` called inside indented block; move to global scope for consistency.")

        # `alertcondition` or `plotshape` must be at global scope (indent == 0)
        if indent > 0 and re.match(r"^(alertcondition|plotshape|plot|bgcolor|hline)\s*\(", stripped):
            errors.append(f"Line {lineno}: Global-only call `{stripped.split('(')[0]}()` is indented.")

        # Check `for i = array.size(...) - 1 to 0` has guard above
        if re.search(r"\bfor\s+\w+\s*=\s*array\.size\(", stripped):
            prev_line = strip_comment(raw_lines[lineno - 2]).strip() if lineno >= 2 else ""
            if "array.size(" not in prev_line and "if " not in prev_line:
                warnings.append(f"Line {lineno}: `for` loop over `array.size()` should be guarded with `if array.size(...) > 0`.")

        # Check `na(boolVar)` forbidden in v6
        for bvar in bool_vars:
            if re.search(rf"\b(?:na|nz|fixnan)\(\s*{bvar}\s*\)", stripped):
                errors.append(f"Line {lineno}: Pine v6 forbids `na/nz/fixnan` on bool `{bvar}`.")

    # 4. SPEC completeness checks
    required_symbols = [
        'indicator(',
        'max_boxes_count = 500',
        'max_lines_count = 500',
        'max_labels_count = 500',
        'barstate.isconfirmed',
        'type SwingPoint',
        'type OrderBlock',
        'type FVG',
        'type TradingRange',
        'ta.pivothigh',
        'ta.pivotlow',
        'ta.atr(14)',
        'ta.sma(volume, 20)',
        '"BOS"',
        '"CHoCH"',
        '"MSS"',
        '"Premium"',
        '"Discount"',
        '"$$$ EQH"',
        '"$$$ EQL"',
        '"OB+"',
        '"BB+"',
        '"FVG+"',
        '"SC"',
        '"AR"',
        '"ST"',
        '"SPRING"',
        '"UTAD"',
        '"SOS"',
        '"SOW"',
        '"LPS"',
        '"LPSY"',
        '"A+ LONG',
        '"A+ SHORT',
        'table.new(',
        'alertcondition(',
    ]
    for sym in required_symbols:
        if sym not in full_code:
            errors.append(f"SPEC check failed: missing required symbol `{sym}`.")

    return errors, warnings


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/validate_pine_v6.py <path/to/file.pine>")
        return 2

    target = Path(sys.argv[1])
    if not target.is_file():
        print(f"Error: file not found: {target}")
        return 2

    errors, warnings = validate_file(target)

    print(f"=== Pine Script v6 Static Validation: {target.name} ===")
    print(f"Lines checked : {len(target.read_text(encoding='utf-8').splitlines())}")
    print(f"Errors        : {len(errors)}")
    print(f"Warnings      : {len(warnings)}")

    for w in warnings:
        print(f"  [WARN]  {w}")
    for e in errors:
        print(f"  [ERROR] {e}")

    if not errors:
        print("RESULT: PASS — Pine Script v6 syntax & SPEC checks passed.")
        return 0

    print("RESULT: FAIL — Fix errors above before pasting into TradingView.")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
