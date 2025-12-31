# Dopamenu

A dopamine menu PWA for intentional energy management. Built to win awards.

**Live Demo:** [dopamenu-sable.vercel.app](https://dopamenu-sable.vercel.app)
**GitHub:** [rocketroz/dopamenu](https://github.com/rocketroz/dopamenu)

---

## What is a Dopamine Menu?

A dopamine menu is a personalized list of activities organized by energy cost and reward value—like a restaurant menu for your brain. The concept was popularized by [Jessica McCabe of "How to ADHD"](https://www.additudemag.com/dopamenu-dopamine-menu-adhd-brain/) and [Eric Tivers of "ADHD reWired"](https://www.psychologytoday.com/us/blog/changing-the-narrative-on-adhd/202406/dopamine-for-adhd-creating-a-dopa-menu).

### Why It Works

People with ADHD have an **interest-based nervous system** rather than an importance-based one. Traditional productivity systems fail because they rely on importance/urgency—but ADHD brains respond to novelty, interest, challenge, and urgency.

> "Just like it's hard to make really good food choices when you are already hungry, it's really hard to make good dopamine choices when you're already low on dopamine." — Jessica McCabe

### The Menu Categories

| Category | Description | Examples |
|----------|-------------|----------|
| **Appetizers** | Quick 2-5 min dopamine hits | Stretch, splash cold water, one song |
| **Sides** | Background fuel while doing boring tasks | Podcast, lo-fi music, fidget toy |
| **Entrees** | Main satisfying activities (15-60 min) | Walk, creative project, video game |
| **Desserts** | Pure indulgence (use sparingly) | Social media, binge TV, online shopping |

---

## Features

### Core Features
- **4 Menu Categories** - Appetizers, Sides, Entrees, Desserts
- **Add/Edit/Delete Items** - Build your personalized dopamine menu
- **Energy Level Filtering** - Filter by Chill, Ready, or Energized states
- **Quick Pick Shuffle** - Slot-machine style random suggestion with anticipation-building animation
- **Streak Tracking** - Animated flame badge with longest streak tracking
- **PWA Support** - Installable, works offline, app-like experience

### Award-Winning Additions
- **Sparky Mascot** - Animated SVG character with 6 moods (idle, happy, excited, sleepy, thinking, celebrating)
- **Sound Design** - 6 programmatic sounds via Web Audio API (tap, success, shuffle, reveal, celebrate, whoosh)
- **Reflection Prompts** - Post-completion emotional check-in modal
- **Insights View** - Stats dashboard with category breakdown and progress visualization
- **Celebration Confetti** - Canvas-based particle celebration on completions

### Zen Mode (Hand Tracking)
- **MediaPipe Hands Integration** - Real-time hand tracking via camera (21 landmarks, 40+ FPS)
- **Gesture-Controlled Particles** - 400 glowing particles respond to hand movements
- **Open Palm** - Attracts particles toward your hand
- **Closed Fist** - Repels particles away from your hand
- **Index Finger Trails** - Leave glowing trails as you move
- **Burst Effects** - Quick hand movements create particle explosions
- **Mouse/Touch Fallback** - Works without camera if preferred
- **Mobile Front Camera** - Defaults to `facingMode: 'user'` on mobile devices

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2.35 | App Router, Server Components, Static Generation |
| **React** | 18 | UI Components with Hooks |
| **TypeScript** | 5 | Type-safe development |
| **Tailwind CSS** | 3.4.1 | Utility-first styling with custom design system |
| **Framer Motion** | 12.23.26 | Spring physics animations, gestures, AnimatePresence |
| **Zustand** | 5.0.9 | Lightweight state management with localStorage persistence |
| **@ducanh2912/next-pwa** | 10.2.9 | Service worker generation, offline support |
| **@mediapipe/hands** | 0.4.x | Real-time hand tracking (21 landmarks per hand) |
| **@mediapipe/camera_utils** | 0.3.x | Camera stream utilities for MediaPipe |
| **Lucide React** | 0.562.0 | Consistent icon set |
| **Web Audio API** | Native | Programmatic sound generation (no external files) |
| **Canvas 2D API** | Native | Particle system rendering with glow effects |

---

## TypeScript Types

### Core Data Types (`lib/types.ts`)

```typescript
type EnergyLevel = 'low' | 'medium' | 'high' | 'any';

type CategoryType = 'appetizers' | 'sides' | 'entrees' | 'desserts';

interface MenuItem {
  id: string;
  name: string;
  energy: EnergyLevel;
  createdAt: number;
  completedCount: number;
}

interface Category {
  id: CategoryType;
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  color: 'coral' | 'teal' | 'gold' | 'cream';
  items: MenuItem[];
}

interface AppState {
  categories: Category[];
  hasCompletedOnboarding: boolean;
  currentEnergyLevel: EnergyLevel | null;
  lastPickedItem: MenuItem | null;
  totalCompletions: number;
}
```

### Hand Tracking Types (`lib/handTracking.ts`)

```typescript
interface HandLandmark {
  x: number;  // 0-1 normalized
  y: number;  // 0-1 normalized
  z: number;  // depth
}

interface HandData {
  landmarks: HandLandmark[];  // 21 landmarks per hand
  isOpen: boolean;            // palm open vs closed fist
  palmCenter: { x: number; y: number };
  fingerTips: { x: number; y: number }[];  // 5 fingertip positions
  velocity: { x: number; y: number };      // movement speed
}
```

### Particle System Types (`lib/particleSystem.ts`)

```typescript
interface Particle {
  x: number;
  y: number;
  vx: number;           // velocity X
  vy: number;           // velocity Y
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  hue: number;
}

interface ParticleSystemConfig {
  particleCount: number;
  colors: string[];
  maxRadius: number;
  minRadius: number;
  attractStrength: number;
  repelStrength: number;
  friction: number;
  returnForce: number;
  glowIntensity: number;
}
```

### Sound Types (`lib/sounds.ts`)

```typescript
type SoundType = 'tap' | 'success' | 'shuffle' | 'reveal' | 'celebrate' | 'whoosh';
```

---

## Design System

### Colors
```
Coral:     #E85A4F (primary, energy, action)
Teal:      #1B998B (success, calm, completion)
Gold:      #F4C95D (celebration, streaks, highlights)
Night:     #1A1A2E (background, depth)
Cream:     #EAEAEA (text, subtle elements)
```

### Typography
- **Space Grotesk** - Geometric sans-serif, friendly yet modern

### Animation Philosophy
- Spring physics over linear easing (Framer Motion)
- 3D pressable buttons (Duolingo-style shadow offset)
- Micro-interactions on every touch
- Respect `prefers-reduced-motion` via `useReducedMotion` hook

### Custom Animations
- `float` - Gentle vertical bobbing (6s)
- `pulse-soft` - Subtle opacity pulse (2s)
- `shimmer` - Loading shimmer effect
- `bounce-soft` - Satisfying scale bounce
- `shake` - Attention-grabbing shake
- `confetti` - Celebration particle burst

---

## Project Structure

```
dopamenu/
├── app/
│   ├── components/
│   │   ├── AddItemModal.tsx      # Create new menu item
│   │   ├── CategoryCard.tsx      # Expandable category with items
│   │   ├── Celebration.tsx       # Confetti + message on completion
│   │   ├── EnergySelector.tsx    # Filter by energy level
│   │   ├── InsightsView.tsx      # Stats dashboard
│   │   ├── Menu.tsx              # Main view orchestrator
│   │   ├── MenuItem.tsx          # Individual menu item
│   │   ├── Onboarding.tsx        # First-time user flow
│   │   ├── ParticlePlayground.tsx # Zen Mode with hand tracking
│   │   ├── QuickPick.tsx         # Shuffle interaction
│   │   ├── ReflectionModal.tsx   # Post-completion emotional check-in
│   │   ├── SoundToggle.tsx       # Mute control
│   │   ├── Sparky.tsx            # Mascot character (6 moods)
│   │   ├── StreakBadge.tsx       # Streak display with flame
│   │   └── ui/
│   │       ├── Button.tsx        # Base button component
│   │       └── PressableButton.tsx # 3D pressable button
│   ├── globals.css               # CSS variables, utilities
│   ├── layout.tsx                # Root layout + fonts
│   └── page.tsx                  # Entry point
├── lib/
│   ├── accessibility.ts          # useReducedMotion hook
│   ├── constants.ts              # Categories, messages, greetings
│   ├── handTracking.ts           # MediaPipe hand tracking hook
│   ├── haptics.ts                # Vibration API wrapper
│   ├── particleSystem.ts         # Canvas particle physics engine
│   ├── sounds.ts                 # Web Audio sound generators
│   ├── store.ts                  # Zustand state + localStorage
│   ├── types.ts                  # TypeScript definitions
│   └── utils.ts                  # Helpers (cn, etc.)
├── public/
│   ├── icons/                    # PWA icons (192, 512, maskable)
│   ├── manifest.json             # PWA manifest
│   └── sw.js                     # Service worker (auto-generated)
├── scripts/
│   └── generate-icons.mjs        # Icon generation script
├── tailwind.config.ts            # Custom design tokens
├── next.config.mjs               # Next.js + PWA config
└── package.json
```

---

## The Science Behind the Design

### 1. Dopamine is About Anticipation, Not Reward

According to [Huberman Lab research](https://www.hubermanlab.com/episode/controlling-your-dopamine-for-motivation-focus-and-satisfaction):

> "Contrary to popular belief, we don't get a 'dopamine hit' when we experience pleasure. What causes dopamine release is the **anticipation** of a reward."

**App Implementation:**
- Quick Pick shuffle animation creates anticipation before revealing the result
- Slot-machine-style text cycling builds suspense
- Sound design emphasizes the "reveal" moment

### 2. Variable Ratio Reinforcement

[Research shows](https://uxmag.com/articles/the-psychology-of-hot-streak-game-design-how-to-keep-players-coming-back-every-day-without-shame) that variable rewards (like slot machines) create stronger engagement than fixed rewards.

**App Implementation:**
- Randomized activity suggestions keep each interaction fresh
- Celebration messages vary each time
- Sparky mascot mood changes based on context

### 3. Loss Aversion & Streaks

[Duolingo's streak system](https://blog.duolingo.com/how-duolingo-streak-builds-habit/) leverages loss aversion—people hate losing more than they like gaining.

**App Implementation:**
- Visual streak counter with flame animation
- Longest streak tracking creates identity investment

### 4. Micro-Rewards ("Dopamine Baby Steps")

[UX research](https://medium.com/design-bootcamp/the-dopamine-loop-how-ux-designs-hook-our-brains-bd1a50a9f22e) shows that small, frequent rewards sustain engagement better than large, rare ones.

**App Implementation:**
- Sound effects on every interaction
- Confetti celebration on completion
- Progress tracking in Insights view
- Sparky's encouraging messages

### 5. Why Habit Apps Usually Fail

According to [Nir Eyal's research](https://www.nirandfar.com/why-behavior-change-apps-fail-to-change-behavior/):

1. **Psychological Reactance** - Users rebel when autonomy is threatened
2. **"Haftas" vs "Wannas"** - Forced behaviors feel like work
3. **Designing for ideal states** - Real users are tired and distracted

**App Implementation:**
- Users build their own menu (autonomy)
- Energy filter respects current capacity
- Quick Pick removes decision fatigue
- No guilt, no notifications, no streaks-as-punishment

---

## Deployment

### Live Site
The app is deployed on Vercel with automatic deployments from GitHub:

**Production URL:** [dopamenu-sable.vercel.app](https://dopamenu-sable.vercel.app)

### Deploy Your Own

#### Option 1: Vercel (Recommended)
1. Fork this repository
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project"
4. Import your forked `dopamenu` repo
5. Vercel auto-detects Next.js - click Deploy

Or use the CLI:
```bash
npx vercel --yes
```

#### Option 2: Other Platforms
The app exports as static HTML, so it works on any static host:

```bash
npm run build
# Output in .next/ folder
```

### Environment Variables
**None required!** The app uses localStorage for all data persistence.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/rocketroz/dopamenu.git
cd dopamenu

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Recreating This Project with Claude Code

### Step 1: Initial Prompt

```
Build "Dopamenu" - a dopamine menu PWA for intentional energy management.

Key requirements:
1. Research award-winning app designs first (Apple Design Awards, Bears, Finch, Duolingo)
2. Implement the dopamine menu concept (Appetizers, Sides, Entrees, Desserts)
3. Focus on micro-interactions and "dopamine baby steps"
4. Make bold design choices - this should NOT look AI-generated
5. PWA with offline support

Tech stack: Next.js 14, Tailwind, Framer Motion, Zustand

Run autonomously. Make good decisions. Don't ask questions.
```

### Step 2: Guide Claude's Research

```
Before coding, research:
1. Why habit apps fail (Nir Eyal, behavioral design)
2. Huberman Lab dopamine/motivation science
3. Apple Design Award winning app patterns
4. ADHD app design (what actually works)
5. Gamification psychology (streaks, variable rewards)
```

### Step 3: Design-First Approach

```
Create a design system with:
- Color palette (with semantic meaning)
- Typography scale
- Animation principles (spring physics)
- Component patterns (3D buttons, cards)
- Accessibility considerations
```

### Step 4: Add Zen Mode

```
Integrate camera-based hand tracking where users can move particles
across the screen by moving their hands. Research MediaPipe Hands for
real-time tracking. Open palm attracts, closed fist repels. Make it
visually stunning with glow effects and particle physics.
```

### Step 5: Deploy

```
Deploy to Vercel and update README with deployment notes.
```

---

## Research Sources

### Dopamine & Motivation Science
- [Huberman Lab: Controlling Your Dopamine](https://www.hubermanlab.com/episode/controlling-your-dopamine-for-motivation-focus-and-satisfaction)
- [Huberman Lab: How to Increase Motivation & Drive](https://www.hubermanlab.com/episode/how-to-increase-motivation-and-drive)

### Dopamine Menu Concept
- [ADDitude: Your ADHD Dopamenu](https://www.additudemag.com/dopamenu-dopamine-menu-adhd-brain/)
- [Psychology Today: Dopamine for ADHD](https://www.psychologytoday.com/us/blog/changing-the-narrative-on-adhd/202406/dopamine-for-adhd-creating-a-dopa-menu)
- [CNN: 5 Things About Dopamine Menus](https://www.cnn.com/2025/02/12/health/dopamenu-adhd-reward-dopamine-wellness)

### Why Habit Apps Fail
- [Nir Eyal: Why Behavior Change Apps Don't Work](https://medium.com/behavior-design/why-behavior-change-apps-dont-work-1de726c2d7a4)
- [What Designers Get Wrong About Habit Loops](https://medium.com/design-bootcamp/what-designers-get-wrong-about-habit-loops-and-how-to-fix-it-6fd47be714d2)

### Gamification Psychology
- [UX Magazine: Psychology of Hot Streak Game Design](https://uxmag.com/articles/the-psychology-of-hot-streak-game-design-how-to-keep-players-coming-back-every-day-without-shame)
- [Duolingo: How the Streak Builds Habit](https://blog.duolingo.com/how-duolingo-streak-builds-habit/)
- [The Psychology Behind Duolingo's Success](https://scrimmage.co/the-psychology-behind-duolingos-success/)

### Hand Tracking & Particles
- [MediaPipe Hands Documentation](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)
- [Codrops: Interactive Particles with Three.js](https://tympanus.net/codrops/2019/01/17/interactive-particles-with-three-js/)

### UX & Dopamine Design
- [The Dopamine Loop: How UX Designs Hook Our Brains](https://medium.com/design-bootcamp/the-dopamine-loop-how-ux-designs-hook-our-brains-bd1a50a9f22e)
- [Product Psychology: How Users Process Rewards](https://www.uxstudioteam.com/ux-blog/product-psychology-users-process-rewards)

### ADHD Apps That Work
- [Sensa: Best ADHD Apps 2024](https://sensa.health/blog/adhd-apps/)
- [Zapier: To-Do Apps That Work with ADHD](https://zapier.com/blog/adhd-to-do-list/)

---

## Future Improvements

Based on research, potential enhancements include:

1. **Streak Freezes** - Allow occasional skips without losing streak
2. **Weekly Challenges** - Variable ratio reinforcement
3. **Friend System** - Social accountability
4. **Widgets** - iOS/Android home screen quick access
5. **Notifications** - Gentle, user-controlled reminders
6. **Data Export** - Patterns and insights over time
7. **Seasonal Themes** - Fresh visual interest
8. **Voice Control** - Hands-free activity selection
9. **Watch App** - Quick access from Apple Watch/Wear OS

---

## License

MIT License - feel free to use, modify, and share.

---

Built with curiosity about human motivation and respect for the ADHD brain.
