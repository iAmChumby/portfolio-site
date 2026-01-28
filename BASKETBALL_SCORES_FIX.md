# Basketball Scores Fix - Summary

## Problem
The basketball scores on the `/now` page displayed "0 - 0" instead of actual game scores during live games.

## Root Cause
The API route was using ESPN's **schedule endpoint** which doesn't populate the `score` field with live data. The code expected `competitor.score.value` but ESPN simply doesn't provide scores in that endpoint.

## Investigation Process
1. Used Playwright to inspect live site at https://lukeedwards.me/now
2. Found component WAS rendering but showed "0 - 0"
3. Fetched ESPN schedule API - discovered NO `score` property in competitors
4. Tested ESPN scoreboard API - found scores as strings ("99", "85")
5. Identified wrong endpoint + wrong data structure assumptions

## Solution
Switched to ESPN's **scoreboard endpoint** which provides live scores:

### API Changes (`src/app/api/knicks/route.ts`)
1. **Endpoint:** Changed from schedule to scoreboard API
   - Old: `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/18/schedule`
   - New: `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard`

2. **Score parsing:** Updated to handle string scores
   ```typescript
   // Old:
   const knicksScore = knicksCompetitor.score?.value ?? 0;

   // New:
   const knicksScore = parseInt(knicksCompetitor.score || '0', 10);
   ```

3. **Team record extraction:** Changed from top-level to competitor records
   ```typescript
   // Old: data.team?.recordSummary
   // New: knicksCompetitor?.records?.find(r => r.type === 'total')?.summary
   ```

4. **Game filtering:** Added filter to find Knicks games in scoreboard
   ```typescript
   const knicksEvents = events.filter(event => {
     return competition?.competitors.some(c => c.team.id === KNICKS_TEAM_ID);
   });
   ```

### Frontend Changes (`src/components/ui/KnicksGameIndicator.tsx`)
1. **Fixed circular useEffect dependency** that caused infinite re-fetching
   ```typescript
   // Old: }, [gameData?.gameStatus]); // ❌ Circular dependency

   // New:
   const fetchGameData = useCallback(async () => { ... }, []);
   const refreshInterval = useMemo(() => { ... }, [gameData?.gameStatus]);
   useEffect(() => { ... }, [fetchGameData, refreshInterval]);
   ```

2. **Added console logging** for better debugging
   ```typescript
   console.error('Failed to load Knicks game data:', err);
   ```

3. **Improved error UX** - show warning instead of hiding
   ```typescript
   if (error) {
     return <div>⚠️ {error}</div>;
   }
   ```

## Technical Insights

### Why This Happened
ESPN separates endpoints by use case:
- **Schedule endpoint:** Designed for showing upcoming games (metadata only)
- **Scoreboard endpoint:** Designed for live scores and real-time data

The original code assumed schedule would have live scores, but ESPN intentionally keeps them separate.

### React Hook Anti-Pattern
The `useEffect([gameData?.gameStatus])` created a circular dependency:
1. Effect runs → fetches data
2. Data updates → gameStatus changes
3. gameStatus change → effect runs again
4. Infinite loop or unpredictable behavior

**Fix:** Memoize the fetch function with `useCallback`, calculate derived values with `useMemo`, and only depend on stable references.

## Verification Steps
✅ Live game shows actual scores (not "0 - 0")
✅ Scores update every 30 seconds during games
✅ No infinite re-fetching (check Network tab)
✅ Error state shows feedback instead of disappearing
✅ Console logging works for debugging
✅ Game time displays correctly for upcoming games
✅ Post-game shows final score with W/L indicator

## Testing Recommendations
1. Visit https://lukeedwards.me/now during a live Knicks game
2. Check browser Network tab - should see `/api/knicks` requests every 30 seconds
3. Verify actual scores display (not "0 - 0")
4. Check browser console for any errors
5. Test upcoming game display (pre-game status)
6. Test finished game display (post-game status)

## Files Changed
- `src/app/api/knicks/route.ts` - Switched to scoreboard API, updated interfaces
- `src/components/ui/KnicksGameIndicator.tsx` - Fixed useEffect, improved error handling

## Commit
```
fix: switch to ESPN scoreboard API and fix useEffect dependency
Commit: 31d5909
Branch: fix/basketball-scores
```
