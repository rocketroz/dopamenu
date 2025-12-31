# Dopamenu

A dopamine menu PWA for intentional energy management. Built to win awards.

**Live Demo:** Install as PWA from your browser
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

## The Science Behind the Design

### 1. Dopamine is About Anticipation, Not Reward

According to [Huberman Lab research](https://www.hubermanlab.com/episode/controlling-your-dopamine-for-motivation-focus-and-satisfaction):

> "Contrary to popular belief, we don't get a 'dopamine hit' when we experience pleasure. What causes dopamine release is the **anticipation** of a reward."

**App Implementation:**
- The Quick Pick shuffle animation creates anticipation before revealing the result
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
- Streak freezes could be added to provide "slack"
- Longest streak tracking creates identity investment

### 4. Micro-Rewards ("Dopamine Baby Steps")

[UX research](https://medium.com/design-bootcamp/the-dopamine-loop-how-ux-designs-hook-our-brains-bd1a50a9f22e) shows that small, frequent rewards sustain engagement better than large, rare ones.

**App Implementation:**
- Sound effects on every interaction (tap, success, shuffle)
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

## Features

### Core MVP
- 4 menu categories (Appetizers, Sides, Entrees, Desserts)
- Add/edit/delete custom items
- Energy level filtering (Chill, Ready, Energized)
- Quick Pick random suggestion with shuffle animation
- Streak tracking with animated flame badge
- PWA: installable, works offline

### Award-Winning Additions
- **Sparky Mascot** - Animated character with 6 moods
- **Sound Design** - Web Audio API, mute toggle
- **Reflection Prompts** - Post-completion emotional check-in
- **Insights View** - Stats dashboard with category breakdown

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | App Router, Server Components |
| **Tailwind CSS** | Utility-first styling with custom design system |
| **Framer Motion** | Spring physics animations, gestures |
| **Zustand** | Lightweight state management + localStorage |
| **@ducanh2912/next-pwa** | Service worker, offline support |
| **Web Audio API** | Programmatic sound generation |
| **Lucide Icons** | Consistent icon set |

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
- Spring physics over linear easing
- 3D pressable buttons (Duolingo-style)
- Micro-interactions on every touch
- Respect `prefers-reduced-motion`

---

## Project Structure

```
dopamenu/
├── app/
│   ├── components/
│   │   ├── Menu.tsx           # Main view
│   │   ├── QuickPick.tsx      # Shuffle interaction
│   │   ├── CategoryCard.tsx   # Expandable category
│   │   ├── MenuItem.tsx       # Individual item
│   │   ├── Sparky.tsx         # Mascot character
│   │   ├── Celebration.tsx    # Confetti + message
│   │   ├── ReflectionModal.tsx# Post-completion prompt
│   │   ├── InsightsView.tsx   # Stats dashboard
│   │   ├── EnergySelector.tsx # Filter by energy
│   │   ├── StreakBadge.tsx    # Streak display
│   │   ├── SoundToggle.tsx    # Mute control
│   │   ├── AddItemModal.tsx   # Create new item
│   │   ├── Onboarding.tsx     # First-time flow
│   │   └── Button.tsx         # Reusable button
│   ├── globals.css            # CSS variables, utilities
│   ├── layout.tsx             # Root layout + fonts
│   └── page.tsx               # Entry point
├── lib/
│   ├── store.ts               # Zustand state
│   ├── types.ts               # TypeScript definitions
│   ├── constants.ts           # Categories, messages
│   ├── utils.ts               # Helpers (cn, etc.)
│   ├── haptics.ts             # Vibration API
│   ├── sounds.ts              # Web Audio generation
│   └── accessibility.ts       # Reduced motion hook
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── icons/                 # App icons
│   └── sw.js                  # Service worker
└── tailwind.config.ts         # Custom design tokens
```

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

Prompt Claude to research before building:

```
Before coding, research:
1. Why habit apps fail (Nir Eyal, behavioral design)
2. Huberman Lab dopamine/motivation science
3. Apple Design Award winning app patterns
4. ADHD app design (what actually works)
5. Gamification psychology (streaks, variable rewards)
```

### Step 3: Design-First Approach

Have Claude establish the design system before components:

```
Create a design system with:
- Color palette (with semantic meaning)
- Typography scale
- Animation principles (spring physics)
- Component patterns (3D buttons, cards)
- Accessibility considerations
```

### Step 4: Iterative Improvement

After initial build, prompt for award-winning polish:

```
Research what makes apps win Apple Design Awards.
Compare our app to Bears, Finch, Duolingo.
Identify gaps and implement:
- Character/mascot for emotional connection
- Sound design for micro-feedback
- Reflection prompts for mindfulness
- Stats/insights for progress visibility
```

### Key Claude Code Commands Used

```bash
# Research phase
claude "Research dopamine menu ADHD motivation science"

# Build phase
claude "Build the app autonomously from SPEC.md"

# Polish phase
claude "What's missing to win awards? Implement improvements"

# Deploy phase
claude "Push to GitHub, create comprehensive README"
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

### UX & Dopamine Design
- [The Dopamine Loop: How UX Designs Hook Our Brains](https://medium.com/design-bootcamp/the-dopamine-loop-how-ux-designs-hook-our-brains-bd1a50a9f22e)
- [Product Psychology: How Users Process Rewards](https://www.uxstudioteam.com/ux-blog/product-psychology-users-process-rewards)

### ADHD Apps That Work
- [Sensa: Best ADHD Apps 2024](https://sensa.health/blog/adhd-apps/)
- [Zapier: To-Do Apps That Work with ADHD](https://zapier.com/blog/adhd-to-do-list/)

### Dopamine Detox Reality
- [Harvard Health: Dopamine Fasting Misunderstanding](https://www.health.harvard.edu/blog/dopamine-fasting-misunderstanding-science-spawns-a-maladaptive-fad-2020022618917)
- [Cleveland Clinic: What Is a Dopamine Detox](https://health.clevelandclinic.org/dopamine-detox)

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

### Deploy to Vercel

```bash
npx vercel
```

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

---

## License

MIT License - feel free to use, modify, and share.

---

Built with curiosity about human motivation and respect for the ADHD brain.
