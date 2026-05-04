<div align="center">

# 🎮 Platinum

**Track games. Write reviews. Share your taste.**

A social platform for gamers - think Letterboxd, but for games.

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org) &nbsp;
[![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61dafb)](https://react.dev) &nbsp;
[![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org) &nbsp;
[![Bun](https://img.shields.io/badge/Bun-black?style=for-the-badge&logo=bun)](https://bun.sh) &nbsp;
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

**[Check it out → plat.social](https://plat.social)**

</div>

---

## What is this?

Platinum is a social platform for people who take their games seriously. Log what you've played, rate and review titles, keep a list of what you want to play next, and follow other gamers to see what they're up to.

I've been into video games my whole life. At some point I wanted a place to actually track that. Not just for myself, but to see what friends are playing, discover things through people with similar taste, and have a feed that's actually about games. So I built it.

---

## Features

- **Game library** - powered by the [IGDB API](https://api-docs.igdb.com), covering hundreds of thousands of titles
- **Personal shelf** - split into Favorites, Currently Playing, and Want to Play
- **Reviews & ratings** - write your thoughts on any game and browse what others are saying
- **Following system** - connect with other gamers *(coming soon)*
- **Social feed** - see reviews from people you follow *(coming soon)*

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 |
| Library | React 19 |
| UI | shadcn/ui, Radix UI, Tailwind CSS v4 |
| Auth | NextAuth v5 |
| Database | PostgreSQL + Drizzle ORM |
| Storage | Cloudflare R2 |
| Validation | Zod |
| Runtime | Bun |
| Data | IGDB API |

---

## Getting Started

**Prerequisites:** [Bun](https://bun.sh) installed.

```bash
# Clone
git clone https://github.com/matheusm18/platinum.git
cd platinum

# Install
bun install

# Environment
cp .env.example .env
# Fill in your keys (IGDB client ID/secret, database URL, NextAuth secret, Cloudflare R2 credentials)

# Run
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

---

<div align="center">

Made by [Matheus Azevedo](https://github.com/matheusm18)

</div>