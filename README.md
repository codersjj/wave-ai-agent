# Wave AI Agent

Wave AI Agent is a cutting-edge, **AI-native SaaS starter kit** designed for building advanced AI agents with sophisticated reasoning capabilities. Unlike simple chat wrappers, Wave provides a complete ecosystem for visual reasoning (Chain of Thought), task planning, artifact generation, and verified SaaS foundations.

Built on **Next.js 15**, **React 19**, and **Tailwind 4**, utilizing **Hono** for a robust backend API and **Better Auth** for secure authentication.

## ✨ Features

### 🧠 Advanced AI Capabilities

- **Chain of Thought Visualization**: Transparently display the AI's reasoning process, steps, and decision-making logic to users.
- **Generative UI & Artifacts**: Render code blocks, web previews, and dynamic components directly in the chat stream.
- **Visual Flow**: Visualize complex logic and node connections (powered by XYFlow).
- **Tool Integration**: Built-in support for external tools (Search, etc.) with `ai` SDK.

### 🛠️ Production-Ready SaaS Foundation

- **Authentication**: Secure, customizable auth flows using [Better Auth](https://github.com/better-auth/better-auth).
- **Subscription & Billing**: Integrated Stripe payments with comprehensive subscription management.
- **Database**: Prisma ORM with fully typed schema for managing users, chats, and subscriptions.
- **Backend API**: Type-safe API routes powered by [Hono](https://hono.dev), running on Next.js Edge/Node runtime.

### 🎨 Premium UI/UX

- **Modern Design**: Sleek, dark-mode-first aesthetic using Tailwind CSS v4.
- **Component Library**: Includes `shadcn/ui` primitives and custom AI-specific components (e.g., `ChainOfThought`, `WebPreview`, `Artifact`).
- **Data Fetching**: Optimized state management with TanStack Query.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd wave-ai-agent
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Environment Setup**

   Copy the `.env.example` (or create one) and add your keys:

   ```bash
   cp .env.example .env
   ```

   *Required keys typically include `DATABASE_URL`, `BETTER_AUTH_SECRET`, `OPENAI_API_KEY` (or Google/Anthropic), and `STRIPE_SECRET_KEY`.*

4. **Initialize Database**

   ```bash
   npm run db:migrate
   ```

5. **Run Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 👥 Who is this for?

This project is the perfect starting point for:

- **AI Engineers & Prototypers**: Who need more than a text box. Detailed "Chain of Thought" and "Plan" components allow you to build agents that solve complex problems and explain their work.
- **SaaS Founders**: Creating vertical AI agents (e.g., "AI for Legal", "AI for Coding"). The included Auth, Billing, and Database setup saves weeks of boilerplate work.
- **Frontend Architects**: Looking for a reference implementation of React 19, Tailwind 4, and Next.js 15 in a real-world application.

## 🏗️ Project Structure

- `app/(routes)`: Application page routes (Dashboard, Auth, etc.).
- `app/api`: Hono API handlers.
- `components/ai-elements`: Specialized components for AI interactions (Reasoning, Tools, Artifacts).
- `features`: Core business logic hooks (Chat, Notes, Subscription).
- `lib`: Utilities and configuration.
- `prisma`: Database schema and migrations.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Hono Documentation](https://hono.dev)
- [Better Auth](https://better-auth.com)
