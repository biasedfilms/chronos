# CHRONOS

**Discover the time you've lived.**

[**→ Open CHRONOS**](YOUR_VERCEL_URL)

CHRONOS is a minimalist interactive web experience that turns your date of birth into a live representation of the time you've lived.

Enter a birth date and CHRONOS calculates your age, total time lived, and the time remaining until your next birthday.

## Features

- Date of birth input with `DD / MM / YYYY` formatting
- Press **Enter** to submit the date
- Animated lifetime calculation
- Total days, years, months, weeks, hours, minutes, and seconds lived
- Live lifetime counter
- Live countdown to the next birthday
- "Born On" date display
- Intelligent singular/plural age labels
- Premium CHRONOS result-card preview
- Downloadable 1080 × 1350 result card
- Responsive desktop, tablet, and mobile layouts
- Manrope typography
- Warm Champagne Gold visual accent
- Reduced-motion support
- Keyboard-accessible interactions

## Design

CHRONOS uses a restrained visual system built around:

- **Background:** `#050505`
- **Primary:** `#F5F5F5`
- **Secondary:** `#A0A0A0`
- **Muted:** `#666666`
- **Border:** `#242424`
- **Accent:** `#C8A96B`
- **Dark Gold:** `#8F7546`

The interface is intentionally minimal, cinematic, and editorial rather than dashboard-heavy or overly futuristic.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Canvas API for result-card generation
- Google Fonts — Manrope

No frontend framework is required.

## Project Structure

```text
CHRONOS/
├── assets/
│   └── images/
│       └── favicon.png
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── animations.js
│   └── calculations.js
├── index.html
├── LICENSE
└── README.md
```

## How It Works

1. Enter a birth date in `DD / MM / YYYY` format.
2. Click **DISCOVER** or press **Enter**.
3. CHRONOS calculates the current lifetime values.
4. The results animate into view.
5. The lifetime statistics continue updating in real time.
6. The birthday countdown updates every second.
7. Use **SHARE MY CHRONOS** to preview the result card.
8. Download the result as a PNG.

## Result Card

The result card is generated at:

```text
1080 × 1350 px
```

It uses the current live CHRONOS values at the moment the card is generated, so the downloaded image reflects the latest lifetime statistics and birthday countdown.

## Local Development

CHRONOS is a static website and can be run with any simple local web server.

For example, with VS Code and Live Server:

```text
Open index.html
→ Start Live Server
→ Open the provided localhost URL
```

## Deployment

CHRONOS can be deployed as a static site through Vercel or GitHub Pages.

No backend is required.

## Author

**Mikael Kalesaran**

© 2026 Mikael Kalesaran. All rights reserved.

---

Built as a personal web development project focused on interaction design, animation, responsive layout, and vanilla JavaScript.
