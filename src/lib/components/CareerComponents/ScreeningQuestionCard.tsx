// src/lib/components/CareerComponents/ScreeningQuestionCard.tsx
"use client";

// --- CHANGE THIS IMPORT ---
import "./ScreeningQuestionCard.scss"; // Use the new SCSS file
// --- END OF CHANGE ---

// This component renders a single question for an applicant to answer
export default function ScreeningQuestionCard({ question, value, onChange }) {
  
  const renderInput = () => {
    switch (question.type) {
      case "Short Answer":
        return (
          <div className="form-group" style={{ maxWidth: '320px' }}>
            <input
              type="text"
              className="input-base"
              placeholder="Your answer..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        );

      case "Long Answer":
        return (
          <div className="form-group">
            <textarea
              className="input-base"
              placeholder="Your answer..."
              rows={4}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        );

      case "Dropdown":
        return (
          <div className="form-group" style={{ maxWidth: '320px' }}>
            <div className="select-wrapper">
              <select 
                className="input-base" 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
              >
                <option value="">Select an option</option>
                {question.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="chevron-icon"></div>
            </div>
          </div>
        );

      case "Checkboxes":
        return (
          <div className="form-group">
            <div className="checkbox-group">
              {question.options.map((option, index) => (
                <label key={index} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={!!value[option]}
                    onChange={(e) => {
                      const newValue = { ...value, [option]: e.target.checked };
                      onChange(newValue);
                    }}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        );
      
      case "Range":
        return (
          <div className="range-inputs">
            <div className="form-group">
              <label className="form-label">Minimum</label>
              <div className="salary-input-wrapper">
                <span className="salary-input-wrapper__currency">₱</span>
                <input
                  type="number"
                  placeholder="e.g., 40,000"
                  // Note: Range value should be an object { min: '', max: '' }
                  value={value?.min || ''}
                  onChange={(e) => onChange({ ...value, min: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Maximum</label>
              <div className="salary-input-wrapper">
                <span className="salary-input-wrapper__currency">₱</span>
                <input
                  type="number"
                  placeholder="e.g., 60,000"
                  value={value?.max || ''}
                  onChange={(e) => onChange({ ...value, max: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      default:
        return <p>Error: Unknown question type "{question.type}"</p>;
    }
  };

  return (
    <div className="screening-question-card">
      <div className="card-inner-wrapper">
        <div className="card-header">
          <h3 className="card-title">
            {question.title}
            {question.isRequired && <span className="required-asterisk"> *</span>}
          </h3>
          {/* You can add buttons or other elements here */}
        </div>
        <div className="card-body">
          {renderInput()}
        </div>
      </div>
    </div>
  );
}