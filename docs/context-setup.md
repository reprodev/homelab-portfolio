# Multi-Stage Splash Hub: Context-Aware Setup Guide

This guide is for AI Agents (Gemini, Claude, Codex) to automatically configure the `ConfigurableSplashHub.jsx` based on the current workspace context.

## 🧠 Core Strategy for AI Agents

Before implementing or modifying the Splash Hub, perform the following research steps:

1.  **Check `package.json`**: Identify the project name and description.
2.  **Check `tailwind.config.js`**: Identify the primary branding colors (look for `azure`, `amberGold`, `primary`, etc.).
3.  **Check `src/index.css`**: Note existing animations (like `pulse`, `float`, or `sweep`).
4.  **Analyze Ecosystem**: Look for references to sister sites or sub-portals (e.g., in footer links or navigation).

## 🤖 Standard Implementation Prompt

Use the following prompt to self-configure the component:

> "Base your implementation on the `docs/templates/ConfigurableSplashHub.jsx` template. Analyze the current 프로젝트 context to:
> 1. Set `brandName` and `domainName` from the project's site title.
> 2. Map `primaryAccentColor` and `secondaryAccentColor` to the established Tailwind palette.
> 3. Define 3 `PortalCards` that link to the main site sectors.
> 4. Ensure stages transition cleanly using the project's existing Framer Motion version."

## 🎨 Token Mapping Table

When configuring the template, map project tokens to these props:

| Hub Prop | Source Token | Default Value |
| :--- | :--- | :--- |
| `brandName` | Site Owner Name | "Khurram Nazir" |
| `domainName` | `window.location.hostname` | "khurramnazir.com" |
| `primaryAccentColor` | `theme.extend.colors.primary` | "azure" |
| `secondaryAccentColor` | `theme.extend.colors.accent` | "amberGold" |
| `cards` | Sidebar/Footer Links | (Music, KB, Homelab) |

## 🛠 Manual Configuration Check
- Ensure that the WebP hero images exist in `public/splash/` before passing them to the `cards` prop.
- Verify that the `SplashHub` is imported once and only once at the top level of `App.jsx`.
- **Development Server Port Note**: Vite defaults to port `5173`. However, if secondary ecosystems (like the Service Desk Sim) are running, Vite automatically increments and deploys the Homelab site to port `5174`. Always double-check browser logs to match coordinates correctly.

## 📚 Knowledge Documentation
For detailed insights into the collaborative engineering process and agent roles:
- **[Codex Knowledge](file:///c:/Users/KnightboxOC/Desktop/homelab-site/docs/codex.md)**: Scaffolding and Utility Core standards.
- **[Claude Knowledge](file:///c:/Users/KnightboxOC/Desktop/homelab-site/docs/claude.md)**: Logic, State Management, and Synthesis protocols.
- **[Agents Framework](file:///c:/Users/KnightboxOC/Desktop/homelab-site/docs/agents.md)**: Overall Multi-Agentic workflow and "Gold Master" verification.
- **[Showstoppers Handbook](file:///c:/Users/KnightboxOC/Desktop/homelab-site/docs/showstoppers.md)**: Rigid rules and failures to avoid in visual, audio, state, and mobile layouts.


