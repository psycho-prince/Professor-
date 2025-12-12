export enum ResearchGoal {
  STRENGTHEN_PAPER = "Strengthen a research paper / thesis",
  SOLVE_ASSIGNMENT = "Solve an assignment",
  FIX_DESIGN = "Fix experimental design",
  UNDERSTAND_MATH = "Understand equations",
  GENERAL_CRITIQUE = "General critique"
}

export enum FieldOfStudy {
  PHYSICS_ENG = "Physics & Engineering",
  CS_ML = "CS / ML",
  BIO_MED = "Biology & Medicine",
  SOCIAL_SCI = "Social Science",
  OTHER = "Other / Mixed"
}

export interface AnalysisRequest {
  goal: ResearchGoal;
  field: FieldOfStudy;
  hypothesis: string;
  files: File[];
}

export interface AnalysisResponse {
  markdown: string;
  timestamp: string;
}

export interface RevisionNote {
  id: string;
  text: string;
  checked: boolean;
}

export interface HistoryItem {
  id: string;
  request: AnalysisRequest;
  response: AnalysisResponse;
  revisionNotes: string | null;
  timestamp: number;
}
