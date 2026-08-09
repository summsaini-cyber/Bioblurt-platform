"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { AQA_TOPICS } from "@/lib/spec-data";
import { calculateScore, getRagStatus, getEffectiveRank } from "@/lib/scoring-engine";
import { ArrowLeft, Home, CheckCircle, XCircle, ChevronDown } from "lucide-react";

export default function BlurtContent({ userId, topic, subtopic }: { userId: string; topic: string; subtopic: string }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ score: number; matched: string[] } | null>(null);
  const [history, setHistory] = useState<{ score: number; manual_rag: string | null; created_at: string }[]>([]);
  const [manualRag, setManualRag] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const specPoints = AQA_TOPICS[topic]?.[subtopic] || [];

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("blurts")
        .select("score,manual_rag,created_at")
        .eq("user_id", userId)
        .eq("topic", topic)
        .eq("subtopic", subtopic)
        .order("created_at", { ascending: false });
      setHistory(data || []);
      if (data && data[0]) {
        setManualRag(data[0].manual_rag);
      }
    }
    load();
  }, [userId, topic, subtopic]);

  async function handleSubmit() {
    if (!text.trim()) return;
    const res = calculateScore(text, specPoints);
    setResult(res);
    setSaving(true);

    await supabase.from("blurts").insert({
      user_id: userId,
      topic,
      subtopic,
      score: res.score,
      blurt_text: text,
      matched_points: res.matched,
      manual_rag: manualRag,
    });

    setSaving(false);
    setHistory((prev) => [{ score: res.score, manual_rag: manualRag, created_at: new Date().toISOString() }, ...prev]);
  }

  async function setRag(rag: string) {
    const newRag = manualRag === rag ? null : rag;
    setManualRag(newRag);
    // Update most recent blurt
    if (history.length > 0) {
      await supabase
        .from("blurts")
        .update({ manual_rag: newRag })
        .eq("user_id", userId)
        .eq("topic", topic)
        .eq("subtopic", subtopic)
        .order("created_at", { ascending: false })
        .limit(1);
    }
  }

  const bestScore = history.length > 0 ? Math.max(...history.map((h) => h.score)) : 0;
  const displayScore = result ? result.score : bestScore;
  const { status, color } = getRagStatus(displayScore, manualRag);
  const { rank, className } = getEffectiveRank(displayScore, manualRag);
  const correctCount = result ? result.matched.length : 0;
  const incorrectCount = result ? specPoints.length - result.matched.length : 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 text-sm">
        <button onClick={() => router.push("/topics")} className="text-muted hover:text-text-secondary flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Topics
        </button>
        <span className="text-muted">/</span>
        <button onClick={() => router.push(`/topics?topic=${encodeURIComponent(topic)}`)} className="text-muted hover:text-text-secondary">
          {topic}
        </button>
        <span className="text-muted">/</span>
        <span className="text-text-secondary font-medium">{subtopic}</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{subtopic}</h1>
        <p className="text-muted text-sm mt-1">{topic}</p>
      </div>

      {/* Current Status */}
      {history.length > 0 && (
        <div className="flex items-center gap-4 text-sm">
          <span>Status: <span className={`font-semibold ${color === "red" ? "text-red" : color === "amber" ? "text-amber" : "text-green"}`}>{status}</span></span>
          <span>Best: {bestScore}%</span>
          <span className={`rank-badge ${className}`}>{rank}</span>
          <span className="text-muted">Attempts: {history.length}</span>
        </div>
      )}

      {/* Blurt Input */}
      <div className="space-y-3">
        <label className="block font-medium">Blurt everything you know:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-72 bg-surface border border-border rounded-xl p-5 text-text-primary placeholder:text-muted focus:border-primary focus:outline-none resize-none leading-relaxed"
          placeholder="Start typing your blurt here..."
        />
        <button
          onClick={handleSubmit}
          disabled={saving || !text.trim()}
          className="btn-primary w-full disabled:opacity-50"
        >
          {saving ? "Saving..." : "Submit Blurt"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Score Display */}
          <div className="dashboard-card">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className={`text-6xl font-extrabold ${color === "red" ? "text-red" : color === "amber" ? "text-amber" : "text-green"}`}>
                  {displayScore}%
                </div>
                <div className="mt-2">
                  <span className={`rank-badge ${className}`}>{rank}</span>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-2">
                <div className="text-lg font-semibold">{status}</div>
                {manualRag ? (
                  <div className="text-sm text-muted">Manual override</div>
                ) : displayScore < 40 ? (
                  <div className="text-sm text-muted">Needs significant revision</div>
                ) : displayScore < 65 ? (
                  <div className="text-sm text-muted">Partial understanding, review missed points</div>
                ) : displayScore < 85 ? (
                  <div className="text-sm text-muted">Strong recall</div>
                ) : (
                  <div className="text-sm text-muted">Excellent! Maintain with spaced review</div>
                )}
              </div>
            </div>
          </div>

          {/* Correct / Incorrect Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="dashboard-card text-center border-green/20">
              <div className="text-4xl font-extrabold text-green">{correctCount}</div>
              <div className="text-xs text-muted uppercase tracking-wider mt-1">Correct</div>
            </div>
            <div className="dashboard-card text-center border-red/20">
              <div className="text-4xl font-extrabold text-red">{incorrectCount}</div>
              <div className="text-xs text-muted uppercase tracking-wider mt-1">Incorrect</div>
            </div>
          </div>

          {/* Detailed Breakdown (expandable) */}
          <div className="dashboard-card">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-between w-full"
            >
              <span className="font-medium">See detailed breakdown</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${showDetails ? "rotate-180" : ""}`} />
            </button>

            {showDetails && (
              <div className="mt-4 space-y-2">
                {specPoints.map((point) => {
                  const isMatched = result.matched.includes(point);
                  return (
                    <div
                      key={point.slice(0, 30)}
                      className={`flex items-start gap-3 p-3 rounded-lg ${isMatched ? "bg-green/5 border border-green/20" : "bg-red/5 border border-red/20"}`}
                    >
                      {isMatched ? (
                        <CheckCircle className="w-5 h-5 text-green shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red shrink-0 mt-0.5" />
                      )}
                      <span className="text-sm text-text-secondary">{point}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Manual RAG Override */}
          <div className="dashboard-card">
            <div className="text-sm text-muted mb-3">Override the auto-score if you feel differently</div>
            <div className="grid grid-cols-4 gap-2">
              <button onClick={() => setRag("Red")} className={`h-10 rounded-xl transition-all ${manualRag === "Red" ? "bg-red ring-2 ring-red/50" : "bg-surface border border-border hover:bg-red/10"}`}>
                <div className="w-6 h-6 rounded-md bg-red mx-auto" />
              </button>
              <button onClick={() => setRag("Amber")} className={`h-10 rounded-xl transition-all ${manualRag === "Amber" ? "bg-amber/20 ring-2 ring-amber/50" : "bg-surface border border-border hover:bg-amber/10"}`}>
                <div className="w-6 h-6 rounded-md bg-amber mx-auto" />
              </button>
              <button onClick={() => setRag("Green")} className={`h-10 rounded-xl transition-all ${manualRag === "Green" ? "bg-green/20 ring-2 ring-green/50" : "bg-surface border border-border hover:bg-green/10"}`}>
                <div className="w-6 h-6 rounded-md bg-green mx-auto" />
              </button>
              <button onClick={() => setRag("Auto")} className={`h-10 rounded-xl text-sm font-medium transition-all ${manualRag === null ? "bg-primary text-white" : "bg-surface border border-border text-muted hover:bg-surface-elevated"}`}>
                Auto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
