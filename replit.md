# 1% Better — Telegram Mini App (Habit Tracker)

## Overview
A minimalist habit tracking application built with the "1% Better" philosophy. Users can track daily habits, build streaks, and receive motivational feedback. The app features a clean, calming design with smooth animations and a peaceful user experience.

**Last Updated:** January 11, 2025

## Current State
✅ **MVP Complete** - Fully functional habit tracker with:
- Home screen displaying all habits with streak counters and progress bars
- Detailed habit view with calendar, circular progress, and weekly chart
- Add habit flow with duration selection and habit type toggle
- Motivational toast messages in Uzbek for encouragement
- Complete backend API with in-memory storage
- Fully tested end-to-end functionality

## Project Architecture

### Tech Stack
- **Frontend:** React + TypeScript, Vite, Wouter (routing), TanStack Query, Framer Motion
- **Backend:** Express.js, TypeScript
- **Storage:** In-memory (MemStorage) with mock data
- **Styling:** Tailwind CSS with custom design system
- **UI Components:** Shadcn/UI with custom habit-specific components

### Design System
- **Colors:** 
  - Primary: `#2563EB` (calm blue)
  - Success: `#10B981` (completed days)
  - Destructive: `#EF4444` (missed days)
  - Background: White/light gray (`#FFFFFF`/`#F8FAFC`)
  - Text: `#1E293B` (primary), `#64748B` (secondary)
- **Typography:** Inter font family, semibold for headings
- **Border Radius:** 12-18px for cards and buttons
- **Animations:** 0.95 scale on press, smooth progress fills, 200-300ms duration

### Key Features

#### 1. Home Screen (`/`)
- Large "1% Better" title with motivational tagline
- Grid of habit cards showing:
  - Habit name
  - Streak counter with 🔥 emoji
  - Mini progress bar (% completion)
  - Today's status: ✅ completed, ❌ skipped, or unmarked
- Floating + button to add new habits

#### 2. Habit Detail (`/habit/:id`)
- Large streak counter display
- Circular progress indicator showing % completion
- Calendar grid with visual status for each day:
  - Green for completed
  - Red for missed
  - Gray for future days
  - Highlighted for today
- Action buttons: "Bajarildi" (Complete) / "O'tkazib yuborish" (Skip)
- Weekly progress line chart
- Motivational toast messages on completion/skip

#### 3. Add Habit (`/add`)
- Habit name text input
- Good/Bad habit toggle switch
- Duration selection chips: 7, 21, 30, 60, 90 days
- "Boshlash" (Start) button to create habit

### Data Model

```typescript
Habit {
  id: string
  name: string
  isGoodHabit: boolean
  duration: number          // Total days for habit completion
  streak: number            // Current consecutive completion streak
  startDate: Date
  completionData: Record<string, boolean>  // date -> completed status
}
```

### API Routes
- `GET /api/habits` - Fetch all habits
- `GET /api/habits/:id` - Fetch specific habit
- `POST /api/habits` - Create new habit
- `PATCH /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `POST /api/habits/:id/mark` - Mark day as complete/skipped

### File Structure
```
client/src/
  ├── components/
  │   ├── HabitCard.tsx           # Habit card with streak and progress
  │   ├── StreakCounter.tsx       # Large streak display
  │   ├── CircularProgress.tsx    # Circular progress indicator
  │   ├── HabitCalendar.tsx       # Monthly calendar grid
  │   ├── DurationChips.tsx       # Duration selection chips
  │   ├── MiniLineChart.tsx       # Weekly progress chart
  │   └── examples/               # Component examples for preview
  ├── pages/
  │   ├── Home.tsx                # Main habit list
  │   ├── HabitDetail.tsx         # Individual habit view
  │   └── AddHabit.tsx            # New habit form
  └── App.tsx                     # Router and app shell

server/
  ├── routes.ts                   # API endpoints
  └── storage.ts                  # In-memory storage with mock data

shared/
  └── schema.ts                   # TypeScript types and Zod schemas
```

## Recent Changes (Jan 11, 2025)
- Implemented complete backend API with RESTful endpoints
- Connected frontend to backend using TanStack Query
- Added real-time habit tracking with completion marking
- Implemented streak calculation logic
- Added motivational toast messages
- Created fully functional end-to-end flow
- Tested all user journeys successfully

## User Preferences
- **Language:** Uzbek (Uzbek Latin script) for UI text
- **Design Philosophy:** Minimalist, calming, motivational, distraction-free
- **Target Platform:** Telegram Mini App (mobile-first design)
- **Animations:** Subtle and smooth, never jarring
- **Feedback:** Positive and encouraging, never punishing

## Motivational Messages
The app uses gentle, encouraging messages in Uzbek:

**On Completion:**
- "Ajoyib! Bugun 1% oldindasan 💪"
- "Davom et, sen kuchlisan 🔥"
- "Bajarildi. O'zing bilan faxrlan 🚀"

**On Skip:**
- "O'tkazib yubordingmi? Hechqisi yo'q, ertaga davom et 🧠"
- "Yiqilish muammosi emas, qaytadan turishdir 💪"
- "Ertaga yangi imkoniyat 🌅"

## Development Notes
- In-memory storage currently used (data resets on server restart)
- Mock data includes 4 sample habits for demonstration
- Streak calculation based on consecutive completed days
- Progress percentage = (completed days / total duration) × 100
- All dates stored in ISO format (YYYY-MM-DD)
- Animations powered by Framer Motion for smooth interactions

## Next Steps (Future Enhancements)
- [ ] Add PostgreSQL database for persistent storage
- [ ] Implement reminder notifications
- [ ] Add statistics dashboard with overall progress
- [ ] Implement streak recovery grace period
- [ ] Add data export/backup functionality
- [ ] Integrate with Telegram Mini App SDK
- [ ] Add haptic feedback for mobile
- [ ] Implement dark mode toggle
- [ ] Add habit editing capability
- [ ] Create habit categories/tags
