<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:tooling-rules -->
# Tooling

- **Package manager**: Always use `pnpm`. Never use `npm` or `yarn`.
- **Linter/Formatter**: Always use [Biome](https://biomejs.dev/). Never use ESLint or Prettier.
<!-- END:tooling-rules -->

<!-- BEGIN:code-style-rules -->
# Code Style

- Write efficient, performant code — avoid unnecessary abstractions and over-engineering.
- No unnecessary comments. Code should be self-explanatory.
- All code, names, and comments must be in English.
- Prioritize legibility and maintainability.
<!-- END:code-style-rules -->


<!-- BEGIN:ui-rules -->
# UI Components & Styling

Component libraries: shadcn/ui and Base UI. Always prefer these over custom-built alternatives.
Styling: Tailwind CSS only. No inline styles or CSS modules unless unavoidable.
Respect and extend the existing app styles — do not introduce new design tokens, color schemes, or patterns that break visual consistency.
When adding new UI, match the tone and style of existing components.

<!-- END:ui-rules -->

<!-- BEGIN:animation-rules -->
# Animations

Use the Motion library for all animations.
Keep animations natural and minimal — only for essential interactions (e.g. mounting/unmounting, state transitions).
No decorative or attention-grabbing animations.

<!-- END:animation-rules -->


<!-- BEGIN:ux-rules -->
# UX

The app must be intuitive and simple to use — UI should speak for itself.
Avoid explicit hints, and onboarding cues unless absolutely necessary.

<!-- END:ux-rules -->

<!-- BEGIN:charts-rules -->
# Charts
Use [shadcn/ui](https://ui.shadcn.com/docs/components/chart) for charts, which uses [Recharts](https://recharts.org/).
<!-- END:charts-rules -->