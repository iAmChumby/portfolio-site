import { NextResponse } from 'next/server';

const ESPN_SCOREBOARD_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard';
const ESPN_SCHEDULE_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/18/schedule';
const KNICKS_TEAM_ID = '18';
const GAME_DURATION_HOURS = 3; // Conservative estimate for NBA game length
const POST_GAME_DISPLAY_HOURS = 6; // Display finished games for 6 hours

interface ESPNTeamLogo {
  href: string;
  rel: string[];
}

interface ESPNTeam {
  id: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  logo?: string;
  logos?: ESPNTeamLogo[];
}

interface ESPNRecord {
  name: string;
  abbreviation?: string;
  type: string;
  summary: string;
}

interface ESPNCompetitor {
  id: string;
  team: ESPNTeam;
  score?: string; // Scoreboard endpoint uses string, not nested object
  homeAway: 'home' | 'away';
  winner?: boolean;
  records?: ESPNRecord[];
}

interface ESPNStatus {
  clock: number;
  displayClock: string;
  period: number;
  type: {
    id: string;
    name: string;
    state: 'pre' | 'in' | 'post';
    completed: boolean;
    description: string;
    detail: string;
    shortDetail: string;
  };
}

interface ESPNCompetition {
  id: string;
  date: string;
  competitors: ESPNCompetitor[];
  status: ESPNStatus;
}

interface ESPNEvent {
  id: string;
  name: string;
  shortName: string;
  date: string;
  competitions: ESPNCompetition[];
}

interface ESPNScoreboardResponse {
  events: ESPNEvent[];
}

interface ESPNScheduleEvent {
  id: string;
  date: string;
  name: string;
  competitions: ESPNCompetition[];
}

interface ESPNScheduleResponse {
  events: ESPNScheduleEvent[];
  team?: {
    record?: {
      items?: Array<{ summary?: string; type?: string }>
    }
  };
}

export interface KnicksGameData {
  isPlaying: boolean;
  isWinning: boolean | null;
  isTied: boolean;
  gameStatus: 'pre' | 'in' | 'post' | null;
  knicksScore: number | null;
  opponentScore: number | null;
  opponentName: string | null;
  opponentLogo: string | null;
  gameTime: string | null;
  period: string | null;
  clock: string | null;
  isHome: boolean | null;
  gameDetail: string | null;
  teamRecord: string | null;
  isRecentlyFinished?: boolean; // Flag for games in 6-hour window
  daysUntilGame?: number | null; // Days until next game (for off-season/multi-day gaps)
  isOffSeason?: boolean; // Flag for off-season period (July-Sept)
}

function getScoreboardLogo(team: ESPNTeam): string | null {
  // Scoreboard endpoint provides logo directly on team object
  if (team.logo) return team.logo;

  // Fallback to logos array if available
  if (team.logos) {
    const scoreboardLogo = team.logos.find(l => l.rel.includes('scoreboard') && !l.rel.includes('dark'));
    if (scoreboardLogo) return scoreboardLogo.href;

    const defaultLogo = team.logos.find(l => l.rel.includes('default') && !l.rel.includes('dark'));
    return defaultLogo?.href || team.logos[0]?.href || null;
  }

  return null;
}

/**
 * Check if a finished game is within the post-game display window
 * Estimates game end time as start time + 3 hours
 */
function isWithinPostGameWindow(gameStartTime: string): boolean {
  const now = new Date();
  const gameStart = new Date(gameStartTime);

  // Estimate game end (start + typical duration)
  const estimatedGameEnd = new Date(
    gameStart.getTime() + GAME_DURATION_HOURS * 60 * 60 * 1000
  );

  // Hours since estimated end
  const hoursSinceEnd = (now.getTime() - estimatedGameEnd.getTime()) / (1000 * 60 * 60);

  return hoursSinceEnd >= 0 && hoursSinceEnd <= POST_GAME_DISPLAY_HOURS;
}

