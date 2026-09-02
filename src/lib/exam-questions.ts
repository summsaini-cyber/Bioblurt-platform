export interface ExamQuestion {
  id: string;
  board: "aqa" | "cie";
  paper: string;
  topic: string;
  question: string;
  marks: number;
  markScheme: string[];
  guidance?: string;
}

export const EXAM_TOPICS: Record<string, Record<string, string[]>> = {
  aqa: {
    paper1: [
      "Biological Molecules",
      "Cells",
      "Organisms Exchange Substances",
      "Genetic Information & Variation",
    ],
    paper2: [
      "Energy Transfers",
      "Organisms Respond to Changes",
      "Genetics, Populations & Evolution",
      "Control of Gene Expression",
    ],
  },
  cie: {
    paper2: [
      "Cell Structure",
      "Biological Molecules",
      "Enzymes",
      "Cell Membranes & Transport",
      "The Mitotic Cell Cycle",
      "Nucleic Acids & Protein Synthesis",
      "Transport in Plants",
      "Transport in Mammals",
      "Gas Exchange",
      "Infectious Disease",
      "Immunity",
    ],
  },
};

export const EXAM_QUESTIONS: ExamQuestion[] = [
  // ═══════════════════════════════════════════════════════════════
  // AQA — PAPER 1
  // ═══════════════════════════════════════════════════════════════
  {
    id: "bio-mol-1",
    board: "aqa",
    paper: "paper1",
    topic: "Biological Molecules",
    question: "Describe how you would test a sample of food for the presence of protein. Explain how you would interpret the results.",
    marks: 5,
    markScheme: [
      "Add biuret reagent / sodium hydroxide + copper sulfate",
      "Heat / mix / shake",
      "If protein present = purple / lilac / mauve",
      "If no protein = blue remains",
      "Reference to peptide bonds detected",
    ],
  },
  {
    id: "bio-mol-2",
    board: "aqa",
    paper: "paper1",
    topic: "Biological Molecules",
    question: "A triglyceride is made from one molecule of glycerol and three fatty acids. Describe the structure of a triglyceride and explain how this structure makes triglycerides suitable for their role as energy storage molecules.",
    marks: 6,
    markScheme: [
      "Glycerol backbone with three fatty acid chains attached by ester bonds",
      "Fatty acid chains are long hydrocarbon chains / non-polar / hydrophobic",
      "High energy content due to many C-H bonds / reduced carbon atoms",
      "Insoluble in water so does not affect water potential / osmosis",
      "Compact / less bulky than equivalent carbohydrate store",
      "Low density / can be stored as droplets in adipose tissue",
    ],
  },
  {
    id: "bio-mol-3",
    board: "aqa",
    paper: "paper1",
    topic: "Biological Molecules",
    question: "Describe how you would carry out a test to distinguish between a reducing sugar and a non-reducing sugar.",
    marks: 4,
    markScheme: [
      "Add Benedict's reagent and heat",
      "Reducing sugar gives brick red / orange / green / yellow precipitate",
      "Non-reducing sugar stays blue",
      "To test for non-reducing sugar: first hydrolyse with acid, neutralise, then Benedict's test",
    ],
  },
  {
    id: "cells-1",
    board: "aqa",
    paper: "paper1",
    topic: "Cells",
    question: "Describe the structure of a cell surface membrane and explain how its structure is related to its functions.",
    marks: 6,
    markScheme: [
      "Phospholipid bilayer with hydrophilic heads and hydrophobic tails",
      "Proteins embedded / intrinsic / extrinsic",
      "Cholesterol molecules between phospholipids",
      "Glycoproteins / glycolipids for cell recognition",
      "Fluid mosaic model allows movement of molecules within membrane",
      "Selective permeability / controls what enters and leaves",
    ],
  },
  {
    id: "cells-2",
    board: "aqa",
    paper: "paper1",
    topic: "Cells",
    question: "Describe the process of mitosis and explain its importance in living organisms.",
    marks: 6,
    markScheme: [
      "Prophase: chromosomes condense / become visible / nuclear envelope breaks down",
      "Metaphase: chromosomes line up on equator / spindle fibres attach to centromeres",
      "Anaphase: sister chromatids pulled apart to opposite poles",
      "Telophase: nuclear envelope reforms / chromosomes decondense / cytokinesis",
      "Importance: growth / repair / asexual reproduction / maintains chromosome number",
      "Genetically identical cells produced / no genetic variation",
    ],
  },
  {
    id: "cells-3",
    board: "aqa",
    paper: "paper1",
    topic: "Cells",
    question: "Describe how you would use an optical microscope to measure the length of a cell.",
    marks: 4,
    markScheme: [
      "Place stage micrometer on stage and calibrate eyepiece graticule",
      "Align scales and calculate value of each eyepiece unit",
      "Replace stage micrometer with slide containing cells",
      "Count number of eyepiece units across cell and multiply by calibration factor",
    ],
  },
  {
    id: "exchange-1",
    board: "aqa",
    paper: "paper1",
    topic: "Organisms Exchange Substances",
    question: "Describe and explain the differences between the gaseous exchange systems of a mammal and a fish.",
    marks: 6,
    markScheme: [
      "Mammal: tidal ventilation / air flows in and out of same pathway",
      "Fish: unidirectional / water flows over gills in one direction",
      "Mammal: alveoli provide large surface area / thin walls / good blood supply",
      "Fish: counter-current system maintains steep concentration gradient",
      "Mammal: dead space / some air not involved in gas exchange",
      "Fish: water passes over gills continuously / more efficient oxygen extraction",
    ],
  },
  {
    id: "exchange-2",
    board: "aqa",
    paper: "paper1",
    topic: "Organisms Exchange Substances",
    question: "Explain how the structure of the alveoli is adapted for gaseous exchange.",
    marks: 4,
    markScheme: [
      "Large surface area provided by many alveoli",
      "Thin walls / one cell thick / short diffusion distance",
      "Good blood supply maintains concentration gradient",
      "Moist surface allows gases to dissolve",
    ],
  },
  {
    id: "genetics-1",
    board: "aqa",
    paper: "paper1",
    topic: "Genetic Information & Variation",
    question: "Describe the process of DNA replication.",
    marks: 6,
    markScheme: [
      "Helicase unwinds / unzips the double helix / breaks hydrogen bonds",
      "DNA strands act as templates",
      "Free DNA nucleotides align with complementary bases",
      "DNA polymerase joins nucleotides to form new strands",
      "Semi-conservative replication / each new DNA molecule has one old and one new strand",
      "Occurs during S phase of interphase / before cell division",
    ],
  },
  {
    id: "genetics-2",
    board: "aqa",
    paper: "paper1",
    topic: "Genetic Information & Variation",
    question: "Explain how meiosis results in genetic variation.",
    marks: 6,
    markScheme: [
      "Crossing over between homologous chromosomes in prophase I",
      "Exchange of genetic material between non-sister chromatids",
      "Independent assortment of homologous chromosomes in metaphase I",
      "Random orientation of bivalents at equator",
      "Random fertilisation / fusion of any male and female gamete",
      "Produces genetically different gametes / daughter cells",
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // AQA — PAPER 2
  // ═══════════════════════════════════════════════════════════════
  {
    id: "energy-1",
    board: "aqa",
    paper: "paper2",
    topic: "Energy Transfers",
    question: "Describe how energy is transferred from light energy to chemical energy in photosynthesis.",
    marks: 6,
    markScheme: [
      "Light energy absorbed by chlorophyll / photosystems in thylakoid membranes",
      "Photoionisation of chlorophyll releases excited electrons",
      "Electrons pass along electron transport chain",
      "Energy used to pump protons into thylakoid space",
      "Protons flow back through ATP synthase generating ATP",
      "NADP reduced to NADPH / ATP and NADPH used in Calvin cycle to fix CO2 into sugar",
    ],
  },
  {
    id: "energy-2",
    board: "aqa",
    paper: "paper2",
    topic: "Energy Transfers",
    question: "Describe the process of glycolysis.",
    marks: 4,
    markScheme: [
      "Glucose phosphorylated using ATP to form hexose bisphosphate",
      "Split into two triose phosphate molecules",
      "Oxidation / dehydrogenation removes hydrogen",
      "Hydrogen accepted by NAD / net gain of 2 ATP / 2 pyruvate produced",
    ],
  },
  {
    id: "response-1",
    board: "aqa",
    paper: "paper2",
    topic: "Organisms Respond to Changes",
    question: "Describe how a nerve impulse is transmitted along a motor neurone.",
    marks: 6,
    markScheme: [
      "Resting potential maintained by sodium-potassium pump and K+ leak channels",
      "Depolarisation: Na+ channels open / Na+ enters axon",
      "Reversal of charge / membrane potential becomes positive inside",
      "Repolarisation: Na+ channels close, K+ channels open / K+ leaves",
      "Hyperpolarisation then restoration of resting potential",
      "Action potential propagated along axon / local circuits / all-or-nothing",
    ],
  },
  {
    id: "response-2",
    board: "aqa",
    paper: "paper2",
    topic: "Organisms Respond to Changes",
    question: "Explain how the structure of a sarcomere is related to its function in muscle contraction.",
    marks: 4,
    markScheme: [
      "Thick filaments (myosin) and thin filaments (actin) arranged in parallel",
      "Z lines anchor thin filaments",
      "A band contains thick filaments / H zone contains only thick filaments",
      "Sliding filament mechanism / myosin heads bind to actin and pull thin filaments inward",
    ],
  },
  {
    id: "evo-1",
    board: "aqa",
    paper: "paper2",
    topic: "Genetics, Populations & Evolution",
    question: "Explain how natural selection can lead to evolution.",
    marks: 6,
    markScheme: [
      "Variation exists within population due to mutation / genetic differences",
      "Environmental selection pressure / competition for limited resources",
      "Individuals with advantageous alleles more likely to survive and reproduce",
      "Advantageous alleles passed to next generation in greater frequency",
      "Over many generations allele frequency changes in gene pool",
      "Population becomes better adapted / may lead to speciation",
    ],
  },
  {
    id: "evo-2",
    board: "aqa",
    paper: "paper2",
    topic: "Genetics, Populations & Evolution",
    question: "Describe the process of transcription.",
    marks: 5,
    markScheme: [
      "DNA helicase unwinds DNA double helix / hydrogen bonds break",
      "RNA polymerase binds to promoter region",
      "Complementary RNA nucleotides align with DNA template strand",
      "RNA polymerase joins nucleotides to form mRNA",
      "Introns removed / splicing / mRNA leaves nucleus through nuclear pore",
    ],
  },
  {
    id: "gene-1",
    board: "aqa",
    paper: "paper2",
    topic: "Control of Gene Expression",
    question: "Explain how a mutation in a gene can lead to a change in the phenotype of an organism.",
    marks: 6,
    markScheme: [
      "Mutation changes DNA base sequence",
      "Different mRNA produced during transcription",
      "Different amino acid sequence in polypeptide / different primary structure",
      "Protein has altered tertiary structure / different shape / may be non-functional",
      "Enzyme no longer fits substrate / cannot catalyse reaction",
      "Metabolic pathway disrupted leading to changed phenotype / disease",
    ],
  },
  {
    id: "gene-2",
    board: "aqa",
    paper: "paper2",
    topic: "Control of Gene Expression",
    question: "Describe the role of transcription factors in controlling gene expression.",
    marks: 4,
    markScheme: [
      "Transcription factors bind to specific DNA sequences near promoter",
      "Can activate or repress transcription",
      "Activators recruit RNA polymerase to start transcription",
      "Repressors block RNA polymerase binding / prevent transcription",
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // CIE — PAPER 2 ONLY (AS Level, 2025–2027 syllabus)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "cie-p2-cell-1",
    board: "cie",
    paper: "paper2",
    topic: "Cell Structure",
    question: "Fig. 1.1 is a drawing of a mesophyll cell from a leaf. Describe the functions of the organelles labelled A and B, and explain how each is adapted to carry out its function.",
    marks: 6,
    markScheme: [
      "A = chloroplast: site of photosynthesis / contains chlorophyll",
      "Chloroplast has thylakoid membranes / grana to maximise surface area for light absorption",
      "Chloroplast has stroma containing enzymes for Calvin cycle",
      "B = mitochondrion: site of aerobic respiration / ATP production",
      "Mitochondrion has cristae to increase surface area for electron transport chain",
      "Mitochondrion matrix contains enzymes for Krebs cycle",
    ],
  },
  {
    id: "cie-p2-cell-2",
    board: "cie",
    paper: "paper2",
    topic: "Cell Structure",
    question: "Describe the differences between the structure of a prokaryotic cell and a eukaryotic cell.",
    marks: 5,
    markScheme: [
      "Prokaryote has no nucleus / nucleoid region contains naked DNA",
      "Prokaryote has no membrane-bound organelles",
      "Prokaryote has 70S ribosomes / eukaryote has 80S ribosomes",
      "Prokaryote has cell wall containing peptidoglycan / murein",
      "Prokaryote DNA is circular / eukaryote DNA is linear and associated with histones",
    ],
  },
  {
    id: "cie-p2-biomol-1",
    board: "cie",
    paper: "paper2",
    topic: "Biological Molecules",
    question: "Describe the structure of a glucose molecule and explain how glucose molecules are joined together to form starch.",
    marks: 5,
    markScheme: [
      "Glucose is a monosaccharide / hexose sugar / 6 carbon atoms",
      "Glucose has formula C6H12O6 / ring structure",
      "Condensation reaction between glucose molecules releases water",
      "Glycosidic bond formed between C1 of one glucose and C4 of next",
      "Starch is a polymer of α-glucose / consists of amylose and amylopectin",
    ],
  },
  {
    id: "cie-p2-enzyme-1",
    board: "cie",
    paper: "paper2",
    topic: "Enzymes",
    question: "Explain how enzymes lower the activation energy of a reaction.",
    marks: 4,
    markScheme: [
      "Enzyme has active site with specific shape complementary to substrate",
      "Enzyme-substrate complex forms / induced fit model",
      "Binding of substrate strains bonds in substrate / lowers activation energy",
      "Reaction proceeds faster at lower temperature / more collisions have sufficient energy",
    ],
  },
  {
    id: "cie-p2-membrane-1",
    board: "cie",
    paper: "paper2",
    topic: "Cell Membranes & Transport",
    question: "Explain the process of facilitated diffusion across a cell surface membrane.",
    marks: 4,
    markScheme: [
      "Movement of molecules down a concentration gradient",
      "Through channel proteins or carrier proteins",
      "Does not require metabolic energy / ATP",
      "Specific to particular molecules / ions that fit the protein channel",
    ],
  },
  {
    id: "cie-p2-mitosis-1",
    board: "cie",
    paper: "paper2",
    topic: "The Mitotic Cell Cycle",
    question: "Describe the events that occur during anaphase of mitosis and explain the importance of mitosis in multicellular organisms.",
    marks: 5,
    markScheme: [
      "Sister chromatids separate at centromere",
      "Chromatids pulled to opposite poles by spindle fibres / microtubules",
      "Importance: growth / increase in cell number",
      "Repair / replacement of damaged cells",
      "Asexual reproduction / production of genetically identical cells",
    ],
  },
  {
    id: "cie-p2-transport-plant-1",
    board: "cie",
    paper: "paper2",
    topic: "Transport in Plants",
    question: "Explain how water moves from the soil to the xylem in the roots of a plant.",
    marks: 5,
    markScheme: [
      "Water moves by osmosis from soil into root hair cells",
      "Root hair cells have large surface area / thin cell wall",
      "Water moves across cortex by osmosis / symplast / apoplast pathways",
      "Casparian strip in endodermis blocks apoplast pathway",
      "Water forced into cytoplasm of endodermal cells before entering xylem",
    ],
  },
  {
    id: "cie-p2-transport-mammal-1",
    board: "cie",
    paper: "paper2",
    topic: "Transport in Mammals",
    question: "Describe the structure of the mammalian heart and explain how the structure is related to its function.",
    marks: 6,
    markScheme: [
      "Four chambers / two atria and two ventricles",
      "Septum separates oxygenated and deoxygenated blood",
      "Left ventricle has thicker muscular wall to pump blood to entire body",
      "Valves prevent backflow of blood",
      "Chordae tendineae prevent valves inverting under high pressure",
      "Coronary arteries supply cardiac muscle with oxygen and nutrients",
    ],
  },
  {
    id: "cie-p2-gas-1",
    board: "cie",
    paper: "paper2",
    topic: "Gas Exchange",
    question: "Describe the features of gas exchange surfaces in mammals and explain how each feature is adapted for efficient gas exchange.",
    marks: 5,
    markScheme: [
      "Large surface area provided by many alveoli",
      "Thin epithelium / one cell thick / short diffusion distance",
      "Good blood supply maintains concentration gradient",
      "Moist surface allows oxygen to dissolve",
      "Ventilation maintains steep diffusion gradient",
    ],
  },
  {
    id: "cie-p2-disease-1",
    board: "cie",
    paper: "paper2",
    topic: "Infectious Disease",
    question: "Explain how the immune system responds to a bacterial infection.",
    marks: 6,
    markScheme: [
      "Antigens on bacterial surface recognised as foreign",
      "Phagocytes engulf bacteria by phagocytosis",
      "Antigen presentation to helper T cells",
      "B cells activated and differentiate into plasma cells",
      "Plasma cells secrete antibodies specific to bacterial antigen",
      "Memory cells formed for rapid secondary response",
    ],
  },
  {
    id: "cie-p2-immunity-1",
    board: "cie",
    paper: "paper2",
    topic: "Immunity",
    question: "Explain how vaccination protects an individual against an infectious disease.",
    marks: 5,
    markScheme: [
      "Vaccine contains weakened / dead pathogen or antigen",
      "Antigen recognised as foreign by immune system",
      "Primary immune response: B cells activated and differentiate into plasma cells",
      "Plasma cells produce antibodies specific to the antigen",
      "Memory B and T cells remain in circulation for rapid secondary response upon re-exposure",
    ],
  },
];

// ── Helper functions ──

export function getQuestionsByBoard(board: string): ExamQuestion[] {
  return EXAM_QUESTIONS.filter((q) => q.board === board);
}

export function getTopicsByBoard(board: string, paper: string): string[] {
  return EXAM_TOPICS[board]?.[paper] || [];
}

export function getQuestionsByBoardAndTopic(
  board: string,
  paper: string,
  topic: string
): ExamQuestion[] {
  return EXAM_QUESTIONS.filter(
    (q) => q.board === board && q.paper === paper && q.topic === topic
  );
}

export function getQuestionById(id: string): ExamQuestion | undefined {
  return EXAM_QUESTIONS.find((q) => q.id === id);
}

export function getPapersByBoard(board: string): string[] {
  return Object.keys(EXAM_TOPICS[board] || {});
}