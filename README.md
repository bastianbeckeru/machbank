# MACHBANK UI
A UI clone of the MACHBANK App.

This project exists because I believe MACH deserves a better interface — so I built it.

Feel free to explore.

## Stack

- **Framework** — NextJS 16 (App Router)
- **Styling** — TailwindCSS
- **Linter** - BiomeJS
- **Package manager** — pnpm

## Getting Started
```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Changes vs Original App

### Auth
- Add animation when the user logs in with PIN.
- Add dynamic FaceID / TouchID icons based on the device.

### Home Header
- Remove hamburger icon.
  - You're already showing a button through user avatar.
- Add contextual hello message.
  - Good morning, afternoon, happy birthday and more. More warm and close to the user.

### Home Sidebar
- Uppercase section titles, compact the buttons and remove the borders. This look cleaner.
- Reorder and rename items.

### Balances Carousel
- Remove Credit Card balance if the user doesn't have one.
  - A $0 balance with a CTA to activate the card is redundant when Home already has multiple activation CTAs.
- Remove Cashback balance.
  - It fits better in the Benefits section, where it adds value and encourages users to discover other discounts.

### Quick Actions
- Exclude MACH Premium.
  - It's not a quick action, it's a product.
- Exclude Credit Card.
  - It's not a quick action, it's a product.

### Cards Section
- Homologate the design through cards.
