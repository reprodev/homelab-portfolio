# 🚀 Homelab Dashboard Deployment Guide (V1.1)

This project has been modernized into a React/Vite architecture with an automated **GitHub Actions** deployment pipeline. Use this guide to sync your local environment to your public repository.

## 📋 Required Files for GitHub Actions
To enable the automated build and deployment, ensure the following files and folders are pushed to the **root** of your public repository:

| Content | Details |
| :--- | :--- |
| **`src/`** | The entire React source code (Components, Assets, Logic). |
| **`.github/`** | The hidden folder containing the `deploy.yml` workflow. |

---

## 🧹 Pre-Deployment: Housekeeping

Before you copy the new files into your live Git folder, you **MUST delete** the following legacy files to prevent conflicts with the new React architecture:

*   **Delete**: `index.html` (The old vanilla version)
*   **Delete**: `script.js`
*   **Delete**: `styles.css`

*The new React version uses its own internal build logic, so these old files are no longer required for the site to function.*

---

| Content | Details |
| :--- | :--- |
| **`index.html`** | The entry point for the dashboard. |
| **`package.json`** | Project dependency metadata. |
| **`package-lock.json`** | Version locking for the build process. |
| **`vite.config.js`** | Vite configuration (Pre-set for relative pathing). |
| **`tailwind.config.js`** | Functional design system tokens. |
| **`postcss.config.js`** | Tailwind CSS processing instructions. |

---

## 🛡️ Security & Zero-Leak Audit
*   **Username**: Zero references to `KnightboxOC` exist in the code.
*   **Absolute Paths**: All `C:\Users\...` references have been modernized to relative `./` paths.
*   **Network IPs**: All internal addresses (`192.168.0.X`) have been replaced with descriptive tokens (e.g., `<PRIMARY_SUBNET>`).
*   **Branching**: The automated reconciler only builds the **Safely Sanitized** source code.

---

## ⌨️ Deployment Workflow (Git Commands)

Run these commands inside your **live Git folder** whenever you want to update the public site:

1.  **Sync your files** (Copy the list above into this directory).
2.  **Add and Commit**:
    ```bash
    git add .
    git commit -m "🚀 Deployment: Modernized Landscape (V1.1)"
    ```
3.  **Push to GitHub**:
    ```bash
    git push
    ```

---

## ⚠️ CRITICAL: One-Time GitHub Configuration
If your site shows a **White Screen** after pushing, you must perform this one-time step in your GitHub repository settings:

1.  Go to **Settings** ➔ **Pages**.
2.  Under **Build and Deployment** ➔ **Branch**:
    *   **Source**: Select **"Deploy from a branch"**.
    *   **Branch**: Select **`gh-pages`**. (Note: This branch is automatically created by the GitHub Action).
    *   **Folder**: Select **`/(root)`**.
3.  Click **Save**.
4.  Wait 1-2 minutes for the site to re-deploy.

---

*Once pushed, you can track the live build progress in the **Actions** tab of your GitHub repository. The site will be automatically published to the `gh-pages` branch upon completion.*
