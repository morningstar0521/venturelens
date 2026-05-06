# VentureLens

![VentureLens Logo](public/logo/logo.png)

VentureLens is a modern platform designed to bridge the gap between visionary founders and skilled contributors. It allows founders to validate their startup concepts and find the right talent to build their dream teams, while providing contributors with a curated list of high-potential ideas to join and grow with.

## Features

- **Founder Dashboard**: Submit and manage startup ideas, track applicant status, and view AI-powered venture scores.
- **Contributor Dashboard**: Browse validated startup ideas, filter by skills and industry, and apply directly to founders.
- **Admin Moderation**: A dedicated admin panel to moderate submissions, manage users, and ensure platform quality.
- **Role-Based Access**: Secure authentication and authorization for Founders, Contributors, and Admins.
- **Modern Tech Stack**: Built with Next.js 15, React 19, TypeScript, and Tailwind CSS for a fast, responsive, and type-safe experience.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [NextAuth.js v5 (Beta)](https://authjs.dev/)
- **Database**: [Neon](https://neon.tech/) (PostgreSQL)
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js 20+ 
- A Neon database account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/minorproject.git
   cd minorproject
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL=your_neon_database_url
   AUTH_SECRET=your_nextauth_secret
   ```

4. Initialize the database:
   Access the `/api/db/init` route in your browser (when running locally) to create the necessary tables.

5. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Best Practices

This project follows modern Next.js 15 best practices:
- **Server Components**: Leverages RSCs for improved performance and SEO.
- **Server Actions**: Uses type-safe Server Actions for data mutations.
- **App Router**: Implements the latest routing patterns and file conventions.
- **Type Safety**: End-to-end type safety with TypeScript and Zod validation.

## Deployment

The project is ready to be deployed on platforms like **Vercel**. 

> [!IMPORTANT]
> Ensure all environment variables are correctly configured in your deployment platform's settings.

---
