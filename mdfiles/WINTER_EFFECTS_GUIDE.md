# ❄️ Winter Effects Quick Reference Guide

A visual guide to all the winter-themed effects and where they're applied.

## 🎯 Component-by-Component Breakdown

### Sidebar (`components/client/Sidebar.tsx`)

```
┌─────────────────────────┐
│ ❄️ AGENTIC              │  ← .winter-text + .ice-glow on logo
│ WINTER IS COMING        │  ← Tagline with tracking
├─────────────────────────┤
│ [➕ New Mission]        │  ← .btn-winter
├─────────────────────────┤
│ 📋 Mission Control      │  ← Active: .ice-glow
│ 👁️ Live Ops             │  ← Hover: border glow
│ 👥 Agents               │
│ 📊 Usage                │
│ 📁 Armory               │
│ ⚙️ Settings             │
├─────────────────────────┤
│ Active Agents: 0        │  ← .ice-glow badge
│ "The lone wolf dies..." │  ← Winter quote
└─────────────────────────┘
    ↑ .frost-border on entire sidebar
```

### Header (`components/client/Header.tsx`)

```
┌──────────────────────────────────────────────────────────────┐
│ ⚡ SYSTEM STATUS: [Operational] | ⏰ ACTIVE TASKS: [0]...   │
│                                          🔔 🌙 👤 Commander   │
└──────────────────────────────────────────────────────────────┘
  ↑ backdrop-blur-sm + border separators
  Status badges: .ice-glow, .ice-pulse
  Icons: animated (pulse)
  User avatar: .ice-glow
```

### Dashboard (`app/page.tsx`)

#### Hero Section
```
        🛡️  WINTER IS COMING  ❄️
           ← .winter-text with shields and snowflake

    Agentic Workflow Platform
    Command your legion of AI agents from the frozen citadel
    The lone wolf dies, but the pack survives.

    [Deploy New Mission]  [Watch the Wall]
         ↑ .btn-winter       ↑ .btn-winter
```

#### Stats Cards
```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ ACTIVE TASKS ⚡ │ │ RUNNING AGENTS👥│ │ TODAY'S COST 💰 │
│      3          │ │       7         │ │    $12.50       │
│ +2 from yest... │ │ Across 3 miss...│ │ -23% from yes...│
└─────────────────┘ └─────────────────┘ └─────────────────┘
  ↑ .frost-border + hover:.ice-glow
  Numbers: .winter-text (emphasized)
  Icons: animated (pulse, winter-storm)
```

#### Action Cards
```
┌─────────────────────────────────┐
│ [🎯] MISSION CONTROL            │
│      Plan and dispatch          │
│                                 │
│ Create structured plans...      │
└─────────────────────────────────┘
  ↑ .frost-border + group hover:.ice-glow
  Icon container: .ice-glow on hover
  Titles: UPPERCASE with tracking
```

#### Recent Activity
```
┌─────────────────────────────────────────────┐
│ ⏰ RECENT ACTIVITY                          │
│ Latest updates from your active missions    │
├─────────────────────────────────────────────┤
│ [RUNNING] Authentication Refactor           │
│           Agent "Code-Analyzer"... 2 MIN AGO│
├─────────────────────────────────────────────┤
│ [COMPLETED] API Documentation Update        │
│           Successfully updated... 15 MIN AGO│
└─────────────────────────────────────────────┘
  ↑ .frost-border on card
  Activity items: hover border glow
  Badges: .rounded-sm
  Clock icon: .ice-pulse
```

## 🎨 CSS Classes Reference

### Border & Container Effects

| Class | Effect | Usage |
|-------|--------|-------|
| `.frost-border` | Icy border with subtle glow | Cards, containers |
| `.ice-glow` | Glowing ice aura | Active states, emphasis |
| `.glass-frost` | Frosted glass with blur | Overlays, modals |

### Text Effects

| Class | Effect | Usage |
|-------|--------|-------|
| `.winter-text` | Bold text with glow shadow | Headings, emphasis |
| `uppercase tracking-wide` | Spaced capitals | Labels, titles |
| `uppercase tracking-wider` | More spaced capitals | Subtitles |

### Animations

| Class | Effect | Duration |
|-------|--------|----------|
| `.winter-storm` | Pulsing glow | 3s loop |
| `.ice-pulse` | Border pulse | 2s loop |
| `.animate-spin-slow` | Slow rotation | 8s loop |
| `.animate-pulse` | Opacity pulse | Built-in |

### Button Effects

| Class | Effect | Usage |
|-------|--------|-------|
| `.btn-winter` | Hover lift + glow | All buttons |
| `.rounded-sm` | Sharp corners | All interactive elements |

## 🎭 Animation Triggers

### On Hover
- Cards → border glow intensifies
- Buttons → lift + ice glow
- Nav items → background + border change
- Icon containers → ice glow appears

### Always Active
- Primary icons → pulse animation
- Snowflakes → slow spin
- Clock icons → ice pulse
- Active nav items → ice glow

### On Focus/Active
- Navigation links → full ice glow + shadow
- Input fields → ice-colored ring
- Badges on active tasks → pulse

## 📋 Implementation Checklist

When adding new components with winter theme:

- [ ] Use `rounded-sm` instead of `rounded-lg`
- [ ] Add `.frost-border` to card containers
- [ ] Add `.ice-glow` to hover states
- [ ] Use UPPERCASE with `tracking-wide` for titles
- [ ] Apply `.btn-winter` to buttons
- [ ] Add subtle animations to icons (pulse, spin-slow)
- [ ] Use border separators with `border-border/50`
- [ ] Apply `transition-all` for smooth state changes

## 🌡️ Intensity Levels

### Subtle (Background elements)
- Radial gradients at 5-10% opacity
- Border transparency at 30-50%
- Muted foreground at 60% opacity

### Medium (Interactive elements)
- Hover states with 30% opacity glows
- Active borders at 60% opacity
- Icon colors at full saturation

### Strong (Emphasis)
- `.winter-text` with full glow
- `.ice-glow` at maximum intensity
- Primary badges with full saturation

## 🎯 Best Practices

1. **Consistency**: Use the same effect level for similar elements
2. **Performance**: Limit simultaneous animations to 3-4 on screen
3. **Accessibility**: Maintain contrast ratios for text
4. **Subtlety**: Let effects enhance, not overwhelm
5. **Responsiveness**: Effects scale with component size

---

**"The Night is Dark and Full of Terrors, But Our UI is Lit"** 🔥❄️


