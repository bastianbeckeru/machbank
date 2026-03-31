# MACHBANK UI Prototype

A minimalist and intuitive mobile-first neobanking interface prototype. The goal of this project is to experiment and achieve the ideal UI/UX for a modern banking app—comfortable, sleek, and free of visual noise.

## Key Features

- **Mobile-First Shell:** Uses a custom frame to simulate a smartphone environment, ensuring the UI remains focused even on desktop browsers.
- **Micro-Interactions:** Buttery smooth transitions and odometer-style animations using [Motion](https://motion.dev/).
- **Tactile Feedback:** Incorporates `web-haptics` to deliver natural vibration callbacks on user input (supported on most mobile devices).
- **Modern Stack:** Built on the bleeding edge with Next.js (App Router), Tailwind CSS v4, TypeScript, and BiomeJS.

## Getting Started

1. Install the dependencies using pnpm:
   ```bash
   pnpm install
   ```
2. Start the development server:
   ```bash
   pnpm dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

> **Tip:** For the most authentic experience, try loading the prototype on your smartphone to test out the haptic feedback! The PIN is `3214`.

## Deployment

Since this is a standard Next.js application, the easiest way to deploy it is via the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

Alternatively, you can build it for production and run it on any Node.js hosting service:
```bash
pnpm build
pnpm start
```

## Purpose

This repository operates as a public playground. Feel free to explore the code, test new interface paradigms, or fork it to try out your own minimalist dashboard concepts!
