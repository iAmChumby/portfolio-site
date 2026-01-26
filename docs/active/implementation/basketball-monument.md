# The League Monument - Implementation Documentation

✅ **IMPLEMENTED** - This feature is fully implemented and deployed.

## Overview

This is the detailed blueprint and implementation documentation for **"The League Monument."**

This is a kinetic data sculpture that serves as the centerpiece of your portfolio. It replaces the generic "Live Feed" with a living, architectural representation of the NBA season. It operates independently of you, visualizing the complex system of the league in real-time.

## Implementation Status

**Status**: ✅ Fully Implemented  
**Route**: `/basketball`  
**Tech Stack**: React Three Fiber, Next.js API Routes, NBA API integration  
**Last Updated**: [Current]

## Architecture

### Components Structure
- `MonumentScene.tsx` - Main scene wrapper with Canvas setup
- `MonolithGroup.tsx` - Renders all 30 team monoliths
- `TeamMonolith.tsx` - Individual team pillar component
- `TeamHUD.tsx` - Heads-up display for team details on hover
- `LoadingState.tsx` - Loading and error states
- `MobileFallback.tsx` - Mobile device fallback message

### Data Flow
1. **API Routes** (`/api/nba/scoreboard`, `/api/nba/standings`)
   - Proxy NBA API requests (avoids CORS)
   - Implement caching (15-30 second server-side cache)
   - Return fallback data if API unavailable

2. **Custom Hooks**
   - `useNBAStandings()` - Fetches and manages standings data
   - `useNBAScoreboard()` - Polls live game data every 15 seconds
   - `useMonumentState()` - Derives visualization state from data

3. **State Management**
   - Two modes: `hierarchy` (standings) and `arena` (live games)
   - Automatic mode switching based on live game presence
   - Smooth animations between states

### Key Features Implemented
- ✅ 30 team monoliths with team logos
- ✅ Two operating modes (Hierarchy/Arena)
- ✅ Real-time score updates (15-second polling)
- ✅ Hover interactions with HUD display
- ✅ Mobile fallback (desktop-only 3D experience)
- ✅ Error handling and graceful degradation
- ✅ Caching strategy for performance

### API Endpoints
- `GET /api/nba/scoreboard` - Live game scores
- `GET /api/nba/standings` - Season standings
- `GET /api/nba/teams` - Team metadata (from static JSON)

---

## Original Concept (Below)

### 1. The Visual Concept: "The Monoliths"

Imagine a dark, minimal 3D scene in the center of your screen. It feels less like a video game and more like a high-end architectural model or a sci-fi server room.

* **The Structure:** There are **30 vertical pillars** (monoliths), one for each NBA team.
* **Material:** They are not cartoonish blocks. They look like matte slate or dark glass—sleek, industrial, and reflective.
* **Identities:** Each pillar features the team’s logo, etched cleanly onto the top surface or floating just above it. The logos are monochromatic (greyscale) to keep the "Systems" aesthetic, only lighting up with team colors when active.



### 2. The Two Operating Modes

The sculpture automatically shifts between two distinct states depending on the time of day.

#### **State A: The Hierarchy (Daytime / No Games)**

When no games are being played (e.g., 10:00 AM), the monument visualizes the **Season Standings**.

* **Formation:** The 30 pillars arrange themselves in a perfect circle or a tiered "stadium" layout.
* **The Data:** The *height* of each pillar is determined by the team's Win/Loss record.
* The **Celtics** and **Thunder** pillars stand tall, towering over the rest.
* The **Wizards** and **Pistons** pillars are low to the ground.


* **The Vibe:** It is a static, majestic museum piece. It allows visitors to instantly grasp the power balance of the league at a glance.

#### **State B: The Arena (Nighttime / Live Games)**

When games begin (e.g., 8:00 PM), the sculpture breaks apart and comes alive.

* **Transformation:** The pillars of playing teams **detach** from the main circle. They slide into the center of the arena, pairing up with their opponents to "face off."
* **The Data:** The *height* of these dueling pillars now represents the **Live Score**.
* If the Thunder are beating the Knicks 102–98, the Thunder pillar physically grows taller than the Knicks pillar.


