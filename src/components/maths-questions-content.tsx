"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Calculator,
  Check,
  ChevronDown,
  Clock,
  Filter,
  RotateCcw,
  Search,
  Shuffle,
  Target,
  TrendingUp,
  X,
  XCircle,
} from "lucide-react";
import { MATHS_QUESTIONS, MathsQuestion } from "@/lib/maths-questions";

const TOPICS = [
  "All topics",
  "Biological Molecules",
  "Cells",
  "Organisms Exchange Substances",
  "Genetic Information & Variation",
  "Energy Transfers",
  "Organisms Respond to Changes",
  "Genetics, Populations & Evolution",
  "Control of Gene Expression",
];

const MATHS_SKILLS = [
  "All maths skills",
  "Percentages",
  "Ratios",
  "Standard form",
  "Means",
  "Rates",
  "Probability",
  "Statistics",
  "Surface area : volume",
  "Logarithms",
  "Exponentials",
  "Geometry",
];

const MARK_OPTIONS = [
  { label: "Any marks", value: "all" },
  { label: "1 mark", value: "1" },
  { label: "2 marks", value: "2" },
  { label: "3 marks", value: "3" },
  { label: "4 marks", value: "4" },
  { label: "5+ marks", value: "5+" },
];

type Screen =
  | "selection"
  | "question"
  | "results"
  | "review"
  | "progress";

type Attempt = {
  questionId: string;
  correct: boolean;
  answer: string;
  time: number;
  createdAt: string;
};

const HISTORY_KEY = "bioblurt-maths-question-history";

