# Logo Assets

Place your logo files here. The recommended files are:

| File | Usage |
|------|-------|
| `logo.png` | Main logo (navbar, general use) |
| `logo.svg` | SVG version (preferred for crisp rendering at all sizes) |
| `logo-dark.png` | Dark background variant (optional) |
| `logo-icon.png` | Icon-only square version (favicon, small spaces) |

## How to use in Navbar

Once you drop your logo file here, update `components/landing/Navbar.tsx`:

```tsx
import Image from "next/image"

// Replace the <Zap /> icon block with:
<Image src="/logo/logo.png" alt="VentureLens" width={120} height={32} priority />
```

## Recommended size
- Navbar logo: **120×32px** (or SVG with viewBox)
- Icon-only: **32×32px**
