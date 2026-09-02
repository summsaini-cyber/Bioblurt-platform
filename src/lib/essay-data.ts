export interface EssayQuestion {
  id: string;
  title: string;
  year?: number;
  type: "past-paper" | "specimen";
}

export const ESSAY_QUESTIONS: EssayQuestion[] = [
  // AQA Paper 3 past papers 2017–2025

  {
    id: "essay-2017-1",
    title:
      "The importance of nitrogen-containing substances in biological systems",
    year: 2017,
    type: "past-paper",
  },
  {
    id: "essay-2017-2",
    title: "The importance of diffusion in organisms",
    year: 2017,
    type: "past-paper",
  },

  {
    id: "essay-2018-1",
    title:
      "The importance of the control of movement in cells and organisms",
    year: 2018,
    type: "past-paper",
  },
  {
    id: "essay-2018-2",
    title:
      "The importance of interactions between cells and between organisms",
    year: 2018,
    type: "past-paper",
  },

  {
    id: "essay-2019-1",
    title:
      "The importance of DNA as an information-carrying molecule and its use in gene technologies",
    year: 2019,
    type: "past-paper",
  },
  {
    id: "essay-2019-2",
    title: "The importance of bonds and bonding in organisms",
    year: 2019,
    type: "past-paper",
  },

  {
    id: "essay-2020-1",
    title:
      "The functions of enzymes and their importance in organisms",
    year: 2020,
    type: "past-paper",
  },
  {
    id: "essay-2020-2",
    title:
      "The causes and importance of variation and diversity in organisms",
    year: 2020,
    type: "past-paper",
  },

  {
    id: "essay-2021-1",
    title:
      "The importance of complementary shapes of molecules in organisms",
    year: 2021,
    type: "past-paper",
  },
  {
    id: "essay-2021-2",
    title:
      "The importance of ions in metabolic processes",
    year: 2021,
    type: "past-paper",
  },

  {
    id: "essay-2022-1",
    title: "The uses and importance of ATP in organisms",
    year: 2022,
    type: "past-paper",
  },
  {
    id: "essay-2022-2",
    title: "The importance of cycles in biology",
    year: 2022,
    type: "past-paper",
  },

  {
    id: "essay-2023-1",
    title:
      "The importance of interactions between organisms and their environment",
    year: 2023,
    type: "past-paper",
  },
  {
    id: "essay-2023-2",
    title:
      "The importance of membranes in the functioning of cells",
    year: 2023,
    type: "past-paper",
  },

  {
    id: "essay-2024-1",
    title:
      "Phosphorus-containing substances and their importance in biological systems",
    year: 2024,
    type: "past-paper",
  },
  {
    id: "essay-2024-2",
    title:
      "The mechanisms and importance of transport within organisms",
    year: 2024,
    type: "past-paper",
  },

  {
    id: "essay-2025-1",
    title:
      "The importance of condensation and hydrolysis reactions in biological systems",
    year: 2025,
    type: "past-paper",
  },
  {
    id: "essay-2025-2",
    title:
      "The importance of responses to changes in the internal and external environment of organisms",
    year: 2025,
    type: "past-paper",
  },

  // 2016 questions + other unmatched/practice titles
  // deliberately shown as Practice rather than labelled as 2016

  {
    id: "essay-2016-1",
    title: "The importance of movement in living organisms",
    type: "specimen",
  },
  {
    id: "essay-2016-2",
    title:
      "The importance of proteins in the control of processes and responses in organisms",
    type: "specimen",
  },

  {
    id: "essay-spec-1",
    title:
      "The importance of energy transfers which take place inside living organisms",
    type: "specimen",
  },
  {
    id: "essay-spec-2",
    title: "The importance of diffusion in organisms",
    type: "specimen",
  },
  {
    id: "essay-spec-3",
    title: "The importance of ions in biology",
    type: "specimen",
  },
  {
    id: "essay-spec-4",
    title:
      "How microscopes have contributed to our understanding of living organisms",
    type: "specimen",
  },
  {
    id: "essay-spec-5",
    title:
      "The transfer of energy between different organisms and between these organisms and their environment",
    type: "specimen",
  },
  {
    id: "essay-spec-6",
    title: "The importance of water in living organisms",
    type: "specimen",
  },
  {
    id: "essay-spec-7",
    title:
      "The importance of membranes in the cells of organisms",
    type: "specimen",
  },
  {
    id: "essay-spec-8",
    title: "The importance of DNA in living organisms",
    type: "specimen",
  },
];

export function getEssayById(id: string): EssayQuestion | undefined {
  return ESSAY_QUESTIONS.find((e) => e.id === id);
}