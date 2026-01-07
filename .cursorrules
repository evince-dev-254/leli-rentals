# Project Rules

## Architecture Constraints

1.  **Middleware vs Proxy**:
    *   This project uses `proxy.ts` (Next.js middleware) exclusively.
    *   **NEVER** create a `middleware.ts` file in the root or `src` directory.
    *   All middleware logic (authentication, cookies, routing) must be added to `proxy.ts`.
    *   If you need to add new middleware functionality, modify `proxy.ts` or import the logic into it.
