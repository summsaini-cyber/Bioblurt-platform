"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { AQA_TOPICS, getTrackerKey } from "@/lib/spec-data";
import { Search, ArrowLeft, AlertTriangle } from "lucide-react";

interface TrackerRow {
  point_key: string;
  rag: string;
  notes: string;
}

export default function TrackerContent({ userId }: { userId: string }) {
  const [tracker, setTracker] = useState<Record<string, TrackerRow>>({});
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"topics" | "list">("topics");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const loadTracker = useCallback(async () => {
    const { data } = await supabase
      .from("tracker_points")
      .select("point_key,rag,notes")
      .eq("user_id", userId);
    const map: Record<string, TrackerRow> = {};
    for (const row of data || []) {
      map[row.point_key] = row;
    }
    setTracker(map);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadTracker();
  }, [loadTracker]);

  async function setPointRag(topic: string, subtopic: string, point: string, newRag: string) {
    const key = getTrackerKey(topic, subtopic, point);
    const current = tracker[key]?.rag || "Red";
    const rag = current === newRag ? "Red" : newRag;

    await supabase.from("tracker_points").upsert({
      user_id: userId,
      topic,
      subtopic,
      point_text: point,
      point_key: key,
      rag,
      notes: tracker[key]?.notes || "",
    }, { onConflict: "user_id,point_key" });

    setTracker((prev) => ({ ...prev, [key]: { ...prev[key], rag } }));
  }

  async function setPointNotes(topic: string, subtopic: string, point: string, notes: string) {
    const key = getTrackerKey(topic, subtopic, point);
    await supabase.from("tracker_points").upsert({
      user_id: userId,
      topic,
      subtopic,
      point_text: point,
      point_key: key,
      rag: tracker[key]?.rag || "Red",
      notes,
    }, { onConflict: "user_id,point_key" });

    setTracker((prev) => ({ ...prev, [key]: { ...prev[key], notes } }));
  }

  // Stats
  const allPoints = Object.entries(AQA_TOPICS).flatMap(([topic, subs]) =>
    Object.entries(subs).flatMap(([subtopic, points]) =>
      points.map((p) => ({ topic, subtopic, point: p, key: getTrackerKey(topic, subtopic, p) }))
    )
  );
  const covered = allPoints.filter((p) => tracker[p.key]?.rag !== "Red").length;
  const total = allPoints.length;
  const coverage = total > 0 ? Math.round((covered / total) * 1000) / 10 : 0;
  const red = allPoints.filter((p) => tracker[p.key]?.rag === "Red").length;
  const amber = allPoints.filter((p) => tracker[p.key]?.rag === "Amber").length;
  const green = allPoints.filter((p) => tracker[p.key]?.rag === "Green").length;

  if (loading) return <div className="text-center py-20 text-muted">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Full AQA Biology Specification Tracker</h1>
        <p className="text-muted text-sm mt-1">Track your progress through the entire specification.</p>
        <p className="text-muted text-sm">Click the coloured boxes to set your confidence. Click the same colour again to unselect.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        <div className="dashboard-card text-center">
          <div className="text-2xl font-extrabold">{covered}/{total}</div>
          <div className="text-xs text-muted uppercase tracking-wider mt-1">Covered</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-2xl font-extrabold">{coverage}%</div>
          <div className="text-xs text-muted uppercase tracking-wider mt-1">Coverage</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-2xl font-extrabold text-red">{red}</div>
          <div className="text-xs text-muted uppercase tracking-wider mt-1">Red</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-2xl font-extrabold text-amber">{amber}</div>
          <div className="text-xs text-muted uppercase tracking-wider mt-1">Amber</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-2xl font-extrabold text-green">{green}</div>
          <div className="text-xs text-muted uppercase tracking-wider mt-1">Green</div>
        </div>
      </div>

      {/* Search + View Mode */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-text-primary focus:border-primary focus:outline-none"
            placeholder="Search spec points..."
          />
        </div>
        <div className="flex bg-surface border border-border rounded-xl p-1">
          <button
            onClick={() => setViewMode("topics")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === "topics" ? "bg-primary text-white" : "text-muted hover:text-text-secondary"}`}
          >
            By Topic
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === "list" ? "bg-primary text-white" : "text-muted hover:text-text-secondary"}`}
          >
            Full List
          </button>
        </div>
      </div>

      {/* By Topic View */}
      {viewMode === "topics" && !selectedTopic && (
        <div className="space-y-4">
          <h3 className="font-semibold">Select a Topic</h3>
          {Object.entries(AQA_TOPICS).map(([topic, subs]) => {
            let topicTotal = 0, topicCovered = 0, topicRed = 0, topicAmber = 0, topicGreen = 0;
            for (const [sub, points] of Object.entries(subs)) {
              for (const point of points) {
                topicTotal++;
                const key = getTrackerKey(topic, sub, point);
                if (tracker[key]) {
                  topicCovered++;
                  if (tracker[key].rag === "Red") topicRed++;
                  else if (tracker[key].rag === "Amber") topicAmber++;
                  else topicGreen++;
                }
              }
            }
            const cov = topicTotal > 0 ? Math.round((topicCovered / topicTotal) * 1000) / 10 : 0;
            return (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className="topic-card w-full text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{topic}</div>
                    <div className="text-xs text-muted mt-0.5">{topicCovered}/{topicTotal} points • {cov}% covered</div>
                  </div>
                  <div className="text-right text-sm">
                    <span className="text-red font-bold">{topicRed}</span> /{" "}
                    <span className="text-amber font-bold">{topicAmber}</span> /{" "}
                    <span className="text-green font-bold">{topicGreen}</span>
                  </div>
                </div>
                <div className="progress-bar-bg mt-3">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${cov}%`,
                      background: cov >= 80 ? "#4CAF50" : cov >= 40 ? "#ffaa33" : "#ff5555",
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected Topic Detail */}
      {viewMode === "topics" && selectedTopic && (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedTopic(null)}
            className="flex items-center gap-2 text-muted hover:text-text-secondary"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all topics
          </button>
          <h3 className="font-semibold text-lg">{selectedTopic}</h3>
          {Object.entries(AQA_TOPICS[selectedTopic]).map(([sub, points]) => {
            const visible = search
              ? points.filter((p) => p.toLowerCase().includes(search.toLowerCase()))
              : points;
            if (visible.length === 0) return null;
            return (
              <div key={sub} className="dashboard-card">
                <h4 className="font-medium mb-3">{sub} ({points.length} points)</h4>
                <div className="space-y-3">
                  {visible.map((point) => {
                    const key = getTrackerKey(selectedTopic, sub, point);
                    const rag = tracker[key]?.rag || "Red";
                    const notes = tracker[key]?.notes || "";
                    return (
                      <div key={key} className="grid grid-cols-[1fr,auto,auto] gap-3 items-start">
                        <p className="text-sm text-text-secondary">{point}</p>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setPointRag(selectedTopic, sub, point, "Red")}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${rag === "Red" ? "bg-red/20 ring-2 ring-red/50" : "bg-surface border border-border hover:bg-red/10"}`}
                          >
                            <div className="w-4 h-4 rounded-sm bg-red" />
                          </button>
                          <button
                            onClick={() => setPointRag(selectedTopic, sub, point, "Amber")}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${rag === "Amber" ? "bg-amber/20 ring-2 ring-amber/50" : "bg-surface border border-border hover:bg-amber/10"}`}
                          >
                            <div className="w-4 h-4 rounded-sm bg-amber" />
                          </button>
                          <button
                            onClick={() => setPointRag(selectedTopic, sub, point, "Green")}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${rag === "Green" ? "bg-green/20 ring-2 ring-green/50" : "bg-surface border border-border hover:bg-green/10"}`}
                          >
                            <div className="w-4 h-4 rounded-sm bg-green" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={notes}
                          onChange={(e) => setPointNotes(selectedTopic, sub, point, e.target.value)}
                          className="w-32 bg-surface border border-border rounded-lg px-2 py-1 text-xs text-text-primary focus:border-primary focus:outline-none"
                          placeholder="Notes..."
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full List View */}
      {viewMode === "list" && (
        <div className="space-y-4">
          <div className="text-sm text-amber bg-amber/5 border border-amber/20 rounded-xl p-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> This view loads all specification points. Use &quot;By Topic&quot; for better performance on slower devices.
          </div>
          {Object.entries(AQA_TOPICS).map(([topic, subs]) => (
            <details key={topic} className="dashboard-card">
              <summary className="font-medium cursor-pointer">{topic}</summary>
              <div className="mt-4 space-y-4">
                {Object.entries(subs).map(([sub, points]) => {
                  const visible = search
                    ? points.filter((p) => p.toLowerCase().includes(search.toLowerCase()))
                    : points;
                  if (visible.length === 0) return null;
                  return (
                    <div key={sub}>
                      <h5 className="text-sm font-medium text-muted mb-2">{sub}</h5>
                      <div className="space-y-2">
                        {visible.map((point) => {
                          const key = getTrackerKey(topic, sub, point);
                          const rag = tracker[key]?.rag || "Red";
                          return (
                            <div key={key} className="grid grid-cols-[1fr,auto] gap-3 items-start">
                              <p className="text-sm text-text-secondary">{point}</p>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => setPointRag(topic, sub, point, "Red")}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${rag === "Red" ? "bg-red/20 ring-2 ring-red/50" : "bg-surface border border-border hover:bg-red/10"}`}
                                >
                                  <div className="w-4 h-4 rounded-sm bg-red" />
                                </button>
                                <button
                                  onClick={() => setPointRag(topic, sub, point, "Amber")}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${rag === "Amber" ? "bg-amber/20 ring-2 ring-amber/50" : "bg-surface border border-border hover:bg-amber/10"}`}
                                >
                                  <div className="w-4 h-4 rounded-sm bg-amber" />
                                </button>
                                <button
                                  onClick={() => setPointRag(topic, sub, point, "Green")}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${rag === "Green" ? "bg-green/20 ring-2 ring-green/50" : "bg-surface border border-border hover:bg-green/10"}`}
                                >
                                  <div className="w-4 h-4 rounded-sm bg-green" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
