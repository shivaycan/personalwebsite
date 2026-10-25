# Vaynotes

Vaynotes is a small Next.js site with a standalone writing surface at `/vaynotes.html` and a private note manager at `/admin`.

## Connect the database and admin login

The site uses a PostgreSQL database. In Vercel, connect a PostgreSQL provider (for example, Neon from the Vercel Marketplace), then add these values under the project’s Environment Variables and redeploy:

- `DATABASE_URL`: the provider’s PostgreSQL connection string.
- `ADMIN_USERNAME`: the admin user ID.
- `ADMIN_PASSWORD`: the admin password.
- `ADMIN_SESSION_SECRET`: a random secret of at least 32 characters.

The app creates its notes table automatically after the first database connection. Do not commit real credentials or connection strings. For local development, copy `.env.example` to `.env.local` and fill it in locally.

Open `/admin` to sign in, edit or delete notes, or import notes saved in that browser’s local storage. Publishing from the writing surface saves to PostgreSQL so the notes are shared across devices.
