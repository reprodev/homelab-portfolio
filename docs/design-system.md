# Homelab Project: Design System & Palette

This document serves as the official "Source of Truth" for all visual tokens across the `khurramnazir.com` ecosystem. Use these standards to ensure consistency in sub-projects and new features.

## 🎨 Primary Palette (Tailwind Tokens)

| Token | Hex Code | Usage |
| :--- | :--- | :--- |
| **Azure (Light)** | `#93c5fd` | Glow effects, sub-tags. |
| **Azure (DEFAULT)** | `#60a5fa` | Primary interaction, brand accent. |
| **Azure (Dark)** | `#2563eb` | Deep gradients, hover states. |
| **AmberGold (Light)** | `#fde68a` | Subtle ambient orbs, highlights. |
| **AmberGold (DEFAULT)** | `#fbbf24` | Secondary branding, `.com` accent. |
| **AmberGold (Dark)** | `#d97706` | Warning states, warm gradients. |
| **SlateCustom (900)** | `#0a0a0a` | Background floor, core surfaces. |
| **SlateCustom (800)** | `#18181b` | Cards, secondary surfaces. |
| **Emerald (400)** | `#34d399` | Success, KB branding. |

## 🅰️ Typography

- **Primary (Display)**: `Outfit` (sans-serif)
  - *Usage*: Headers, Titles, Hero Text.
- **Secondary (Mono)**: `JetBrains Mono` (monospace)
  - *Usage*: Code, Status Pills, Technical Labels, Tags.

## ✨ Micro-Animations (Keyframes)

- **`animate-sweep`**: A high-tech horizontal scanline for cards.
  - *Definition*: `translateX(-100%)` to `translateX(100%)`.
- **`animate-float`**: Ambient background movement.
  - *Definition*: Gentles `translate` and `scale` oscillation.
- **`gradient-text`**: Animated text gradients using `bg-clip-text`.

1. **Glassmorphism**: Always use `backdrop-blur-xl` with slightly transparent backgrounds (`bg-white/5`).
2. **Ambient Glow**: Use large, low-opacity (`opacity-10`) blurred absolute-positioned circles for background depth.
3. **Typography Scaling**: For large branding, use `text-[clamp(3rem,8.5vw,10rem)]` to handle fluid viewport widths.

---

## 🔮 Interactive & Retro Creative Design Upgrades (Option 2 Trends)

### 1. Spotlight Cursor Hover Borders (Vercel-Style)
*   **Aesthetic:** Card borders that are dark or semi-transparent by default, but glow with a cursor-following radial spotlight on hover.
*   **React Integration:** Tracks client coordinates dynamically via `onMouseMove` events.
*   **CSS Style:**
    ```css
    radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.15), transparent 80%)
    ```
*   **Performance Guardrail:** Bypasses coordinate tracking entirely on touch devices (`isMobile`) or where pointer hover is unsupported (`(hover: none)`) to preserve frame rates.

### 2. Skeuomorphic Inset Hardware LEDs
*   **Aesthetic:** Inset, three-dimensional physical status lights mimicking analog server hardware.
*   **Styling:**
    *   *Outer Bezel:* Deeply inset dark circle with dual-layered inner shadows:
        `bg-slate-950/80 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] border border-white/5`
    *   *Glass Core:* High-intensity radial sphere with an analog breathing glow:
        `shadow-[inset_0_-1px_1.5px_rgba(0,0,0,0.3)] animate-pulse`
    *   *Colors:* Emerald (`#10b981`), Azure (`#3b82f6`), Amber (`#f59e0b`).

### 3. Phosphor-CRT Screen Filter (`crt-screen` & `crt-text`)
*   **Aesthetic:** Immersive terminal display with horizontal scanlines, radial vignette, and glowing phosphorus text shadow.
*   **Implementation:**
    *   `::before` pseudo-element: Generates a repeating linear gradient of vertical scanlines.
    *   `::after` pseudo-element: Generates a radial vignette to create screen-depth shadow.
    *   `crt-text` class: Applies phosphor glow text shadow using CSS `text-shadow`.
