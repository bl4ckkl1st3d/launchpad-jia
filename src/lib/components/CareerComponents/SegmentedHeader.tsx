// src/lib/components/CareerComponents/SegmentedHeader.tsx

"use client";
import React from "react";
// Import the SASS module
import styles from "./SegmentedHeader.module.scss";

/**
 * A simple SVG checkmark icon to display inside the completed steps.
 */
const CheckIcon = () => (
  <svg
    className={styles.checkIcon} // Added a class to target this
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 3L4.5 8.5L2 6"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


/**
 * A new SVG error icon (red warning triangle).
 */
const ErrorIcon = () => (
  <svg
    className={styles.errorIcon}
    viewBox="0 0 16 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* This path is the red triangle */}
    <path
      d="M7.99992 0.666626L0.833252 13.3333H15.1666L7.99992 0.666626ZM7.99992 8.66663C7.63325 8.66663 7.33325 8.36663 7.33325 7.99996V5.33329C7.33325 4.96663 7.63325 4.66663 7.99992 4.66663C8.36659 4.66663 8.66659 4.96663 8.66659 5.33329V7.99996C8.66659 8.36663 8.36659 8.66663 7.99992 8.66663ZM8.66659 11.3333H7.33325V9.99996H8.66659V11.3333Z"
      fill="#D92D20" // Filled with red
    />
  </svg>
);

interface SegmentedHeaderProps {
  currentStep: number;
  maxAchievedStep: number;
  setStep: (step: number) => void;
  errors?: object; // <-- Accept the errors object
}

const steps = [
  "Career Details",
  "CV Review",
  "AI Interview",
  "Pipeline",
  "Review Career",
];

export default function SegmentedHeader({
  currentStep,
  maxAchievedStep,
  setStep,
  errors = {}, // <-- Default to empty object
}: SegmentedHeaderProps) {
  // --- Helper to check for errors on a step ---
  const hasErrorOnStep = (stepNumber: number) => {
    // This logic only checks for Step 1 errors.
    // You can expand this as you build validation for other steps.
    if (stepNumber === 1 && errors && Object.keys(errors).length > 0) {
      return true;
    }
    // else if (stepNumber === 2 && errors.someOtherCheck) { ... }
    return false;
  };

  return (
    <nav className={styles.segmentedHeader}>
      <div className={styles.segmentedHeader__container}>
        {steps.map((title, index) => {
          const stepNumber = index + 1;

          // --- State Logic ---
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isClickable = stepNumber <= maxAchievedStep;
          const isDark = isCurrent || isCompleted;
          const isError = hasErrorOnStep(stepNumber); // <-- Check for error

          // --- Dynamic ClassNames ---
          const stepGroupClasses = [
            styles.segmentedHeader__stepGroup,
            isDark ? styles.isDark : "",
            isError ? styles.isError : "", // <-- Add error class
          ].join(" ");

          const stepClasses = [
            styles.segmentedHeader__step,
            isClickable ? styles.isClickable : "",
          ].join(" ");

          return (
            <div key={stepNumber} className={stepGroupClasses}>
              {/* 1. The Step (Circle + Title) */}
              <button
                disabled={!isClickable}
                onClick={() => isClickable && setStep(stepNumber)}
                className={stepClasses}
              >
                <div className={styles.segmentedHeader__circle}>
                  {/*
                    --- UPDATED: Conditional logic to show ONLY ONE icon ---
                    Priority: Error > Completed > Dot
                  */}
                  {isError ? (
                    <ErrorIcon />
                  ) : isCompleted ? (
                    <CheckIcon />
                  ) : (
                    <div className={styles.segmentedHeader__dot}></div>
                  )}
                </div>
                <span className={styles.segmentedHeader__title}>{title}</span>
              </button>

              {/* 2. The Connector (Divider) */}
              <div className={styles.segmentedHeader__connector} />
            </div>
          );
        })}
      </div>
    </nav>
  );
}