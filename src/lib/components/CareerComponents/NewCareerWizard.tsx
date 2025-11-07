// src/lib/components/CareerComponents/NewCareerWizard.tsx

"use client";

import { useState, Dispatch, SetStateAction } from "react";
// Import the pill-style header you requested
import SegmentedHeader from "./SegmentedHeader";
// Import the component for the first step
import Step1_Details from "../CareerSteps/Step1_Details";

// Import other step components as you build them
// import Step2_CVReview from "../CareerSteps/Step2_CVReview";
// ...

// We create a new, comprehensive interface for all steps
export interface CareerData {
  jobTitle: string;
  description: string;
  workSetup: string;
  workSetupRemarks: string;
  screeningSetting: string;
  employmentType: string;
  requireVideo: boolean;
  salaryNegotiable: boolean;
  minimumSalary: string;
  maximumSalary: string;
  questions: any[];
  country: string;
  province: string;
  city: string;
  teamAccess: Array<{ email: string; name: string; role: "Owner" | "Member" }>;
}

// This is all the state from your old CareerForm.tsx, now in one place.
const initialCareerData: CareerData = {
  jobTitle: "",
  description: "",
  workSetup: "",
  workSetupRemarks: "",
  screeningSetting: "Good Fit and above",
  employmentType: "Full-Time",
  requireVideo: true,
  salaryNegotiable: true,
  minimumSalary: "",
  maximumSalary: "",
  questions: [
    { id: 1, category: "CV Validation / Experience", questionCountToAsk: null, questions: [] },
    { id: 2, category: "Technical", questionCountToAsk: null, questions: [] },
    { id: 3, category: "Behavioral", questionCountToAsk: null, questions: [] },
    { id: 4, category: "Analytical", questionCountToAsk: null, questions: [] },
    { id: 5, category: "Others", questionCountToAsk: null, questions: [] },
  ],
  country: "Philippines",
  province: "",
  city: "",
  teamAccess: [], // Your new requested field
};

export default function NewCareerWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxAchievedStep, setMaxAchievedStep] = useState(1);
  const [careerData, setCareerData] = useState<CareerData>(initialCareerData);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // You will move your saveCareer and updateCareer logic here
  // and adapt it for the draft/next-step flow.

  const handleSaveDraft = async () => {
    setIsLoading(true);
    // ... logic from old saveCareer (formType="add") ...
    // ... or logic from old updateCareer (formType="edit") if draftId exists ...
    console.log("Saving draft:", careerData);

    // MOCK API CALL
    return new Promise(resolve => {
      setTimeout(() => {
        if (!draftId) setDraftId("mock-draft-id-123"); // Set a draft ID after first save
        setIsLoading(false);
        console.log("Draft saved!");
        resolve(true);
      }, 1000);
    });
  };

  const handleNextStep = async () => {
    // 1. Save progress first
    await handleSaveDraft();

    // 2. Move to next step if not last step
    if (currentStep < 5) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (nextStep > maxAchievedStep) {
        setMaxAchievedStep(nextStep);
      }
    } else {
      // Logic for "Finish & Post" on the last step
      console.log("Finishing and posting career!");
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1_Details
            careerData={careerData}
            setCareerData={setCareerData}
          />
        );
      // case 2:
      //   return <Step2_CVReview careerData={careerData} setCareerData={setCareerData} />;
      // ... other steps
      default:
        return (
          <Step1_Details
            careerData={careerData}
            setCareerData={setCareerData}
          />
        );
    }
  };

  return (
    
    <div className="new-career-wizard">
      
      {/* The pill header */}
      <SegmentedHeader
        currentStep={currentStep}
        maxAchievedStep={maxAchievedStep}
        setStep={setCurrentStep}
      />

      {/* The content for the current step */}
      <div className="p-8">
        {renderStep()}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 border-t pt-6">
          <button
            onClick={handleSaveDraft}
            className="btn-secondary" // Use your app's CSS classes
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Draft"}
          </button>
          <div className="flex gap-4">
            <button
              onClick={handleBackStep}
              className="btn-secondary"
              disabled={currentStep === 1 || isLoading}
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              className="btn-primary" // Use your app's CSS classes
              disabled={isLoading}
            >
              {currentStep === 5 ? "Finish & Post" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// We need to define the props for our new Step component
export interface CareerStepProps {
  careerData: CareerData;
  setCareerData: Dispatch<SetStateAction<CareerData>>;
}