*   **Mobile Guardrail:** Scanline flickering animations are restricted to screens $\ge 1024$px via CSS media queries to conserve energy and keep mobile scrolling at a smooth 60 FPS.
*   **Z-Index Rule:** Interactive terminal texts, logs, and click actions must use explicit `relative z-20` layers to ensure the scanline pseudo-elements (confined to `z-10` with `pointer-events: none`) do not eat click events.

### 4. Bento Blueprint Dots Canvas (`blueprint-dots`)
*   **Aesthetic:** Subtle technical dot-matrix background blueprint pattern that aligns under bento grid margins.
*   **CSS Class:**
    ```css
    .blueprint-dots {
      background-size: 24px 24px;
      background-image: radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    }
    ```
*   **Performance:** Offloaded to native browser background rasterization, which does not impact the DOM tree.

### 5. Interactive SVG Topology Traces & Laser Waves
*   **Aesthetic:** High-fidelity system networking diagrams featuring circuit trace path coordinates, glowing flowing currents, and laser-like packet circles.
*   **Design Tokens:**
    *   *Circuit Traces:* Native SVG paths with clean grid alignment coordinates (e.g. `d="M 40,50 L 140,50 L 240,50 L 350,50"`), featuring transparent-green borders:
        `stroke="rgba(16,185,129,0.15)" strokeWidth="2"`
    *   *Laser Particle Waves:* Floating glowing particles traversing paths dynamically.
        `stroke="url(#pathGradient)" strokeDasharray="10, 80" strokeDashoffset="100"` with smooth linear framer-motion loops.
    *   *Sonar Ripples:* Multi-layered pulsating rings emitting from active topology nodes to indicate active sync:
        `animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}`

### 6. Skeuomorphic Synthesized Soundscapes & Tactile Audio Cues
*   **Aesthetic:** Zero-dependency, zero-media-file audio layer generating premium tactile and ambient soundscapes via native Web Audio API oscillators.
*   **Parameters:**
    *   *Server hum base:* Dual sine oscillators at $50\text{Hz}$ and $95\text{Hz}$ mixed with white noise. Passed through a Biquad lowpass filter at $140\text{Hz}$ with resonance set to `1` to eliminate harsh hiss.
    *   *Mechanical hover click:* Sine oscillator starting at $400\text{Hz}$ and rapidly ramping down to $80\text{Hz}$ over $0.05\text{s}$, with peak volume at `0.02`.
    *   *Portal open click:* Sine oscillator starting at $80\text{Hz}$ ramping up to $480\text{Hz}$ over $0.12\text{s}$ to deliver a mechanical unlatch signature.
    *   *Deployment phase ping:* Triangle oscillator at $880\text{Hz}$ ramping down to $220\text{Hz}$ over $0.15\text{s}$ at `0.04` volume.
    *   *Deployment success chime:* Dual oscillator chord (C5 at $523.25\text{Hz}$ and C6 at $1046.5\text{Hz}$) played sequentially or in harmony with linear amplitude envelopes.

---

## 🧠 Mobile Performance Hard Rules
To prevent creative layout shifts, UI locks, or stutters on low-power touchscreens:
1.  **Never Track Coordinates on Touch:** Touch screen taps snap coordinates instantly, blocking the main thread. Always gate coordinate states with `isMobile` boundaries.
2.  **No Dynamic Filters on Scroll:** Keep blurs and blend-modes to static backgrounds; running high-frequency filters on scroll causes layout stuttering.
3.  **Media Query Animation Constraints:** Keep animations like flickers or heavy rotations gated behind `@media (min-width: 1024px)`.
4.  **Pointer Event Disabling:** Always set `pointer-events: none` on ambient overlays to keep them click-through safe.
5.  **Audio Resource Garbage Collection:** Always explicitly close or disconnect native oscillator and filter nodes upon component unmount to prevent browser audio context thread saturation.

