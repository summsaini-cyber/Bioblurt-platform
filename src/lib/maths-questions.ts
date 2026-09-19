export type MathsAnswerType =
  | "decimal"
  | "number"
  | "percentage"
  | "standard-form"
  | "unit";

export interface MathsQuestion {
  id: string;
  year: number;
  paper: string;
  questionNumber: string;
  marks: number;

  topic: string;
  mathsSkill: string;

  question: string;

  answerType: MathsAnswerType;
  unit?: string;

  correctAnswer: number;
  acceptedAnswers?: {
    min: number;
    max: number;
  };

  workedSolution: string;
}

export const MATHS_QUESTIONS: MathsQuestion[] = [
  {
    id: "aqa-2022-p1-q01-4",
    year: 2022,
    paper: "Paper 1",
    questionNumber: "01.4",
    marks: 2,

    topic: "Energy Transfers",
    mathsSkill: "Statistics",

    question:
      "Calculate the index of diversity using d = 1 − Σ(n/N)², where n is the shoot biomass of each plant species and N is the total shoot biomass. Species A has a biomass of 14, Species B 8, and Species C 3. Total shoot biomass is 25.",

    answerType: "decimal",

    correctAnswer: 0.57,
    acceptedAnswers: {
      min: 0.56,
      max: 0.58,
    },

    workedSolution:
      "d = 1 − [(14/25)² + (8/25)² + (3/25)²] = 1 − (0.3136 + 0.1024 + 0.0144) = 0.5696 ≈ 0.57.",
  },

  {
    id: "aqa-2022-p1-q03-4",
    year: 2022,
    paper: "Paper 1",
    questionNumber: "03.4",
    marks: 2,

    topic: "Cells",
    mathsSkill: "Geometry",

    question:
      "The inner pore of a channel has a diameter of 2.9 nm. Calculate the cross-sectional area of the channel, assuming it is circular. Use π = 3.14. Give your answer in nm² to 1 decimal place.",

    answerType: "unit",
    unit: "nm²",

    correctAnswer: 6.6,
    acceptedAnswers: {
      min: 6.55,
      max: 6.65,
    },

    workedSolution:
      "Radius = 2.9 ÷ 2 = 1.45 nm. Area = πr² = 3.14 × 1.45² = 6.596 ≈ 6.6 nm².",
  },

  {
    id: "aqa-2022-p1-q06-2",
    year: 2022,
    paper: "Paper 1",
    questionNumber: "06.2",
    marks: 2,

    topic: "Organisms Exchange Substances",
    mathsSkill: "Percentages",

    question:
      "The rate of transpiration was 15 at 1 pm and 27 at 2 pm. Calculate the percentage increase in the rate of transpiration from 1 pm to 2 pm.",

    answerType: "percentage",

    correctAnswer: 80,
    acceptedAnswers: {
      min: 79.5,
      max: 80.5,
    },

    workedSolution:
      "Percentage increase = [(27 − 15) ÷ 15] × 100 = (12 ÷ 15) × 100 = 80%.",
  },

  {
    id: "aqa-2022-p1-q08-2",
    year: 2022,
    paper: "Paper 1",
    questionNumber: "08.2",
    marks: 2,

    topic: "Organisms Exchange Substances",
    mathsSkill: "Surface area : volume",

    question:
      "A damaged fish gill has a surface area of 1.1 × 10⁴ μm² and a surface area : volume ratio of 0.13 : 1. Calculate the volume of the damaged gill. Give your answer to 2 significant figures.",

    answerType: "standard-form",
    unit: "μm³",

    correctAnswer: 85000,
    acceptedAnswers: {
      min: 84500,
      max: 85500,
    },

    workedSolution:
      "Surface area : volume = 0.13 : 1. Therefore volume = surface area ÷ 0.13 = (1.1 × 10⁴) ÷ 0.13 = 8.46 × 10⁴ μm³ ≈ 8.5 × 10⁴ μm³.",
  },

  {
    id: "aqa-2023-p1-q08-4",
    year: 2023,
    paper: "Paper 1",
    questionNumber: "08.4",
    marks: 2,

    topic: "Energy Transfers",
    mathsSkill: "Ratios",

    question:
      "A volume of 0.01 dm³ of MiTMAB solution was added to treated cells. The concentration required to reduce cell growth from equal to the control to 0.0 of the control was 30 μmol dm⁻³. The molar mass of MiTMAB is 395.3 g mol⁻¹. Calculate the increase in mass of MiTMAB added, in μg.",

    answerType: "unit",
    unit: "μg",

    correctAnswer: 118.59,
    acceptedAnswers: {
      min: 118,
      max: 119.5,
    },

    workedSolution:
      "Moles = concentration × volume = 30 μmol dm⁻³ × 0.01 dm³ = 0.3 μmol. Mass = 0.3 × 395.3 = 118.59 μg ≈ 119 μg.",
  },
];

export function getMathsQuestionById(id: string) {
  return MATHS_QUESTIONS.find((question) => question.id === id);
}

export function getMathsQuestionsByTopic(topic: string) {
  return MATHS_QUESTIONS.filter((question) => question.topic === topic);
}

export function getMathsQuestionsBySkill(mathsSkill: string) {
  return MATHS_QUESTIONS.filter(
    (question) => question.mathsSkill === mathsSkill
  );
}