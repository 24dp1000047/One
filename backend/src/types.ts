export type TaskIntent =
  | 'code_generation'
  | 'technical_reasoning'
  | 'creative_writing'
  | 'general_dialogue'
  | 'decision_noul'
  | 'decision_choice';

export type TaskComplexity = 'simple' | 'moderate' | 'complex';

export interface TypeSafeNoulResult {
  question: string;
  subject: string;
  category: string;
  truthScorePercent: number; // e.g. 33 for 33% true
  verdict: 'TRUE' | 'FALSE' | 'CONTESTED / AMBIGUOUS';
  confidence: number;
  criteria: string;
}

export interface TypeSafeChoiceOption {
  label: string;
  probabilityPercent: number;
}

export interface TypeSafeChoiceResult {
  question: string;
  options: TypeSafeChoiceOption[];
  winningChoice: string;
  confidence: number;
  condition?: string;
}

export interface JevDecision {
  engine: string;
  intent: TaskIntent;
  complexity: TaskComplexity;
  confidence: number;
  reasoningBudget: 'low' | 'medium' | 'high';
  latencyMs: number;
  primitiveType: 'noul' | 'choice' | 'classifier';
  noulResult?: TypeSafeNoulResult;
  choiceResult?: TypeSafeChoiceResult;
  stateExplanation?: string;
}

export interface InklingResponse {
  model: string;
  content: string;
  suggestedFollowUps?: string[];
  executionTimeMs: number;
  status: 'SUCCESS' | 'FAILED';
  error?: string;
}

export interface ChatApiResponse {
  success: boolean;
  jevDecision: JevDecision;
  response: string;
  suggestedFollowUps?: string[];
  model: string;
  executionTimeMs: number;
  error?: string;
}
