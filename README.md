# Bible Teaching Calendar

A web-based calendar application for managing sermon and Bible lesson scheduling.

## Features

- **Calendar View**: Monthly and weekly calendar views with scheduled lessons
- **Drag-and-Drop**: Move scheduled items between days or schedule new lessons by dragging
- **Filtering**: Filter by lesson type (Sermon AM, Afternoon Study, Sermon PM) and preparation status
- **Bulk Date Shift**: Shift multiple scheduled lessons forward when you need to insert a break
- **Unscheduled Panel**: Browse and schedule lessons from your sermon library

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS v4
- @dnd-kit/core for drag-and-drop
- TanStack Query for API state management
- date-fns for date manipulation
- Vite for build tooling

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your API credentials:
```env
VITE_CRAFT_API_URL=your_api_url
VITE_CRAFT_API_KEY=your_api_key
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── api/           # API client and collection endpoints
├── components/
│   ├── Calendar/  # Calendar grid, day cells, scheduled items
│   ├── Modals/    # Add, edit, and shift dates modals
│   ├── Sidebar/   # Filters and unscheduled lessons panel
│   └── common/    # Shared UI components
├── hooks/         # React Query hooks for data fetching
├── types/         # TypeScript type definitions
└── utils/         # Date utilities and color mappings
```
