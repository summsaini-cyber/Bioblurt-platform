"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { ExamQuestion } from "@/lib/exam-questions";
import { ChevronLeft, Clock, Lightbulb, Send, RotateCcw, CheckCircle, XCircle, AlertTriangle, GripVertical } from "lucide-react";

export default function ExamQuestionContent({ question, userId }: { question: ExamQuestion; userId: string }) {
  const [plan, setPlan] = useState("");
  const [answer, setAnswer] = useState("");
  const [showPlan, setShowPlan] = useState(true);
  const [timerOn, setTimerOn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Recommended time: ~1.5 min per mark
  const recommendedTime = question.marks * 90;

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

  function startTimer() {
    setTimeLeft(recommendedTime);
    setTimerOn(true);
  }

  function stopTimer() {
    setTimerOn(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  async function handleSubmit() {
    if (!answer.trim()) return;
    setSaving(true);
    setError("");

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
    setTimerOn(false);
    setTimeLeft(0);
  }

  return (
    <div className="space-y-6 relative">
      {/* Floating Timer */}
      {!submitted && (
        <div className="hidden lg:block fixed right-6 top-28 w-52 z-40">
          <div className="dashboard-card p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <GripVertical className="w-4 h-4 text-muted" />
              <Clock className="w-4 h-4" /> Timer
            </div>
            {!timerOn && timeLeft === 0 ? (
              <button onClick={startTimer} className="btn-secondary w-full text-xs flex items-center justify-center gap-2">
                <Clock className="w-3 h-3" /> Start ({formatTime(recommendedTime)})
              </button>
            ) : (
              <div className="text-center space-y-2">
                <div className={`text-3xl font-mono font-bold ${timeLeft < 30 ? "text-red" : "text-primary"}`}>
                  {formatTime(timeLeft)}
                </div>
                <button onClick={stopTimer} className="text-xs text-muted hover:text-text-secondary">
                  Stop
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-muted hover:text-text-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">{question.topic}</h1>
          <p className="text-muted text-xs">{question.paper === "paper1" ? "Paper 1" : "Paper 2"}</p>
        </div>
      </div>

      {/* Question Box — marks now inside the question */}
      <div className="dashboard-card border-l-4 border-l-primary">
        <p className="text-text-primary font-medium leading-relaxed">
          {question.question}{" "}
          <span className="text-amber font-semibold">[{question.marks} marks]</span>
        </p>
      </div>

      {/* Mobile Timer (bottom bar) */}
      {!submitted && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border p-3 flex items-center justify-between">
          {!timerOn && timeLeft === 0 ? (
            <button onClick={startTimer} className="btn-secondary text-sm flex items-center gap-2 w-full justify-center">
              <Clock className="w-4 h-4" /> Start Timer
            </button>
          ) : (
            <>
              <div className={`text-xl font-mono font-bold ${timeLeft < 30 ? "text-red" : "text-primary"}`}>
                {formatTime(timeLeft)}
              </div>
              <button onClick={stopTimer} className="text-sm text-muted">Stop</button>
            </>
          )}
        </div>
      )}

      {/* Planning Box */}
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
              className="w-full h-32 bg-surface border border-border rounded-xl p-4 text-sm text-text-primary placeholder:text-muted focus:border-primary focus:outline-none resize-none"
              placeholder="Jot down your plan here before you answer..."
            />
          )}
        </div>
      )}

      {/* Answer Area — fixed lined paper alignment */}
      {!submitted ? (
        <div className="space-y-3">
          <label className="block font-medium text-sm">Your Answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full h-96 bg-surface border border-border rounded-xl p-5 text-text-primary placeholder:text-muted focus:border-primary focus:outline-none resize-none text-[15px]"
            placeholder="Write your answer here..."
            style={{
              lineHeight: "2.2em",
              backgroundImage: "linear-gradient(transparent calc(2.2em - 1px), rgba(255,255,255,0.08) calc(2.2em - 1px))",
              backgroundSize: "100% 2.2em",
              backgroundPosition: "0 1.25rem",
              backgroundAttachment: "local",
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={saving || !answer.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? "Marking..." : <><Send className="w-4 h-4" /> Submit Answer</>}
          </button>
          {error && (
            <div className="text-sm text-red bg-red/10 rounded-xl px-4 py-3">{error}</div>
          )}
        </div>
      ) : (
        /* Results */
        <div className="space-y-6">
          {/* Score */}
          <div className="dashboard-card text-center">
            <div className={`text-6xl font-extrabold ${result.score >= question.marks * 0.8 ? "text-green" : result.score >= question.marks * 0.5 ? "text-amber" : "text-red"}`}>
              {result.score}/{question.marks}
            </div>
            <div className="mt-2 text-sm text-muted">
              {result.score === question.marks ? "Perfect!" : result.score >= question.marks * 0.5 ? "Passing" : "Needs work"}
            </div>
          </div>

          {/* AI Feedback */}
          {result.feedback && (
            <div className="dashboard-card border-primary/20">
              <div className="text-sm font-semibold text-primary mb-2">Examiner Feedback</div>
              <p className="text-sm text-text-secondary leading-relaxed">{result.feedback}</p>
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
                  <div key={i} className="p-3 rounded-lg bg-green/5 border border-green/20 text-sm text-text-secondary">
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
                  <div key={i} className="p-3 rounded-lg bg-red/5 border border-red/20 text-sm text-text-secondary">
                    {mark}
                  </div>
                ))}
              </div>
            )}

            {result.tentativeMarks?.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-amber flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Benefit of Doubt (tentative)
                </div>
                {result.tentativeMarks.map((mark: string, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-amber/5 border border-amber/20 text-sm text-text-secondary">
                    {mark}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={reset} className="btn-secondary flex-1 flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
            <Link href="/exam-practice" className="btn-primary flex-1 text-center">
              Back to Questions
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}