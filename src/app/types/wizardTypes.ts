export interface Step {
  id: number;
  title: string;
  iconClass: string;
}

export interface StepNavigationProps {
  steps: Step[];
  currentStep: number;
}

export interface StepNavigationStepProps {
  step: Step;
  isActive: boolean;
  isComplete: boolean;
}
