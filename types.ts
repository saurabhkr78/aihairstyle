
export interface HairstyleSuggestion {
  name: string;
  description: string;
  length_recommendation: string;
  generatedImage?: string;
}

export interface AnalysisResult {
  face_shape: string;
  forehead_size: string;
  jawline: string;
  hair_texture: string;
  hairstyles: HairstyleSuggestion[];
}

export enum AppStep {
  UPLOAD,
  MASK,
  PROCESSING,
  RESULTS,
  ERROR,
}
