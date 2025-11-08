// src/lib/components/CareerSteps/Step2_CVReview.tsx
"use client";

import { useEffect, useState } from "react";
import { CareerStepProps } from "../CareerComponents/NewCareerWizard";
import CustomDropdown from "../CareerComponents/CustomDropdown";
// --- 1. Import the new QuestionBuilder component ---
import QuestionBuilder from "../CareerComponents/QuestionBuilder";

// Import styles
import "./Step1_Details.scss";
import "./Step2_CVReview.scss";
import "../CareerComponents/QuestionBuilder.scss"; // Import the new styles

// --- Screening Filter Options ---
const screeningOptions = [
  { name: "Good Fit and Above", icon: "la la-check" },
  { name: "Only Strong Fit", icon: "la la-check-double" },
  { name: "No Automatic Promotion", icon: "la la-times" },
];

// --- 2. Suggested Questions static data ---
const initialSuggestedQuestions = [
  {
    id: "notice_period",
    name: "Notice Period",
    desc: "How long is your notice period?",
    // This is the pre-built question object that gets added
    questionData: {
      id: "q_notice", // A unique-ish ID
      title: "How long is your notice period?",
      type: "Dropdown",
      options: ["Immediately", "< 30 days", "> 30 days"],
    },
  },
  {
    id: "work_setup",
    name: "Work Setup",
    desc: "Are you willing to report to the office when required?",
    questionData: {
      id: "q_work_setup",
      title: "How often are you willing to report to the office?",
      type: "Dropdown",
      options: [
        "At most 1-2x a week",
        "At most 3-4x a week",
        "Open to fully onsite work",
        "Only open to fully remote work",
      ],
    },
  },
  {
    id: "asking_salary",
    name: "Asking Salary",
    desc: "How much is your expected monthly salary?",
    questionData: {
      id: "q_salary",
      title: "How much is your expected monthly salary?",
      type: "Range",
      options: [], // Range doesn't use options
    },
  },
];

