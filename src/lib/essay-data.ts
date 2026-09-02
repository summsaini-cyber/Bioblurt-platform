export interface EssayQuestion {
  id: string;
  title: string;
  year?: number;
  type: "past-paper" | "specimen";
}

export const ESSAY_QUESTIONS: EssayQuestion[] = [
  // Past papers 2016–2024
  { id: "essay-2016-1", title: "The importance of movement in living organisms", year: 2016, type: "past-paper" },
  { id: "essay-2016-2", title: "The importance of proteins in the control of processes and responses in organisms", year: 2016, type: "past-paper" },
  { id: "essay-2017-1", title: "The importance of ATP in living organisms", year: 2017, type: "past-paper" },
  { id: "essay-2017-2", title: "How bacteria can affect the lives of humans and other organisms", year: 2017, type: "past-paper" },
  { id: "essay-2018-1", title: "The importance of specific shapes fitting together in cells and organisms", year: 2018, type: "past-paper" },
  { id: "essay-2018-2", title: "The importance to humans of the control of growth, reproduction, and development of organisms, including themselves", year: 2018, type: "past-paper" },
  { id: "essay-2019-1", title: "The importance of nitrogen-containing substances in biological systems", year: 2019, type: "past-paper" },
  { id: "essay-2019-2", title: "The adaptations of organisms to their environments", year: 2019, type: "past-paper" },
  { id: "essay-2021-1", title: "The importance of the movement of substances across cell membranes", year: 2021, type: "past-paper" },
  { id: "essay-2021-2", title: "The importance of responses to changes in the internal and external environment of an organism", year: 2021, type: "past-paper" },
  { id: "essay-2022-1", title: "The importance of proteins and peptides in living organisms", year: 2022, type: "past-paper" },
  { id: "essay-2022-2", title: "The importance of the ability to respond to changes in the environment", year: 2022, type: "past-paper" },
  { id: "essay-2023-1", title: "The importance of cycles in biology", year: 2023, type: "past-paper" },
  { id: "essay-2023-2", title: "The importance of enzymes in the control of biological processes", year: 2023, type: "past-paper" },
  { id: "essay-2024-1", title: "Phosphorus-containing substances and their importance in biological systems", year: 2024, type: "past-paper" },
  { id: "essay-2024-2", title: "The mechanisms and importance of transport within organisms", year: 2024, type: "past-paper" },

  // Specimen / practice titles
  { id: "essay-spec-1", title: "The importance of energy transfers which take place inside living organisms", type: "specimen" },
  { id: "essay-spec-2", title: "The importance of diffusion in organisms", type: "specimen" },
  { id: "essay-spec-3", title: "The importance of ions in biology", type: "specimen" },
  { id: "essay-spec-4", title: "How microscopes have contributed to our understanding of living organisms", type: "specimen" },
  { id: "essay-spec-5", title: "The transfer of energy between different organisms and between these organisms and their environment", type: "specimen" },
  { id: "essay-spec-6", title: "The importance of water in living organisms", type: "specimen" },
  { id: "essay-spec-7", title: "The importance of membranes in the cells of organisms", type: "specimen" },
  { id: "essay-spec-8", title: "The importance of DNA in living organisms", type: "specimen" },
];

export function getEssayById(id: string): EssayQuestion | undefined {
  return ESSAY_QUESTIONS.find((e) => e.id === id);
}