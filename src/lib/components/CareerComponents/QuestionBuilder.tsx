// src/lib/components/CareerComponents/QuestionBuilder.tsx
"use client";

import { useState } from "react";
import "./QuestionBuilder.scss";

// ---
// This component is complex.
// It manages its own internal state for the question title, type, and options.
// It receives the initial question data as a prop ('initialQuestion').
// It receives a function 'onUpdate' to save changes to the parent.
// It receives a function 'onDelete' to delete itself.
// ---
export default function QuestionBuilder({
  initialQuestion,
  onUpdate,
  onDelete,
}) {
  const [title, setTitle] = useState(initialQuestion.title || "");
  const [type, setType] = useState(initialQuestion.type || "Dropdown");
  const [options, setOptions] = useState(initialQuestion.options || ["Option 1"]);

  // --- Handlers for this specific question card ---

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    // TODO: Add a debounce here later so it doesn't fire on every keystroke
    onUpdate(initialQuestion.id, { title: e.target.value, type, options });
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
    onUpdate(initialQuestion.id, { title, type: newType, options });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    onUpdate(initialQuestion.id, { title, type, options: newOptions });
  };

  const handleAddOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`];
    setOptions(newOptions);
    onUpdate(initialQuestion.id, { title, type, options: newOptions });
  };

  const handleDeleteOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    onUpdate(initialQuestion.id, { title, type, options: newOptions });
  };

  // --- Icons for the dropdown ---
  const typeIcons = {
    Dropdown: "la-chevron-circle-down",
    "Short Answer": "la-font",
    "Long Answer": "la-align-left",
    Checkboxes: "la-check-square",
    Range: "la-sliders-h",
  };

  return (
    <div className="question-builder-container">

      {/* Main Card */}
      <div className="question-card">
        {/* Card Header: Question Title + Type Dropdown */}
        <div className="question-card-header">
          <input
            type="text"
            className="question-title-input"
            placeholder="Write your question..."
            value={title}
            onChange={handleTitleChange}
          />
          <div className="select-wrapper" style={{ width: "232px" }}>
            <select value={type} onChange={handleTypeChange}>
              <option value="Dropdown">Dropdown</option>
              <option value="Short Answer">Short Answer</option>
              <option value="Long Answer">Long Answer</option>
              <option value="Checkboxes">Checkboxes</option>
              <option value="Range">Range</option>
            </select>
            {/* You can add an icon here if you want */}
            <i className={`la ${typeIcons[type]} select-icon-prefix`}></i>
            <svg
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="#717680"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Card Body: Options or Range */}
        <div className="question-card-body">
          {/* Show this for Dropdown or Checkboxes */}
          {(type === "Dropdown" || type === "Checkboxes") && (
            <div className="question-options-list">
              {options.map((option, index) => (
                <div className="question-option-item" key={index}>
                  <span className="question-option-number">{index + 1}</span>
                  <input
                    type="text"
                    className="question-option-input"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                  <button
                    className="btn-icon-delete"
                    onClick={() => handleDeleteOption(index)}
                  >
                    <i className="la la-times"></i>
                  </button>
                </div>
              ))}
              <button className="btn-add-option" onClick={handleAddOption}>
                <i className="la la-plus"></i> Add Option
              </button>
            </div>
          )}

          {/* Show this for Range */}
          {type === "Range" && (
            <div className="question-range-inputs">
              <div className="form-group" style={{ flex: 1 }}>
                <label>Minimum</label>
                <div className="salary-input-wrapper">
                  <span className="salary-input-wrapper__currency">₱</span>
                  <input type="number" placeholder="e.g., 40,000" />
                  <span className="salary-input-wrapper__suffix">PHP</span>
                </div>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Maximum</label>
                <div className="salary-input-wrapper">
                  <span className="salary-input-wrapper__currency">₱</span>
                  <input type="number" placeholder="e.g., 60,000" />
                  <span className="salary-input-wrapper__suffix">PHP</span>
                </div>
              </div>
            </div>
          )}

          {/* --- ADD THIS BLOCK --- */}
        {/* Show this for Short Answer */}
        {type === "Short Answer" && (
          <div className="question-answer-placeholder">
            <input
              type="text"
              className="question-text-input"
              placeholder="Short answer text"
              disabled
            />
          </div>
        )}

        {/* --- ADD THIS BLOCK --- */}
        {/* Show this for Long Answer */}
        {type === "Long Answer" && (
          <div className="question-answer-placeholder">
            <textarea
              className="question-textarea-input"
              placeholder="Long answer text"
              rows={3}
              disabled
            />
          </div>
        )}
        {/* --- END OF ADDED BLOCKS --- */}

        </div>

        {/* Card Footer: Delete Question Button */}
        <div className="question-card-footer">
          <button className="btn-delete-question" onClick={() => onDelete(initialQuestion.id)}>
            <i className="la la-trash"></i> Delete Question
          </button>
        </div>
      </div>
    </div>
  );
}