# Guard Rails for AI Agents: Design Primitives

This document defines the core primitive constraints for the design system. AI Agents MUST adhere to these rules when proposing changes, generating UI, or modifying tokens.

## 🎨 Core Primitives (Immutable)

These are the primitive color scales defined in `core.json`. AI Agents MUST NOT modify these hex values.

### Brand & Accents
| Palette | 5 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Brand (Indigo)** | `#f5f3ff` | `#ede9fe` | `#ddd6fe` | `#c4b5fd` | `#a78bfa` | `#8b5cf6` | `#7c3aed` | `#6d28d9` | `#5b21b6` | `#4c1d95` | `#2e1065` |
| **Plum (Violet)** | `#f5f3ff` | `#ede9fe` | `#ddd6fe` | `#c4b5fd` | `#a78bfa` | `-` | `#7c3aed` | `#6d28d9` | `#5b21b6` | `#4c1d95` | `#2e1065` |
| **Azure (Blue)** | `#eff6ff` | `#dbeafe` | `#bfdbfe` | `#93c5fd` | `#60a5fa` | `-` | `#2563eb` | `#1d4ed8` | `#1e40af` | `#1e3a8a` | `#172554` |
| **Emerald (Green)** | `#ecfdf5` | `#d1fae5` | `#a7f3d0` | `#6ee7b7` | `#34d399` | `-` | `#059669` | `#047857` | `#065f46` | `#064e3b` | `#022c22` |
| **Blush (Red)** | `#fff1f2` | `#ffe4e6` | `#fecdd3` | `#fda4af` | `#fb7185` | `-` | `#e11d48` | `#be123c` | `#9f1239` | `#881337` | `#4c0519` |

### Grays & Neutrals
| Palette | 5 | 10 | 15 | 20 | 25 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Storm (Slate)** | `#f8fafc` | `#f1f5f9` | `#eef2f6` | `#e2e8f0` | `#d1d5db` | `#cbd5e1` | `#94a3b8` | `#64748b` | `#475569` | `#334155` | `#1e293b` | `#0f172a` | `#020617` |
| **Smoke (Gray)** | `#f8f8f8` | `#eeeeee` | `-` | `#a0a0a0` | `-` | `#8b8b8b` | `#7c7c7c` | `#747474` | `#6f6f6f` | `#616161` | `#505050` | `#181818` | `#0b0b0b` |

## 🌓 Mode-Aware Text Constraints

Text colors MUST follow these specific semantic mappings and alpha constraints to ensure accessibility and consistent vibrancy across themes.

### Light Mode (`[data-theme="light"]`)
Base: `{core.color.black}` (`#000000`)

| Semantic Token | Alpha | Hex Result (on White) | Role |
| :--- | :--- | :--- | :--- |
| `txt.extreme` | 100% | `#000000` | Headings, Primary Text |
| `txt.severe` | 95% | `#0d0d0d` | Body text |
| `txt.moderate` | 65% | `#595959` | Subtitles, Secondary info |
| `txt.soft` | 55% | `#737373` | Hints, Placeholders |
| `txt.delicate` | 42% | `#949494` | Disabled states / Muted |

### Dark Mode (`[data-theme="dark"]`)
Base: `{core.color.white}` (`#FFFFFF`)

| Semantic Token | Alpha | Hex Result (on Black) | Role |
| :--- | :--- | :--- | :--- |
| `txt.extreme` | 100% | `#FFFFFF` | Headings, Primary Text |
| `txt.severe` | 95% | `#f2f2f2` | Body text |
| `txt.moderate` | 67% | `#ababab` | Subtitles, Secondary info |
| `txt.soft` | 55% | `#8c8c8c` | Hints, Placeholders |
| `txt.delicate` | 42% | `#6b6b6b` | Disabled states / Muted |

## 🏗️ Semantic Backgrounds & Surfaces

| Context | Light Mode (`storm`) | Dark Mode (`black`) | Role |
| :--- | :--- | :--- | :--- |
| `bg.nought` | `{core.color.white}` | `{core.color.black}` | Main app surface |
| `bg.faint` | `{core.color.storm.5}` | `rgba(255,255,255,0.05)` | Section backgrounds |
| `bg.delicate` | `{core.color.storm.10}` | `rgba(255,255,255,0.10)` | Card/Hover states |
| `surface.harsh` | `{core.color.storm.80}` | `{core.color.storm.20}` | Contrast surfaces |

> [!IMPORTANT]
> **Inverse Tokens**: `txt.inverse` tokens flip these logic bases (e.g., `inverse.extreme` in Light mode uses White).

### AI Agent Rules:

1. **Immutable Primitives**: Never attempt to "re-brand" or "adjust" these specific hex codes. They have been curated for accessibility and vibrancy.
2. **Semantic Linking**: When creating new components, always reference these via the `brand` palette or their semantic mappings (e.g., `primary.action` -> `brand.60`).

> [!NOTE]
> The `plum` palette in `core.json` currently mirrors the `brand` palette hex-for-hex. Both represent the core maturity and vibrancy of the system. Changing one WITHOUT the other may lead to inconsistencies.

### AI Agent Rules:

1. **Immutable Primitives**: Never attempt to "re-brand" or "adjust" these specific hex codes. They have been curated for accessibility and vibrancy.
2. **Semantic Linking**: When creating new components, always reference these via the `brand` palette or their semantic mappings (e.g., `primary.action` -> `brand.60`).
3. **No Ad-hoc Hexes**: Never use hardcoded hex values in UI code that approximate these colors. Use the provided CSS variables or JSON tokens.
4. **Preserve Vibrancy**: If adding new palettes, ensure they complement this Indigo/Violet core without overshadowing its vibrancy.

## 📏 Scale & Sizing

- **Base Unit**: The system is built on an **8px grid** (`core.size.SCALE: 8`).
- **Mathematical Multipliers**: Sizing tokens (dimension, space) MUST be derived from the base scale. Avoid hardcoded fractional pixels.

---

_Created to ensure consistency across automated agent interventions._
