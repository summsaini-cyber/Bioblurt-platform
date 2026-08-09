"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { AQA_TOPICS } from "@/lib/spec-data";
import { getRagStatus, getEffectiveRank } from "@/lib/scoring-engine";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface BlurtRow {
  topic: string;
  subtopic: string;
  score: number;
  manual_rag: string | null;
}

export default function TopicsContent({ userId, selectedTopic }: { userId: string; selectedTopic?: string }) {
  const [blurts, setBlurts] = useState<BlurtRow[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("blurts")
        .select("topic,subtopic,score,manual_rag")
        .eq("user_id", userId);
      setBlurts(data || []);
      setLoading(false);
    }
    load();
  }, [userId]);

  if (loading) return <div className="text-center py-20 text-muted">Loading...</div>;

  if (selectedTopic && AQA_TOPICS[selectedTopic]) {
    // Show subtopics for selected topic
    const subtopics = AQA_TOPICS[selectedTopic];
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.push("/topics")}
          className="flex items-center gap-2 text-muted hover:text-text-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to topics
        </button>

        <div>
          <h1 className="text-2xl font-bold">{selectedTopic}</h1>
          <p className="text-muted text-sm mt-1">Select a sub-topic to blurt</p>
        </div>

        <div className="grid gap-3">
          {Object.keys(subtopics).map((sub) => {
            const best = blurts
              .filter((b) => b.topic === selectedTopic && b.subtopic === sub)
              .sort((a, b) => b.score - a.score)[0];
            const score = best?.score || 0;
            const manual = best?.manual_rag || null;
            const { status } = getRagStatus(score, manual);
            const { rank, className } = getEffectiveRank(score, manual);

            return (
              <Link
                key={sub}
                href={`/blurt/${encodeURIComponent(selectedTopic)}/${encodeURIComponent(sub)}`}
                className="topic-card flex items-center justify-between"
              >
                <span className="font-medium">{sub}</span>
                <div className="flex items-center gap-3">
                  {best ? (
                    <>
                      <span className={`text-xs font-semibold uppercase tracking-wider ${status === "Red" ? "text-red" : status === "Amber" ? "text-amber" : "text-green"}`}>
                        {status}
                      </span>
                      <span className={`rank-badge ${className}`}>{rank}</span>
                    </>
                  ) : (
                    <span className="text-xs text-muted uppercase tracking-wider">New</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Show all topics
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Topics</h1>
        <p className="text-muted text-sm mt-1">Select a topic to start blurting</p>
      </div>

      <div className="grid gap-3">
        {Object.entries(AQA_TOPICS).map(([topic, subs]) => {
          const scores = blurts.filter((b) => b.topic === topic).map((b) => b.score);
          const avg = scores.length > 0 ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 0;
          const manual = blurts.find((b) => b.topic === topic)?.manual_rag;
          const { status } = getRagStatus(avg, manual);
          const subCount = Object.keys(subs).length;
          const attempted = new Set(blurts.filter((b) => b.topic === topic).map((b) => b.subtopic)).size;

          return (
            <Link key={topic} href={`/topics?topic=${encodeURIComponent(topic)}`} className="topic-card flex items-center justify-between">
              <div>
                <div className="font-medium">{topic}</div>
                <div className="text-xs text-muted mt-0.5">{attempted}/{subCount} subtopics attempted</div>
              </div>
              <div className="flex items-center gap-3">
                {scores.length > 0 ? (
                  <>
                    <span className={`text-xs font-semibold uppercase tracking-wider ${status === "Red" ? "text-red" : status === "Amber" ? "text-amber" : "text-green"}`}>
                      {status}
                    </span>
                    <span className={`rank-badge ${getEffectiveRank(avg, manual).className}`}>
                      {getEffectiveRank(avg, manual).rank}
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-muted uppercase tracking-wider">New</span>
                )}
                <ArrowRight className="w-4 h-4 text-muted" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
