# Devboard

Devboard is a clean, modern GitHub profile viewer built for developers who want more than just a profile page. It lets you search any GitHub user, explore their repositories, and get a real sense of how they code — all in a focused, dark-themed interface.

The standout feature is its AI integration: Devboard can generate a concise developer persona based on a user's language usage and repositories, and summarize any repo in plain English with a single click.

## Features

- **GitHub User Search:** Instantly fetch public profile info — bio, stats, and links — for any GitHub user.
- **AI Integration:**
  - **Developer Persona:** Analyzes a user's top languages and repos to generate a short, professional summary of their technical focus — whether that's frontend, backend, fullstack, or DevOps.
  - **Repo Summaries:** Hit the Analyze button next to any repository to get a 15-word breakdown of what it does and what tech it uses.
- **Activity Heatmap:** A contribution graph covering the last 365 days, styled similarly to GitHub's own calendar view.
- **Language Analytics:** A stacked bar chart showing the percentage breakdown of the developer's most-used programming languages.
- **Repository Browser:** Filter repos by text, sort by stars, recency, forks, or name, and navigate through pages.
- **Commit Feed:** A live view of the developer's most recent public push events.
- **Modular SCSS Architecture:** Component-based styling with SCSS variables for easy theming and responsive behavior out of the box.

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** SCSS + Radix UI Primitives + Lucide Icons
- **AI:** `@google/genai` (Google AI SDK)
- **Data:** Public GitHub REST API

## Getting Started

### Prerequisites

- Node.js v18 or higher
- `yarn`, `npm`, or `pnpm`
- A Google AI API key (required for AI features)

### Installation

1. Clone the repository:

```bash
   git clone https://github.com/yourusername/devboard.git
   cd devboard
```

2. Install dependencies:

```bash
   yarn install
   # or npm install / pnpm install
```

3. Set up your environment variables:

```bash
   cp .env.example .env
```

Open `.env` and add your API key:

```env
   VITE_GEMINI_API_KEY=your_actual_api_key_here
```

4. Start the dev server:

```bash
   yarn dev
```

5. Open `http://localhost:5173` in your browser (or whichever port Vite assigns).

## License

MIT — see the [LICENSE](LICENSE) file for details.