export default function MathsQuestionsContent() {
  const [screen, setScreen] = useState<Screen>("selection");

  const [topic, setTopic] = useState("All topics");
  const [skill, setSkill] = useState("All maths skills");
  const [marks, setMarks] = useState("all");
  const [numberOfQuestions, setNumberOfQuestions] = useState("10");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [previouslyWrong, setPreviouslyWrong] = useState(false);

  const [history, setHistory] = useState<Attempt[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>(
    []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [standardFormCoefficient, setStandardFormCoefficient] = useState("");
  const [standardFormExponent, setStandardFormExponent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [questionStartedAt, setQuestionStartedAt] = useState<number | null>(
    null
  );
  const [sessionResults, setSessionResults] = useState<Attempt[]>([]);
  const [reviewQuestionId, setReviewQuestionId] = useState<string | null>(
    null
  );

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(HISTORY_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setHistory(
            parsed.map((attempt) => ({
              ...attempt,
              createdAt:
                attempt.createdAt ??
                new Date().toISOString(),
            }))
          );
        }
      }
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    if (screen !== "question" || submitted) return;

    const timer = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [screen, submitted]);

  const wrongQuestionIds = useMemo(() => {
    return new Set(
      history
        .filter((attempt) => !attempt.correct)
        .map((attempt) => attempt.questionId)
    );
  }, [history]);

  const skillStats = useMemo(() => {
    return MATHS_SKILLS.filter(
      (item) => item !== "All maths skills"
    )
      .map((mathsSkill) => {
        const attempts = history.filter((attempt) => {
          const question = MATHS_QUESTIONS.find(
            (item) => item.id === attempt.questionId
          );

          return question?.mathsSkill === mathsSkill;
        });

        const correct = attempts.filter(
          (attempt) => attempt.correct
        ).length;

        const possibleMarks = attempts.reduce((sum, attempt) => {
          const question = MATHS_QUESTIONS.find(
            (item) => item.id === attempt.questionId
          );

          return sum + (question?.marks ?? 0);
        }, 0);

        const gainedMarks = attempts.reduce((sum, attempt) => {
          if (!attempt.correct) return sum;

          const question = MATHS_QUESTIONS.find(
            (item) => item.id === attempt.questionId
          );

          return sum + (question?.marks ?? 0);
        }, 0);

        return {
          skill: mathsSkill,
          attempts: attempts.length,
          correct,
          accuracy: attempts.length
            ? Math.round((correct / attempts.length) * 100)
            : 0,
          possibleMarks,
          gainedMarks,
        };
      })
      .filter((item) => item.attempts > 0);
  }, [history]);

  const weakestSkill = useMemo(() => {
    if (!skillStats.length) return null;

    return [...skillStats].sort((a, b) => {
      if (a.accuracy !== b.accuracy) {
        return a.accuracy - b.accuracy;
      }

      return b.attempts - a.attempts;
    })[0];
  }, [skillStats]);

  const totalMarks = useMemo(() => {
    return history.reduce((sum, attempt) => {
      const question = MATHS_QUESTIONS.find(
        (item) => item.id === attempt.questionId
      );

      return sum + (question?.marks ?? 0);
    }, 0);
  }, [history]);

  const gainedMarks = useMemo(() => {
    return history.reduce((sum, attempt) => {
      if (!attempt.correct) return sum;

      const question = MATHS_QUESTIONS.find(
        (item) => item.id === attempt.questionId
      );

      return sum + (question?.marks ?? 0);
    }, 0);
  }, [history]);

  const overallAccuracy = history.length
    ? Math.round(
        (history.filter((attempt) => attempt.correct).length /
          history.length) *
          100
      )
    : 0;

  const recentHistory = useMemo(() => {
    return [...history]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 10);
  }, [history]);

  const recentAccuracy = useMemo(() => {
    if (!recentHistory.length) return 0;

    return Math.round(
      (recentHistory.filter((attempt) => attempt.correct).length /
        recentHistory.length) *
        100
    );
  }, [recentHistory]);

  const activeFilters = useMemo(() => {
    let count = 0;

    if (topic !== "All topics") count++;
    if (skill !== "All maths skills") count++;
    if (marks !== "all") count++;
    if (previouslyWrong) count++;

    return count;
  }, [topic, skill, marks, previouslyWrong]);

  const filteredQuestions = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return MATHS_QUESTIONS.filter((question) => {
      if (topic !== "All topics" && question.topic !== topic) {
        return false;
      }

      if (skill !== "All maths skills" && question.mathsSkill !== skill) {
        return false;
      }

      if (marks !== "all") {
        if (marks === "5+" && question.marks < 5) return false;

        if (marks !== "5+" && question.marks !== Number(marks)) {
          return false;
        }
      }

      if (previouslyWrong && !wrongQuestionIds.has(question.id)) {
        return false;
      }

      if (searchTerm) {
        const searchableText = [
          question.question,
          question.year,
          question.paper,
          question.questionNumber,
          question.topic,
          question.mathsSkill,
        ]
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(searchTerm)) return false;
      }

      return true;
    });
  }, [
    topic,
    skill,
    marks,
    search,
    previouslyWrong,
    wrongQuestionIds,
  ]);

  const currentQuestion = useMemo(() => {
    const id = selectedQuestionIds[currentIndex];

    return MATHS_QUESTIONS.find((question) => question.id === id);
  }, [selectedQuestionIds, currentIndex]);

  const reviewQuestion = useMemo(() => {
    if (!reviewQuestionId) return undefined;

    return MATHS_QUESTIONS.find(
      (question) => question.id === reviewQuestionId
    );
  }, [reviewQuestionId]);

  function clearFilters() {
    setTopic("All topics");
    setSkill("All maths skills");
    setMarks("all");
    setSearch("");
    setPreviouslyWrong(false);
  }

  function resetAnswer() {
    setAnswer("");
    setStandardFormCoefficient("");
    setStandardFormExponent("");
    setSubmitted(false);
    setIsCorrect(false);
  }

  function startQuestions() {
    const requestedCount = Number(numberOfQuestions);

    const shuffled = [...filteredQuestions].sort(
      () => Math.random() - 0.5
    );

    const selected = shuffled.slice(
      0,
      Math.min(requestedCount, shuffled.length)
    );

    if (!selected.length) return;

    setSelectedQuestionIds(selected.map((question) => question.id));
    setCurrentIndex(0);
    setSessionResults([]);
    setElapsedSeconds(0);
    setQuestionStartedAt(Date.now());
    resetAnswer();
    setScreen("question");
  }

  function startWeakAreas() {
    if (!weakestSkill) return;

    const weakQuestionIds = new Set(
      history
        .filter((attempt) => !attempt.correct)
        .map((attempt) => attempt.questionId)
    );

    const weakSkillQuestions = MATHS_QUESTIONS.filter(
      (question) =>
        question.mathsSkill === weakestSkill.skill
    );

    const wrongFirst = [...weakSkillQuestions].sort((a, b) => {
      const aWrong = weakQuestionIds.has(a.id) ? 0 : 1;
      const bWrong = weakQuestionIds.has(b.id) ? 0 : 1;

      return aWrong - bWrong;
    });

    const selected = wrongFirst.slice(
      0,
      Math.min(Number(numberOfQuestions), wrongFirst.length)
    );

    if (!selected.length) return;

    setSelectedQuestionIds(selected.map((question) => question.id));
    setCurrentIndex(0);
    setSessionResults([]);
    setElapsedSeconds(0);
    setQuestionStartedAt(Date.now());
    resetAnswer();
    setScreen("question");
  }

  function getSubmittedValue() {
    if (!currentQuestion) return NaN;

    if (currentQuestion.answerType === "standard-form") {
      const coefficient = Number(standardFormCoefficient);
      const exponent = Number(standardFormExponent);

      if (!Number.isFinite(coefficient) || !Number.isFinite(exponent)) {
        return NaN;
      }

      return coefficient * Math.pow(10, exponent);
    }

    return Number(answer.replace(/,/g, "").trim());
  }

  function saveAttempt(attempt: Attempt) {
    const updatedHistory = [...history, attempt];

    setHistory(updatedHistory);

    try {
      window.localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(updatedHistory)
      );
    } catch {
      // Local storage unavailable. Session still works.
    }
  }

  function submitAnswer() {
    if (!currentQuestion || submitted) return;

    const value = getSubmittedValue();

    if (!Number.isFinite(value)) return;

    const min =
      currentQuestion.acceptedAnswers?.min ??
      currentQuestion.correctAnswer;

    const max =
      currentQuestion.acceptedAnswers?.max ??
      currentQuestion.correctAnswer;

    const correct = value >= min && value <= max;

    const timeTaken = questionStartedAt
      ? Math.max(
          1,
          Math.round((Date.now() - questionStartedAt) / 1000)
        )
      : Math.max(1, elapsedSeconds);

    const attempt: Attempt = {
      questionId: currentQuestion.id,
      correct,
      answer:
        currentQuestion.answerType === "standard-form"
          ? `${standardFormCoefficient} × 10^${standardFormExponent}`
          : answer,
      time: timeTaken,
      createdAt: new Date().toISOString(),
    };

    setIsCorrect(correct);
    setSubmitted(true);
    setSessionResults((previous) => [...previous, attempt]);
    saveAttempt(attempt);
  }

  function nextQuestion() {
    if (!submitted) return;

    if (currentIndex >= selectedQuestionIds.length - 1) {
      setScreen("results");
      return;
    }

    setCurrentIndex((index) => index + 1);
    setElapsedSeconds(0);
    setQuestionStartedAt(Date.now());
    resetAnswer();
  }

  function restartSession() {
    setScreen("selection");
    setSelectedQuestionIds([]);
    setCurrentIndex(0);
    setSessionResults([]);
    setElapsedSeconds(0);
    setQuestionStartedAt(null);
    setReviewQuestionId(null);
    resetAnswer();
  }

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return `${minutes}:${remaining.toString().padStart(2, "0")}`;
  }

  function openReview(questionId: string) {
    setReviewQuestionId(questionId);
    setScreen("review");
  }

  if (screen === "question" && currentQuestion) {
    return (
      <QuestionScreen
        question={currentQuestion}
        currentIndex={currentIndex}
        totalQuestions={selectedQuestionIds.length}
        answer={answer}
        setAnswer={setAnswer}
        standardFormCoefficient={standardFormCoefficient}
        setStandardFormCoefficient={setStandardFormCoefficient}
        standardFormExponent={standardFormExponent}
        setStandardFormExponent={setStandardFormExponent}
        submitted={submitted}
        isCorrect={isCorrect}
        elapsedSeconds={elapsedSeconds}
        submitAnswer={submitAnswer}
        nextQuestion={nextQuestion}
        formatTime={formatTime}
      />
    );
  }

  if (screen === "results") {
    return (
      <ResultsScreen
        results={sessionResults}
        selectedQuestionIds={selectedQuestionIds}
        onReview={openReview}
        onRestart={restartSession}
      />
    );
  }

  if (screen === "review" && reviewQuestion) {
    const latestAttempt = [...history]
      .reverse()
      .find((attempt) => attempt.questionId === reviewQuestion.id);

    return (
      <ReviewScreen
        question={reviewQuestion}
        attempt={latestAttempt}
        onBack={() =>
          setScreen(
            sessionResults.length > 0 ? "results" : "selection"
          )
        }
      />
    );
  }

  if (screen === "progress") {
    return (
      <ProgressScreen
        history={history}
        skillStats={skillStats}
        weakestSkill={weakestSkill}
        overallAccuracy={overallAccuracy}
        totalMarks={totalMarks}
        gainedMarks={gainedMarks}
        recentHistory={recentHistory}
        recentAccuracy={recentAccuracy}
        onBack={() => setScreen("selection")}
        onFixWeakAreas={startWeakAreas}
      />
    );
  }

  return (
    <SelectionScreen
      topic={topic}
      setTopic={setTopic}
      skill={skill}
      setSkill={setSkill}
      marks={marks}
      setMarks={setMarks}
      numberOfQuestions={numberOfQuestions}
      setNumberOfQuestions={setNumberOfQuestions}
      search={search}
      setSearch={setSearch}
      showFilters={showFilters}
      setShowFilters={setShowFilters}
      previouslyWrong={previouslyWrong}
      setPreviouslyWrong={setPreviouslyWrong}
      activeFilters={activeFilters}
      filteredQuestions={filteredQuestions}
      wrongCount={wrongQuestionIds.size}
      clearFilters={clearFilters}
      startQuestions={startQuestions}
      historyCount={history.length}
      overallAccuracy={overallAccuracy}
      onProgress={() => setScreen("progress")}
      onFixWeakAreas={startWeakAreas}
      weakestSkill={weakestSkill}
    />
  );
}

