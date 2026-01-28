import { NextResponse } from 'next/server';

const ESPN_SCOREBOARD_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard';
const KNICKS_TEAM_ID = '18';

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

function findRelevantGame(events: ESPNEvent[]): { event: ESPNEvent; type: 'live' | 'upcoming' } | null {
  const now = new Date();

  // Filter to only Knicks games
  const knicksEvents = events.filter(event => {
    const competition = event.competitions[0];
    return competition?.competitors.some(c => c.team.id === KNICKS_TEAM_ID);
  });

  // First, look for a live game (in progress)
  for (const event of knicksEvents) {
    const competition = event.competitions[0];
    if (!competition) continue;

    const status = competition.status;
    if (status.type.state === 'in') {
      return { event, type: 'live' };
    }
  }

  // Next, look for the next upcoming game (pre-game, future date)
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
      // No upcoming games found - might be off-season
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
      } as KnicksGameData);
    }

    // Extract team record from the Knicks competitor in the game
    const competition = relevantGame.event.competitions[0];
    const knicksCompetitor = competition.competitors.find(
      (c) => c.team.id === KNICKS_TEAM_ID
    );
    const teamRecord = knicksCompetitor?.records?.find(r => r.type === 'total')?.summary || null;

    const gameData = parseGame(relevantGame.event, teamRecord);

    return NextResponse.json(gameData);
  } catch (error) {
    console.error('Error fetching Knicks game data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game data' },
      { status: 500 }
    );
  }
}
