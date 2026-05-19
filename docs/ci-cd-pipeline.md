# DEVOPS: Vite Build & Deployment Workflow
> **Target:** Khurram Nazir CI/CD Pipeline  
> **Aesthetic Standard:** Gold Master V4.2.0 Compliant  
> **Status:** Operational

This document records the DevOps workflows, Vite production build steps, and automated GitHub Actions scripts used to compile and host the public portfolio infrastructure visualizer.

---

## 1. Local Production Compilation & Validation
To test and compile the production bundle locally prior to pushes, standard npm package scripts are defined:

```bash
# 1. Clean build cache and install dependencies
npm ci

# 2. Run local development server (HMR active)
npm run dev

# 3. Compile production-optimized static distribution bundle
npm run build

# 4. Preview locally compiled build target output (dist directory)
npm run preview
```

---

## 2. GitHub Actions YAML Spec (`deploy.yml`)
The site utilizes a standard GitHub Actions pipeline that triggers automatically on every push to the `main` branch. This builds the static React assets via Vite and pushes the output compilation target directory (`dist/`) directly to the `gh-pages` branch.

```yaml
name: Deploy Homelab Dashboard to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  build-and-deploy:
    concurrency: ci-${{ github.ref }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository Source
        uses: actions/checkout@v4

      - name: Setup Node.js Environment (LTS 20)
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Project Dependencies
        run: npm ci

      - name: Compile Production Bundle (Vite)
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
          clean: true
```

---

## 3. Production Optimizations (Vite Integration)
The Vite configuration (`vite.config.js`) enforces several high-fidelity performance constraints to ensure fast load speeds:
1.  **Code Splitting / Lazy Loading:** Large component models (like the complex `SplashHub.jsx` entry screen) are decoupled from the main app bundle via standard React dynamic import strategies.
2.  **Asset Compression:** SVG vector definitions are optimized to reduce bundle footprint, while styling sheets are minified down to inline CSS segments.
3.  **No Placeholders:** Visual assets (including brand vectors and dynamic nodes) are completely embedded as SVG paths directly inside JSX templates, eliminating network latency overheads.
