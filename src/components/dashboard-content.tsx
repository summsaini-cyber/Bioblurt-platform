"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { AQA_TOPICS, getAllSpecPoints } from "@/lib/spec-data";
import { getRagStatus, getEffectiveRank } from "@/lib/scoring-engine";
import { BookOpen, ArrowRight, Zap, Trophy } from "lucide-react";

interface BlurtRow {
  topic: string;
  subtopic: string;
  score: number;
  manual_rag: string | null;
  created_at: string;
}

interface TrackerRow {
  topic: string;
  subtopic: string;
  rag: string;
  point_key: string;
}

export default function DashboardContent({ userId }: { userId: string }) {
  const [blurts, setBlurts] = useState<BlurtRow[]>([]);
  const [tracker, setTracker] = useState<TrackerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: blurtData } = await supabase
        .from("blurts")
        .select("topic,subtopic,score,manual_rag,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      const { data: trackerData } = await supabase
        .from("tracker_points")
        .select("topic,subtopic,rag,point_key")
        .eq("user_id", userId);

      setBlurts(blurtData || []);
      setTracker(trackerData || []);
      setLoading(false);
    }
    load();
  }, [userId]);

  if (loading) return <div className="text-center py-20 text-muted">Loading...</div>;

  // Stats
  const totalSubtopics = Object.values(AQA_TOPICS).reduce((a, b) => a + Object.keys(b).length, 0);
  const attemptedSet = new Set(blurts.map((b) => `${b.topic}|${b.subtopic}`));
  const attempted = attemptedSet.size;
  const avgScore = blurts.length > 0 ? Math.round((blurts.reduce((a, b) => a + b.score, 0) / blurts.length) * 10) / 10 : 0;
  const totalPoints = getAllSpecPoints().length;
  const covered = tracker.filter((t) => t.rag !== "Red").length;
  const coverage = totalPoints > 0 ? Math.round((covered / totalPoints) * 1000) / 10 : 0;

  // Topic stats
  const topicStats: Record<string, { attempted: number; total: number; scores: number[] }> = {};
  for (const [topic, subs] of Object.entries(AQA_TOPICS)) {
    topicStats[topic] = { attempted: 0, total: Object.keys(subs).length, scores: [] };
  }
  for (const b of blurts) {
    if (topicStats[b.topic]) {
      topicStats[b.topic].scores.push(b.score);
      if (!topicStats[b.topic].attempted) topicStats[b.topic].attempted = 0;
      topicStats[b.topic].attempted++;
    }
  }

  // Weak topics — ONLY attempted subtopics that are Red or < 50%
  const weak: { topic: string; subtopic: string; score: number; rag: string; reason: string }[] = [];
  for (const [topic, subs] of Object.entries(AQA_TOPICS)) {
    for (const sub of Object.keys(subs)) {
      const best = blurts
        .filter((b) => b.topic === topic && b.subtopic === sub)
        .sort((a, b) => b.score - a.score)[0];
      if (best) {
        const manual = best.manual_rag;
        const rag = manual || getRagStatus(best.score, null).status;
        if (rag === "Red" || best.score < 50) {
          weak.push({ topic, subtopic: sub, score: best.score, rag, reason: manual ? "Manual Red" : `Score ${best.score}%` });
        }
      }
    }
  }
  weak.sort((a, b) => a.score - b.score); // weakest first
  const topWeak = weak.slice(0, 5);

  // RAG counts
  const redCount = blurts.filter((b) => (b.manual_rag || getRagStatus(b.score, null).status) === "Red").length;
  const amberCount = blurts.filter((b) => (b.manual_rag || getRagStatus(b.score, null).status) === "Amber").length;
  const greenCount = blurts.filter((b) => (b.manual_rag || getRagStatus(b.score, null).status) === "Green").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted text-sm mt-1">Track your AQA Biology revision progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="dashboard-card text-center">
          <div className="text-3xl font-extrabold">{attempted}/{totalSubtopics}</div>
          <div className="text-xs text-muted uppercase tracking-wider mt-1">Blurts Done</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-3xl font-extrabold">{avgScore}%</div>
          <div className="text-xs text-muted uppercase tracking-wider mt-1">Avg Score</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-3xl font-extrabold">{blurts.length}</div>
          <div className="text-xs text-muted uppercase tracking-wider mt-1">Total Attempts</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-3xl font-extrabold">{coverage}%</div>
          <div className="text-xs text-muted uppercase tracking-wider mt-1">Spec Covered</div>
        </div>
      </div>

      {/* Full Spec Tracker Card */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">Complete AQA Spec Checklist</h3>
            <p className="text-sm text-muted">{covered}/{totalPoints} points covered • {coverage}% complete</p>
          </div>
          <div className="text-right text-sm">
            <span className="text-red font-bold">{tracker.filter((t) => t.rag === "Red").length}</span> <span className="text-muted">Red</span>{" "}
            <span className="text-amber font-bold">{tracker.filter((t) => t.rag === "Amber").length}</span> <span className="text-muted">Amber</span>{" "}
            <span className="text-green font-bold">{tracker.filter((t) => t.rag === "Green").length}</span> <span className="text-muted">Green</span>
          </div>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{
              width: `${coverage}%`,
              background: coverage >= 80 ? "#4CAF50" : coverage >= 40 ? "#ffaa33" : "#ff5555",
            }}
          />
        </div>
        <Link href="/tracker" className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
          Open Full Specification Tracker <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Blurt RAG Breakdown */}
      {blurts.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="dashboard-card text-center">
            <div className="text-3xl font-extrabold text-red">{redCount}</div>
            <div className="text-xs text-muted uppercase tracking-wider mt-1">Red</div>
          </div>
          <div className="dashboard-card text-center">
            <div className="text-3xl font-extrabold text-amber">{amberCount}</div>
            <div className="text-xs text-muted uppercase tracking-wider mt-1">Amber</div>
          </div>
          <div className="dashboard-card text-center">
            <div className="text-3xl font-extrabold text-green">{greenCount}</div>
            <div className="text-xs text-muted uppercase tracking-wider mt-1">Green</div>
          </div>
        </div>
      )}

      {/* Weak Topics */}
      <div className="dashboard-card">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-red" />
          <h3 className="font-semibold text-lg">Weak Topics</h3>
        </div>

        {blurts.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-muted">Do a blurt to get started!</p>
            <Link href="/topics" className="btn-primary inline-flex items-center gap-2">
              Start Blurting <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : weak.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <Trophy className="w-8 h-8 text-green mx-auto" />
            <p className="text-muted">No weak topics right now — you're doing great!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topWeak.map((w) => (
              <div key={`${w.topic}|${w.subtopic}`} className="flex items-center gap-4">
                <div className="flex-1 p-3 rounded-xl bg-surface border border-border">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{w.subtopic}</div>
                    <span className={`text-sm font-bold ${w.score >= 40 ? "text-amber" : "text-red"}`}>
                      {w.score}%
                    </span>
                  </div>
                  <div className="text-xs text-muted">{w.topic} • {w.reason}</div>
                </div>
                <Link
                  href={`/blurt/${encodeURIComponent(w.topic)}/${encodeURIComponent(w.subtopic)}`}
                  className="btn-secondary whitespace-nowrap text-sm"
                >
                  Review →
                </Link>
              </div>
            ))}
            <div className="text-center pt-2">
              <p className="text-xs text-muted">This is all! Do some more blurts for weak topic reviews.</p>
            </div>
          </div>
        )}
      </div>

      {/* Topic Progress */}
      {Object.keys(topicStats).length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Topic Progress</h3>
          <div className="space-y-3">
            {Object.entries(topicStats)
              .filter(([, s]) => s.attempted > 0)
              .map(([topic, stat]) => {
                const pct = Math.round((stat.attempted / stat.total) * 100);
                const avg = stat.scores.length > 0 ? Math.round((stat.scores.reduce((a, b) => a + b, 0) / stat.scores.length) * 10) / 10 : 0;
                return (
                  <div key={topic}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">{topic}</span>
                      <span className="text-muted">{stat.attempted}/{stat.total} • {avg}% avg</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${pct}%`,
                          background: pct >= 80 ? "#4CAF50" : pct >= 40 ? "#ffaa33" : "#ff5555",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Topic Selection */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Select a Topic</h3>
        <div className="grid gap-3">
          {Object.entries(AQA_TOPICS).map(([topic, subs]) => {
            const scores = blurts.filter((b) => b.topic === topic).map((b) => b.score);
            const avg = scores.length > 0 ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 0;
            const manual = blurts.filter((b) => b.topic === topic).find((b) => b.manual_rag !== null)?.manual_rag || null;
            const { status } = getRagStatus(avg, manual);
            return (
              <Link key={topic} href={`/topics?topic=${encodeURIComponent(topic)}`} className="topic-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-muted" />
                  <span className="font-medium">{topic}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${status === "Red" ? "text-red" : status === "Amber" ? "text-amber" : "text-green"}`}>
                    {scores.length > 0 ? status : "New"}
                  </span>
                  {scores.length > 0 && (
                    <span className={`rank-badge ${getEffectiveRank(avg, manual).className}`}>
                      {getEffectiveRank(avg, manual).rank}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}