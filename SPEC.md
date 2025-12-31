# Dopamenu — Build Spec

## Overview
A Progressive Web App for managing personal dopamine menus. Built for CES demo (January 2025).

**Positioning:** A universal tool for intentional energy management. Everyone has dopamine reward loops. This is for anyone who wants to be more deliberate about what activities fuel them vs. drain them.

**NOT:** An ADHD app. No medical framing. No disorder language. This is lifestyle, not treatment.

---

## Core Concept

Categorize your favorite activities like a restaurant menu based on effort and reward:

- **Appetizers** — Quick hits. Low effort, instant boost. (2-5 min)
- **Sides** — Pair with other activities. Background fuel.
- **Entrees** — The main event. Requires investment, bigger payoff.
- **Desserts** — Pure indulgence. Save for when you've earned it.

---

## Design Philosophy

### The Problem with AI-Generated UI
Most AI-generated apps look the same:
- Predictable gradients
- Generic rounded cards
- Obvious Tailwind defaults
- No personality, no tension, no surprise

### Dopamenu Should Feel:
- **Confident** — Bold choices, not safe defaults
- **Tactile** — Like physical objects you want to touch
- **Warm** — Inviting, not clinical
- **Distinctive** — You'd recognize it in a lineup
- **Alive** — Subtle motion, not static

### Specific Design Directions

**Color Palette — Rich, Not Pastel:**
- Primary: Deep warm coral `#E85A4F`
- Secondary: Rich teal `#1B998B`
- Background: Off-black with warmth `#1A1A2E`
- Surface: Elevated dark `#252542`
- Text: Warm white `#EAEAEA`
- Accent: Gold for highlights `#F4C95D`

**Typography:**
- Headlines: Bold, slightly condensed, confident
- Body: Clean, generous letter-spacing
- Consider a distinctive display font (not Inter, not system fonts)

**UI Patterns That Feel Fresh:**
- Slight rotation on cards (1-2 degrees) — breaks the grid subtly
- Shadows that feel like real light sources, not flat drop shadows
- Micro-interactions: satisfying haptic-feeling feedback on tap
- Cards that feel like physical cards (slight texture, depth)
- Generous whitespace — let elements breathe
- One unexpected element per screen (an illustration, an animation, a color pop)

**Avoid:**
- Perfect symmetry everywhere
- Generic icon sets
- Glassmorphism (overdone)
- Gradients as backgrounds (lazy)
- Rounded corners on everything (pick sharp or rounded, commit)

---

## Features (MVP)

### Must Have
- [ ] Add/edit/delete menu items in each category
- [ ] Quick-pick: tap a category, get a random suggestion with satisfying animation
- [ ] Energy level selector (low/medium/high) — simple, not clinical
- [ ] Time awareness (morning/afternoon/evening) — subtle, automatic
- [ ] Mobile-first responsive design
- [ ] PWA: installable, works offline
- [ ] Local storage persistence (no backend)
- [ ] Onboarding: 3 screens max, sets the vibe

### Delighters
- [ ] Satisfying animations when adding/completing items
- [ ] Swipe to complete (feels like checking off)
- [ ] "Shuffle" animation for random pick
- [ ] Optional celebration moment when you do the thing
- [ ] Share your menu as a beautiful image

---

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS (but override defaults aggressively)
- **Animations:** Framer Motion
- **Storage:** localStorage + Zustand for state
- **PWA:** next-pwa
- **Icons:** Lucide or custom (not FontAwesome)
- **Fonts:** Load one distinctive font (e.g., Space Grotesk, Outfit, or similar)
- **Deploy:** Vercel

---

## File Structure
```
dopamenu/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── manifest.json
│   └── components/
│       ├── Menu.tsx
│       ├── CategoryCard.tsx
│       ├── MenuItem.tsx
│       ├── AddItemModal.tsx
│       ├── QuickPick.tsx
│       ├── EnergySelector.tsx
│       ├── Onboarding.tsx
│       └── ui/ (shared components)
├── lib/
│   ├── store.ts
│   ├── types.ts
│   └── constants.ts
├── public/
│   ├── icons/
│   └── fonts/
├── tailwind.config.js
├── next.config.js
└── package.json
```

---

## Sample Data (Pre-populated)

Universal, relatable examples — not productivity-bro or self-help clichés:

```json
{
  "appetizers": [
    {"id": 1, "name": "Dance to one song", "energy": "low"},
    {"id": 2, "name": "Step outside, no phone", "energy": "low"},
    {"id": 3, "name": "Text someone you're thinking of", "energy": "low"},
    {"id": 4, "name": "Stretch for 3 minutes", "energy": "low"}
  ],
  "sides": [
    {"id": 5, "name": "Put on a playlist", "energy": "any"},
    {"id": 6, "name": "Light a candle", "energy": "low"},
    {"id": 7, "name": "Open the windows", "energy": "low"},
    {"id": 8, "name": "Work from a different spot", "energy": "medium"}
  ],
  "entrees": [
    {"id": 9, "name": "Deep work session", "energy": "high"},
    {"id": 10, "name": "Cook a real meal", "energy": "medium"},
    {"id": 11, "name": "Long walk, no destination", "energy": "medium"},
    {"id": 12, "name": "Make something with your hands", "energy": "high"}
  ],
  "desserts": [
    {"id": 13, "name": "Watch something you love", "energy": "low"},
    {"id": 14, "name": "Guilt-free nap", "energy": "low"},
    {"id": 15, "name": "Order your favorite food", "energy": "low"},
    {"id": 16, "name": "Unplanned adventure", "energy": "high"}
  ]
}
```

---

## Onboarding Flow (3 screens)

**Screen 1:** "Your energy is a menu"
Brief, warm intro. Not preachy.

**Screen 2:** "Pick what fuels you"
Quick category explanation with examples.

**Screen 3:** "Start with a few favorites"
Optional quick-add of 3-5 items to get started.

Then → straight to the app.

---

## Copy Tone

- First person plural ("we" not "you should")
- Conversational, not instructional
- Zero productivity jargon (no "optimize", "hack", "routine")
- Allowed to be slightly playful
- Short sentences. Breathing room.

**Examples:**
- ✓ "What sounds good right now?"
- ✓ "Nice. You did the thing."
- ✗ "Track your habits to optimize your day"
- ✗ "Build better routines"

---

## Success Criteria

- Loads in < 2 seconds on mobile
- Installable as PWA
- Works fully offline after first load
- Someone seeing it says "that's nice" not "that looks like an AI made it"
- Feels good to use — you want to open it
- Laura can demo it confidently at CES

---

## Build Instructions for Agent

1. **Research first:** Before writing code, spend 10 minutes looking at award-winning app designs (Mobbin, Godly, Awwwards) to calibrate taste level
2. **Set up project:** Next.js 14 with App Router, Tailwind, Framer Motion
3. **Design system first:** Define colors, typography, spacing, shadows as CSS variables before building components
4. **Build components:** Start with the smallest pieces, work up
5. **Add motion:** Every interaction should have subtle, satisfying feedback
6. **Test on mobile:** Use Chrome DevTools mobile view throughout
7. **PWA setup:** Manifest, service worker, icons
8. **Polish pass:** Go through every screen and ask "is this delightful?"
9. **Git + Deploy:** Push to GitHub, deploy to Vercel

---

## Owner
Laura Tornga — CES January 2025

## Timeline
Build overnight (Dec 30-31, 2024)