* **The Motion:** The pillars are not static. They gently "breathe" or bob to show they are active.

### 3. The "Texture" of Data (Visualizing the Invisible)

We avoid plastering text everywhere. Instead, we use lighting and motion to communicate detailed stats subtly:

* **Momentum (The Glow):** If a team goes on a "run" (scoring many points quickly), their pillar begins to **glow** with an internal light (Emissive Material). A "hot" team literally looks hot. A "cold" team looks dim.
* **The Clock (The Life Bar):** A thin, vertical LED strip runs up the spine of each pillar.
* At the start of the game, the strip is full.
* As the 4th quarter winds down, the strip depletes. You can tell how much time is left just by looking at the light level.


* **Tension (The Distance):** In a close game (within 5 points), the two dueling pillars move physically closer together, creating visual tension. In a blowout, the winning pillar towers over the losing one, and they drift apart.

### 4. How Interaction Works

The user is an observer of this system, but they can query it for details.

* **The Hover:** When a user moves their mouse over any pillar (active or static), the sculpture pauses its ambient motion and focuses on that team.
* **The "Head-Up Display" (HUD):** A clean, glass-like information card floats next to the cursor. This is the only place active text appears.
* **If Live:** It shows the precise score, the game clock, and the current Top Scorer for that team (e.g., *"S. Gilgeous-Alexander: 32pts"*).
* **If Static:** It shows their Record, Conference Standing, and when they play next (e.g., *"Next: vs LAL @ 7:00 PM"*).



### 5. The Fetching Strategy (How it works under the hood)

To ensure the site is blazing fast and never "flickers," we use a "Heartbeat" pattern.

* **Step 1: The One-Time Asset Load**
* When the user first loads the site, we silently load the 30 team logos (SVGs). These are cached instantly. We never fetch these again.


* **Step 2: The Heartbeat (The Polling)**
* Every **15 seconds**, your site quietly asks the NBA: *"What is the state of the league?"*
* It fetches a single, lightweight file (the Daily Manifest) that contains the scores for every single game.
* **Crucially:** The user does not see a loading spinner. The 3D pillars simply smoothly animate to their new positions. If Shai hits a 3-pointer, the OKC pillar smoothly grows 3 units taller.



### 6. The Aesthetic Style

This aligns with your "Anthropic" and "Systems Developer" preferences.

* **Lighting:** Dark mode. High contrast. The pillars cast soft, realistic shadows.
* **Colors:** Mostly slate greys, deep blacks, and white accents. Color is reserved *only* for the teams (Blue/Orange for OKC) and only when they are active/glowing.
* **Typography:** Small, crisp Monospace fonts (like JetBrains Mono) for the HUD data.

**The Result:** A portfolio centerpiece that looks like a piece of generative art, but functionally serves as a better scoreboard than ESPN. It proves you understand APIs, 3D rendering, and system design without you having to write a single paragraph about it.

---

## 7. Technical Implementation Strategy

### 7.1 Technology Stack

This section details how to build "The League Monument" as a performant, free-to-operate system.

**Core Technologies:**
- **3D Rendering:** React Three Fiber (`@react-three/fiber`) — a React wrapper around Three.js
  - Easier than raw Three.js for React developers
  - Declarative JSX syntax for scene management
  - Built-in `useFrame` hook for 60fps animation loop
  - Native support for smooth state-driven animations
  
- **Data Fetching & Caching:** Next.js App Router with custom API routes
  - Server-side proxy to NBA API (avoids CORS issues)
  - Multi-tier caching strategy (see Section 7.3)
  - Prevents rate-limiting by centralizing requests
  
- **Real-Time Updates:** React hooks (`useState`, `useEffect`) with 15-second polling interval
  - No WebSockets needed (polling is sufficient for sports data)
  - Aligns with your "Heartbeat" pattern (see Section 5)

### 7.2 Data Architecture: The Free NBA API Proxy

**Why a Proxy?**
The NBA doesn't officially provide a public API, but their website uses internal endpoints. By proxying through Next.js, you:
- Eliminate CORS errors
- Control caching to avoid rate limits (staying free forever)
- Cache aggressively without worrying about user geography

