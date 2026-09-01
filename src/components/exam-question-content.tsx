"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { ExamQuestion } from "@/lib/exam-questions";
import {
  ChevronLeft,
  Clock,
  Lightbulb,
  Send,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  GripVertical,
  Play,
  Pause,
  Timer,
} from "lucide-react";

function getRecommendedTimeRange(marks: number): { min: number; max: number; label: string } {
  switch (marks) {
    case 1:
      return { min: 60, max: 60, label: "1 minute" };
    case 2:
      return { min: 90, max: 120, label: "1½–2 minutes" };
    case 3:
      return { min: 150, max: 180, label: "2½–3 minutes" };
    case 4:
      return { min: 180, max: 240, label: "3–4 minutes" };
    case 5:
      return { min: 240, max: 300, label: "4–5 minutes" };
    case 6:
      return { min: 300, max: 360, label: "5–6 minutes" };
    default:
      return { min: marks * 60, max: marks * 75, label: `${marks}–${Math.ceil(marks * 1.25)} minutes` };
  }
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ExamQuestionContent({
  question,
  userId,
}: {
  question: ExamQuestion;
  userId: string;
}) {
  const [plan, setPlan] = useState("");
  const [answer, setAnswer] = useState("");
  const [showPlan, setShowPlan] = useState(true);

  // Stopwatch state
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const stopwatchRef = useRef<NodeJS.Timeout | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const supabase = createClient();
  const recommended = getRecommendedTimeRange(question.marks);

  // ── Stopwatch logic ──
  useEffect(() => {
    if (isRunning) {
      stopwatchRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    }
    return () => {
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    };
  }, [isRunning]);

  function startStopwatch() {
    setElapsedTime(0);
    setIsRunning(true);
    setIsPaused(false);
  }

  function pauseStopwatch() {
    setIsRunning(false);
    setIsPaused(true);
  }

  function resumeStopwatch() {
    setIsRunning(true);
    setIsPaused(false);
  }

  function resetStopwatch() {
    setIsRunning(false);
    setIsPaused(false);
    setElapsedTime(0);
  }

  // ── Draggable timer popup ──
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const timerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only drag from the header/grip area
    const target = e.target as HTMLElement;
    if (!target.closest("[data-drag-handle]")) return;

    setIsDragging(true);
    const rect = timerRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // ── Submit ──
  async function handleSubmit() {
    if (!answer.trim()) return;
    setSaving(true);
    setError("");

    // Stop the stopwatch and capture final time
    const finalTime = elapsedTime;
    setIsRunning(false);

    try {
      const res = await fetch("/api/grade-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer,
          question: question.question,
          marks: question.marks,
          markScheme: question.markScheme,
          topic: question.topic,
          timeSpent: finalTime,
          recommendedMin: recommended.min,
          recommendedMax: recommended.max,
          recommendedLabel: recommended.label,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Grading failed");

      setResult(data);
      setSubmitted(true);

      await supabase.from("exam_attempts").insert({
        user_id: userId,
        question_id: question.id,
        question: question.question,
        marks: question.marks,
        answer,
        score: data.score,
        feedback: data.feedback,
        marks_awarded: data.marksAwarded || [],
        marks_missed: data.marksMissed || [],
        time_spent: finalTime,
      } as any);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setAnswer("");
    setPlan("");
    setSubmitted(false);
    setResult(null);
    setError("");
    resetStopwatch();
    setPosition({ x: 0, y: 0 });
  }

  const timerActive = elapsedTime > 0 || isRunning || isPaused;

  return (
    <div className="space-y-6 relative">
      {/* ── Floating Draggable Timer (Desktop) ── */}
      {!submitted && (
        <div
          ref={timerRef}
          className="hidden lg:block fixed right-6 top-28 w-56 z-40 select-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            cursor: isDragging ? "grabbing" : "default",
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="dashboard-card p-4 space-y-3 shadow-lg border border-border/50">
            <div
              data-drag-handle
              className="flex items-center gap-2 text-sm font-semibold text-primary cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-4 h-4 text-muted" />
              <Timer className="w-4 h-4" /> Stopwatch
            </div>

            {!timerActive ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startStopwatch();
                }}
                className="btn-secondary w-full text-xs flex items-center justify-center gap-2"
              >
                <Play className="w-3 h-3" /> Start ({recommended.label})
              </button>
            ) : (
              <div className="text-center space-y-3">
                <div
                  className={`text-3xl font-mono font-bold ${
                    elapsedTime > recommended.max
                      ? "text-red"
                      : elapsedTime > recommended.min
                      ? "text-amber"
                      : "text-green"
                  }`}
                >
                  {formatTime(elapsedTime)}
                </div>

                <div className="flex gap-2">
                  {isRunning ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        pauseStopwatch();
                      }}
                      className="btn-secondary flex-1 text-xs flex items-center justify-center gap-1"
                    >
                      <Pause className="w-3 h-3" /> Pause
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resumeStopwatch();
                      }}
                      className="btn-primary flex-1 text-xs flex items-center justify-center gap-1"
                    >
                      <Play className="w-3 h-3" /> Resume
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetStopwatch();
                    }}
                    className="text-xs text-muted hover:text-text-secondary px-2"
                    title="Reset"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>

                {isPaused && (
                  <div className="text-[10px] text-amber font-medium bg-amber/10 rounded-lg px-2 py-1">
                    ⏸ Paused — typing disabled
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-muted hover:text-text-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">{question.topic}</h1>
          <p className="text-muted text-xs">
            {question.paper === "paper1" ? "Paper 1" : "Paper 2"}
          </p>
        </div>
      </div>

      {/* ── Question Box ── */}
      <div className="dashboard-card border-l-4 border-l-primary">
        <p className="text-text-primary font-medium leading-relaxed">
          {question.question}{" "}
          <span className="text-amber font-semibold">[{question.marks} marks]</span>
        </p>
      </div>

      {/* ── Mobile Timer (bottom bar) ── */}
      {!submitted && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border p-3 flex items-center justify-between">
          {!timerActive ? (
            <button
              onClick={startStopwatch}
              className="btn-secondary text-sm flex items-center gap-2 w-full justify-center"
            >
              <Play className="w-4 h-4" /> Start Stopwatch
            </button>
          ) : (
            <>
              <div
                className={`text-xl font-mono font-bold ${
                  elapsedTime > recommended.max
                    ? "text-red"
                    : elapsedTime > recommended.min
                    ? "text-amber"
                    : "text-green"
                }`}
              >
                {formatTime(elapsedTime)}
              </div>
              <div className="flex items-center gap-3">
                {isRunning ? (
                  <button onClick={pauseStopwatch} className="btn-secondary text-xs flex items-center gap-1">
                    <Pause className="w-3 h-3" /> Pause
                  </button>
                ) : (
                  <button onClick={resumeStopwatch} className="btn-primary text-xs flex items-center gap-1">
                    <Play className="w-3 h-3" /> Resume
                  </button>
                )}
                <button onClick={resetStopwatch} className="text-xs text-muted">
                  Reset
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Planning Box ── */}
      {!submitted && (
        <div className="space-y-2">
          <button
            onClick={() => setShowPlan(!showPlan)}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
          >
            <Lightbulb className="w-4 h-4" />
            {showPlan ? "Hide Planning Box" : "Show Planning Box"}
          </button>

          {showPlan && (
            <textarea
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              disabled={isPaused}
              className="w-full h-32 bg-surface border border-border rounded-xl p-4 text-sm text-text-primary placeholder:text-muted focus:border-primary focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Jot down your plan here before you answer..."
            />
          )}
        </div>
      )}

      {/* ── Answer Area ── */}
      {!submitted ? (
        <div className="space-y-3">
          <label className="block font-medium text-sm">
            Your Answer
            {isPaused && (
              <span className="ml-2 text-xs text-amber font-medium">
                (Timer paused — resume to type)
              </span>
            )}
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isPaused}
            className="w-full h-96 bg-surface border border-border rounded-xl p-5 text-text-primary placeholder:text-muted focus:border-primary focus:outline-none resize-none text-[15px] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            placeholder="Write your answer here..."
            style={{
              lineHeight: "2.2em",
              backgroundImage:
                "linear-gradient(transparent calc(2.2em - 1px), rgba(255,255,255,0.08) calc(2.2em - 1px))",
              backgroundSize: "100% 2.2em",
              backgroundPosition: "0 1.25rem",
              backgroundAttachment: "local",
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={saving || !answer.trim() || isPaused}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              "Marking..."
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit Answer
              </>
            )}
          </button>
          {error && (
            <div className="text-sm text-red bg-red/10 rounded-xl px-4 py-3">
              {error}
            </div>
          )}
        </div>
      ) : (
        /* ── Results ── */
        <div className="space-y-6">
          {/* Score */}
          <div className="dashboard-card text-center">
            <div
              className={`text-6xl font-extrabold ${
                result.score >= question.marks * 0.8
                  ? "text-green"
                  : result.score >= question.marks * 0.5
                  ? "text-amber"
                  : "text-red"
              }`}
            >
              {result.score}/{question.marks}
            </div>
            <div className="mt-2 text-sm text-muted">
              {result.score === question.marks
                ? "Perfect!"
                : result.score >= question.marks * 0.5
                ? "Passing"
                : "Needs work"}
            </div>
          </div>

          {/* Time Analysis */}
          {result.timeFeedback && (
            <div className="dashboard-card border-l-4 border-l-blue-500">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-400 mb-2">
                <Clock className="w-4 h-4" /> Time Analysis
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {result.timeFeedback}
              </p>
            </div>
          )}

          {/* AI Feedback */}
          {result.feedback && (
            <div className="dashboard-card border-primary/20">
              <div className="text-sm font-semibold text-primary mb-2">
                Examiner Feedback
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {result.feedback}
              </p>
            </div>
          )}

          {/* Marks Breakdown */}
          <div className="space-y-3">
            <h3 className="font-semibold">Mark Breakdown</h3>

            {result.marksAwarded?.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-green flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Marks Awarded
                </div>
                {result.marksAwarded.map((mark: string, i: number) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-green/5 border border-green/20 text-sm text-text-secondary"
                  >
                    {mark}
                  </div>
                ))}
              </div>
            )}

            {result.marksMissed?.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-red flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Marks Missed
                </div>
                {result.marksMissed.map((mark: string, i: number) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-red/5 border border-red/20 text-sm text-text-secondary"
                  >
                    {mark}
                  </div>
                ))}
              </div>
            )}

            {result.tentativeMarks?.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-amber flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Benefit of Doubt
                  (tentative)
                </div>
                {result.tentativeMarks.map((mark: string, i: number) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-amber/5 border border-amber/20 text-sm text-text-secondary"
                  >
                    {mark}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
            <Link
              href="/exam-practice"
              className="btn-primary flex-1 text-center"
            >
              Back to Questions
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}