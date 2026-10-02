# Soul N

Next.js App Router starter with TypeScript, Tailwind CSS, and ESLint.

## Local development

Use Node.js 24 (see `.nvmrc`).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Edit `src/app/page.tsx` to change the homepage;
`src/app/layout.tsx` owns the shared layout and metadata.

## Verification and production

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

The starter uses system fonts so production builds do not need to download fonts.

## Hostinger automatic deployments

Use Hostinger's managed **Deploy Web App** option on a Business or Cloud plan.
Connect the GitHub repository rather than uploading a ZIP so later pushes
can trigger new builds automatically.

1. Push this project to `https://github.com/kunalkumar007/soul-n`.
2. In hPanel, choose **Websites → Add website → Deploy Web App → Import Git Repository**.
3. Connect GitHub and select `kunalkumar007/soul-n`, branch `main`.
4. Confirm the detected Next.js framework with these settings:

   | Setting | Value |
   | --- | --- |
   | Project root | Repository root |
   | Node.js | 24.x |
   | Install command, if editable | `npm ci` |
   | Build command | `npm run build` |
   | Build output | `.next` |
   | Start command, if editable | `npm start` |

5. Use a temporary Hostinger domain for the initial deployment, then attach
   your custom domain when ready.
6. Confirm automatic deployment is active for the connected branch. Push
   a homepage change to `main`, check its commit and successful build in
   **Deployments**, and verify the new content on the live URL.

Hostinger runs the build and hosts the Next.js application. No FTP upload
workflow or separate GitHub Actions deployment is required for this setup.
Automatic deployment is only configured once the repository is connected
in hPanel; the files in this repository alone do not activate it.

Add secrets using Hostinger's **Environment Variables** settings. Local
`.env` files are ignored by Git. Only use `NEXT_PUBLIC_` for values intended
for browsers. Treat deployment directories as generated files;
make persistent changes in this repository.

Reference: [Hostinger Node.js deployment guide](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/).
