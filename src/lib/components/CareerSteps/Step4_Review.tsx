import React, { useState } from "react";
import "./Step4_Review.scss"; // Re-uses the SCSS file
import type { CareerData } from "../CareerComponents/NewCareerWizard";

// 1. Import the location data
import philippineCitiesAndProvinces from "../../../../public/philippines-locations.json";

// Helper component for a single Label/Value field
const ReviewField: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="review-field">
    <label>{label}</label>
    <div className="review-text">{value || "N/A"}</div>
  </div>
);

// Define the component props
interface Step4Props {
  careerData: CareerData;
  setCurrentStep: (step: number) => void;
}

const Step4_Review: React.FC<Step4Props> = ({ careerData, setCurrentStep }) => {
  // State for collapsible cards
  const [isCard1Open, setIsCard1Open] = useState(true);
  const [isCard2Open, setIsCard2Open] = useState(true);
  const [isCard3Open, setIsCard3Open] = useState(true);

  // Helper to format the salary range
  const formatSalary = () => {
    const min = careerData.minimumSalary || 0;
    const max = careerData.maximumSalary || 0;

    if (careerData.salaryNegotiable) {
      return "Negotiable";
    }
    if (!min && !max) {
      return "N/A";
    }
    // --- UPDATED: Changed $ to ₱ ---
    return `₱${min} - ₱${max}`;
  };

  // Helper to find the full province name from the key
  const getFullProvinceName = () => {
    if (!careerData.province) return "N/A";

    const province = philippineCitiesAndProvinces.provinces.find(
      (p: { key: string }) => p.key === careerData.province
    );

    return province ? province.name : careerData.province;
  };

  return (
    <div className="step-review-container">
      {/* --- CARD 1: Career Details --- */}
      <div className="review-card">
        <div className="review-card-header">
          <div className="header-left">
            <button
              className="collapse-button"
              aria-expanded={isCard1Open}
              onClick={() => setIsCard1Open(!isCard1Open)}
            >
              {/* --- UPDATED: Icon --- */}
              <i
                className={
                  isCard1Open
                    ? "la la-chevron-circle-down"
                    : "la la-chevron-circle-right"
                }
              />
            </button>
            <h3>Career Details</h3>
          </div>
          <button
            className="review-edit-button"
            aria-label="Edit Career Details"
            onClick={() => setCurrentStep(1)}
          />
        </div>

        {isCard1Open && (
          <div className="review-card-content">
            {/* Job Title */}
            <div className="review-grid full-width">
              <ReviewField label="Job Title" value={careerData.jobTitle} />
            </div>
            <hr className="review-divider" />

            {/* Employment & Work Arrangement */}
            <div className="review-grid">
              <ReviewField
                label="Employment Type"
                value={careerData.employmentType}
              />
              <ReviewField
                label="Work Arrangement"
                value={careerData.workSetup}
              />
              <div></div> {/* Empty spacer */}
            </div>
            <hr className="review-divider" />

            {/* Location fields */}
            <div className="review-grid">
              <ReviewField label="Country" value={careerData.country} />
              <ReviewField
                label="State/Province"
                value={getFullProvinceName()}
              />
              <ReviewField label="City" value={careerData.city} />
            </div>
            <hr className="review-divider" />

            {/* --- UPDATED: Changed $ to ₱ --- */}
            <div className="review-grid">
              <ReviewField
                label="Minimum Salary"
                value={
                  careerData.minimumSalary
                    ? `₱${careerData.minimumSalary}`
                    : "N/A"
                }
              />
              <ReviewField
                label="Maximum Salary"
                value={
                  careerData.maximumSalary
                    ? `₱${careerData.maximumSalary}`
                    : "N/A"
                }
              />
              <ReviewField label="Salary" value={formatSalary()} />
            </div>
            <hr className="review-divider" />

            {/* Job Description */}
            <div className="review-field">
              <label>Job Description</label>
              <div
                className="job-description-preview"
                dangerouslySetInnerHTML={{
                  __html:
                    careerData.description || "<p>No description provided.</p>",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* --- CARD 2: CV Review and Pre-Screening Questions --- */}
      <div className="review-card">
        <div className="review-card-header">
          <div className="header-left">
            <button
              className="collapse-button"
              aria-expanded={isCard2Open}
              onClick={() => setIsCard2Open(!isCard2Open)}
            >
              {/* --- UPDATED: Icon --- */}
              <i
                className={
                  isCard2Open
                    ? "la la-chevron-circle-down"
                    : "la la-chevron-circle-right"
                }
              />
            </button>
            <h3>CV Review and Pre-Screening Questions</h3>
          </div>
          <button
            className="review-edit-button"
            aria-label="Edit CV Review Settings"
            onClick={() => setCurrentStep(2)}
          />
        </div>

        {isCard2Open && (
          <div className="review-card-content">
            <div className="review-grid full-width">
              <ReviewField
                label="CV Screening"
                value={careerData.screeningSetting}
              />
            </div>
            <hr className="review-divider" />
            <div className="review-field">
              <label>CV Secret Prompt</label>
              <p
                className="review-text"
                style={{ fontStyle: "italic", color: "#555" }}
              >
                {careerData.workSetupRemarks ||
                  "No custom instructions provided."}
              </p>
            </div>
            <hr className="review-divider" />
            <div className="review-field">
              <label>Pre-Screening Questions</label>
              {careerData.questions[0]?.questions.length > 0 ? (
                <ol style={{ paddingLeft: "20px", margin: 0, width: "100%" }}>
                  {careerData.questions[0].questions.map((q: any) => (
                    <li
                      key={q.id}
                      className="review-text"
                      style={{ marginBottom: "8px" }}
                    >
                      {q.title}
                    </li>
                  ))}
                </ol>
              ) : (
                <p>No custom questions added.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- CARD 3: AI Interview Setup --- */}
      <div className="review-card">
        <div className="review-card-header">
          <div className="header-left">
            <button
              className="collapse-button"
              aria-expanded={isCard3Open}
              onClick={() => setIsCard3Open(!isCard3Open)}
            >
              {/* --- UPDATED: Icon --- */}
              <i
                className={
                  isCard3Open
                    ? "la la-chevron-circle-down"
                    : "la la-chevron-circle-right"
                }
              />
            </button>
            <h3>AI Interview Setup</h3>
          </div>
          <button
            className="review-edit-button"
            aria-label="Edit AI Interview Setup"
            onClick={() => setCurrentStep(1)} // 'Require Video' is on Step 1
          />
        </div>

        {isCard3Open && (
          <div className="review-card-content">
            <div className="review-grid">
              <ReviewField
                label="AI Interview Screening"
                value={careerData.screeningSetting}
              />
              <ReviewField
                label="Require Video on Interview"
                value={careerData.requireVideo ? "Yes" : "No"}
              />
            </div>
            <hr className="review-divider" />
            <div className="review-field">
              <label>AI Interview Secret Prompt</label>
              <p
                className="review-text"
                style={{ fontStyle: "italic", color: "#555" }}
              >
                {careerData.workSetupRemarks ||
                  "No custom instructions provided."}
              </p>
            </div>
            <hr className="review-divider" />
            <div className="review-field">
              <label>Interview Questions</label>
              {careerData.customInterviewQuestions &&
              careerData.customInterviewQuestions.length > 0 ? (
                <ol style={{ paddingLeft: "20px", margin: 0, width: "100%" }}>
                  {careerData.customInterviewQuestions.map((q: any) => (
                    <li
                      key={q.id}
                      className="review-text"
                      style={{ marginBottom: "8px" }}
                    >
                      {q.text}
                    </li>
                  ))}
                </ol>
              ) : (
                <p>No custom questions added.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step4_Review;
