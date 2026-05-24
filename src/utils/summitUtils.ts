import { pastSummitsData } from "@/data/summitData";
import { speakers as centralSpeakers } from "@/data/speakers";

/**
 * Single source of truth for the sorted array of past summits.
 */
export const summitsArray = Object.values(pastSummitsData).sort((a, b) => b.year - a.year);

/**
 * Helper to calculate speaker and session counts for a given year.
 */
export const getSummitCounts = (year: number) => {
  const yearSpeakers = centralSpeakers[year] || [];
  return {
    speakersCount: yearSpeakers.length,
    sessionsCount: yearSpeakers.filter((s) => !!s.topic).length,
  };
};

/**
 * Converts a Google Drive shareable `/view` URL to a `/preview` embed URL.
 *
 * Handles:
 * - Drive `/view` URLs → replaces the `/view` (and any query string) with `/preview`
 * - Already-embed-safe `/preview` URLs → returned unchanged
 * - Non-Drive URLs (e.g., direct PDF paths) → returned unchanged
 *
 * @example
 * getGoogleDriveEmbedUrl(
 *   "https://drive.google.com/file/d/ABC123/view?usp=sharing"
 * )
 * // → "https://drive.google.com/file/d/ABC123/preview"
 */
export const getGoogleDriveEmbedUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "drive.google.com" && parsed.pathname.endsWith("/view")) {
      parsed.pathname = parsed.pathname.replace(/\/view$/, "/preview");
      parsed.search = "";
      return parsed.toString();
    }
  } catch {
    // url is not a valid absolute URL (e.g., a relative path like "/deck.pdf") — return as-is
  }
  return url;
};