function findRelevantGame(events: ESPNEvent[]): { event: ESPNEvent; type: 'live' | 'upcoming' | 'finished' } | null {
  const now = new Date();

  // Filter to only Knicks games
  const knicksEvents = events.filter(event => {
    const competition = event.competitions[0];
    return competition?.competitors.some(c => c.team.id === KNICKS_TEAM_ID);
  });

  // Priority 1: Look for a live game (in progress)
  for (const event of knicksEvents) {
    const competition = event.competitions[0];
    if (!competition) continue;

    const status = competition.status;
    if (status.type.state === 'in') {
      return { event, type: 'live' };
    }
  }

  // Priority 2: Look for recently finished games (within 6-hour window)
  let recentFinishedGame: ESPNEvent | null = null;
  let recentFinishedTime: Date | null = null;

  for (const event of knicksEvents) {
    const competition = event.competitions[0];
    if (!competition) continue;

    const status = competition.status;
    const gameDate = new Date(event.date);

    // Check for finished games within the post-game display window
    if (status.type.state === 'post' && isWithinPostGameWindow(event.date)) {
      // If multiple finished games in window, select the most recent one
      if (!recentFinishedGame || gameDate > recentFinishedTime!) {
        recentFinishedGame = event;
        recentFinishedTime = gameDate;
      }
    }
  }

  if (recentFinishedGame) {
    return { event: recentFinishedGame, type: 'finished' };
  }

  // Priority 3: Look for the next upcoming game (pre-game, future date)
  let nextGame: ESPNEvent | null = null;
  let nextGameTime: Date | null = null;

  for (const event of knicksEvents) {
    const competition = event.competitions[0];
    if (!competition) continue;

    const status = competition.status;
    const gameDate = new Date(event.date);

    // Look for pre-game status or future games
    if (status.type.state === 'pre' && gameDate > now) {
      if (!nextGame || gameDate < nextGameTime!) {
        nextGame = event;
        nextGameTime = gameDate;
      }
    }
  }

  if (nextGame) {
    return { event: nextGame, type: 'upcoming' };
  }

  return null;
}

/**
 * Detect if we're in the NBA off-season (July-September)
 * Simple calendar heuristic: months 6, 7, 8 (July, Aug, Sept)
 */
function isOffSeason(): boolean {
  const month = new Date().getMonth(); // 0-indexed: 6=July, 7=Aug, 8=Sept
  return month >= 6 && month <= 8;
}

/**
 * Fetch the next scheduled game from ESPN Schedule API
 * Returns the earliest upcoming game with pre-game status
 * Caches for 1 hour since schedules don't change frequently
 */
