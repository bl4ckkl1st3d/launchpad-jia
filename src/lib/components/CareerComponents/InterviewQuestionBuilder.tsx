// src/lib/components/CareerComponents/InterviewQuestionBuilder.tsx
"use client";
import React, { useState, useMemo } from "react";
import "./InterviewQuestionBuilder.scss"; // New SCSS file
import InterviewQuestionModal from "./InterviewQuestionModal"; // Using your existing modal

// Define the categories
type QuestionCategory =
  | "CV Validation / Experience"
  | "Technical"
  | "Behavioral"
  | "Analytical"
  | "Others";

// Define the shape of a question
interface Question {
  id: number;
  text: string;
  category: QuestionCategory;
}

// Props for the component
interface InterviewQuestionBuilderProps {
  customQuestions: Question[];
  setCustomQuestions: (questions: Question[]) => void;
  jobDescription: string;
  orgId: string;
}

const CATEGORIES: QuestionCategory[] = [
  "CV Validation / Experience",
  "Technical",
  "Behavioral",
  "Analytical",
  "Others",
];

const InterviewQuestionBuilder: React.FC<InterviewQuestionBuilderProps> = ({
  customQuestions = [],
  setCustomQuestions,
  jobDescription,
  orgId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  // State to track which category to add a new question to
  const [categoryToAdd, setCategoryToAdd] = useState<QuestionCategory | null>(
    null
  );
  const [modalAction, setModalAction] = useState<"add" | "edit" | "delete">(
    "add"
  );

  const totalQuestions = customQuestions.length;

  // --- Handlers ---
  const handleManuallyAdd = (category: QuestionCategory) => {
    setEditingQuestion(null);
    setCategoryToAdd(category);
    setModalAction("add"); 
    setIsModalOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setCategoryToAdd(null);
    setModalAction("edit");
    setIsModalOpen(true);
  };

  const handleDeleteQuestion = (question: Question) => {
    setEditingQuestion(question); // Set the question context
    setModalAction("delete");     // Set action
    setIsModalOpen(true);         // Open modal
  };

const handleModalAction = (
    action: string,
    groupId?: number,
    questionText?: string,
    questionId?: number // This ID is passed from the modal for edit/delete
  ) => {
    // Note: The modal doesn't support categories yet.
    // When adding, we use the 'categoryToAdd' state.
    if (action === "add" && questionText && categoryToAdd) {
      // Add new question to the correct category
      const newQuestion: Question = {
        id: Date.now(),
        text: questionText,
        category: categoryToAdd, // Use the saved category
      };
      setCustomQuestions([...customQuestions, newQuestion]);
    } else if (action === "edit" && questionText && questionId) {
      // Edit existing question
      setCustomQuestions(
        customQuestions.map((q) =>
          q.id === questionId ? { ...q, text: questionText } : q
        )
      );
    } else if (action === "delete" && questionId) {
      // Delete existing question
      setCustomQuestions(customQuestions.filter((q) => q.id !== questionId));
    }

    // Close modal and reset states (this now works for "cancel" too, as action="")
    setIsModalOpen(false);
    setEditingQuestion(null);
    setCategoryToAdd(null);
  };

  const handleGenerateQuestions = async (category: QuestionCategory) => {
    // Placeholder function
    setIsGenerating(true);
    console.log(`Generating AI questions for: ${category}`);
    await new Promise((res) => setTimeout(res, 1500));
    // Here you would add the new questions to state
    // const newQuestions = ...
    // setCustomQuestions(prev => [...prev, ...newQuestions]);
    setIsGenerating(false);
  };

  // Helper to render a question section
  const renderQuestionSection = (category: QuestionCategory) => {
    // Filter questions for this category
    const questions = customQuestions.filter((q) => q.category === category);

    return (
      <div className="iqb-section" key={category}>
        {/* Section Header with Title and Buttons */}
        <div className="iqb-section-header">
          <h3 className="iqb-section-title">{category}</h3>
        </div>

        {/* List of questions for this category */}
        <div className="iqb-question-list">
          {questions.length > 0 ? (
            questions.map((question) => (
              <div key={question.id} className="iqb-question-item">
                <p className="iqb-question-text">{question.text}</p>
                <div className="iqb-question-item-actions">
                  <button
                    className="btn-secondary-small"
                    onClick={() => handleEditQuestion(question)}
                  >
                    <i className="la la-edit"></i> Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteQuestion(question)}
                  >
                    <i className="la la-trash"></i>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="iqb-no-questions">
              No questions added for this category.
            </p>
          )}
        </div>
        <div className="iqb-section-actions">
          <button
            className="btn-primary-small"
            onClick={() => handleGenerateQuestions(category)}
            disabled={isGenerating}
          >
            <i className="la la-magic"></i>
            {isGenerating ? "Generating..." : "Generate Questions"}
          </button>
          <button
            className="btn-secondary-small"
            onClick={() => handleManuallyAdd(category)}
          >
            <i className="la la-plus-circle"></i>
            Manually Add
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="iqb-container">
      {/* --- Top Warning --- */}
      {totalQuestions < 5 && (
        <div className="iqb-warning">
          <i className="la la-exclamation-triangle"></i>{" "}
          {/* Using icon from figma spec */}
          <span>You must add at least 5 questions.</span>
        </div>
      )}

      {/* --- Main Content (Categories) --- */}
      <div className="iqb-main-content">
        {/* --- Map to include dividers --- */}
        {CATEGORIES.map((category, index) => (
          <React.Fragment key={category}>
            {renderQuestionSection(category)}
            {/* Add a divider after every section, as per figma */}
            <hr className="divider" />
          </React.Fragment>
        ))}
      </div>

      {/* --- Total Questions Footer --- */}
      <div className="iqb-footer">
        <div className="iqb-total-container">
          <span className="iqb-total-label">Total Questions</span>
          <input
            type="text"
            className="iqb-total-input"
            value={totalQuestions}
            disabled
          />
        </div>
      </div>

      {/* --- Modal for Add/Edit --- */}
      {isModalOpen && (
        <InterviewQuestionModal
          groupId={1}
          questionToEdit={
            editingQuestion
              ? { id: editingQuestion.id, question: editingQuestion.text }
              : undefined
          }
          action={modalAction}
          onAction={handleModalAction}
        />
      )}
    </div>
  );
};

export default InterviewQuestionBuilder;
