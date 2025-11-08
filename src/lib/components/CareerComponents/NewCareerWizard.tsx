// src/lib/components/CareerComponents/NewCareerWizard.tsx

"use client";

import { useState, Dispatch, SetStateAction, useEffect } from "react";
// Import the pill-style header you requested
import SegmentedHeader from "./SegmentedHeader";
// Import the component for the first step
import Step1_Details from "../CareerSteps/Step1_Details";
import Step2_CVReview from "../CareerSteps/Step2_CVReview";
import Step3_AIInterview from "../CareerSteps/Step3_AIInterview";
import Step4_Review from "../CareerSteps/Step4_Review";
import {  errorToast } from "@/lib/Utils";


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
export interface Step1Errors {
  jobTitle?: string;
  description?: string;
  workSetup?: string;
  employmentType?: string;
  province?: string;
  city?: string;
  minimumSalary?: string;
  maximumSalary?: string;
}

export interface Step2Errors {
  workSetupRemarks?: string;
  [key: string]: string | undefined; // For dynamic question IDs
}

export type WizardErrors = Step1Errors & Step2Errors;

export default function NewCareerWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxAchievedStep, setMaxAchievedStep] = useState(1);
  const [careerData, setCareerData] = useState<CareerData>(initialCareerData);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<WizardErrors>({});

  useEffect(() => {
    if (currentStep === 1) {
      validateStep1();
    } else if (currentStep === 2) {
      validateStep2();
    }
  }, [careerData, currentStep]);

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

  /**
   * --- ADDED: This is the single validation function ---
   * It checks all required fields for Step 1 and shows toasts.
   * It returns 'true' if valid, 'false' if an error is found.
   */

  
