# Design Guidelines: 1% Better — Telegram Mini App (Habit Tracker)

## Design Approach
**Minimalist Reference-Based**: Inspired by Telegram's native design language combined with wellness apps like Streaks and Habitica, focusing on clarity, motivation, and distraction-free tracking.

## Core Design Principles
1. **Absolute Simplicity**: Every element must serve a purpose, no decorative elements
2. **Motivational, Not Punishing**: Gentle encouragement over harsh reminders
3. **Daily Ritual**: Design should make users feel "This is so simple… I can do this today"
4. **Peaceful Environment**: Calming, non-anxious interface that inspires action

## Color System
- **Background**: `#FFFFFF` or `#F8FAFC` (pure white or subtle gray)
- **Primary**: `#2563EB` (calm blue for progress and buttons)
- **Success**: `#10B981` (completed days)
- **Error/Missed**: `#EF4444` (missed days)
- **Text Primary**: `#1E293B`
- **Text Secondary**: `#64748B`
- **No gradients, neon, or harsh contrasts allowed**

## Typography
- **Headings**: Inter or SF Pro — SemiBold
- **Body**: Inter or SF Pro — Regular (comfortable reading)
- **Numbers**: Large and Bold (for statistics)
- **Hierarchy**: Clear size differentiation between hero text and body

## Layout System
- **Spacing Units**: Use Tailwind's 4, 6, 8, 12, 16, 24 for consistent rhythm
- **Border Radius**: 12-18px for all cards and buttons (rounded, friendly)
- **Cards**: Light shadow or subtle border, generous internal padding
- **Wide Spacing**: No cramped elements, breathing room between all components

## Component Library

### Navigation & Structure
- **App Header**: Large "1% Better" title with tagline "Every day 1% better"
- **Bottom FAB**: Floating + button (bottom-right) for adding habits

### Habit Cards (Main Screen)
- Card layout with:
  - Habit name (bold, dark)
  - Streak indicator: 🔥 emoji + number + "days"
  - Mini progress bar (subtle, thin)
  - Today's status: ✅ or ❌ icon
- Spacing between cards: 3-4 units
- Tap to open detail view

### Habit Detail View
- **Header**: Habit name centered
- **Large Streak Counter**: 🔥 emoji with big number + "days"
- **Circular Progress**: Percentage completion visual
- **Calendar Grid**:
  - ✅ Completed (green fill)
  - ❌ Missed (red/empty)
  - ⚪ Future days (gray/disabled)
  - Grid layout: 7 columns (week days)
- **Action Buttons**: Two prominent buttons:
  - ✅ "Mark as Complete"
  - ❌ "Mark as Skipped"
- **Mini Line Chart**: Weekly progress trend (bottom section)

### Add New Habit Screen
- **Input Field**: Large, clear habit name input
- **Toggle**: Good habit ✅ / Bad habit ❌ (pill-style toggle)
- **Duration Chips**: Horizontal scroll of selectable chips:
  - 7 days / 21 days / 30 days / 60 days / 90 days / Custom
- **Reminder** (optional toggle)
- **Primary Button**: Large "Start" button at bottom

### Motivational Toasts
- Appear after completing/skipping habit
- Messages:
  - "Amazing! You're 1% ahead today 💪"
  - "Keep going, you're strong 🔥"
  - "Done. Be proud of yourself 🚀"
  - "Missed today? It's okay, continue tomorrow 🧠"
- Soft appearance/disappearance animation
- Auto-dismiss after 3 seconds

## Animations & Interactions
- **Button Press**: 0.95 scale animation (subtle squeeze)
- **Progress Fill**: Smooth animation when updating
- **Toast Enter/Exit**: Slide up with fade
- **No Aggressive Alerts**: All feedback is gentle and encouraging
- **Haptic Feedback**: Light haptic on button press (Telegram native)
- **Duration**: All animations 200-300ms

## Images
**No images required** — This is a purely functional app focused on data visualization and habit tracking. All visual interest comes from:
- Progress circles and bars
- Calendar grid visualization
- Emoji usage (🔥 for streaks)
- Clean typography and spacing

## Accessibility
- Large touch targets (minimum 44px)
- High contrast text (WCAG AA compliant)
- Clear labels for all interactive elements
- Status indicators use both color AND icons (✅/❌)

## Telegram Mini App Specific
- Utilize Telegram's native header if available
- Follow Telegram's color mode (light/dark) preferences
- Use Telegram's haptic feedback API
- Respect Telegram's safe areas and bottom navigation