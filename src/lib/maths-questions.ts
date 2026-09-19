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
  // =========================
  // ORIGINAL 6 QUESTIONS
  // =========================

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

  {
    id: "aqa-2022-p1-q-extra",
    year: 2022,
    paper: "Paper 1",
    questionNumber: "Extra",
    marks: 2,

    topic: "Organisms Exchange Substances",
    mathsSkill: "Rates",

    question:
      "A plant absorbs 18 cm³ of water in 6 minutes. Calculate the mean rate of water uptake in cm³ min⁻¹.",

    answerType: "number",
    unit: "cm³ min⁻¹",

    correctAnswer: 3,
    acceptedAnswers: {
      min: 2.99,
      max: 3.01,
    },

    workedSolution:
      "Rate = volume ÷ time = 18 ÷ 6 = 3 cm³ min⁻¹.",
  },

  // =========================
  // NEW 20 QUESTIONS
  // =========================

  {
    id: "aqa-style-cardiac-output-1",
    year: 2026,
    paper: "Paper 1",
    questionNumber: "Maths 01",
    marks: 3,

    topic: "Organisms Exchange Substances",
    mathsSkill: "Rates",

    question:
      "At rest, a student has a heart rate of 72 beats min⁻¹ and a stroke volume of 65 cm³. During exercise, their cardiac output increases by 80%. If their heart rate during exercise rises to 130 beats min⁻¹, calculate their stroke volume during exercise in cm³. Give your answer to the nearest whole number.",

    answerType: "number",
    unit: "cm³",

    correctAnswer: 65,
    acceptedAnswers: {
      min: 64.5,
      max: 65.5,
    },

    workedSolution:
      "Resting cardiac output = 72 × 65 = 4680 cm³ min⁻¹. Exercise cardiac output = 4680 × 1.80 = 8424 cm³ min⁻¹. Exercise stroke volume = 8424 ÷ 130 = 64.8 cm³ ≈ 65 cm³.",
  },

  {
    id: "aqa-style-magnification-2",
    year: 2026,
    paper: "Paper 1",
    questionNumber: "Maths 02",
    marks: 3,

    topic: "Cells",
    mathsSkill: "Standard form",

    question:
      "A student uses a light microscope to take a micrograph of a cell organelle. The image length of the organelle is 18 mm and the magnification used is ×40 000. Calculate the actual length of the organelle in nanometres (nm). Give your answer in standard form.",

    answerType: "standard-form",
    unit: "nm",

    correctAnswer: 450,
    acceptedAnswers: {
      min: 449,
      max: 451,
    },

    workedSolution:
      "18 mm = 18 000 000 nm = 1.8 × 10⁷ nm. Actual size = image size ÷ magnification = 18 000 000 ÷ 40 000 = 450 nm = 4.5 × 10² nm.",
  },

  {
    id: "aqa-style-index-diversity-3",
    year: 2026,
    paper: "Paper 1",
    questionNumber: "Maths 03",
    marks: 3,

    topic: "Genetics, Populations & Evolution",
    mathsSkill: "Statistics",

    question:
      "A student samples the insect population in a woodland area. They collect counts of 22, 14, 8, 5 and 1 organisms for five species. Use the formula d = N(N − 1) / Σn(n − 1) to calculate the index of diversity. Give your answer to 2 decimal places.",

    answerType: "decimal",

    correctAnswer: 3.4,
    acceptedAnswers: {
      min: 3.39,
      max: 3.41,
    },

    workedSolution:
      "N = 22 + 14 + 8 + 5 + 1 = 50. N(N − 1) = 50 × 49 = 2450. Σn(n − 1) = (22 × 21) + (14 × 13) + (8 × 7) + (5 × 4) + (1 × 0) = 720. d = 2450 ÷ 720 = 3.40.",
  },

  {
    id: "aqa-style-surface-volume-4",
    year: 2026,
    paper: "Paper 1",
    questionNumber: "Maths 04",
    marks: 3,

    topic: "Cells",
    mathsSkill: "Surface area : volume",

    question:
      "A single bacterial cell can be modelled as a cylinder with radius 1.0 μm and length 4.0 μm. Volume = πr²h and total surface area = 2πrh + 2πr². Calculate the surface area to volume ratio. Express your answer as X : 1 to 2 significant figures. Use π = 3.14.",

    answerType: "number",

    correctAnswer: 2.5,
    acceptedAnswers: {
      min: 2.45,
      max: 2.55,
    },

    workedSolution:
      "Volume = 3.14 × 1.0² × 4.0 = 12.56 μm³. Surface area = (2 × 3.14 × 1.0 × 4.0) + (2 × 3.14 × 1.0²) = 31.4 μm². Ratio = 31.4 ÷ 12.56 = 2.5 : 1.",
  },

  {
    id: "aqa-style-respiration-rate-5",
    year: 2026,
    paper: "Paper 1",
    questionNumber: "Maths 05",
    marks: 2,

    topic: "Energy Transfers",
    mathsSkill: "Percentages",

    question:
      "In an investigation into yeast respiration, 15 cm³ of carbon dioxide was produced in 5 minutes at 20°C. At 30°C, 38 cm³ was produced in 5 minutes. Calculate the percentage increase in the rate of carbon dioxide production at 30°C compared with 20°C.",

    answerType: "percentage",

    correctAnswer: 153.3,
    acceptedAnswers: {
      min: 152.5,
      max: 154,
    },

    workedSolution:
      "Rate at 20°C = 15 ÷ 5 = 3 cm³ min⁻¹. Rate at 30°C = 38 ÷ 5 = 7.6 cm³ min⁻¹. Percentage increase = ((7.6 − 3) ÷ 3) × 100 = 153.3%.",
  },

  {
    id: "aqa-style-hardy-weinberg-6",
    year: 2026,
    paper: "Paper 1",
    questionNumber: "Maths 06",
    marks: 3,

    topic: "Genetics, Populations & Evolution",
    mathsSkill: "Percentages",

    question:
      "In a population of 2000 plants, 16% show the recessive phenotype of short height (tt). Assuming Hardy-Weinberg equilibrium, calculate the total number of heterozygous (Tt) plants.",

    answerType: "number",

    correctAnswer: 960,
    acceptedAnswers: {
      min: 959,
      max: 961,
    },

    workedSolution:
      "q² = 0.16, so q = √0.16 = 0.4. p = 1 − 0.4 = 0.6. Heterozygous proportion = 2pq = 2 × 0.6 × 0.4 = 0.48. Number of heterozygous plants = 0.48 × 2000 = 960.",
  },

  {
    id: "aqa-style-dilution-7",
    year: 2026,
    paper: "Paper 1",
    questionNumber: "Maths 07",
    marks: 2,

    topic: "Biological Molecules",
    mathsSkill: "Ratios",

    question:
      "A student has a 1.0 mol dm⁻³ sucrose solution. Calculate the volume of this stock solution needed to prepare 20 cm³ of a 0.2 mol dm⁻³ sucrose solution. Use C₁V₁ = C₂V₂.",

    answerType: "number",
    unit: "cm³",

    correctAnswer: 4,
    acceptedAnswers: {
      min: 3.9,
      max: 4.1,
    },

    workedSolution:
      "1.0 × V₁ = 0.2 × 20. V₁ = 4 cm³. Therefore, use 4 cm³ of stock solution and add 16 cm³ of distilled water.",
  },

  {
    id: "aqa-style-enzyme-rate-8",
    year: 2026,
    paper: "Paper 1",
    questionNumber: "Maths 08",
    marks: 2,

    topic: "Energy Transfers",
    mathsSkill: "Rates",

    question:
      "An enzyme-catalysed reaction produces 4.8 cm³ of oxygen gas in 3 minutes and 20 seconds during the initial linear phase. Calculate the initial rate in cm³ s⁻¹. Give your answer in standard form to 2 significant figures.",

    answerType: "standard-form",
    unit: "cm³ s⁻¹",

    correctAnswer: 0.024,
    acceptedAnswers: {
      min: 0.0235,
      max: 0.0245,
    },

    workedSolution:
      "3 minutes 20 seconds = 200 seconds. Rate = 4.8 ÷ 200 = 0.024 cm³ s⁻¹ = 2.4 × 10⁻² cm³ s⁻¹.",
  },

  {
    id: "aqa-style-potato-mass-9",
    year: 2026,
    paper: "Paper 1",
    questionNumber: "Maths 09",
    marks: 2,

    topic: "Organisms Respond to Changes",
    mathsSkill: "Percentages",

    question:
      "A cylinder of potato tissue has an initial mass of 2.45 g. After being placed in a 0.4 mol dm⁻³ sucrose solution for 4 hours, its final mass is 2.18 g. Calculate the percentage change in mass.",

    answerType: "percentage",

    correctAnswer: -11.02,
    acceptedAnswers: {
      min: -11.2,
      max: -10.9,
    },

    workedSolution:
      "Change in mass = 2.18 − 2.45 = −0.27 g. Percentage change = (−0.27 ÷ 2.45) × 100 = −11.02%.",
  },

  {
    id: "aqa-style-mark-recapture-10",
    year: 2026,
    paper: "Paper 1",
    questionNumber: "Maths 10",
    marks: 2,

    topic: "Genetics, Populations & Evolution",
    mathsSkill: "Ratios",

    question:
      "Scientists use mark-release-recapture to estimate the population of a beetle species. The first sample contains 45 marked beetles. The second sample contains 36 beetles, of which 9 are marked. Calculate the estimated population using N = Mn/m.",

    answerType: "number",

    correctAnswer: 180,
    acceptedAnswers: {
      min: 179,
      max: 181,
    },

    workedSolution:
      "N = (45 × 36) ÷ 9 = 1620 ÷ 9 = 180 beetles.",
  },

  {
    id: "aqa-style-uncertainty-11",
    year: 2026,
    paper: "Paper 1",
    questionNumber: "Maths 11",
    marks: 1,

    topic: "Cells",
    mathsSkill: "Percentages",

    question:
      "A student measures 10.0 cm³ of liquid using a measuring cylinder with an uncertainty of ±0.5 cm³. Calculate the percentage uncertainty.",

    answerType: "percentage",

    correctAnswer: 5,
    acceptedAnswers: {
      min: 4.9,
      max: 5.1,
    },

    workedSolution:
      "Percentage uncertainty = (0.5 ÷ 10.0) × 100 = 5%.",
  },

  {
    id: "aqa-style-mitotic-index-12",
    year: 2026,
    paper: "Paper 1",
    questionNumber: "Maths 12",
    marks: 2,

    topic: "Cells",
    mathsSkill: "Ratios",

    question:
      "A student examines a plant root tip. They count 142 total cells, of which 23 are undergoing mitosis. Calculate the mitotic index to 2 decimal places.",

    answerType: "decimal",

    correctAnswer: 0.16,
    acceptedAnswers: {
      min: 0.155,
      max: 0.165,
    },

    workedSolution:
      "Mitotic index = number of cells in mitosis ÷ total number of cells = 23 ÷ 142 = 0.1619... ≈ 0.16.",
  },

  {
    id: "aqa-style-ventilation-13",
    year: 2026,
    paper: "Paper 1",
    questionNumber: "Maths 13",
    marks: 3,

    topic: "Organisms Exchange Substances",
    mathsSkill: "Rates",

    question:
      "A person at rest has a breathing rate of 12 breaths min⁻¹ and a tidal volume of 0.5 dm³. During exercise, pulmonary ventilation rate increases to 45 dm³ min⁻¹ and breathing rate increases to 30 breaths min⁻¹. Calculate the percentage increase in tidal volume during exercise.",

    answerType: "percentage",

    correctAnswer: 200,
    acceptedAnswers: {
      min: 199,
      max: 201,
    },

    workedSolution:
      "Exercise tidal volume = 45 ÷ 30 = 1.5 dm³. Percentage increase = ((1.5 − 0.5) ÷ 0.5) × 100 = 200%.",
  },

  {
    id: "aqa-style-bacterial-growth-14",
    year: 2026,
    paper: "Paper 1",
    questionNumber: "Maths 14",
    marks: 2,

    topic: "Cells",
    mathsSkill: "Standard form",

    question:
      "A bacterial culture initially contains 5.0 × 10³ cells. Under optimal conditions, the population doubles every 20 minutes. Calculate the total number of cells after 3 hours. Give your answer in standard form.",

    answerType: "standard-form",
    unit: "cells",

    correctAnswer: 2560000,
    acceptedAnswers: {
      min: 2550000,
      max: 2570000,
    },

    workedSolution:
      "3 hours = 180 minutes. Number of divisions = 180 ÷ 20 = 9. Number of cells = 5.0 × 10³ × 2⁹ = 2.56 × 10⁶ cells.",
  },

  {
    id: "aqa-style-chi-squared-15",
    year: 2026,
    paper: "Paper 1",
    questionNumber: "Maths 15",
    marks: 2,

    topic: "Genetics, Populations & Evolution",
    mathsSkill: "Probability",

    question:
      "In a genetic cross between two heterozygous fruit flies (AaBb × AaBb), 640 offspring are produced. Calculate the expected number displaying both dominant phenotypes using a 9:3:3:1 ratio.",

    answerType: "number",

    correctAnswer: 360,
    acceptedAnswers: {
      min: 359,
      max: 361,
    },

    workedSolution:
      "Probability of both dominant phenotypes = 9/16. Expected number = 640 × 9/16 = 360 offspring.",
  },

  {
    id: "aqa-style-npp-16",
    year: 2026,
    paper: "Paper 1",
    questionNumber: "Maths 16",
    marks: 2,

    topic: "Energy Transfers",
    mathsSkill: "Percentages",

    question:
      "An ecosystem has a Gross Primary Productivity of 2.4 × 10⁴ kJ m⁻² yr⁻¹. Respiratory losses account for 55% of GPP. Calculate the Net Primary Productivity.",

    answerType: "standard-form",
    unit: "kJ m⁻² yr⁻¹",

    correctAnswer: 10800,
    acceptedAnswers: {
      min: 10700,
      max: 10900,
    },

    workedSolution:
      "Respiratory loss = 0.55 × 2.4 × 10⁴ = 1.32 × 10⁴. NPP = 2.4 × 10⁴ − 1.32 × 10⁴ = 1.08 × 10⁴ kJ m⁻² yr⁻¹.",
  },

  {
    id: "aqa-style-energy-efficiency-17",
    year: 2026,
    paper: "Paper 1",
    questionNumber: "Maths 17",
    marks: 2,

    topic: "Energy Transfers",
    mathsSkill: "Percentages",

    question:
      "Primary consumers store 3.2 × 10³ kJ m⁻² yr⁻¹ of energy in their biomass. Secondary consumers assimilate 2.88 × 10² kJ m⁻² yr⁻¹ into their own biomass. Calculate the efficiency of energy transfer as a percentage.",

    answerType: "percentage",

    correctAnswer: 9,
    acceptedAnswers: {
      min: 8.9,
      max: 9.1,
    },

    workedSolution:
      "Efficiency = (2.88 × 10² ÷ 3.2 × 10³) × 100 = 9%.",
  },

  {
    id: "aqa-style-stomatal-density-18",
    year: 2026,
    paper: "Paper 1",
    questionNumber: "Maths 18",
    marks: 2,

    topic: "Organisms Exchange Substances",
    mathsSkill: "Ratios",

    question:
      "A leaf surface area of 0.25 mm² contains 45 stomata on the lower epidermis and 5 stomata on the upper epidermis. Calculate the stomatal density ratio of the lower epidermis compared with the upper epidermis. Express your answer as X : 1.",

    answerType: "number",

    correctAnswer: 9,
    acceptedAnswers: {
      min: 8.9,
      max: 9.1,
    },

    workedSolution:
      "Lower density = 45 ÷ 0.25 = 180 stomata mm⁻². Upper density = 5 ÷ 0.25 = 20 stomata mm⁻². Ratio = 180 : 20 = 9 : 1.",
  },

  {
    id: "aqa-style-scale-bar-19",
    year: 2026,
    paper: "Paper 1",
    questionNumber: "Maths 19",
    marks: 2,

    topic: "Cells",
    mathsSkill: "Standard form",

    question:
      "A student wants to draw a scale bar representing 5 μm on a diagram of a cell. The magnification is ×12 000. Calculate the length of the scale bar in millimetres.",

    answerType: "number",
    unit: "mm",

    correctAnswer: 60,
    acceptedAnswers: {
      min: 59,
      max: 61,
    },

    workedSolution:
      "5 μm = 0.005 mm. Image size = actual size × magnification = 0.005 × 12 000 = 60 mm.",
  },

  {
    id: "aqa-style-nacl-mass-20",
    year: 2026,
    paper: "Paper 1",
    questionNumber: "Maths 20",
    marks: 2,

    topic: "Biological Molecules",
    mathsSkill: "Ratios",

    question:
      "A 0.15 mol dm⁻³ sodium chloride solution is required. Calculate the mass of NaCl needed to prepare 250 cm³ of this solution. The molar mass of NaCl is 58.5 g mol⁻¹.",

    answerType: "number",
    unit: "g",

    correctAnswer: 2.19,
    acceptedAnswers: {
      min: 2.18,
      max: 2.20,
    },

    workedSolution:
      "250 cm³ = 0.25 dm³. Moles = 0.15 × 0.25 = 0.0375 mol. Mass = 0.0375 × 58.5 = 2.19375 g ≈ 2.19 g.",
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