async function fetchNextScheduledGame(): Promise<{ event: ESPNEvent; teamRecord: string | null } | null> {
  try {
    const response = await fetch(ESPN_SCHEDULE_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`ESPN Schedule API responded with status: ${response.status}`);
      return null;
    }

    const data: ESPNScheduleResponse = await response.json();

    if (!data.events || data.events.length === 0) {
      return null;
    }

    const now = new Date();

    // Find all upcoming games (pre-game status and future date)
    const upcomingGames = data.events
      .filter(event => {
        const competition = event.competitions?.[0];
        if (!competition) return false;

        const gameDate = new Date(event.date);
        const status = competition.status;

        return status.type.state === 'pre' && gameDate > now;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (upcomingGames.length === 0) {
      return null;
    }

    // Get team record from schedule response
    const teamRecord = data.team?.record?.items?.find(r => r.type === 'total')?.summary || null;

    // Return earliest upcoming game
    return {
      event: upcomingGames[0] as ESPNEvent,
      teamRecord,
    };
  } catch (error) {
    console.error('Error fetching from Schedule API:', error);
    return null;
  }
}

function parseGame(event: ESPNEvent, teamRecord: string | null): KnicksGameData {
  const competition = event.competitions[0];
  const status = competition.status;
  
  const knicksCompetitor = competition.competitors.find(
    (c) => c.team.id === KNICKS_TEAM_ID
  )!;
  
  const opponentCompetitor = competition.competitors.find(
    (c) => c.team.id !== KNICKS_TEAM_ID
  )!;
  
  // Scoreboard endpoint returns scores as strings
  const knicksScore = parseInt(knicksCompetitor.score || '0', 10);
  const opponentScore = parseInt(opponentCompetitor.score || '0', 10);
  
  const gameState = status.type.state;
  const isPlaying = gameState === 'in';
  const isFinished = gameState === 'post';
  
  // Determine if winning (only relevant during or after game)
  let isWinning: boolean | null = null;
  let isTied = false;
  
  if (isPlaying || isFinished) {
    if (knicksScore > opponentScore) {
      isWinning = true;
    } else if (knicksScore < opponentScore) {
      isWinning = false;
    } else {
      isTied = true;
    }
  }
  
  // Get period info
  let period: string | null = null;
  if (status.period > 0) {
    if (status.period <= 4) {
      period = `Q${status.period}`;
    } else {
      const otPeriod = status.period - 4;
      period = otPeriod === 1 ? 'OT' : `${otPeriod}OT`;
    }
  }
  
  return {
    isPlaying,
    isWinning,
    isTied,
    gameStatus: gameState,
    knicksScore: isPlaying || isFinished ? knicksScore : null,
    opponentScore: isPlaying || isFinished ? opponentScore : null,
    opponentName: opponentCompetitor.team.shortDisplayName,
    opponentLogo: getScoreboardLogo(opponentCompetitor.team),
    gameTime: event.date,
    period,
    clock: status.displayClock,
    isHome: knicksCompetitor.homeAway === 'home',
    gameDetail: status.type.shortDetail,
    teamRecord,
  };
}

export async function GET() {
  try {
    const response = await fetch(ESPN_SCOREBOARD_URL, {
      next: { revalidate: 30 }, // Cache for 30 seconds
    });

    if (!response.ok) {
      throw new Error(`ESPN API responded with status: ${response.status}`);
    }

    const data: ESPNScoreboardResponse = await response.json();

    const relevantGame = findRelevantGame(data.events || []);

    if (!relevantGame) {
      // Priority 4: No game found in scoreboard, try schedule API for upcoming games
      const scheduleResult = await fetchNextScheduledGame();

      if (scheduleResult) {
        // Found an upcoming game in the schedule
        const gameData = parseGame(scheduleResult.event, scheduleResult.teamRecord);
        const now = new Date();
        const gameDate = new Date(scheduleResult.event.date);
        const daysUntil = Math.ceil((gameDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        return NextResponse.json({
          ...gameData,
          daysUntilGame: daysUntil,
          isOffSeason: isOffSeason(),
        } as KnicksGameData);
      }

      // No games found in either API - true off-season
      return NextResponse.json({
        isPlaying: false,
        isWinning: null,
        isTied: false,
        gameStatus: null,
        knicksScore: null,
        opponentScore: null,
        opponentName: null,
        opponentLogo: null,
        gameTime: null,
        period: null,
        clock: null,
        isHome: null,
        gameDetail: null,
        teamRecord: null,
        daysUntilGame: null,
        isOffSeason: isOffSeason(),
      } as KnicksGameData);
    }

    // Extract team record from the Knicks competitor in the game
    const competition = relevantGame.event.competitions[0];
    const knicksCompetitor = competition.competitors.find(
      (c) => c.team.id === KNICKS_TEAM_ID
    );
    const teamRecord = knicksCompetitor?.records?.find(r => r.type === 'total')?.summary || null;

    const gameData = parseGame(relevantGame.event, teamRecord);

    // Add isRecentlyFinished flag for games in the 6-hour post-game window
    const enhancedGameData = {
      ...gameData,
      isRecentlyFinished: relevantGame.type === 'finished'
    };

    return NextResponse.json(enhancedGameData);
  } catch (error) {
    console.error('Error fetching Knicks game data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game data' },
      { status: 500 }
    );
  }
}