const validateStep1 = () => {
    const {
      jobTitle,
      description,
      workSetup,
      employmentType,
      province,
      city,
      salaryNegotiable,
      minimumSalary,
      maximumSalary,
    } = careerData;

    const step1Errors: Step1Errors = {};

    if (!jobTitle || jobTitle.trim().length === 0) {
      step1Errors.jobTitle = "This is a required field";
    }
    if (!workSetup || workSetup.trim().length === 0) {
      step1Errors.workSetup = "This is a required field";
    }
    if (!employmentType || employmentType.trim().length === 0) {
      step1Errors.employmentType = "This is a required field";
    }
    if (!province || province.trim().length === 0) {
      step1Errors.province = "This is a required field";
    }
    if (!city || city.trim().length === 0) {
      step1Errors.city = "This is a required field";
    }
    if (!description || description.trim().length === 0) {
      step1Errors.description = "This is a required field";
    }

    // Salary checks

      const minIsMissing = !minimumSalary;
      const maxIsMissing = !maximumSalary;

      if (minIsMissing) {
        step1Errors.minimumSalary = "This is a required field";
      }
      if (maxIsMissing) {
        step1Errors.maximumSalary = "This is a required field";
      }
      
      // Only if NEITHER is missing, check the comparison
      if (!minIsMissing && !maxIsMissing) {
        if (Number(minimumSalary) > Number(maximumSalary)) {
            step1Errors.minimumSalary = "Minimum salary cannot be greater than maximum salary";
            step1Errors.maximumSalary = "Maximum salary cannot be less than minimum salary";
        }
      }
    
    setErrors(prev => {
      const newErrors = { ...prev };
      const step1ErrorKeys = [
        "jobTitle", "description", "workSetup", "employmentType", 
        "province", "city", "minimumSalary", "maximumSalary"
      ];
      
      step1ErrorKeys.forEach(key => {
        delete newErrors[key];
      });

      return { ...newErrors, ...step1Errors };
    });
    
    return Object.keys(step1Errors).length === 0;
  };

  const validateStep2 = () => {
    const { workSetupRemarks, questions } = careerData;
    const step2Errors: Step2Errors = {};

    if (!workSetupRemarks || workSetupRemarks.trim().length === 0) {
      step2Errors.workSetupRemarks = "AI custom instructions cannot be empty.";
    }

    const questionsList = questions[0]?.questions || [];
    questionsList.forEach(q => {
      if (!q.title || q.title.trim().length === 0) {
        step2Errors[q.id] = "Question title cannot be empty.";
      }
    });

    // We only want to set errors for Step 2, preserving Step 1 errors
    setErrors(prev => {
      // Create a copy of previous errors
      const newErrors = { ...prev };
      
      // Remove old Step 2 errors
      Object.keys(newErrors).forEach(key => {
        if (key === 'workSetupRemarks' || key.startsWith('q_') || key.startsWith('custom_')) {
          delete newErrors[key];
        }
      });

      // Add new Step 2 errors
      return { ...newErrors, ...step2Errors };
    });

    return Object.keys(step2Errors).length === 0;
  };
  
  /**
   * --- UPDATED: Hooked validation into the save button ---
   */
  const confirmSaveCareer = async (status: "active" | "inactive") => {
    // --- 1. Validate first ---
    if (!validateStep1()) {
      console.log("Validation failed");
      return; // Stop if invalid
    }

    // --- 2. Proceed with saving if valid ---
    setIsLoading(true);
    console.log(`Saving career with status: ${status}`, careerData);
    
    return new Promise(resolve => {
      setTimeout(() => {
        if (!draftId) setDraftId(`mock-draft-${status}-id-456`);
        setIsLoading(false);
        console.log(`Career saved as ${status}!`);
        resolve(true);
      }, 1000);
    });
  };

  /**
   * --- UPDATED: Hooked validation into the 'Next' button ---
   */
  const handleNextStep = async () => {
    // --- 1. Validate the current step first ---
    let isValid = true;
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }

    // --- 2. If not valid, stop here. The toast was already shown. ---
    if (!isValid) {
      console.log("Validation failed, cannot move to next step.");
      return;
    }

    // 3. Save progress first
    await handleSaveDraft();

    // 4. Move to next step if not last step
    if (currentStep < 5) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (nextStep > maxAchievedStep) {
        setMaxAchievedStep(nextStep);
      }
      setErrors({});
    } else {
      // Logic for "Finish & Post" on the last step
      console.log("Finishing and posting career!");
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };


