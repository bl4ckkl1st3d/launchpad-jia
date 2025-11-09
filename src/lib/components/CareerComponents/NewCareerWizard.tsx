// src/lib/components/CareerComponents/NewCareerWizard.tsx

"use client";

import { useState, Dispatch, SetStateAction, useEffect } from "react";
import axios from "axios";
// Import the pill-style header you requested
import SegmentedHeader from "./SegmentedHeader";
// Import the component for the first step
import Step1_Details from "../CareerSteps/Step1_Details";
import Step2_CVReview from "../CareerSteps/Step2_CVReview";
import Step3_AIInterview from "../CareerSteps/Step3_AIInterview";
import Step4_Review from "../CareerSteps/Step4_Review";
import { useAppContext } from "@/lib/context/AppContext";
import { errorToast, candidateActionToast } from "@/lib/Utils";


// We create a new, comprehensive interface for all steps
export interface CareerData {
  _id?: string;
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
  customInterviewQuestions: any[];
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
  customInterviewQuestions: [],
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

export interface Step3Errors {
  [key: string]: string | undefined;
}

export type WizardErrors = Step1Errors & Step2Errors & Step3Errors;

export default function NewCareerWizard() {
  const { user, orgID } = useAppContext();
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
    } else if (currentStep === 3) {
      validateStep3();
    }
  }, [careerData, currentStep]);

  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      const dataToSave = {
        ...careerData,
        _id: draftId,
        minimumSalary: isNaN(Number(careerData.minimumSalary)) ? null : Number(careerData.minimumSalary),
        maximumSalary: isNaN(Number(careerData.maximumSalary)) ? null : Number(careerData.maximumSalary),
      };
      const payload = {
        careerData: dataToSave,
        orgID,
        user: { image: user.image, name: user.name, email: user.email },
      };

      console.log("Attempting to save draft with payload:", JSON.stringify(payload, null, 2));

      const response = await axios.put("/api/career-data", payload);

      if (response.data.success) {
        if (!draftId) {
          setDraftId(response.data.id);
          // Update careerData with the new ID without triggering a re-render loop
          setCareerData(prev => ({...prev, _id: response.data.id})); 
        }
        console.log("Draft saved successfully!", response.data);
      } else {
        console.error("Draft save was not successful:", response.data);
      }
    } catch (error) {
      console.error("An error occurred while saving the draft.");
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          console.error("Error response headers:", error.response.headers);
        } else if (error.request) {
          console.error("Error request:", error.request);
        }
      } else {
        console.error("Non-Axios error:", error);
      }
      errorToast("Failed to save draft", 1500);
    } finally {
      setIsLoading(false);
    }
  };

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
    console.log("Running validation for Step 2...");
    const { workSetupRemarks, questions } = careerData;
    const step2Errors: Step2Errors = {};

    console.log("Current workSetupRemarks:", workSetupRemarks);
    if (!workSetupRemarks || workSetupRemarks.trim().length === 0) {
      step2Errors.workSetupRemarks = "AI custom instructions cannot be empty.";
      console.log("Validation error: AI custom instructions are empty.");
    }

    const questionsList = questions[0]?.questions || [];
    console.log("Current CV Validation questions:", questionsList);
    questionsList.forEach(q => {
      console.log(`Validating question id: ${q.id}`, q);
      if (!q.title || q.title.trim().length === 0) {
        step2Errors[q.id] = "Question title cannot be empty.";
        console.log(`Validation error: Question with id ${q.id} has an empty title.`);
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

    const isValid = Object.keys(step2Errors).length === 0;
    console.log("Step 2 validation complete. Is valid:", isValid, "Errors:", step2Errors);
    return isValid;
  };

  const validateStep3 = () => {
    const { customInterviewQuestions } = careerData;
    const step3Errors: Step3Errors = {};
    let emptyCount = 0;

    if (customInterviewQuestions) {
      customInterviewQuestions.forEach((q, index) => {
        if (!q.text || q.text.trim().length === 0) {
          emptyCount++;
          step3Errors[`customInterviewQuestion_${index}`] = "Question text cannot be empty.";
        }
      });
    }

    if (!customInterviewQuestions || customInterviewQuestions.length < 5) {
      step3Errors.customInterviewQuestions = "At least 5 custom interview questions are required.";
    } else if (emptyCount > 0) {
      step3Errors.customInterviewQuestions = `You have ${emptyCount} question(s) with an empty text.`;
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      // remove old step 3 errors
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith('customInterviewQuestion')) {
          delete newErrors[key];
        }
      });
      return { ...newErrors, ...step3Errors };
    });

    return Object.keys(step3Errors).length === 0;
  };
  
  const handleSaveCareer = async (status: "active" | "inactive") => {
    console.log(`Attempting to save career with status: ${status}`);
    const isStep1Valid = validateStep1();
    const isStep2Valid = validateStep2();
    const isStep3Valid = validateStep3();
    console.log(`Validation results - Step 1: ${isStep1Valid}, Step 2: ${isStep2Valid}, Step 3: ${isStep3Valid}`);

    if (!isStep1Valid || !isStep2Valid || !isStep3Valid) {
      console.log("Validation failed in handleSaveCareer. Aborting save.");
      errorToast("Please fill out all required fields before publishing.", 1500);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        careerData: { ...careerData, _id: draftId },
        orgID,
        user: { image: user.image, name: user.name, email: user.email },
        status,
      };
      const response = await axios.patch("/api/career-data", payload);

      if (response.data.success) {
        candidateActionToast(
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, marginLeft: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#181D27" }}>Career {status === "active" ? "published" : "saved"}!</span>
          </div>,
          1300, 
      <i className="la la-check-circle" style={{ color: "#039855", fontSize: 32 }}></i>);
        setTimeout(() => {
          window.location.href = `/recruiter-dashboard/careers`;
        }, 1300);
      }
    } catch (error) {
      console.error("Failed to save career", error);
      errorToast("Failed to save career",1500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndNext = async () => {
    console.log(`"Save and Next" clicked on step ${currentStep}`);
    let isValid = true;
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    } else if (currentStep === 3) {
      isValid = validateStep3();
    }

    if (!isValid) {
      console.log(`Validation failed for step ${currentStep}. Cannot move to next step.`);
      return;
    }

    if (currentStep === 4) {
      await handleSaveCareer("active");
    } else {
      await handleSaveDraft();
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (nextStep > maxAchievedStep) {
        setMaxAchievedStep(nextStep);
      }
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
          errors={errors}
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
              <span style={{ color: "#6B7280" }}>[DRAFT] </span>
              {careerData.jobTitle}
            </span>
          ) : (
            "Add new career"
          )}
        </h1>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
          <button
            disabled={careerData.jobTitle.trim() === "" || isLoading}
            style={{ width: "fit-content", color: "#414651", background: "#fff", border: "1px solid #D5D7DA", padding: "8px 16px", borderRadius: "60px", cursor: (careerData.jobTitle.trim() === "" || isLoading) ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}
            onClick={() => {
              handleSaveCareer("inactive");
            }}>
            Save as Unpublished
          </button>
          <button
            disabled={careerData.jobTitle.trim() === "" || isLoading}
            style={{ width: "fit-content", background: (careerData.jobTitle.trim() === "" || isLoading) ? "#D5D7DA" : "black", color: "#fff", border: "1px solid #E9EAEB", padding: "8px 16px", borderRadius: "60px", cursor: (careerData.jobTitle.trim() === "" || isLoading) ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}
            onClick={handleSaveAndNext}>
            {currentStep === 4 ? (
              <>
                <i className="la la-check-circle" style={{ color: "#fff", fontSize: 20, marginRight: 8 }}></i>
                Save as Published
              </>
            ) : (
              <>
                Save and Next
                <i className="la la-arrow-right" style={{ color: "#fff", fontSize: 16, marginLeft: 8 }}></i>
              </>
            )}
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
