import { ContributionData, ContributionDay, ContributionWeek } from "../../src/github";

export interface GitHubUserProfile {
  login: string;
  name: string;
  avatarUrl: string;
  bio: string;
  publicRepos: number;
  followers: number;
}

/**
 * Calculates the current consecutive active day streak from a sorted list of contribution days.
 */
export function calculateBrowserStreak(days: { date: string; count: number }[]): number {
  if (!days || days.length === 0) return 0;
  
  // Sort ascending by date (oldest to newest)
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  
  let streak = 0;
  let idx = sorted.length - 1;

  // If the last day (today) has 0 contributions, check if streak is alive from yesterday
  if (idx >= 0 && sorted[idx].count === 0) {
    idx--;
  }

  while (idx >= 0 && sorted[idx].count > 0) {
    streak++;
    idx--;
  }

  return streak;
}

/**
 * Executes a network fetch with an automatic timeout abort signal.
 */
export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 8000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return res;
  } catch (err: any) {
    if (err?.name === "AbortError") {
      const timeoutErr = new Error(`Request timed out after ${timeoutMs / 1000}s`);
      (timeoutErr as any).code = "TIMEOUT";
      throw timeoutErr;
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Extracts a human-readable reset message from GitHub API rate limit response headers.
 */
export function parseRateLimitReset(res: Response): string {
  const resetEpoch = res.headers.get("x-ratelimit-reset");
  if (resetEpoch) {
    const resetTime = parseInt(resetEpoch, 10) * 1000;
    const diffMs = resetTime - Date.now();
    if (diffMs > 0) {
      const minutes = Math.ceil(diffMs / 60000);
      return `resets in ~${minutes} min`;
    }
  }
  return "resets shortly";
}

/**
 * Fetches basic public profile information for a GitHub user.
 */
export async function fetchGitHubProfile(username: string): Promise<GitHubUserProfile> {
  const cleanUser = username.trim().replace(/^@/, "");
  if (!cleanUser) {
    const err = new Error("Please enter a valid GitHub username.");
    (err as any).code = "EMPTY_USERNAME";
    throw err;
  }

  const res = await fetchWithTimeout(`https://api.github.com/users/${encodeURIComponent(cleanUser)}`, {}, 8000);

  if (res.status === 404) {
    const err = new Error(`User "@${cleanUser}" not found on GitHub.`);
    (err as any).code = "NOT_FOUND";
    throw err;
  }

  if (res.status === 403) {
    const resetInfo = parseRateLimitReset(res);
    const err = new Error(`GitHub API rate limit reached (${resetInfo}). Please try again later.`);
    (err as any).code = "RATE_LIMITED";
    throw err;
  }

  if (!res.ok) {
    const err = new Error(`GitHub API error (HTTP ${res.status}).`);
    (err as any).code = `HTTP_${res.status}`;
    throw err;
  }

  const data: any = await res.json();
  return {
    login: data.login || cleanUser,
    name: data.name || data.login || cleanUser,
    avatarUrl: data.avatar_url || `https://github.com/${cleanUser}.png?size=200`,
    bio: data.bio || "GitHub Developer",
    publicRepos: data.public_repos || 0,
    followers: data.followers || 0,
  };
}

/**
 * Fetches PR counts (open, merged, assigned/reviews) for a user from the public GitHub Search API within the recency window.
 */
export async function fetchUserPRStats(
  username: string,
  prDays: number = 14
): Promise<{ openPRs: number; mergedPRs: number; assignedPRs: number }> {
  const cleanUser = username.trim().replace(/^@/, "");
  let openPRs = 0;
  let mergedPRs = 0;
  let assignedPRs = 0;

  const sinceDate = new Date(Date.now() - prDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  try {
    const [resOpen, resMerged, resAssigned] = await Promise.allSettled([
      fetchWithTimeout(`https://api.github.com/search/issues?q=author:${encodeURIComponent(cleanUser)}+type:pr+state:open`, {}, 6000),
      fetchWithTimeout(`https://api.github.com/search/issues?q=author:${encodeURIComponent(cleanUser)}+type:pr+is:merged+merged:>=${sinceDate}`, {}, 6000),
      fetchWithTimeout(`https://api.github.com/search/issues?q=assignee:${encodeURIComponent(cleanUser)}+type:pr+created:>=${sinceDate}`, {}, 6000),
    ]);

    if (resOpen.status === "fulfilled" && resOpen.value.ok) {
      const data: any = await resOpen.value.json();
      if (typeof data.total_count === "number") {
        openPRs = Math.min(4, Math.max(0, data.total_count));
      }
    }

    if (resMerged.status === "fulfilled" && resMerged.value.ok) {
      const data: any = await resMerged.value.json();
      if (typeof data.total_count === "number") {
        mergedPRs = Math.min(4, Math.max(0, data.total_count));
      }
    }

    if (resAssigned.status === "fulfilled" && resAssigned.value.ok) {
      const data: any = await resAssigned.value.json();
      if (typeof data.total_count === "number") {
        assignedPRs = Math.min(4, Math.max(0, data.total_count));
      }
    }
  } catch (err) {
    console.warn("Could not fetch PR counts from GitHub Search API:", err);
  }

  return { openPRs, mergedPRs, assignedPRs };
}

/**
 * Checks repository owner and contributor status for a given GitHub username.
 */
export async function checkUserStatus(username: string): Promise<{ isOwner: boolean; isContributor: boolean }> {
  const clean = username.trim().toLowerCase().replace(/^@/, "");
  const isOwner = clean === "nivinvysakh";
  let isContributor = false;

  try {
    const res = await fetchWithTimeout("https://api.github.com/repos/nivinvysakh/gh-tree/contributors", {}, 6000);
    if (res.ok) {
      const list: any = await res.json();
      if (Array.isArray(list)) {
        isContributor = list.some((c: any) => c.login?.toLowerCase() === clean);
      }
    }
  } catch (err) {
    console.warn("Could not check repo contributors:", err);
  }

  return { isOwner, isContributor };
}

/**
 * Fetches the user's contribution graph from the CORS-friendly public contributions API.
 * Maps to the gh-tree ContributionData format with real PR counts and streak.
 */
export async function fetchGitHubContributions(
  username: string,
  openPRsOverride?: number,
  mergedPRsOverride?: number,
  assignedPRsOverride?: number
): Promise<ContributionData> {
  const cleanUser = username.trim().replace(/^@/, "");

  // If overrides not explicitly passed, fetch real PR stats in parallel
  const prStatsPromise = (openPRsOverride === undefined || mergedPRsOverride === undefined || assignedPRsOverride === undefined)
    ? fetchUserPRStats(cleanUser)
    : Promise.resolve({
        openPRs: openPRsOverride ?? 0,
        mergedPRs: mergedPRsOverride ?? 0,
        assignedPRs: assignedPRsOverride ?? 0,
      });

  try {
    const [contribRes, prStats] = await Promise.all([
      fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(cleanUser)}?y=last`),
      prStatsPromise,
    ]);

    const openPRs = openPRsOverride ?? prStats.openPRs;
    const mergedPRs = mergedPRsOverride ?? prStats.mergedPRs;
    const assignedPRs = assignedPRsOverride ?? prStats.assignedPRs;

    if (contribRes.ok) {
      const data: any = await contribRes.json();
      if (data.contributions && Array.isArray(data.contributions) && data.contributions.length > 0) {
        const allDays: { date: string; count: number }[] = data.contributions;
        
        // Chunk all historical contribution days into chronological 7-day weeks (up to full year)
        const weeks: ContributionWeek[] = [];
        const totalWeeks = Math.ceil(allDays.length / 7);

        for (let i = 0; i < allDays.length; i += 7) {
          const slice = allDays.slice(i, i + 7);
          const days: ContributionDay[] = slice.map((d) => ({
            date: d.date,
            count: d.count,
          }));
          const total = days.reduce((sum, d) => sum + d.count, 0);
          const weekIndex = Math.floor(i / 7);
          const isRecentWeek = weekIndex >= totalWeeks - 4;

          weeks.push({
            days,
            total,
            openPRs: isRecentWeek ? Math.round(openPRs / 4) : 0,
            mergedPRs: isRecentWeek ? Math.round(mergedPRs / 4) : 0,
            assignedPRs: isRecentWeek ? Math.round(assignedPRs / 4) : 0,
          });
        }

        const totalCommits = data.total?.lastYear || allDays.reduce((sum, d) => sum + d.count, 0);
        const calculatedStreak = calculateBrowserStreak(allDays);

        return {
          totalCommits,
          totalOpenPRs: openPRs,
          totalMergedPRs: mergedPRs,
          totalAssignedPRs: assignedPRs,
          currentStreak: calculatedStreak,
          weeks,
        };
      }
    }
  } catch (err) {
    console.warn("Could not fetch from contributions API, falling back to simulated data:", err);
  }

  const prStats = await prStatsPromise;
  const openPRs = openPRsOverride ?? prStats.openPRs;
  const mergedPRs = mergedPRsOverride ?? prStats.mergedPRs;
  const assignedPRs = assignedPRsOverride ?? prStats.assignedPRs;

  // Fallback mock contribution calendar
  return generateMockContributions(48, 14, openPRs, mergedPRs, assignedPRs);
}

/**
 * Generates customizable mock contribution data for live playground previewing.
 */
export function generateMockContributions(
  totalCommits: number = 42,
  streak: number = 14,
  openPRs: number = 2,
  mergedPRs: number = 2,
  assignedPRs: number = 1,
  weekCount: number = 24
): ContributionData {
  const weeks: ContributionWeek[] = [];
  const now = new Date();

  const weights = [
    0.5, 1.2, 2.0, 0.8, 1.5, 2.5, 0.3, 1.8, 3.0, 1.1,
    0.6, 2.2, 1.4, 0.9, 1.7, 2.8, 0.4, 1.9, 2.1, 1.3,
    0.7, 1.6, 2.4, 1.5,
  ];

  const totalWeight = weights.slice(0, weekCount).reduce((a, b) => a + b, 0);
  let remainingCommits = totalCommits;

  for (let w = 0; w < weekCount; w++) {
    const weight = weights[w % weights.length];
    const isLast = w === weekCount - 1;
    const weekCommits = isLast
      ? Math.max(0, remainingCommits)
      : Math.min(remainingCommits, Math.round((weight / totalWeight) * totalCommits));
    remainingCommits = Math.max(0, remainingCommits - weekCommits);

    const days: ContributionDay[] = [];
    let weekDayRemaining = weekCommits;

    for (let d = 0; d < 7; d++) {
      const dayOffset = (weekCount - 1 - w) * 7 + (6 - d);
      const date = new Date(now.getTime() - dayOffset * 86400000);
      const dateStr = date.toISOString().split("T")[0];
      const isLastDay = d === 6;
      const count = isLastDay
        ? weekDayRemaining
        : Math.min(weekDayRemaining, Math.round(weekDayRemaining / (7 - d)));
      weekDayRemaining = Math.max(0, weekDayRemaining - count);

      days.push({ date: dateStr, count });
    }

    weeks.push({
      days,
      total: weekCommits,
      openPRs: w >= weekCount - 2 ? Math.round(openPRs / 2) : 0,
      mergedPRs: w >= weekCount - 2 ? Math.round(mergedPRs / 2) : 0,
      assignedPRs: w >= weekCount - 2 ? Math.round(assignedPRs / 2) : 0,
    });
  }

  return {
    totalCommits,
    totalOpenPRs: openPRs,
    totalMergedPRs: mergedPRs,
    totalAssignedPRs: assignedPRs,
    currentStreak: streak,
    weeks,
  };
}