const renderStep = () => {
  switch (currentStep) {
    case 1:
      return (
        <Step1_Details
          careerData={careerData}
          setCareerData={setCareerData}
          errors={errors}
        />
      );
    case 2:
      return (
        <Step2_CVReview
          careerData={careerData}
          setCareerData={setCareerData}
          errors={errors}
        />
      );
    case 3:
      return (
        <Step3_AIInterview
          careerData={careerData}
          setCareerData={setCareerData}
        />
      );
    case 4:
      return (
        <Step4_Review
          careerData={careerData}
          setCurrentStep={setCurrentStep} 
        />
      );
    // case 2:
    // return <Step2_CVReview careerData={careerData} setCareerData={setCareerData} />;
    // ... other steps
    default:
      return (
        <Step1_Details
          careerData={careerData}
          setCareerData={setCareerData}
          errors={errors}
        />
      );
  }
};

  return (
    
    <div className="new-career-wizard" style={{  width: "100%" }}>
      {/* --- START: Your new header block --- */}
      <div style={{ marginBottom: "35px", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", border: '1px solid #D5D7DA' }}>
        <h1 style={{ fontSize: "24px", fontWeight: 550, color: "#111827" }}>
          {draftId ? (
            <span>
              {/* This span is ONLY for the grey text */}
              <span style={{ color: "#6B7280" }}>[DRAFT] </span>
              
              {/* This text will be the default h1 color (black) */}
              {careerData.jobTitle}
            </span>
          ) : (
            "Add new career"
          )}
        </h1>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
          <button
            // Simple check just to enable/disable button
            disabled={careerData.jobTitle.trim() === "" || isLoading}
            style={{ width: "fit-content", color: "#414651", background: "#fff", border: "1px solid #D5D7DA", padding: "8px 16px", borderRadius: "60px", cursor: (careerData.jobTitle.trim() === "" || isLoading) ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}
            onClick={() => {
              confirmSaveCareer("inactive");
            }}>
            Save as Unpublished
          </button>
          <button
            disabled={careerData.jobTitle.trim() === "" || isLoading}
            style={{ width: "fit-content", background: (careerData.jobTitle.trim() === "" || isLoading) ? "#D5D7DA" : "black", color: "#fff", border: "1px solid #E9EAEB", padding: "8px 16px", borderRadius: "60px", cursor: (careerData.jobTitle.trim() === "" || isLoading) ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}
            onClick={() => {
              confirmSaveCareer("active");
            }}>
            <i className="la la-check-circle" style={{ color: "#fff", fontSize: 20, marginRight: 8 }}></i>
            Save as Published
          </button>
        </div>
      </div>
      {/* --- END: Your new header block --- */}

      {/* --- START: Centered pill header --- */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          border: '1px solid #D5D7DA',
        }}
      >
        <SegmentedHeader
          currentStep={currentStep}
          maxAchievedStep={maxAchievedStep}
          setStep={setCurrentStep}
          errors={errors}
        />
      </div>
      {/* --- END: Centered pill header --- */}

      {/* The content for the current step */}
      <div className="p-8">
        {renderStep()}

        {/* Navigation buttons */}

    <div className="flex justify-end mt-8 border-t pt-6">
      {/* "Save Draft" button removed */}
      <div style={{ display: "flex", gap: "12px" }}>
        {/* "Back" button (Grey Style) */}
        <button
          onClick={handleBackStep}
          disabled={currentStep === 1 || isLoading}
          style={{
            width: "fit-content",
            color: (currentStep === 1 || isLoading) ? "#9CA3AF" : "#414651",
            background: "#fff",
            border: "1px solid #D5D7DA",
            padding: "10px 24px", // <-- MADE BIGGER
            borderRadius: "60px",
            cursor: (currentStep === 1 || isLoading) ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
            opacity: (currentStep === 1 || isLoading) ? 0.7 : 1,
            transition: "all 0.2s",
            fontSize: "15px", // <-- MADE BIGGER
            fontWeight: "700" // <-- MADE BIGGER
          }}
        >
          Back
        </button>

        {/* "Next / Finish" button (Black Style) */}
        <button
          onClick={handleNextStep}
          disabled={isLoading || Object.keys(errors).length > 0}
          style={{
            width: "fit-content",
            background: (isLoading || Object.keys(errors).length > 0) ? "#D5D7DA" : "black",
            color: "#fff",
            border: "1px solid",
            borderColor: (isLoading || Object.keys(errors).length > 0) ? "#D5D7DA" : "black",
            padding: "10px 24px", // <-- MADE BIGGER
            borderRadius: "60px",
            cursor: (isLoading || Object.keys(errors).length > 0) ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s",
            fontSize: "15px", // <-- MADE BIGGER
            fontWeight: "700" // <-- MADE BIGGER
          }}
        >
          {currentStep === 5 ? "Finish & Post" : "Next"}
          
          {/* Conditional Icon */}
          {currentStep === 5 ? (
            <i className="la la-check-circle" style={{ color: "#fff", fontSize: 18 }}></i>
          ) : (
            <i className="la la-arrow-right" style={{ color: "#fff", fontSize: 16 }}></i>
          )}
        </button>
      </div>
    </div>
      </div>
    </div>
  );
}

// --- UPDATED: 'errors' prop removed ---
export interface CareerStepProps {
  careerData: CareerData;
  setCareerData: Dispatch<SetStateAction<CareerData>>; 
  errors?: WizardErrors;
}
