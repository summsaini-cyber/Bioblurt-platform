const STOP_WORDS = new Set([
  "the","and","are","from","that","with","for","can","its","has","have","this","into","been",
  "they","their","them","than","then","when","where","which","while","during","between",
  "through","within","under","over","such","each","both","all","any","some","many","most",
  "more","less","very","also","only","just","but","not","however","therefore","because",
  "since","although","though","unless","whether","either","neither","yet","so","as","at",
  "by","in","of","on","to","up","via","per","a","an","is","it","be","or","if","do","does",
  "did","will","would","could","should","may","might","must","shall","was","were","had",
  "having","being","made","used","using","form","forms","formed","role","roles","function",
  "functions","structure","structures","process","processes","including","involves","involving",
  "called","known","found","present","produced","produces","produce","give","gives","given",
  "take","takes","taken","make","makes","use","uses","one","two","three","first","second",
  "third","other","another","same","different","similar","various","certain","specific",
  "particular","general","main","major","important","essential","necessary","required",
  "needed","able","due","across","along","around","against","towards","away","down","off",
  "out","upon","without","about","above","after","again","against","ago","before","behind",
  "below","beside","besides","beyond","despite","except","inside","instead","into","like",
  "near","onto","outside","past","since","throughout","till","toward","underneath","until",
  "unto","upon","versus","via","within","worth"
]);

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  const keywords: string[] = [];
  for (const word of words) {
    const clean = word.replace(/[^a-z0-9]/g, "");
    if (clean.length >= 4 && !STOP_WORDS.has(clean)) {
      keywords.push(clean);
    }
  }
  return keywords;
}

function similarity(a: string, b: string): number {
  const len = Math.max(a.length, b.length);
  if (len === 0) return 1;
  let dist = 0;
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) dist++;
  }
  return 1 - dist / len;
}

export function calculateScore(userText: string, specPoints: string[]): { score: number; matched: string[] } {
  if (!userText || !userText.trim()) return { score: 0, matched: [] };

  const userKeywords = extractKeywords(userText);
  if (userKeywords.length === 0) return { score: 0, matched: [] };

  const matched: string[] = [];

  for (const point of specPoints) {
    const pointKeywords = extractKeywords(point);
    if (pointKeywords.length === 0) continue;

    let matchedCount = 0;
    for (const pk of pointKeywords) {
      let best = 0;
      for (const uk of userKeywords) {
        if (pk === uk) {
          best = 1;
          break;
        } else if (pk.length >= 6 && uk.includes(pk)) {
          best = Math.max(best, 0.5);
        } else {
          const ratio = similarity(pk, uk);
          if (ratio > 0.88) {
            best = Math.max(best, ratio * 0.6);
          }
        }
      }
      if (best >= 0.45) matchedCount += best;
    }

    const sim = matchedCount / pointKeywords.length;
    if (sim >= 0.5) matched.push(point);
  }

  const score = specPoints.length > 0 ? Math.round((matched.length / specPoints.length) * 1000) / 10 : 0;
  return { score: Math.min(score, 100), matched };
}

export function getRank(percentage: number): { rank: string; className: string } {
  if (percentage < 25) return { rank: "Beginner", className: "rank-beginner" };
  if (percentage < 45) return { rank: "Developing", className: "rank-developing" };
  if (percentage < 65) return { rank: "Proficient", className: "rank-proficient" };
  if (percentage < 85) return { rank: "Advanced", className: "rank-advanced" };
  return { rank: "Master", className: "rank-master" };
}

export function getEffectiveRank(score: number, manualRag: string | null): { rank: string; className: string } {
  const { rank, className } = getRank(score);
  if (manualRag === "Amber" && score < 45) return { rank: "Developing", className: "rank-developing" };
  if (manualRag === "Green" && score < 65) return { rank: "Proficient", className: "rank-proficient" };
  return { rank, className };
}

export function getRagStatus(score: number, manualRag: string | null): { status: string; color: string } {
  if (manualRag) return { status: manualRag, color: manualRag.toLowerCase() };
  if (score < 40) return { status: "Red", color: "red" };
  if (score < 65) return { status: "Amber", color: "amber" };
  return { status: "Green", color: "green" };
}
