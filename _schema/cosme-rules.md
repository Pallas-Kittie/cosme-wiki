# Cosme Wiki — Agent Rules

## What this wiki is for
A personal cross-reference database of cosmetics products and their ingredients. Two linked databases: **products** (what's in the bottle) and **ingredients** (what each component does, where it's approved, how it's used).

## Core rule: bilingual
Every entry must have both English and Chinese names where applicable. If Chinese isn't known, leave the `_zh` field as an empty string — never omit the field entirely.

---

## Extracting a PRODUCT entry

Target file: `E:\cosme-wiki\data\products.json`

### Required fields
| Field | How to extract |
|---|---|
| `id` | Slug: lowercase brand + name, hyphens, no spaces. e.g. `cerave-moisturizing-cream` |
| `name` | Full English product name |
| `name_zh` | Chinese name (search or translate if not on label) |
| `brand` | Brand name exactly as appears |
| `type` | One of: Moisturizer, Serum, Cleanser, Toner, Sunscreen, Foundation, Lipstick, Eyeshadow, Blush, Primer, Mask, Eye Cream, Body Lotion, Oil, Other |
| `type_zh` | Chinese translation of type |
| `skin_type` | Array: Dry, Normal, Oily, Combination, Sensitive, All |
| `concern_tags` | Array: Hydration, Anti-aging, Brightening, Acne, Redness, Sensitive, Barrier Repair, Firming, Pore-minimizing, SPF, Pigmentation |
| `ingredients_inci` | Full INCI list, preserving exact order from label (highest concentration first) |

### Optional fields
| Field | Notes |
|---|---|
| `photo` | Leave as `""` — user will add manually |
| `price` | Include currency symbol |
| `buy_links` | Array of `{ "store": "...", "url": "..." }` |
| `my_rating` | Leave as `null` — user sets |
| `my_notes` | Leave as `""` — user sets |

### INCI list rules
- Use official INCI names (not trade names). e.g. `Retinol` not `Vitamin A Pure`
- Preserve comma-separated order from the label
- Do NOT translate INCI names — they are always in English

---

## Extracting an INGREDIENT entry

Target file: `E:\cosme-wiki\data\ingredients.json`

### Required fields
| Field | How to extract |
|---|---|
| `id` | Slug of INCI name. e.g. `retinol`, `sodium-hyaluronate` |
| `inci_name_en` | Official INCI name |
| `inci_name_eu` | EU-specific INCI if different; otherwise same as `inci_name_en` |
| `name_zh` | Chinese INCI or common Chinese name |
| `common_name_en` | Common name e.g. "Vitamin A" |
| `common_name_zh` | Chinese common name |
| `function` | Array from: Humectant, Emollient, Occlusive, Surfactant, Preservative, Active, Anti-aging, Brightening, Antioxidant, Cell-communicating, Soothing, Exfoliant, Fragrance, Colorant, Solvent, Chelating, Film-former, pH-adjuster, Thickener, Emulsifier |
| `benefits_en` | 2–4 sentences in plain English |
| `benefits_zh` | Chinese translation |
| `concerns_en` | Known risks, irritation potential, interactions — empty string if none |
| `concerns_zh` | Chinese translation |
| `typical_pct_min` | Numeric, lower end of typical use range |
| `typical_pct_max` | Numeric, upper end |
| `comedogenic_rating` | 0–5 scale; null if unknown |
| `allergen` | Boolean |
| `supplier` | Known major suppliers; if unknown use `""` |
| `supplier_info` | Additional supplier notes; `""` if unknown |

### Approval field
```json
"approval": { "EU": "approved", "USA": "approved", "China": "approved" }
```
Values: `"approved"` | `"restricted"` | `"prohibited"` | `"not-listed"`

### Usage area field
```json
"usage_area": { "Face": "M", "Eye": "S", "Lip": "NR", "Nail": "NR" }
```
Codes:
- **M** — Major use (commonly and safely used here)
- **S** — Some use (used but with limitations/concentration restrictions)
- **NR** — Not recommended (technically possible but inadvisable)
- **X** — Prohibited (banned for this use by at least one major regulatory body)

### Cross-references
After updating ingredients.json, check if any existing products in products.json contain this ingredient name in their `ingredients_inci` array. The cross-reference is computed at runtime from products.json — you do NOT need to manually add `products_containing` to ingredient entries.

---

## Deduplication rules
1. Before adding any entry, search `data/products.json` and `data/ingredients.json` for an existing entry with the same `id` or matching name.
2. If found: **update** the existing entry with any new information. Do not create a duplicate.
3. If not found: append to the array.

## Commit format
After updating data files:
```
git -C E:\cosme-wiki add data/
git -C E:\cosme-wiki commit -m "ingest: [brief description of what was added]"
```
Do not commit _sources/queue.json changes — the ingest GUI manages that separately.

---

## What NOT to do
- Never add fields not in the schema
- Never translate INCI names (they're always Latin/English per international standard)
- Never invent `my_rating` or `my_notes` — these are personal fields the user fills in
- Never infer approval status without a source — use `"not-listed"` if uncertain