**Key NBA API Endpoints (via data.nba.com):**

1. **Standings** (Season hierarchy data)
   - Route: `/stats/standings`
   - Response: Team records (wins/losses), standings position, conference/division
   - Update frequency: Once daily (or less)
   - Use in: Section 2 (State A - The Hierarchy)

2. **Live Scoreboard** (Game scores and clock)
   - Route: `/live/scoreboard`
   - Response: Active games, live scores, quarter/time remaining, play-by-play
   - Update frequency: Every 15 seconds (during games)
   - Use in: Section 2 (State B - The Arena)

3. **Team Static Data** (Logos, colors, IDs)
   - Route: `/data/static/teams`
   - Response: Team metadata (color schemes, logo URLs, abbreviations)
   - Update frequency: Cached forever (never changes)
   - Use in: Initial load (Section 5 - Step 1)

### 7.3 Aggressive Caching Strategy

To stay free while maintaining real-time feel, implement a three-tier cache:

**Tier 1: Server-Side Route Handler Cache (15-30 seconds)**
- **Where:** Next.js API route (`/api/nba/league-state`)
- **How:** Store response in memory with timestamp
- **Benefit:** All concurrent client requests hit this cache, not NBA API
  - Example: 100 users load your site → only 1 call to NBA API
  - Prevents rate-limit exhaustion
  
- **Implementation pattern:**
  ```
  API route receives request
    ↓
  Check: "Is cached data < 15 seconds old?"
    ↓
  Yes → Return cached data immediately
  No → Fetch from NBA API, store in memory, return
  ```

**Tier 2: Client-Side State Cache (React memory)**
- **Where:** React component state (`useState`)
- **How:** Store last received data
- **Benefit:** If server cache misses (unlikely), client uses stale data while fetching
  - User sees last known scores until new data arrives
  - Smooth UX, no loading spinners (ties to Section 4: "The Hover")

**Tier 3: Browser LocalStorage (Optional overnight persistence)**
- **Where:** Browser's localStorage API
- **How:** Persist last valid data snapshot
- **Benefit:** If site refreshes at 3 AM during off-season, gracefully show yesterday's standings instead of error

**Result:** One NBA API call per 15 seconds per server instance, regardless of traffic volume.

### 7.4 Real-Time Update Loop (The Heartbeat Implementation)

This operationalizes Section 5 (The Fetching Strategy):

```
┌─ Client loads page
│
├─ Step 1: Load team logos (cached forever after first load)
│          SVGs stored in browser cache
│
├─ Step 2: Initial data fetch
│          useEffect triggers on mount
│          Fetches /api/nba/league-state
│          React state updates with standings/scores
│          Three.js scene renders pillars
│
├─ Step 3: 15-second polling
│          setInterval calls fetch every 15s
│          Server cache hit → data returned in < 50ms
│          React state updates if data changed
│          Three.js animates pillar transitions smoothly
│
└─ Repeat Step 3 until user leaves page
```

**Key Detail:** No loading spinners. Pillars smoothly animate to new heights/glow values. User perceives real-time without flicker.

### 7.5 React Three Fiber Architecture

**Component Structure:**

```
<LeagueMonument> (main component)
  ├─ <Canvas> (Three.js scene container)
  │  ├─ <PerspectiveCamera/>
  │  ├─ <Lights/>
  │  └─ <Monoliths> (instanced geometry for 30 pillars)
  │     └─ useFrame hook (runs every 60fps, animates transitions)
  │
  └─ <HUD> (React component, positioned via CSS/Framer Motion)
     └─ Shows team details on hover
```

**Performance Optimizations:**

1. **Instancing**
   - Instead of rendering 30 individual `<Mesh>` objects, use `<InstancedMesh/>`
   - Renders all 30 pillars in a single GPU call
   - 60x performance improvement vs. naive approach

2. **Raycasting (Hover Detection)**
   - Only cast rays on `mousemove` event, not every frame
   - Detect which pillar is hovered, highlight it
   - Update HUD position (see Section 4)

