"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { TrendingUp, ArrowRight, AlertCircle, Target } from "lucide-react";

interface BlurtRow {
  topic: string;
  subtopic: string;
  score: number;
  manual_rag: string | null;
  created_at: string;
}

export default function ProgressContent({ userId }: { userId: string }) {
  const [blurts, setBlurts] = useState<BlurtRow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("blurts")
        .select("topic,subtopic,score,manual_rag,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });
      setBlurts(data || []);
      setLoading(false);
    }
    load();
  }, [userId]);

  if (loading) return <div className="text-center py-20 text-muted">Loading...</div>;

  if (blurts.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <TrendingUp className="w-12 h-12 text-muted mx-auto" />
        <h2 className="text-xl font-bold">No data yet</h2>
        <p className="text-muted">Do a blurt to start tracking your progress!</p>
        <Link href="/topics" className="btn-primary inline-flex items-center gap-2">
          Start Blurting <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Group by date for trend
  const dateMap = new Map<string, { total: number; count: number }>();
  for (const b of blurts) {
    const date = b.created_at.slice(0, 10);
    const existing = dateMap.get(date) || { total: 0, count: 0 };
    existing.total += b.score;
    existing.count += 1;
    dateMap.set(date, existing);
  }
  const trendData = Array.from(dateMap.entries()).map(([date, val]) => ({
    date,
    avg: Math.round(val.total / val.count),
  }));

  // Topic averages
  const topicMap = new Map<string, { total: number; count: number; best: number; worst: number }>();
  for (const b of blurts) {
    const existing = topicMap.get(b.topic) || { total: 0, count: 0, best: 0, worst: 100 };
    existing.total += b.score;
    existing.count += 1;
    existing.best = Math.max(existing.best, b.score);
    existing.worst = Math.min(existing.worst, b.score);
    topicMap.set(b.topic, existing);
  }
  const topicData = Array.from(topicMap.entries())
    .map(([topic, val]) => ({
      topic,
      avg: Math.round(val.total / val.count),
      best: val.best,
      worst: val.worst,
      count: val.count,
    }))
    .sort((a, b) => b.avg - a.avg);

  // Subtopic detail (weakest first)
  const subtopicMap = new Map<string, { topic: string; total: number; count: number; best: number }>();
  for (const b of blurts) {
    const key = `${b.topic}|${b.subtopic}`;
    const existing = subtopicMap.get(key) || { topic: b.topic, total: 0, count: 0, best: 0 };
    existing.total += b.score;
    existing.count += 1;
    existing.best = Math.max(existing.best, b.score);
    subtopicMap.set(key, existing);
  }
  const subtopicData = Array.from(subtopicMap.entries())
    .map(([key, val]) => ({
      key,
      topic: val.topic,
      subtopic: key.split("|")[1],
      avg: Math.round(val.total / val.count),
      best: val.best,
      count: val.count,
    }))
    .sort((a, b) => a.avg - b.avg);

  // Stats
  const totalBlurts = blurts.length;
  const avgScore = Math.round(blurts.reduce((a, b) => a + b.score, 0) / blurts.length);
  const bestTopic = topicData[0];
  const weakestTopic = topicData[topicData.length - 1];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="text-muted text-sm mt-1">Track your improvement over time</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="dashboard-card text-center">
          <div className="text-3xl font-extrabold">{totalBlurts}</div>
          <div className="text-xs text-muted uppercase tracking-wider mt-1">Total Blurts</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-3xl font-extrabold">{avgScore}%</div>
          <div className="text-xs text-muted uppercase tracking-wider mt-1">Overall Avg</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-3xl font-extrabold text-green">{bestTopic?.avg || 0}%</div>
          <div className="text-xs text-muted uppercase tracking-wider mt-1">Best Topic</div>
          <div className="text-xs text-primary mt-0.5 truncate max-w-[120px] mx-auto">{bestTopic?.topic || "-"}</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-3xl font-extrabold text-red">{weakestTopic?.avg || 0}%</div>
          <div className="text-xs text-muted uppercase tracking-wider mt-1">Weakest Topic</div>
          <div className="text-xs text-primary mt-0.5 truncate max-w-[120px] mx-auto">{weakestTopic?.topic || "-"}</div>
        </div>
      </div>

      {/* Score Trend Chart */}
      <div className="dashboard-card">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" /> Score Trend
        </h3>
        <div className="h-48 flex items-end gap-2">
          {trendData.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity">{d.avg}%</div>
              <div
                className="w-full rounded-t-lg transition-all hover:opacity-80"
                style={{
                  height: `${Math.max(d.avg, 5)}%`,
                  background: d.avg >= 65 ? "#4CAF50" : d.avg >= 40 ? "#ffaa33" : "#ff5555",
                  minHeight: "4px",
                }}
              />
              <div className="text-[10px] text-muted truncate w-full text-center">
                {new Date(d.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Breakdown */}
      <div className="dashboard-card">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" /> Topic Breakdown
        </h3>
        <div className="space-y-4">
          {topicData.map((t) => (
            <div key={t.topic}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary font-medium">{t.topic}</span>
                <span className="text-muted">{t.avg}% avg • {t.count} attempt{t.count > 1 ? "s" : ""}</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${t.avg}%`,
                    background: t.avg >= 65 ? "#4CAF50" : t.avg >= 40 ? "#ffaa33" : "#ff5555",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subtopic Detail */}
      <div className="dashboard-card">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red" /> Subtopic Detail
        </h3>
        <div className="space-y-3">
          {subtopicData.map((s) => (
            <div key={s.key} className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
              <div>
                <div className="font-medium text-sm">{s.subtopic}</div>
                <div className="text-xs text-muted">{s.topic} • {s.count} attempt{s.count > 1 ? "s" : ""}</div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-bold ${
                    s.avg >= 65 ? "text-green" : s.avg >= 40 ? "text-amber" : "text-red"
                  }`}
                >
                  {s.avg}%
                </span>
                <Link
                  href={`/blurt/${encodeURIComponent(s.topic)}/${encodeURIComponent(s.subtopic)}`}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  Blurt →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}