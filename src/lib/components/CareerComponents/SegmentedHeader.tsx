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
    width="12"
    height="12"
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

interface SegmentedHeaderProps {
  currentStep: number;
  maxAchievedStep: number;
  setStep: (step: number) => void;
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
}: SegmentedHeaderProps) {
  return (
    <nav className={styles.segmentedHeader}>
      <div className={styles.segmentedHeader__container}>
        {steps.map((title, index) => {
          const stepNumber = index + 1;

          // --- State Logic ---
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isClickable = stepNumber <= maxAchievedStep;
          // "isDark" = active OR completed (per your image)
          const isDark = isCurrent || isCompleted;

          // --- Dynamic ClassNames ---
          // Build the class list for the step group
          const stepGroupClasses = [
            styles.segmentedHeader__stepGroup,
            isDark ? styles.isDark : "",
          ].join(" ");

          // Build the class list for the step button
          const stepClasses = [
            styles.segmentedHeader__step,
            isClickable ? styles.isClickable : "",
          ].join(" ");

          return (
            // This div holds the step and its following connector
            <div key={stepNumber} className={stepGroupClasses}>
              {/* 1. The Step (Circle + Title) */}
              <button
                disabled={!isClickable}
                onClick={() => isClickable && setStep(stepNumber)}
                className={stepClasses}
              >
                <div className={styles.segmentedHeader__circle}>
                  <CheckIcon />
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