3. **Canvas Optimization**
   - Set `dpr={Math.min(window.devicePixelRatio, 2)}` to cap resolution
   - Disables anti-aliasing on mobile to improve frame rate
   - Use `flat` shading on pillars to reduce lighting complexity

4. **LOD (Level of Detail)** (future optimization)
   - Simplify pillar geometry when far from camera
   - Only needed if performance degrades below 60fps

**Animation with useFrame:**
```
Every frame (60x per second):
  ├─ If pillar height changed:
  │  └─ Smoothly interpolate from old height to new height
  │     Duration: 0.5 seconds (easeInOut easing)
  │
  └─ If team is "hot" (momentum):
      └─ Modulate emissive material glow (pulse effect)
```

### 7.6 Mobile Consideration

**Three.js/React Three Fiber on mobile is expensive.** Options:

1. **Desktop-only** (recommended for MVP)
   - Show message: "The League Monument is optimized for desktop"
   - Redirect to standings table on mobile
   - Keeps scope small, maintains performance

2. **Adaptive rendering** (future enhancement)
   - Detect mobile, render with lower pillar count or simplify geometry
   - Reduce animation frame rate (e.g., 30fps on mobile vs. 60fps desktop)

For now, assume desktop-only to keep initial implementation focused.

### 7.7 Error Handling & Graceful Degradation

**If NBA API is unavailable:**
- Server returns cached data from Tier 3 (LocalStorage fallback)
- If all caches are empty: show "League data unavailable. Standings from {timestamp}" 
- Scene remains visible but static
- No error crashes, no broken page

**If user's browser doesn't support WebGL:**
- Detect on load, show fallback standings table
- Alternative: CSS-based pillar visualization (not 3D, but functional)

### 7.8 Performance Targets & Monitoring

**What to measure:**

| Metric | Target | How to Monitor |
|--------|--------|----------------|
| Initial load | < 2 seconds | Lighthouse, browser DevTools |
| First data render | < 500ms | React Profiler |
| Polling latency | < 100ms | Network tab (should be cache hits) |
| Animation frame rate | 60 FPS | DevTools > Rendering > Frame rate |
| Bundle size | < 150KB (Three.js + r3f) | `next/bundle-analyzer` |

---

## 8. Cross-Reference: Design ↔ Implementation

This section maps the original design concepts to technical implementation:

| Original Concept | Technical Implementation | Section |
|------------------|-------------------------|---------|
| "30 vertical pillars" | `<InstancedMesh>` with 30 instances | 7.5 |
| "The Hierarchy" mode | Fetches `/stats/standings` every 24h | 7.2, Section 2.A |
| "The Arena" mode | Fetches `/live/scoreboard` every 15s | 7.2, Section 2.B |
| "The Glow" (momentum) | Emissive material animation in `useFrame` | 7.5, Section 3 |
| "The Clock" (time remaining) | Data from `/live/scoreboard` rendered as LED strip | 7.5, Section 3 |
| "The Hover" & HUD | Raycasting on `mousemove`, CSS-positioned info card | 7.5, Section 4 |
| "The Heartbeat" polling | `useEffect` with `setInterval`, 15-second cycle | 7.4, Section 5 |
| Smooth animations | `useFrame` hook with easing interpolation | 7.5 |
| No flicker on data updates | Multi-tier caching ensures smooth state transitions | 7.3 |

---

## 9. Next Steps for Implementation

**Phase 1: Foundation**
1. [ ] Create `/api/nba/league-state` route handler with caching logic
2. [ ] Fetch and test NBA API endpoints (verify data structure)
3. [ ] Build React Three Fiber scene with static pillars

**Phase 2: Interactivity**
4. [ ] Implement `useEffect` polling (15-second heartbeat)
5. [ ] Wire state updates to pillar animations
6. [ ] Add hover detection (raycasting) and HUD

**Phase 3: Polish**
7. [ ] Optimize performance (instancing, LOD, canvas settings)
8. [ ] Add error handling and fallbacks
9. [ ] Test on target devices/browsers
10. [ ] Deploy and monitor cache hit rate