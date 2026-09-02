"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { EssayQuestion } from "@/lib/essay-data";
import {
  ChevronLeft,
  Clock,
  Send,
  RotateCcw,
  PenTool,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  GripVertical,
  Play,
  Pause,
  Timer,
} from "lucide-react";

export default function EssayWriteContent({ essay, userId }: { essay: EssayQuestion; userId: string }) {
  const [text, setText] = useState("");
  const [timerOn, setTimerOn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [timerPosition, setTimerPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const router = useRouter();
  const supabase = createClient();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (timerOn && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerOn(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerOn, timeLeft]);

  const handleTimerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setDragging(true);

      dragStart.current = {
        x: e.clientX - timerPosition.x,
        y: e.clientY - timerPosition.y,
      };
    },
    [timerPosition]
  );

  const handleTimerMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging) return;

      setTimerPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    },
    [dragging]
  );

  const handleTimerMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    if (!dragging) return;

    window.addEventListener("mousemove", handleTimerMouseMove);
    window.addEventListener("mouseup", handleTimerMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleTimerMouseMove);
      window.removeEventListener("mouseup", handleTimerMouseUp);
    };
  }, [dragging, handleTimerMouseMove, handleTimerMouseUp]);

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  async function handleSubmit() {
    if (!text.trim()) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/grade-essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          essay: essay.title,
          answer: text,
          timeSpent: 45 * 60 - timeLeft,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Grading failed");

      setResult(data);
      setSubmitted(true);

      await supabase.from("essay_attempts").insert({
        user_id: userId,
        essay_id: essay.id,
        essay_title: essay.title,
        answer: text,
        score: data.score,
        band: data.band,
        feedback: data.feedback,
        strengths: data.strengths || [],
        improvements: data.improvements || [],
        time_spent: 45 * 60 - timeLeft,
      } as any);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setText("");
    setSubmitted(false);
    setResult(null);
    setError("");
    setTimerOn(false);
    setTimeLeft(45 * 60);
    setTimerPosition({ x: 0, y: 0 });
  }

  const bandColor =
    result?.band === "21-25 Extended Abstract"
      ? "text-green"
      : result?.band === "16-20 Relational"
      ? "text-green"
      : result?.band === "11-15 Multistructural"
      ? "text-amber"
      : result?.band === "6-10 Unistructural"
      ? "text-amber"
      : "text-red";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-muted hover:text-text-secondary">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Synoptic Essay</h1>
            <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-lg">
              25 marks
            </span>
          </div>
          <p className="text-muted text-xs">
            {essay.year ? `AQA ${essay.year} Paper 3` : "AQA Specimen"}
          </p>
        </div>
      </div>

      {/* Floating Timer */}
      {!submitted && (
        <div
          className="fixed right-6 top-24 z-50 w-56"
          style={{
            transform: `translate(${timerPosition.x}px, ${timerPosition.y}px)`,
          }}
        >
          <div className="dashboard-card shadow-xl border border-border">
            <div
              onMouseDown={handleTimerMouseDown}
              className="flex items-center gap-2 mb-3 cursor-grab active:cursor-grabbing select-none"
            >
              <GripVertical className="w-4 h-4 text-muted" />
              <Timer className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Essay Timer</span>
            </div>

            {!timerOn ? (
              <button
                onClick={() => setTimerOn(true)}
                disabled={timeLeft === 0}
                className="btn-secondary w-full text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                {timeLeft === 0 ? "Time Finished" : "Start 45-Min Timer"}
              </button>
            ) : (
              <>
                <div
                  className={`text-3xl text-center font-mono font-bold mb-3 ${
                    timeLeft < 300 ? "text-red" : "text-primary"
                  }`}
                >
                  {formatTime(timeLeft)}
                </div>

                <button
                  onClick={() => setTimerOn(false)}
                  className="btn-secondary w-full text-sm flex items-center justify-center gap-2"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
              </>
            )}

            {!timerOn && timeLeft > 0 && (
              <p className="text-[11px] text-muted text-center mt-2">
                Start timer to begin writing
              </p>
            )}

            {timerOn && (
              <p className="text-[11px] text-muted text-center mt-2">
                Pause = writing locked
              </p>
            )}

            {timeLeft === 0 && (
              <p className="text-[11px] text-red text-center mt-2 font-medium">
                Time finished — writing locked
              </p>
            )}
          </div>
        </div>
      )}

      {/* Question */}
      <div className="dashboard-card border-l-4 border-l-primary">
        <p className="text-text-primary font-medium leading-relaxed text-lg">
          {essay.title}
        </p>
        <p className="text-xs text-muted mt-2">
          Write an essay on the above title. You should use information from different parts of the A Level course and
          show how the topics link together. [25 marks]
        </p>
      </div>

      {/* Writing Area */}
      {!submitted ? (
        <div className="space-y-3">
          <label className="block font-medium text-sm flex items-center gap-2">
            <PenTool className="w-4 h-4" /> Your Essay
          </label>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!timerOn}
            className="w-full h-[32rem] bg-surface border border-border rounded-xl p-5 text-text-primary placeholder:text-muted focus:border-primary focus:outline-none resize-none text-[15px] disabled:opacity-60 disabled:cursor-not-allowed"
            placeholder={
              timerOn
                ? "Write your essay here. Aim for 3-4 sides in the exam (about 600-900 words)..."
                : "Start the timer before writing..."
            }
            style={{
              lineHeight: "2.2em",
              backgroundImage: "linear-gradient(transparent calc(2.2em - 1px), rgba(255,255,255,0.06) calc(2.2em - 1px))",
              backgroundSize: "100% 2.2em",
              backgroundPosition: "0 1.25rem",
              backgroundAttachment: "local",
            }}
          />

          <div className="flex items-center justify-between text-xs text-muted">
            <span>{text.split(/\s+/).filter((w) => w.length > 0).length} words</span>
            <span>Target: 600–900 words</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving || !text.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? "Marking..." : <><Send className="w-4 h-4" /> Submit Essay</>}
          </button>

          {error && <div className="text-sm text-red bg-red/10 rounded-xl px-4 py-3">{error}</div>}
        </div>
      ) : (
        /* Results */
        <div className="space-y-6">
          {/* Score */}
          <div className="dashboard-card text-center">
            <div className={`text-6xl font-extrabold ${bandColor}`}>{result.score}/25</div>
            <div className="mt-2 text-lg font-semibold">{result.band}</div>
            <div className="mt-1 text-sm text-muted">
              {result.score >= 21
                ? "Excellent — holistic understanding with strong synoptic links"
                : result.score >= 16
                ? "Strong — good range of topics with clear links"
                : result.score >= 11
                ? "Developing — covers several areas but links are weak"
                : result.score >= 6
                ? "Limited — list-like, needs more depth and breadth"
                : "Needs significant work — major gaps in knowledge"}
            </div>
          </div>

          {/* Feedback */}
          {result.feedback && (
            <div className="dashboard-card border-primary/20">
              <div className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Examiner Feedback
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{result.feedback}</p>
            </div>
          )}

          {/* Strengths */}
          {result.strengths?.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-green flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Strengths
              </div>
              {result.strengths.map((s: string, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-green/5 border border-green/20 text-sm text-text-secondary">
                  {s}
                </div>
              ))}
            </div>
          )}

          {/* Improvements */}
          {result.improvements?.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-amber flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Areas to Improve
              </div>
              {result.improvements.map((s: string, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-amber/5 border border-amber/20 text-sm text-text-secondary">
                  {s}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={reset} className="btn-secondary flex-1 flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
            <Link href="/essays" className="btn-primary flex-1 text-center">
              Back to Essays
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}