// src/lib/components/CareerSteps/Step3_AIInterview.tsx
import React from 'react';
import { CareerStepProps } from '../CareerComponents/NewCareerWizard';

// Import the CustomDropdown component
import CustomDropdown from '../CareerComponents/CustomDropdown'; 
// --- UPDATED: Import the NEW InterviewQuestionBuilder ---
import InterviewQuestionBuilder from '../CareerComponents/InterviewQuestionBuilder';

// Import all necessary SCSS files
// --- UPDATED: Import the new SCSS file ---
import '../CareerComponents/InterviewQuestionBuilder.scss'; 
import './Step3_AIInterview.scss'; 

// Options can stay outside the component as they are constant
const screeningOptions = [
  { name: "Good Fit and Above", icon: "la la-check" },
  { name: "Only Strong Fit", icon: "la la-check-double" },
  { name: "No Automatic Promotion", icon: "la la-times" },
];

const Step3_AIInterview: React.FC<CareerStepProps> = ({ careerData, setCareerData, errors }) => {
  
  const handleScreeningChange = (selectedName: string) => {
    setCareerData(prev => ({ ...prev, screeningSetting: selectedName }));
  };

  const handleToggle = () => {
    setCareerData(prev => ({ 
      ...prev, 
      videoRecordingEnabled: !prev.videoRecordingEnabled 
    }));
  };

  const handlePreambleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCareerData(prev => ({ ...prev, aiPreamble: e.target.value }));
  };

  // --- NEW: Handler for InterviewQuestionBuilder component ---
  const handleCustomQuestionsChange = (newQuestions: any) => {
    setCareerData(prev => ({
      ...prev,
      customInterviewQuestions: newQuestions // Make sure this state key exists
    }));
  };

  // Read video state from prop, default to 'true' if not provided
  const isVideoEnabled = careerData.videoRecordingEnabled ?? true;

  return (
    <div className="step1-container"> 
      {/* Left Column */}
      <div className="step1-container__main"> 
        
        {/* --- CARD 1: AI Interview Settings --- */}
        <div className="card-block"> 
          <div className="card-block__header"> 
            <h2 className="card-block__title">1. AI Interview Settings</h2>
          </div>
          <div className="card-block__content"> 
            
            {/* Section 1: Interview Screening */}
            <div className="form-section step3-dropdown-section"> 
              <div className="form-group"> 
                <h3 className="form-section__title-with-icon">AI Interview Screening</h3> 
                <p className="form-section__description"> 
                  Jia automatically endorses candidates who meet the chosen criteria. 
                </p>
              </div>
              <div className="form-group" style={{ width: '320px' }}> 
                <CustomDropdown
                  settingList={screeningOptions}
                  screeningSetting={careerData.screeningSetting}
                  onSelectSetting={handleScreeningChange}
                  placeholder="Choose screening filter"
                />
              </div>
            </div>

            <hr className="divider" /> 

            {/* Section 2: Video Recording */}
            <div className="form-section"> 
              <div className="form-group"> 
                <h3 className="form-section__title-with-icon">Video Recording</h3> 
                <p className="form-section__description"> 
                  Candidates will be required to record their video and audio.
                </p>
              </div>
              <div className="step3-status-container">
                <div className="step3-status-item">
                  <span className="step3-icon-placeholder">📹</span>
                  <p className="form-section__description">
                    Require Video Interview
                  </p>
                </div>
                <div className="step3-toggle" onClick={handleToggle} role="switch" aria-checked={isVideoEnabled}>
                  <div className={isVideoEnabled ? 'step3-toggle-base-on' : 'step3-toggle-base-off'}>
                    <div className="step3-toggle-button"></div>
                  </div>
                  <span className="step3-toggle-text">{isVideoEnabled ? 'On' : 'Off'}</span>
                </div>
              </div>
            </div>

            <hr className="divider" /> 

            {/* Section 3: AI-Generated Preamble */}
            <div className="form-section"> 
              <div className="form-group"> 
                <h3 className="form-section__title-with-icon"> 
                  <span className="gradient-icon">✨</span> 
                  AI-Generated Preamble
                </h3>
                <p className="form-section__description"> 
                  This preamble will be shown to the candidate. You can edit it as needed.
                </p>
              </div>
              <div className="form-group"> 
                <textarea
                  className="form-textarea step3-preamble-textarea"
                  placeholder="Enter a secret prompt (e.g., 'Treat candidates who speak in Taglish, English or Tagalog equally. Focus on clarity, coherence and confidence rather than languange preference or accent.')"
                  value={careerData.aiPreamble ?? ''}
                  onChange={handlePreambleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- CARD 2: Custom AI Interview Questions --- */}
        <div className="card-block">
          <div className="card-block__header">
            <h2 className="card-block__title">2. Custom AI Interview Questions</h2>
          </div>
          <div className="card-block__content">
            <div className="form-section">
              <div className="form-group">
                <p className="form-section__description">
                  Add your own questions to the interview. Jia will ask these after the standard questions.
                </p>
                {errors?.customInterviewQuestions && <p style={{ color: 'red', marginTop: '10px' }}>{errors.customInterviewQuestions}</p>}
              </div>
              <div className="form-group">
                {/* --- Using the NEW component --- */}
                <InterviewQuestionBuilder
                  customQuestions={careerData.customInterviewQuestions || []}
                  setCustomQuestions={handleCustomQuestionsChange}
                  jobDescription={careerData.jobDescription || ''}
                  orgId={careerData.orgId || ''}
                  errors={errors}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column */}
      <div className="step1-container__sidebar"> 
        <div className="card-block card-block--tips card-block--shadow-inner"> 
          <div className="card-block__header"> 
            <span className="gradient-icon">💡</span> 
            <h2 className="card-block__title">Tips</h2> 
          </div>
          <div className="card-block__content"> 
            <ul className="tips-card__text step3-tips-list"> 
              <li>Set clear expectations for the candidate.</li>
              <li>Keep questions concise and relevant to the role.</li>
              <li>Use the AI preamble to provide context and reduce bias.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3_AIInterview;