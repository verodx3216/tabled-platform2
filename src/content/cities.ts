/**
 * The Founding 500 — Tabled's 50-city national launch.
 * Every city's founding class of 500 is OPEN AT ONCE; members claim seats in
 * order of application per city. The leaderboard shows which cities are
 * filling fastest — introductions and first tables begin as a city fills.
 */

export const UNLOCK_AT = 500;

/** Below this count a city shows "Just opened" instead of a number. */
export const SHOW_COUNT_FROM = 25;

export type RaceCity = { name: string; live?: boolean };

export const raceCities: RaceCity[] = [
  { name: "Raleigh" },
  { name: "New York" },
  { name: "Miami" },
  // First-unlock targets
  { name: "Austin" },
  { name: "Nashville" },
  { name: "Atlanta" },
  { name: "Charlotte" },
  { name: "Dallas" },
  { name: "Houston" },
  { name: "Chicago" },
  { name: "Washington DC" },
  { name: "Boston" },
  { name: "Denver" },
  { name: "Seattle" },
  { name: "Tampa" },
  // Second wave
  { name: "Los Angeles" },
  { name: "San Francisco" },
  { name: "San Diego" },
  { name: "Phoenix" },
  { name: "Scottsdale" },
  { name: "Philadelphia" },
  { name: "Minneapolis" },
  { name: "Orlando" },
  { name: "Las Vegas" },
  { name: "San Antonio" },
  { name: "Columbus" },
  { name: "Kansas City" },
  { name: "Indianapolis" },
  { name: "Charleston" },
  { name: "Salt Lake City" },
  { name: "Portland" },
  // National footprint
  { name: "San Jose" },
  { name: "Sacramento" },
  { name: "St. Louis" },
  { name: "Pittsburgh" },
  { name: "Cincinnati" },
  { name: "Cleveland" },
  { name: "Detroit" },
  { name: "Baltimore" },
  { name: "Richmond" },
  { name: "Virginia Beach" },
  { name: "Jacksonville" },
  { name: "New Orleans" },
  { name: "Louisville" },
  { name: "Memphis" },
  { name: "Oklahoma City" },
  { name: "Tulsa" },
  { name: "Omaha" },
  { name: "Milwaukee" },
  { name: "Providence" },
];

export const cityNames = raceCities.map((c) => c.name);

/** Alphabetical version for signup dropdowns. */
export const cityNamesAlpha = [...cityNames].sort((a, b) => a.localeCompare(b));

/** International cities shown as "coming soon" — selectable at signup so we
 *  bank demand, but not part of the US Race to 500. */
export const comingSoon = ["Dubai", "London", "Singapore"];
