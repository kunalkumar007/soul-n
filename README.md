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

## Chatbot enquiries

The floating Soul Sync guide collects a nickname, required email, optional phone
number, and guidance topic, then lets visitors review and edit their answers before
sending them to the team by email. The phone step has an explicit skip option;
an omitted or blank phone number is also accepted by the API. New enquiries do
not ask for a personal biography or pictures. Draft answers stay in this browser
and resume across pages and reloads. Earlier drafts keep their nickname, topic,
and previous note, require contact details, and show the note at review before
sending again.
Start over clears that draft; it does not recall an email already sent.

Email settings are deliberately placeholders for now. Copy `.env.example` to
`.env.local` and replace `CHATBOT_TO_EMAIL`, `CHATBOT_FROM_EMAIL`, and
`RESEND_API_KEY` when ready. The sender must belong to a domain verified in
[Resend](https://resend.com/docs/send-with-nextjs). Set the same three variables
in the hosting dashboard for deployment, then restart/redeploy the app. Keep
them server-only (no `NEXT_PUBLIC_` prefix).

With settings missing, sending shows “Email delivery isn’t connected yet” and
keeps the answers for retry. No email is sent and no success is claimed.
The API validates submissions and sends plain-text email to the configured
recipient only, with the validated visitor email as the reply-to address
([Resend send-email API](https://resend.com/docs/api-reference/emails/send-email)).
The browser supplies no sender or recipient. Retries use the
same [Resend idempotency key](https://resend.com/docs/dashboard/emails/idempotency-keys)
to prevent duplicate emails within the provider’s 24-hour window. API success
means the provider accepted the message, not a confirmed inbox delivery.

Run the chatbot behavior and mocked email tests with `npm run test:chatbot`.
The public endpoint does not maintain a distributed rate limiter.

The site provides kink and lifestyle guidance, without public profiles or matching.
Legacy `/discover` and `/connections` URLs redirect to the homepage.

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
