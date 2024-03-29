import { fetchByID, searchOnNetkeiba } from "./crawler.ts";
import { HorseInfo, searchQuery, SearchResult } from "./model.ts";
import {
  horseInfo2SearchResult,
  scrapeHorseInfo,
  scrapeSearchResult,
} from "./scrape/scraper.ts";

export { lookupID, profileByID, profileByName };

async function lookupID(query: searchQuery): Promise<SearchResult[]> {
  let result: SearchResult[] = [];
  const response = await searchOnNetkeiba(query);

  if (response.unique) {
    // 例: url = https://db.netkeiba.com/horse/2017106711/
    // scrapeHorseInfo(response.html) の返り値を取り出して searchResult型に変換して返す。
    const horseInfo = scrapeHorseInfo(response.html);
    result = horseInfo2SearchResult(horseInfo);
  } else {
    result = scrapeSearchResult(response.html);
  }
  return result;
}

async function profileByName(query: searchQuery): Promise<HorseInfo> {
  const res = await searchOnNetkeiba(query);
  if (res.unique) {
    return scrapeHorseInfo(res.html);
  } else {
    throw new Error("Not found or multiple results. Modify the search query so that the search results are unique.");
  }
}

async function profileByID(horseID: string): Promise<HorseInfo> {
  const res = await fetchByID(horseID);
  return scrapeHorseInfo(res.html);
}
