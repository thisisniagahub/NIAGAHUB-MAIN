# PAGES

## OVERVIEW

Route-level React modules for the main app. Each file maps to a route in `App.tsx`.

## WHERE TO LOOK

| Task         | Location                      | Notes                        |
| ------------ | ----------------------------- | ---------------------------- |
| Landing page | `pages/LandingPage.tsx`       | public entry route           |
| Login        | `pages/LoginPage.tsx`         | auth flow                    |
| Modules      | `pages/*Module.tsx`           | feature areas                |
| Placeholders | `pages/ModulePlaceholder.tsx` | WIP routes                   |
| Docs         | `pages/DocumentationPage.tsx` | docs route and slug handling |

## CONVENTIONS

- Add or change routes in `App.tsx` alongside new page modules.
- Keep business logic in `services/` and UI primitives in `components/`.
- Use `ProtectedRoute` for authenticated areas (see `App.tsx`).

## ANTI-PATTERNS

- Do not add routes without wiring them in `App.tsx`.
- Do not duplicate shared UI; move reusable pieces into `components/`.