function SelectionScreen({
  topic,
  setTopic,
  skill,
  setSkill,
  marks,
  setMarks,
  numberOfQuestions,
  setNumberOfQuestions,
  search,
  setSearch,
  showFilters,
  setShowFilters,
  previouslyWrong,
  setPreviouslyWrong,
  activeFilters,
  filteredQuestions,
  wrongCount,
  clearFilters,
  startQuestions,
  historyCount,
  overallAccuracy,
  onProgress,
  onFixWeakAreas,
  weakestSkill,
}: {
  topic: string;
  setTopic: (value: string) => void;
  skill: string;
  setSkill: (value: string) => void;
  marks: string;
  setMarks: (value: string) => void;
  numberOfQuestions: string;
  setNumberOfQuestions: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  previouslyWrong: boolean;
  setPreviouslyWrong: (value: boolean) => void;
  activeFilters: number;
  filteredQuestions: MathsQuestion[];
  wrongCount: number;
  clearFilters: () => void;
  startQuestions: () => void;
  historyCount: number;
  overallAccuracy: number;
  onProgress: () => void;
  onFixWeakAreas: () => void;
  weakestSkill: {
    skill: string;
    attempts: number;
    correct: number;
    accuracy: number;
    possibleMarks: number;
    gainedMarks: number;
  } | null;
}) {
  const requested = Number(numberOfQuestions);
  const available = Math.min(requested, filteredQuestions.length);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">Maths Questions</h1>
            <p className="text-muted text-sm mt-1">
              AQA Biology maths skills practice
            </p>
          </div>
        </div>
      </div>

    
        <div className="grid sm:grid-cols-3 gap-4">
          <button
            onClick={onProgress}
            className="dashboard-card text-left hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-primary" />

              <div>
                <p className="text-xs text-muted">
                  Questions attempted
                </p>

                <p className="text-xl font-bold mt-1">
                  {historyCount}
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={onProgress}
            className="dashboard-card text-left hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />

              <div>
                <p className="text-xs text-muted">
                  Overall accuracy
                </p>

                <p className="text-xl font-bold mt-1">
                  {overallAccuracy}%
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={onProgress}
            className="dashboard-card text-left hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-primary" />

              <div>
                <p className="text-xs text-muted">
                  Weakest skill
                </p>

                <p className="text-sm font-bold mt-1">
                  {weakestSkill?.skill ?? "Not enough data"}
                </p>
              </div>
            </div>
          </button>
        </div>
      

      {weakestSkill && (
        <div className="dashboard-card border-primary/30 bg-primary/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />

                <h2 className="font-semibold">
                  Fix your weakest area
                </h2>
              </div>

              <p className="text-sm text-muted mt-2">
                {weakestSkill.skill} · {weakestSkill.accuracy}% accuracy
                across {weakestSkill.attempts} attempt
                {weakestSkill.attempts === 1 ? "" : "s"}.
              </p>
            </div>

            <button
              onClick={onFixWeakAreas}
              className="btn-primary flex items-center justify-center gap-2 shrink-0"
            >
              <Target className="w-4 h-4" />
              Fix weak area
            </button>
          </div>
        </div>
      )}

      <div className="dashboard-card space-y-6">
        <div>
          <h2 className="text-lg font-semibold">
            Build your question set
          </h2>
          <p className="text-sm text-muted mt-1">
            Choose what maths skills you want to practise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Biology topic
            </label>

            <div className="relative">
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full appearance-none bg-surface border border-border rounded-xl px-4 py-3 pr-10 text-sm text-text-primary focus:border-primary focus:outline-none"
              >
                {TOPICS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Maths skill
            </label>

            <div className="relative">
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full appearance-none bg-surface border border-border rounded-xl px-4 py-3 pr-10 text-sm text-text-primary focus:border-primary focus:outline-none"
              >
                {MATHS_SKILLS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Number of questions
          </label>

          <div className="grid grid-cols-4 gap-2 max-w-md">
            {["5", "10", "15", "20"].map((number) => (
              <button
                key={number}
                onClick={() => setNumberOfQuestions(number)}
                className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                  numberOfQuestions === number
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-surface text-text-secondary hover:border-primary/40"
                }`}
              >
                {number}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Search questions
          </label>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by question, year, paper or skill..."
              className="w-full bg-surface border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-text-primary placeholder:text-muted focus:border-primary focus:outline-none"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-medium text-primary"
          >
            <Filter className="w-4 h-4" />
            More filters

            {activeFilters > 0 && (
              <span className="bg-primary text-white text-[10px] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                {activeFilters}
              </span>
            )}

            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          {showFilters && (
            <div className="mt-4 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Marks
                </label>

                <div className="flex flex-wrap gap-2">
                  {MARK_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setMarks(option.value)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                        marks === option.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-text-secondary hover:border-primary/40"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() =>
                  setPreviouslyWrong(!previouslyWrong)
                }
                className={`w-full rounded-xl border p-4 text-left transition-colors ${
                  previouslyWrong
                    ? "border-red/40 bg-red/5"
                    : "border-border bg-surface hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Previously wrong
                    </p>

                    <p className="text-xs text-muted mt-1">
                      {wrongCount > 0
                        ? `${wrongCount} question${
                            wrongCount === 1 ? "" : "s"
                          } available`
                        : "No previously wrong questions yet"}
                    </p>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      previouslyWrong
                        ? "bg-red border-red"
                        : "border-border"
                    }`}
                  >
                    {previouslyWrong && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                </div>
              </button>

              {activeFilters > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-muted hover:text-text-secondary"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        <div className="text-xs text-muted">
          {filteredQuestions.length} question
          {filteredQuestions.length === 1 ? "" : "s"} match your filters.
        </div>

        <div className="border-t border-border pt-5">
          <button
            onClick={startQuestions}
            disabled={!filteredQuestions.length}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shuffle className="w-4 h-4" />
            Start {available} Questions
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestionScreen({
  question,
  currentIndex,
  totalQuestions,
  answer,
  setAnswer,
  standardFormCoefficient,
  setStandardFormCoefficient,
  standardFormExponent,
  setStandardFormExponent,
  submitted,
  isCorrect,
  elapsedSeconds,
  submitAnswer,
  nextQuestion,
  formatTime,
}: {
  question: MathsQuestion;
  currentIndex: number;
  totalQuestions: number;
  answer: string;
  setAnswer: (value: string) => void;
  standardFormCoefficient: string;
  setStandardFormCoefficient: (value: string) => void;
  standardFormExponent: string;
  setStandardFormExponent: (value: string) => void;
  submitted: boolean;
  isCorrect: boolean;
  elapsedSeconds: number;
  submitAnswer: () => void;
  nextQuestion: () => void;
  formatTime: (seconds: number) => string;
}) {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted">
            AQA Biology · {question.year} · {question.paper}
          </p>

          <h1 className="text-2xl font-bold mt-1">
            Question {currentIndex + 1} of {totalQuestions}
          </h1>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2">
          <Clock className="w-4 h-4 text-muted" />

          <span className="text-sm font-mono">
            {formatTime(elapsedSeconds)}
          </span>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-medium">
            Q{question.questionNumber}
          </span>

          <span className="text-xs px-3 py-1.5 rounded-lg bg-surface border border-border">
            {question.marks} marks
          </span>

          <span className="text-xs px-3 py-1.5 rounded-lg bg-surface border border-border">
            {question.mathsSkill}
          </span>
        </div>

        <p className="text-base leading-7">
          {question.question}
        </p>
      </div>

      <div className="dashboard-card space-y-5">
        <label className="text-sm font-medium">
          Your answer
        </label>

        {!submitted &&
        question.answerType === "standard-form" ? (
          <div className="flex items-center gap-3 max-w-xl">
            <input
              value={standardFormCoefficient}
              onChange={(e) =>
                setStandardFormCoefficient(e.target.value)
              }
              placeholder="8.5"
              className="w-28 bg-surface border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none"
            />

            <span className="text-lg">× 10</span>

            <input
              value={standardFormExponent}
              onChange={(e) =>
                setStandardFormExponent(e.target.value)
              }
              placeholder="4"
              className="w-20 bg-surface border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none"
            />

            <span className="text-sm text-muted">
              {question.unit}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 max-w-xl">
            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={submitted}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitAnswer();
              }}
              placeholder="Enter your answer"
              className={`flex-1 bg-surface border rounded-xl px-4 py-3 text-sm focus:outline-none ${
                submitted
                  ? isCorrect
                    ? "border-green"
                    : "border-red"
                  : "border-border focus:border-primary"
              }`}
            />

            {question.answerType === "percentage" && (
              <span className="text-sm font-medium">%</span>
            )}

            {question.answerType === "unit" && (
              <span className="text-sm font-medium">
                {question.unit}
              </span>
            )}
          </div>
        )}

        {!submitted && (
          <button
            onClick={submitAnswer}
            className="btn-primary flex items-center gap-2"
          >
            Check answer
            <Check className="w-4 h-4" />
          </button>
        )}
      </div>

      {submitted && (
        <div
          className={`rounded-2xl border p-5 ${
            isCorrect
              ? "border-green/40 bg-green/5"
              : "border-red/40 bg-red/5"
          }`}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <Check className="w-5 h-5 text-green mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red mt-0.5" />
            )}

            <div>
              <h2 className="font-semibold">
                {isCorrect ? "Correct" : "Incorrect"}
              </h2>

              <p className="text-sm text-muted mt-1">
                {isCorrect
                  ? "Good. Your answer is within the accepted range."
                  : `Correct answer: ${formatCorrectAnswer(question)}`}
              </p>

              <div className="mt-4">
                <p className="text-sm font-medium">
                  Worked solution
                </p>

                <p className="text-sm text-muted mt-1 leading-6">
                  {question.workedSolution}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {submitted && (
        <button
          onClick={nextQuestion}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {currentIndex === totalQuestions - 1
            ? "View results"
            : "Next question"}

          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function ResultsScreen({
  results,
  selectedQuestionIds,
  onReview,
  onRestart,
}: {
  results: Attempt[];
  selectedQuestionIds: string[];
  onReview: (questionId: string) => void;
  onRestart: () => void;
}) {
  const correctCount = results.filter(
    (result) => result.correct
  ).length;

  const total = selectedQuestionIds.length;

  const totalTime = results.reduce(
    (sum, result) => sum + result.time,
    0
  );

  return (
    <div className="space-y-6 pb-10">
      <div>
        <p className="text-sm text-muted">Maths Questions</p>
        <h1 className="text-2xl font-bold mt-1">
          Session complete
        </h1>
      </div>

      <div className="dashboard-card text-center py-8">
        <div className="text-4xl font-bold">
          {correctCount}/{total}
        </div>

        <p className="text-muted mt-2">
          {total
            ? Math.round((correctCount / total) * 100)
            : 0}
          % correct
        </p>

        <p className="text-xs text-muted mt-3">
          Total time: {formatStaticTime(totalTime)}
        </p>
      </div>

      <div className="dashboard-card">
        <h2 className="font-semibold mb-5">
          Question results
        </h2>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
          {selectedQuestionIds.map((id, index) => {
            const result = results.find(
              (item) => item.questionId === id
            );

            return (
              <button
                key={id}
                onClick={() => onReview(id)}
                title={`Review question ${index + 1}`}
                className={`aspect-square rounded-xl flex items-center justify-center border transition-transform hover:scale-105 ${
                  result?.correct
                    ? "border-green/40 bg-green/10 text-green"
                    : "border-red/40 bg-red/10 text-red"
                }`}
              >
                {result?.correct ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <X className="w-5 h-5" />
                )}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-muted mt-4">
          Click any result to review the question and solution.
        </p>
      </div>

      <button
        onClick={onRestart}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        New question set
      </button>
    </div>
  );
}

function ReviewScreen({
  question,
  attempt,
  onBack,
}: {
  question: MathsQuestion;
  attempt?: Attempt;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6 pb-10">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted hover:text-text-primary"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to results
      </button>

      <div>
        <p className="text-sm text-muted">
          {question.year} · {question.paper} · Q
          {question.questionNumber}
        </p>

        <h1 className="text-2xl font-bold mt-1">
          Review question
        </h1>
      </div>

      <div className="dashboard-card">
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary">
            {question.mathsSkill}
          </span>

          <span className="text-xs px-3 py-1.5 rounded-lg bg-surface border border-border">
            {question.marks} marks
          </span>
        </div>

        <p className="leading-7">{question.question}</p>
      </div>

      {attempt && (
        <div
          className={`rounded-2xl border p-5 ${
            attempt.correct
              ? "border-green/40 bg-green/5"
              : "border-red/40 bg-red/5"
          }`}
        >
          <div className="flex items-center gap-2">
            {attempt.correct ? (
              <Check className="w-5 h-5 text-green" />
            ) : (
              <XCircle className="w-5 h-5 text-red" />
            )}

            <span className="font-semibold">
              {attempt.correct ? "Correct" : "Incorrect"}
            </span>
          </div>

          <p className="text-sm text-muted mt-3">
            Your answer:{" "}
            <span className="text-text-primary">
              {attempt.answer || "No answer recorded"}
            </span>
          </p>

          <p className="text-sm text-muted mt-1">
            Time: {formatStaticTime(attempt.time)}
          </p>
        </div>
      )}

      <div className="dashboard-card">
        <h2 className="font-semibold">
          Correct answer
        </h2>

        <p className="text-sm text-muted mt-2">
          {formatCorrectAnswer(question)}
        </p>

        <div className="border-t border-border mt-5 pt-5">
          <h2 className="font-semibold">
            Worked solution
          </h2>

          <p className="text-sm text-muted mt-2 leading-6">
            {question.workedSolution}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProgressScreen({
  history,
  skillStats,
  weakestSkill,
  overallAccuracy,
  totalMarks,
  gainedMarks,
  recentHistory,
  recentAccuracy,
  onBack,
  onFixWeakAreas,
}: {
  history: Attempt[];
  skillStats: {
    skill: string;
    attempts: number;
    correct: number;
    accuracy: number;
    possibleMarks: number;
    gainedMarks: number;
  }[];
  weakestSkill: {
    skill: string;
    attempts: number;
    correct: number;
    accuracy: number;
    possibleMarks: number;
    gainedMarks: number;
  } | null;
  overallAccuracy: number;
  totalMarks: number;
  gainedMarks: number;
  recentHistory: Attempt[];
  recentAccuracy: number;
  onBack: () => void;
  onFixWeakAreas: () => void;
}) {
  return (
    <div className="space-y-6 pb-10">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted hover:text-text-primary"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Maths Questions
      </button>

      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              Maths Progress
            </h1>

            <p className="text-sm text-muted mt-1">
              Track your Maths performance and target weak areas.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ProgressCard
          label="Questions attempted"
          value={history.length.toString()}
        />

        <ProgressCard
          label="Accuracy"
          value={`${overallAccuracy}%`}
        />

        <ProgressCard
          label="Marks gained"
          value={`${gainedMarks}/${totalMarks}`}
        />

        <ProgressCard
          label="Recent accuracy"
          value={`${recentAccuracy}%`}
        />
      </div>

      {weakestSkill && (
        <div className="dashboard-card border-primary/30 bg-primary/5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />

                <h2 className="font-semibold">
                  Weakest area
                </h2>
              </div>

              <p className="text-xl font-bold mt-3">
                {weakestSkill.skill}
              </p>

              <p className="text-sm text-muted mt-1">
                {weakestSkill.accuracy}% accuracy across{" "}
                {weakestSkill.attempts} attempt
                {weakestSkill.attempts === 1 ? "" : "s"}.
              </p>
            </div>

            <button
              onClick={onFixWeakAreas}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Target className="w-4 h-4" />
              Fix my weak area
            </button>
          </div>
        </div>
      )}

      <div className="dashboard-card">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />

          <h2 className="font-semibold">
            Maths skill performance
          </h2>
        </div>

        <p className="text-sm text-muted mt-1">
          Based on your completed questions.
        </p>

        <div className="mt-6 space-y-5">
          {skillStats.map((item) => (
            <div key={item.skill}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">
                    {item.skill}
                  </p>

                  <p className="text-xs text-muted mt-1">
                    {item.correct}/{item.attempts} correct ·{" "}
                    {item.gainedMarks}/{item.possibleMarks} marks
                  </p>
                </div>

                <span className="text-sm font-semibold">
                  {item.accuracy}%
                </span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-surface border border-border overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    item.accuracy < 50
                      ? "bg-red"
                      : item.accuracy < 75
                      ? "bg-primary/60"
                      : "bg-primary"
                  }`}
                  style={{
                    width: `${item.accuracy}%`,
                  }}
                />
              </div>
            </div>
          ))}

          {!skillStats.length && (
            <p className="text-sm text-muted">
              Complete some Maths questions to see skill
              performance.
            </p>
          )}
        </div>
      </div>

      <div className="dashboard-card">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />

          <h2 className="font-semibold">
            Recent progress
          </h2>
        </div>

        <p className="text-sm text-muted mt-1">
          Your last 10 attempts, newest first.
        </p>

        <div className="mt-5 space-y-3">
          {recentHistory.map((attempt, index) => {
            const question = MATHS_QUESTIONS.find(
              (item) => item.id === attempt.questionId
            );

            if (!question) return null;

            return (
              <div
                key={`${attempt.questionId}-${attempt.createdAt}-${index}`}
                className="flex items-center justify-between gap-4 border-b border-border last:border-0 pb-3 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {question.mathsSkill}
                  </p>

                  <p className="text-xs text-muted mt-1">
                    {question.year} · Q{question.questionNumber}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted">
                    {formatStaticTime(attempt.time)}
                  </span>

                  {attempt.correct ? (
                    <Check className="w-4 h-4 text-green" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ProgressCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="dashboard-card">
      <p className="text-xs text-muted">{label}</p>

      <p className="text-2xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}

function formatCorrectAnswer(question: MathsQuestion) {
  if (question.answerType === "standard-form") {
    const exponent = Math.floor(
      Math.log10(Math.abs(question.correctAnswer))
    );

    const coefficient =
      question.correctAnswer / Math.pow(10, exponent);

    return `${coefficient.toPrecision(2)} × 10^${exponent}${
      question.unit ? ` ${question.unit}` : ""
    }`;
  }

  if (question.answerType === "percentage") {
    return `${question.correctAnswer}%`;
  }

  return `${question.correctAnswer}${
    question.unit ? ` ${question.unit}` : ""
  }`;
}

function formatStaticTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}