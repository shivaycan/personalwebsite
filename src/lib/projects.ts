export type Project = {
  name: string;
  description: string;
  github: string;
};

export const projects: Project[] = [
  {
    name: 'Disease Prediction System',
    description: 'A machine learning pipeline for symptom-based disease prediction.',
    github: 'https://github.com/username/disease-prediction-system'
  },
  {
    name: 'Gesture Drawing App',
    description: 'A gesture-controlled drawing interface using computer vision.',
    github: 'https://github.com/username/gesture-drawing-app'
  }
];
