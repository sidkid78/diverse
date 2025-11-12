# ⚡ Quick Start: Winter Theme

Get the winter-themed Agentic Workflow Platform up and running in minutes.

## 🚀 Installation & Setup

```bash
# Navigate to the project directory
cd agentic-workflow/agentic

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**

## 🎨 What You'll See

### Default Theme: Dark Mode ❄️
The app launches in dark mode by default with the full winter theme:
- Deep icy blue backgrounds
- Stark white text
- Ice glow effects on interactive elements
- "Winter is Coming" branding

### Toggle Light Mode ☀️
Click the sun/moon icon in the top-right header to switch between themes.

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app/globals.css` | Color palette & winter effect classes |
| `app/layout.tsx` | App structure & theme configuration |
| `components/theme-provider.tsx` | Theme management |
| `app/page.tsx` | Dashboard with winter styling |
| `components/client/Sidebar.tsx` | Navigation with winter branding |
| `components/client/Header.tsx` | Header with status indicators |

## 🎯 Quick Customization

### Change Primary Color

Edit `app/globals.css` line 90:
```css
--primary: oklch(0.55 0.15 220); /* Change 220 (hue) to any value 0-360 */
```

### Adjust Ice Glow Intensity

Edit `app/globals.css` around line 153:
```css
.ice-glow {
  box-shadow: 
    0 0 10px oklch(0.55 0.15 220 / 0.3),  /* Increase 0.3 for stronger glow */
    0 0 20px oklch(0.55 0.15 220 / 0.15),
    0 0 30px oklch(0.55 0.15 220 / 0.1);
}
```

### Change Border Sharpness

Edit `app/globals.css` line 47:
```css
--radius: 0.25rem; /* Increase for rounder, decrease for sharper */
```

### Modify Animation Speed

Edit `app/globals.css` around line 195-206:
```css
.animate-spin-slow {
  animation: spin-slow 8s linear infinite; /* Change 8s to speed up/slow down */
}
```

## 🔧 Adding Winter Effects to New Components

### Basic Card with Frost Border
```tsx
<Card className="frost-border hover:ice-glow transition-all rounded-sm">
  {/* your content */}
</Card>
```

### Winter-Styled Button
```tsx
<Button className="btn-winter rounded-sm">
  Click Me
</Button>
```

### Epic Title Text
```tsx
<h1 className="winter-text text-3xl uppercase tracking-wider">
  YOUR TITLE
</h1>
```

### Animated Icon
```tsx
<Snowflake className="w-6 h-6 text-primary ice-glow animate-spin-slow" />
```

## 📚 Documentation

- **Full Theme Details**: See `WINTER_THEME.md`
- **All Changes Made**: See `THEME_CHANGES.md`  
- **Effect Reference**: See `WINTER_EFFECTS_GUIDE.md`

## 🐛 Troubleshooting

### Theme Not Loading
1. Check that `className="dark"` is on the `<html>` tag in `app/layout.tsx`
2. Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser console for errors

### Colors Look Wrong
- Ensure you're using a modern browser (Chrome 111+, Firefox 113+, Safari 16.4+)
- OKLCH colors require recent browser versions
- Older browsers will fall back to default colors

### Animations Not Working
- Check that `tw-animate-css` is installed: `npm install tw-animate-css`
- Verify `postcss.config.mjs` includes `@tailwindcss/postcss`

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## 🎮 Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## ⚙️ Environment Variables

No special environment variables needed for the winter theme. It works out of the box!

## 🌐 Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 111+ | Full support including OKLCH |
| Firefox | 113+ | Full support |
| Safari | 16.4+ | Requires `-webkit-` prefixes (included) |
| Edge | 111+ | Based on Chromium |

## 📝 Notes

- **Performance**: All animations are GPU-accelerated for smooth performance
- **Accessibility**: Maintains WCAG contrast ratios for text
- **Mobile**: Fully responsive on all screen sizes
- **Dark Mode**: Default theme optimized for dark mode experience

## 🎉 Next Steps

1. Explore the dashboard at `/`
2. Check out Mission Control at `/plans/new`
3. View The Wall (Live Ops) at `/tasks`
4. Manage Night's Watch at `/agents`
5. Review The Ledger at `/usage`

## 💡 Tips

- Hover over elements to see ice glow effects
- Watch for animated icons (pulse, spin, glow)
- Notice the frost borders on cards
- Check out the winter quotes throughout the app
- Try both light and dark themes

---

**"The Night is Dark and Full of Terrors, but Your UI is Epic"** ❄️⚔️

For questions or issues, refer to the documentation files or check the code comments.


