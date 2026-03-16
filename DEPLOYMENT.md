# Deployment Guide — B&M Training LMS

## Prerequisites

- Node.js 18+ installed locally
- A GitHub repository named `bm-training-lms`
- GitHub Pages enabled on the repository (Settings > Pages > Source: "Deploy from a branch" > Branch: `gh-pages`)

## Environment Variables

### VITE_POWERAUTOMATE_URL

The app POSTs completion data to a Power Automate HTTP trigger. The URL is stored as an environment variable so it stays out of source control.

**For local development:**
1. Copy `.env.example` to `.env`
2. Paste your Power Automate webhook URL as the value:
   ```
   VITE_POWERAUTOMATE_URL=https://prod-XX.westus.logic.azure.com/workflows/...
   ```
3. Restart the dev server (`npm run dev`)

**For GitHub Actions builds:**
1. Go to your repo on GitHub: Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Name: `VITE_POWERAUTOMATE_URL`
4. Value: your full Power Automate HTTP trigger URL
5. Click "Add secret"

The workflow at `.github/workflows/deploy.yml` passes this secret to the build step via the `env` block. Vite inlines the value at build time — it does not appear in the workflow logs.

## Deploying

### Option A: GitHub Actions (automatic)

Every push to the `main` branch triggers the Actions workflow, which:
1. Checks out the code
2. Installs dependencies (`npm ci`)
3. Builds with `VITE_POWERAUTOMATE_URL` from repo secrets
4. Deploys the `dist/` folder to the `gh-pages` branch

The deployed site will be available at:
```
https://<your-github-username>.github.io/bm-training-lms/
```

### Option B: Manual deploy from your machine

```bash
npm run deploy
```

This runs `npm run build` (via the `predeploy` script) then pushes `dist/` to the `gh-pages` branch using the `gh-pages` package.

Note: For the manual deploy to include the Power Automate URL, your local `.env` must contain `VITE_POWERAUTOMATE_URL`.

## Embedding in SharePoint

To embed the deployed LMS in a SharePoint page:

1. Edit the SharePoint page where you want the training module
2. Add a new web part: click **+** > search for **Embed**
3. In the Embed web part, paste this iframe code:
   ```html
   <iframe
     src="https://<your-github-username>.github.io/bm-training-lms/"
     width="100%"
     height="900"
     frameborder="0"
     style="border: none; border-radius: 8px;"
     allow="clipboard-write"
   ></iframe>
   ```
4. Adjust `height` as needed (900px works well for most screens)
5. Save and publish the page

**Notes:**
- The `allow="clipboard-write"` attribute lets the "Copy Summary" button work inside the iframe
- If your SharePoint tenant blocks external iframes, an admin may need to add `github.io` to the allowed domains in the SharePoint admin center (under HTML Field Security or the embedded content policy)
- The app is fully self-contained (no server-side component) — all data stays in the browser until the user clicks "Submit to Training Record" or downloads the CSV
