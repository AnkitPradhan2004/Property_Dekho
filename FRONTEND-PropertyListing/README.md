# Property Listing – Modern Real Estate Frontend

A production-ready, high-performance React + Vite application to browse, filter, and compare properties with a polished, modern UI.

## Features
- Beautiful landing hero with gradients, stats, and CTAs
- Responsive, accessible UI powered by Tailwind CSS and Framer Motion
- Property grid/list views with skeleton loading and infinite scroll
- Favorites and comparisons with optimistic UI
- Auth context with login/logout, token persistence
- Toast notifications and polished components

## Tech Stack
- React 19, React Router, Vite
- Tailwind CSS, Framer Motion, Lucide Icons
- TanStack Query for data fetching/caching
- Axios API layer

## Getting Started
1. Install Node.js LTS (>= 18). Ensure `node` and `npm` are available in your terminal (restart if needed).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build && npm run preview
   ```

## Configuration
- API base URL is set in `src/api/axios.js` (`http://localhost:5000/api`). Update as needed.

## Scripts
- `npm run dev`: Start development server
- `npm run build`: Production build
- `npm run preview`: Preview the production build
- `npm start`: Alias to `vite` for convenience

## Project Structure
```
src/
  components/     # UI components
  pages/          # Route pages (Home, PropertyDetails, Dashboard, etc.)
  context/        # Auth context + hook
  services/       # API clients (property, user, inquiry, chat)
  api/            # Axios instance
```

## Design Notes
- Tailwind tokens and utilities in `src/index.css` provide consistent spacing, typography, and animations.
- Reusable buttons and utility classes (`btn-primary`, `btn-secondary`, `text-gradient`, etc.) ensure cohesive styling.

## Production Tips
- Set `baseURL` to your deployed backend URL in `src/api/axios.js`.
- Enable HTTPS and a CDN for static assets in production.