export default function Step2_CVReview({
  careerData,
  setCareerData,
  errors = {},
}: CareerStepProps) {


  const [suggestedQuestions, setSuggestedQuestions] = useState(
    initialSuggestedQuestions
  );

  // --- 4. Get the *actual* list of questions ---
  // We'll use the first category in the array for all our questions
  const questionsList = careerData.questions[0]?.questions || [];

  // --- Handlers ---

  const handleScreeningChange = (selectedName: string) => {
    setCareerData(prev => ({ ...prev, screeningSetting: selectedName }));
  };

  const handleInstructionsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    setCareerData(prev => ({ ...prev, workSetupRemarks: value }));
  };

  // --- 5. New Question Handlers ---

  const updateQuestionsList = (newQuestionsList) => {
    // This is complex because we must update the parent's nested array
    setCareerData(prev => {
      // Create a deep copy of the questions array
      const newQuestionsCategories = JSON.parse(JSON.stringify(prev.questions));
      // Ensure the first category exists
      if (!newQuestionsCategories[0]) {
        newQuestionsCategories[0] = {
          id: 1,
          category: "Pre-Screening Questions",
          questions: [],
        };
      }
      // Update the inner questions list
      newQuestionsCategories[0].questions = newQuestionsList;
      // Return the new state
      return { ...prev, questions: newQuestionsCategories };
    });
  };

  const handleAddCustom = () => {
    const newQuestion = {
      id: `custom_${Date.now()}`, // Simple unique ID
      title: "",
      type: "Dropdown",
      options: ["Option 1"],
    };
    updateQuestionsList([...questionsList, newQuestion]);
  };
  
  const handleAddSuggested = (suggestedQuestion) => {
    // Check if it's already added
    if (questionsList.find(q => q.id === suggestedQuestion.questionData.id)) {
      return; 
    }
    // Add the pre-built question to the list
    updateQuestionsList([...questionsList, suggestedQuestion.questionData]);
  };

  const handleDeleteQuestion = (questionId) => {
    const newQuestionsList = questionsList.filter(q => q.id !== questionId);
    updateQuestionsList(newQuestionsList);
  };
  
  const handleUpdateQuestion = (questionId, newQuestionData) => {
    const newQuestionsList = questionsList.map(q => 
      q.id === questionId ? { ...q, ...newQuestionData } : q
    );
    updateQuestionsList(newQuestionsList);
  };

  return (
    <div className="step1-container">
      {/* --- Left Column --- */}
      <div className="step1-container__main">
        {/* --- 1. CV Screening Card --- */}
        <div className="card-block">
          {/* ... (This card is unchanged from the previous step) ... */}
          <div className="card-block__header">
            <span className="card-block__title">CV Screening Setting</span>
          </div>
          <div className="card-block__content">
            <div className="form-section" style={{ position: 'relative', zIndex: 2 }}>
              <h3 className="form-section__title">Screening Filter</h3>
              <p className="form-section__description">
                Automatically screen CVs that meet the threshold you set.
              </p>
              <div style={{ width: "320px" }}>
                <CustomDropdown
                  settingList={screeningOptions}
                  screeningSetting={careerData.screeningSetting}
                  onSelectSetting={handleScreeningChange}
                  placeholder="Choose screening filter"
                />
              </div>
            </div>
            <div className="divider" />
            <div className="form-section" style={{ position: 'relative', zIndex: 1 }}>
              <h3 className="form-section__title-with-icon">
                <i className="la la-quote-left gradient-icon"></i>
                <span>AI Custom Instructions</span>
              </h3>
              <p className="form-section__description">
                Guide the AI by providing specific instructions, keywords, or
                criteria to look for in CVs.
              </p>
              <textarea
                className="form-textarea"
                placeholder="e.g., “Prioritize candidates with 3+ years of startup experience”..."
                value={careerData.workSetupRemarks}
                onChange={handleInstructionsChange}
                rows={5}
              />
              {errors.workSetupRemarks && (
                <p
                  style={{ color: "#f00", marginTop: "5px", fontSize: "14px" }}
                >
                  {errors.workSetupRemarks}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* --- 2. Pre-Screening Questions Card (CHANGED) --- */}
        <div className="card-block">
          <div className="card-block__header card-block__header--with-button">
            <div className="card-block__title-wrapper">
              <span className="card-block__title">Pre-Screening Questions</span>
              <span className="badge">{questionsList.length}</span>
            </div>
            <button className="btn-primary-small" onClick={handleAddCustom}>
              <i className="la la-plus"></i>
              Add custom
            </button>
          </div>
          
          <div className="card-block__content">
            {/* --- 6. Render the list of added questions --- */}
            <div className="question-builder-list">
              {questionsList.map(question => (
                <div key={question.id} className="question-item-wrapper">
                  <QuestionBuilder
                    initialQuestion={question}
                    onUpdate={handleUpdateQuestion}
                    onDelete={handleDeleteQuestion}
                  />
                  {errors[question.id] && (
                    <p style={{ color: '#f00', marginTop: '5px', fontSize: '14px' }}>
                      {errors[question.id]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* --- 7. Render the Suggested Questions section --- */}
            <div className="suggested-questions-container">
              <h3 className="suggested-questions-title">
                Suggested Pre-screening Questions:
              </h3>
              <div className="suggested-questions-list">
                {suggestedQuestions.map(sug => {
                  const isAdded = questionsList.find(q => q.id === sug.questionData.id);
                  return (
                    <div className="suggested-question-item" key={sug.id}>
                      <div className="suggested-question-info">
                        <span className="suggested-question-name">{sug.name}</span>
                        <span className="suggested-question-desc">{sug.desc}</span>
                      </div>
                      <button
                        className={`btn-add-suggested ${isAdded ? "btn-add-suggested--added" : ""}`}
                        onClick={() => handleAddSuggested(sug)}
                        disabled={isAdded}
                      >
                        {isAdded ? "Added" : "Add"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Right Column (Tips) --- */}
      <div className="step1-container__sidebar">
        <div className="card-block card-block--tips card-block--shadow-inner">
          <div className="card-block__header">
            <i className="la la-lightbulb gradient-icon"></i>
            <span className="card-block__title">Tips</span>
          </div>
          <div className="card-block__content">
            <p className="tips-card__text">
              <strong>Refine the AI screening</strong> by providing clear,
              concise instructions. Focus on non-negotiable skills, keywords, or
              experiences.
              <br />
              <br />
              <strong>Add custom questions</strong> to evaluate skills that are
              difficult to assess from a CV alone, such as problem-solving or
              behavioral traits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


{/* --- Right Column (Tips) --- */}
      {/*  */}