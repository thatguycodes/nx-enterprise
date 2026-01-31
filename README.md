# 🚀 Enterprise Nx Monorepo

Welcome to the **Nx Enterprise** monorepo. This project is a production-ready, scalable workspace designed for modern web development, utilizing a modular architecture to share code effectively between applications.

## 🏗️ Architecture Overview

Our monorepo is structured to maximize code reuse and maintainability:

- **`apps/`**: Contains our end-user applications.
  - **`web`**: A high-performance Next.js 16 (TypeScript) application.
  - **`web-e2e`**: Automated end-to-end tests using Playwright.
- **`libs/`**: Shared libraries and business logic.
  - **`shared/ui`**: A curated library of React components styled with SCSS Modules and documented via Storybook.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Monorepo Tooling**: [Nx](https://nx.dev/)
- **Styling**: SCSS Modules
- **Component Documentation**: [Storybook](https://storybook.js.org/)
- **Testing**: [Jest](https://jestjs.io/) (Unit) & [Playwright](https://playwright.dev/) (E2E)
- **Language**: TypeScript

---

## 🏁 Getting Started

### 1. Prerequisites
Ensure you have the following installed:
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Running the Application
To start the `web` application in development mode:
```bash
npx nx dev web
```
The app will be available at [http://localhost:3000](http://localhost:3000).

### 4. Exploring Components
Documentation for our shared UI components is handled by Storybook:
```bash
npx nx storybook ui
```
This will launch the Storybook dashboard locally.

---

## ⚡ Powering Up with Nx

Nx is the engine that drives this monorepo. Here is how to get the most out of it:

### 🔍 Project Graph
Visualize how projects and libraries depend on each other:
```bash
npx nx graph
```

### 🏃 Running Tasks
Nx uses a consistent syntax: `npx nx <target> <project>`.
- **Build**: `npx nx build web`
- **Test**: `npx nx test ui`
- **Lint**: `npx nx lint web`

### 🏗️ Generating Code
Use generators to create boilerplate-free code that follows our standards:
- **New Library**: `npx nx g @nx/react:lib libs/my-new-lib`
- **New Component**: `npx nx g @nx/react:component my-button --project=shared-ui`

### 🏎️ Affected Commands
Only run tasks for projects changed in your current branch:
```bash
npx nx affected -t test
npx nx affected -t build
```

### 📦 Caching
Nx caches every task. If you run the same command twice without changing code, the second run will be near-instant!

---

## 📝 Development Guidelines

1. **Shared Components**: Always check `libs/shared/ui` before creating a new component. If it's reusable, put it there!
2. **Styling**: Use SCSS Modules (`.module.scss`). Avoid global styles unless absolutely necessary.
3. **Type Safety**: Avoid `any`. Use TypeScript interfaces and types for all props and data structures.
4. **Testing**: Every new component in `shared/ui` should have a corresponding `.spec.tsx` and `.stories.tsx` file.

---

Built with ❤️ by the Enterprise Team.
