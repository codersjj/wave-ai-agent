# Plan

Detailed plans for accomplishing tasks.

## Setup

- [x] init project with shadcn
  - `npx shadcn@latest init`
  - see: [shadcn doc](https://ui.shadcn.com/docs/installation/next)
- [x] add shadcn components which we're going to use
  - `npx shadcn@latest add`
    - and then select those components: alert, avatar, badge, button, card, collapsible, dialog, dropdown-menu, form, input, label, popover, select, separator, sheet, sidebar, skeleton, sonner, textarea
- [x] install some dependencies we needed
  - `npm i uuid date-fns nuqs @remixicon/react zustand @tanstack/react-query`
- [x] update app/layout.tsx
  - [x] suppressHydrationWarning
  - [x] update font
  - [x] update Metadata
  - [x] add providers
- [x] add Toaster
- [x] add dark mode feature
- [x] custom theme with shadcnstudio
  - see: [shadcn studio theme generator](https://shadcnstudio.com/theme-generator)
- [x] initialize application file structure
  - [x] app/(routes)
    - [x] app/(routes)/(dashboard)
      - [x] app/(routes)/(dashboard)/billing
      - [x] app/(routes)/(dashboard)/chat
      - [x] app/(routes)/(dashboard)/home
      - [x] app/(routes)/(dashboard)/settings
      - [x] app/(routes)/(dashboard)/layout.tsx
    - [x] app/(routes)/(web)
      - [x] app/(routes)/(web)/layout.tsx
      - [x] app/(routes)/(web)/page.tsx
        - [x] move app/page.tsx into app/(routes)/(web)
    - [x] app/(routes)/auth
      - [x] app/(routes)/auth/layout.tsx
  - [x] app/api
  - [x] app/actions
- [x] update app/(routes)/(dashboard)/layout.tsx
  - [x] sidebar
  - [x] NuqsAdapter
  - [x] Suspense
- [x] add Logo component

## Database(Neon, Prisma ORM)

- [x] set up Neon
- [x] set up Prisma

## Authentication(Better Auth)

- [x] integrate Better Auth
  - see:
    - [Better Auth Installation](https://www.better-auth.com/docs/installation)
    - [Better Auth CLI](https://www.better-auth.com/docs/concepts/cli)
    - [baseline your database](https://www.prisma.io/docs/orm/prisma-migrate/workflows/baselining)
    - [set config to use Prisma Migrate with Prisma Accelerate](https://www.prisma.io/docs/guides/neon-accelerate#4-set-up-accelerate-in-the-prisma-console)
- [x] use session on the server side
  - see: [basic usage](https://www.better-auth.com/docs/basic-usage#server-side)
- [x] add sign in/sign up pages
- [x] add bearer and openAPI plugins
  - see:
    - [Bearer Token Authentication](https://www.better-auth.com/docs/plugins/bearer)
    - [Open API](https://www.better-auth.com/docs/plugins/open-api)
  - [x] Use Bearer Tokens
    - see: [How to Use Bearer Tokens](https://www.better-auth.com/docs/plugins/bearer#how-to-use-bearer-tokens)
- [x] add useAuthToken hook with zustand
  - see: [Persisting a state](https://zustand.docs.pmnd.rs/middlewares/persist#persisting-a-state)

## Dashboard UI

- [ ] sidebar
