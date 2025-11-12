# ❄️ Winter is Coming Theme

A badass, Game of Thrones-inspired "Winter is Coming" theme for the Agentic Workflow Platform.

## 🎨 Theme Overview

This theme transforms the application into a frozen citadel with:

- **Deep icy blues and slate grays** - Evoking the cold of the North
- **Stark white accents** - Like fresh snow in the moonlight
- **Medieval fortress aesthetics** - Sharp, angular design with frost effects
- **Epic atmosphere** - Foreboding and powerful

## 🌨️ Color Palette

### Dark Theme (The Long Night)
- **Background**: Deep cold night (`oklch(0.12 0.02 240)`)
- **Foreground**: Stark white like snow (`oklch(0.95 0.01 220)`)
- **Primary**: Ice blue (`oklch(0.55 0.15 220)`)
- **Accent**: Bright ice accent (`oklch(0.45 0.12 210)`)
- **Destructive**: Cold fire red (`oklch(0.50 0.20 25)`)

### Light Theme (Dawn Before the Long Night)
- **Background**: Frosty white (`oklch(0.98 0.01 240)`)
- **Foreground**: Deep cold (`oklch(0.15 0.02 240)`)
- **Primary**: Deep icy blue (`oklch(0.35 0.08 240)`)
- **Accent**: Ice crystal blue (`oklch(0.65 0.12 220)`)

## ✨ Special Effects

### CSS Classes Available

- `.frost-border` - Adds an icy border with subtle glow
- `.ice-glow` - Creates a glowing ice effect around elements
- `.winter-text` - Adds text shadow and tracking for emphasis
- `.glass-frost` - Frosted glass effect with backdrop blur
- `.winter-storm` - Animated pulsing glow effect
- `.ice-pulse` - Pulsing border animation
- `.btn-winter` - Enhanced button with hover effects
- `.animate-spin-slow` - 8-second rotation for snowflakes

## 🏰 Thematic Elements

### Branding
- **Logo**: Snowflake icon with slow rotation
- **Motto**: "Winter is Coming" with "The lone wolf dies, but the pack survives"
- **User**: Default "Lord Commander" title

### Renamed Sections
- **Mission Control** → Command center for agent deployment
- **Live Ops** → "The Wall" - Monitoring station
- **Agents** → "Night's Watch" - Your AI legion
- **Armory** → Storage for plans and templates
- **Usage** → "The Ledger" - Cost tracking

## 🎯 Design Philosophy

1. **Sharp & Angular** - Rounded corners minimized to `0.25rem`
2. **High Contrast** - Clear hierarchy with ice blue accents
3. **Atmospheric** - Subtle radial gradients create depth
4. **Responsive** - All effects work across screen sizes
5. **Performance** - CSS animations are GPU-accelerated

## 🚀 Usage

The theme is automatically applied and defaults to dark mode. Users can toggle between light and dark themes using the theme switcher in the header.

### Adding Winter Effects to Components

```tsx
// Frost border with ice glow on hover
<Card className="frost-border hover:ice-glow transition-all rounded-sm">
  {/* content */}
</Card>

// Winter-styled text
<h1 className="winter-text">WINTER IS COMING</h1>

// Animated snowflake
<Snowflake className="animate-spin-slow ice-glow" />
```

## 🎨 Customization

All color values are defined in `app/globals.css` using OKLCH color space for perceptual uniformity. Modify the CSS variables in `:root` and `.dark` to adjust the theme.

## ⚡ Performance Notes

- Animations use `transform` for GPU acceleration
- `backdrop-filter` includes `-webkit-` prefix for Safari support
- Color transitions are smooth with `transition-all`
- Frost effects use low-opacity shadows for performance

---

**"The North Remembers"** - Your agentic workflow platform, forged in ice and ready for the long night ahead. ❄️⚔️


