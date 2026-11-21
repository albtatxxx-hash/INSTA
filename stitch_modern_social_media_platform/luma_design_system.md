---
name: "Luma Design System"
description: "Minimalist, content-first visual social media design system with dual Light/Dark polarity, subtle glassmorphism, and a sunset-to-violet gradient reserved exclusively for active Story rings and primary notification badges."
---

## Overview

Luma is a modern, content-first visual social media platform built to let photography and short-form video command the viewport without visual noise. The interface pairs ultra-clean monochrome surfaces with crisp geometric typography (`Plus Jakarta Sans` and `Inter`) and subtle frosted-glass overlays (`backdrop-blur`) for modals, floating navigation bars, and media overlays.

Color restraint is central to the experience: surfaces remain neutral in both Light Mode (`#FFFFFF` / `#FAFAFA`) and Dark Mode (`#0A0A0A` / `#121212`), while a vibrant sunset-orange, magenta, and violet gradient is reserved exclusively for active Story rings and primary notification badges.

## Colors

Luma supports both **Light Mode** and **Dark Mode** as first-class polarities. Surfaces step cleanly through neutral tiers separated by hairline borders (`#EFEFEF` in light, `#262626` in dark), ensuring photography remains the hero.

- **Primary:** High-contrast monochrome (`#0F0F0F` in light, `#FFFFFF` in dark) for primary actions, active navigation states, and crisp iconography.
- **Secondary:** Clean action blue for Follow buttons, links, and interactive text triggers.
- **Gradient Accents:** `accent-orange`, `accent-magenta`, and `accent-violet` form the signature Story ring and notification badge gradient.

```yaml
colors:
  accent-orange: "#FF7A00"
  accent-magenta: "#E1306C"
  accent-violet: "#833AB4"
  like-red: "#FF3040"
  verified-blue: "#0095F6"
  success: "#16A34A"
  on-success: "#272727"
  error: "#DC2626"
  on-error: "#FFFFFF"
  light:
    primary: "#0F0F0F"
    on-primary: "#FFFFFF"
    secondary: "#0070D2"
    on-secondary: "#FFFFFF"
    background: "#FFFFFF"
    on-background: "#0F0F0F"
    surface: "#FFFFFF"
    surface-container-low: "#FAFAFA"
    surface-container: "#F4F4F5"
    surface-container-high: "#EFEFEF"
    on-surface: "#0F0F0F"
    on-surface-variant: "#6E6E73"
    outline: "#8E8E93"
    outline-variant: "#EFEFEF"
    scrim: "#0F0F0F"
  dark:
    primary: "#FFFFFF"
    on-primary: "#0A0A0A"
    secondary: "#3897F0"
    on-secondary: "#0A0A0A"
    background: "#0A0A0A"
    on-background: "#F5F5F5"
    surface: "#0A0A0A"
    surface-container-low: "#121212"
    surface-container: "#1A1A1A"
    surface-container-high: "#262626"
    on-surface: "#F5F5F5"
    on-surface-variant: "#A1A1AA"
    outline: "#71717A"
    outline-variant: "#262626"
    scrim: "#000000"
```

## Typography

Luma pairs **Plus Jakarta Sans** for brand marks, modal titles, and section headings with **Inter** for feed captions, usernames, timestamps, and UI controls. **JetBrains Mono** handles tabular numeric counters where alignment matters.

```yaml
typography:
  display-lg:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 44px
    letterSpacing: -0.75px
  display-lg-mobile:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 34px
    letterSpacing: -0.5px
  headline-lg:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 32px
    letterSpacing: -0.4px
  headline-md:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: -0.25px
  title-md:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 22px
    letterSpacing: -0.1px
  body-md:
    fontFamily: "Inter"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
  body-sm:
    fontFamily: "Inter"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: 0px
  label-lg:
    fontFamily: "Inter"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: 0px
  label-md:
    fontFamily: "Inter"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0.1px
  label-sm:
    fontFamily: "Inter"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 14px
    letterSpacing: 0.2px
  mono-sm:
    fontFamily: "JetBrains Mono"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0px
```

## Layout & Spacing

Desktop uses a balanced **3-column architecture**: a fixed `240px` left navigation rail, a centered `max-w-[630px]` scrollable main feed, and a `320px` right discovery & profile sidebar. On tablet and mobile viewports (`< 1024px` / `< 768px`), the left rail collapses into a sleek bottom fixed navigation bar paired with a sticky glassmorphic top header.

```yaml
spacing:
  gutter-xs: 4px
  gutter-sm: 8px
  gutter-md: 16px
  gutter-lg: 24px
  gutter-xl: 32px
  section: 48px
  page-margin: 24px
```

## Elevation & Depth

Hierarchy relies on **hairline borders** (`1px solid` `outline-variant`) and subtle tonal surface stepping (`surface` → `surface-container-low` → `surface-container`) rather than heavy drop shadows. Modals, sticky mobile headers, and bottom navigation bars use **subtle glassmorphism** (`backdrop-blur-md` over translucent surfaces) so underlying photography softly bleeds through.

## Shapes

Cards, media frames, and buttons use clean, modern corner radii: `12px` (`md`) for post media containers and explore tiles, `16px` (`lg`) for modals and floating cards, `8px` (`DEFAULT`) for buttons and inputs, and `9999px` (`full`) for avatars, story rings, and pill badges.

```yaml
rounded:
  sm: 4px
  DEFAULT: 8px
  md: 12px
  lg: 16px
  xl: 24px
  full: 9999px
```

## Motion & Micro-interaction

Micro-interactions are tactile and immediate. Like-button taps and double-tap heart bursts spring outward cleanly, hover overlays fade in smoothly, and modals decelerate into view. Only `transform` and `opacity` are animated to maintain 60fps scrolling.

```yaml
motion:
  state-change:
    duration: 150ms
    delay: 0ms
    timingFunction: cubic-bezier(0.2, 0, 0, 1)
  heart-burst:
    duration: 450ms
    delay: 0ms
    timingFunction: cubic-bezier(0.175, 0.885, 0.32, 1.275)
  surface-enter:
    duration: 240ms
    delay: 0ms
    timingFunction: cubic-bezier(0.2, 0, 0, 1)
  surface-exit:
    duration: 160ms
    delay: 0ms
    timingFunction: cubic-bezier(0.3, 0, 1, 1)
```

## Voice & Content Strategy

Copy is concise, human, and unobtrusive:

- **Tone:** Warm, editorial, and minimal. Avoid marketing buzzwords.
- **Capitalisation:** Sentence case for captions, comments, and helper text; concise title-case for navigation items ("Home", "Explore", "Reels", "Messages", "Notifications", "Create", "Profile").
- **Engagement:** Use compact tabular numbers (`1,428 likes`, `42 comments`) and short relative timestamps (`2h`, `5h`, `1d`).

## Components

Component implementations live as individual HTML sticker sheet files in
`components/`. Each file contains the canonical, styled HTML components with
`<!-- COMPONENT: name -->` comment markers. Read each file before use.

- **Avatar** → `@components/avatar.html`: `avatar-image`, `avatar-editable`
- **Button** → `@components/button.html`: `button-primary`, `button-icon`, `button-with-icon`
- **Card** → `@components/card.html`: `card-elevated`, `card-action`, `card-interactive`, `card-interactive-2`
- **Modal** → `@components/modal.html`: `modal-standard`, `modal-alert`, `modal-drawer`
- **Typography** → `@components/typography.html`: `typography-display`, `typography-body`, `typography-label`
