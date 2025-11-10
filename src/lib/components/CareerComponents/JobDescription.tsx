"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import InterviewQuestionGeneratorV2 from "./InterviewQuestionGeneratorV2";
import { useAppContext } from "../../context/AppContext";
import DirectInterviewLinkV2 from "./DirectInterviewLinkV2";
import CareerForm from "./CareerForm";
import CareerLink from "./CareerLink";
import RichTextEditor from "@/lib/components/CareerComponents/RichTextEditor";
import "@/lib/components/CareerSteps/Step1_Details.scss";
import "@/lib/components/CareerSteps/Step4_Review.scss";

const ReviewField = ({ label, value }: { label: string; value: string }) => (
  <div className="review-field">
    <label>{label}</label>
    <p className="review-text">{value || "N/A"}</p>
  </div>
);

// Define Props for JobDescription
interface JobDescriptionProps {
  formData: any;
  setFormData: (data: any) => void;
  editModal: boolean; // This was in the original page.tsx
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  handleCancelEdit: () => void;
}

export default function JobDescription({ formData, setFormData, editModal, isEditing, setIsEditing, handleCancelEdit }: { formData: any, setFormData: (formData: any) => void, editModal: boolean, isEditing: boolean, setIsEditing: (isEditing: boolean) => void, handleCancelEdit: () => void }) {
    const { user } = useAppContext();
    const [showEditModal, setShowEditModal] = useState(false);
    const [isCard1Open, setIsCard1Open] = useState(true);
    const [isCard2Open, setIsCard2Open] = useState(true);
    const [isCard3Open, setIsCard3Open] = useState(true);
    useEffect(() => {
        if (editModal) {
            setShowEditModal(true);
        }
    }, [editModal]);

    const getFullProvinceName = () => {
    // In a real scenario, this component would need access to the locations JSON
    // to map formData.province (e.g., "MM") to "Metro Manila".
    return formData.province || "N/A";
  };
  const formatSalary = () => {
    if (formData.salaryNegotiable) return "Negotiable";
    if (formData.minimumSalary && formData.maximumSalary) {
      return `₱${formData.minimumSalary} - ₱${formData.maximumSalary}`;
    }
    if (formData.minimumSalary) return `From ₱${formData.minimumSalary}`;
    if (formData.maximumSalary) return `Up to ₱${formData.maximumSalary}`;
    return "Not specified";
  };
  
const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    if (!e || !e.target) return;
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handler for the RichTextEditor
  const handleDescriptionChange = (value: string) => {
    setFormData({ ...formData, description: value });
  };

  // Handler for toggles
  const handleToggleChange = (name: string) => {
    setFormData({
      ...formData,
      [name]: !formData[name],
    });
  };
    const handleEdit = () => {
        setShowEditModal(true);
    }

    async function updateCareer() {
      const userInfoSlice = {
        image: user.image,
        name: user.name,
        email: user.email,
      };
        const input = {
            _id: formData._id,
            jobTitle: formData.jobTitle,
            updatedAt: Date.now(),
            questions: formData.questions,
            status: formData.status,
            screeningSetting: formData.screeningSetting,
            requireVideo: formData.requireVideo,
            description: formData.description,
            lastEditedBy: userInfoSlice,
            createdBy: userInfoSlice,
        };

        Swal.fire({
            title: "Updating career...",
            text: "Please wait while we update the career...",
            allowOutsideClick: false,
        });

        try {
            const response = await axios.post("/api/update-career", input);
            
            if (response.status === 200) {
                Swal.fire({
                    title: "Success",
                    text: "Career updated successfully",
                    icon: "success",
                    allowOutsideClick: false,
                }).then(() => {
                   setIsEditing(false);
                   window.location.reload();
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Failed to update career",
                icon: "error",
                allowOutsideClick: false,
            });
        }
    }

    async function deleteCareer() {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Deleting career...",
              text: "Please wait while we delete the career...",
              allowOutsideClick: false,
              showConfirmButton: false,
              willOpen: () => {
                Swal.showLoading();
              },
            });
    
            try {
              const response = await axios.post("/api/delete-career", {
                id: formData._id,
              });
    
              if (response.data.success) {
                Swal.fire({
                  title: "Deleted!",
                  text: "The career has been deleted.",
                  icon: "success",
                  allowOutsideClick: false,
                }).then(() => {
                  window.location.href = "/recruiter-dashboard/careers";
                });
              } else {
                Swal.fire({
                  title: "Error!",
                  text: response.data.error || "Failed to delete the career",
                  icon: "error",
                });
              }
            } catch (error) {
              console.error("Error deleting career:", error);
              Swal.fire({
                title: "Error!",
                text: "An error occurred while deleting the career",
                icon: "error",
              });
            }
          }
        });
      }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #D5D7DA", padding: "8px 16px", borderRadius: "60px", cursor: "pointer", whiteSpace: "nowrap" }} onClick={handleEdit}>
              <i className="la la-edit" style={{ marginRight: 8 }}></i>
              Edit details
          </button>
            <div className="thread-set">
                <div className="left-thread">
      {/* --- CARD 1: Career Details (from Step4_Review) --- */}
      <div className="layered-card-outer">
      <div className="review-card">
        <div className="review-card-header">
          <div className="header-left">
            <button
              className="collapse-button"
              aria-expanded={isCard1Open}
              onClick={() => setIsCard1Open(!isCard1Open)}
            >
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
          {/* Edit button is handled by parent `page.tsx` */}
        </div>

        {isCard1Open && (
          <div className="review-card-content">
            {!isEditing ? (
              // --- NOT EDITING (Review Mode from Step4_Review) ---
              <>
                <div className="review-grid full-width">
                  <ReviewField label="Job Title" value={formData.jobTitle} />
                </div>
                <hr className="review-divider" />
                <div className="review-grid">
                  <ReviewField
                    label="Employment Type"
                    value={formData.employmentType}
                  />
                  <ReviewField
                    label="Work Arrangement"
                    value={formData.workSetup}
                  />
                  <div></div>
                </div>
                <hr className="review-divider" />
                <div className="review-grid">
                  <ReviewField
                    label="Country"
                    value={formData.country || "Philippines"}
                  />
                  <ReviewField
                    label="State/Province"
                    value={getFullProvinceName()} // Uses helper
                  />
                  <ReviewField label="City" value={formData.city} />
                </div>
                <hr className="review-divider" />
                <div className="review-grid">
                  <ReviewField
                    label="Minimum Salary"
                    value={
                      formData.minimumSalary
                        ? `₱${formData.minimumSalary}`
                        : "N/A"
                    }
                  />
                  <ReviewField
                    label="Maximum Salary"
                    value={
                      formData.maximumSalary
                        ? `₱${formData.maximumSalary}`
                        : "N/A"
                    }
                  />
                  <ReviewField label="Salary" value={formatSalary()} />
                </div>
                <hr className="review-divider" />
                <div className="review-field">
                  <label>Job Description</label>
                  <div
                    className="job-description-preview"
                    dangerouslySetInnerHTML={{
                      __html:
                        formData.description ||
                        "<p>No description provided.</p>",
                    }}
                  />
                </div>
              </>
            ) : (
              // --- IS EDITING (Form Mode from Step1_Details) ---
              <div className="form-container">
                {/* Job Title is edited in the HeaderBar, so we don't include it here */}

                <div className="form-section">
                  <h3 className="form-section__title">Work Setting</h3>
                  <div className="form-row form-row--horizontal">
                    <div className="form-group form-group--flex">
                      <label htmlFor="workSetup">Location Type</label>
                      <div className="select-wrapper">
                        <select
                          id="workSetup"
                          name="workSetup"
                          value={formData.workSetup || ""}
                          onChange={handleInputChange}
                        >
                          <option value="On-site">On-site</option>
                          <option value="Remote">Remote</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group form-group--flex">
                      <label htmlFor="employmentType">Employment Type</label>
                      <div className="select-wrapper">
                        <select
                          id="employmentType"
                          name="employmentType"
                          value={formData.employmentType || ""}
                          onChange={handleInputChange}
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-section" style={{ zIndex: 2 }}>
                  <h3 className="form-section__title">Location</h3>
                  {/* Simplified Location vs Step1 - no complex JSON logic */}
                  <div className="form-group">
                    <label htmlFor="province">State/Province</label>
                    <input
                      type="text"
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      placeholder="Enter province"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                    />
                  </div>
                </div>

                <div className="form-section" style={{ zIndex: 1 }}>
                  <div className="salary-toggle-wrapper">
                    <h3 className="form-section__title">Salary</h3>
                    <div className="toggle-control">
                      <button
                        type="button"
                        onClick={() => handleToggleChange("salaryNegotiable")}
                        className={`toggle-control__button ${
                          formData.salaryNegotiable
                            ? "toggle-control__button--active"
                            : ""
                        }`}
                      >
                        <span className="toggle-control__knob" />
                      </button>
                      <span className="toggle-control__label">
                        {formData.salaryNegotiable
                          ? "Salary is negotiable"
                          : "Salary is fixed"}
                      </span>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group form-group--flex">
                      <label htmlFor="minimumSalary">Minimum Salary</label>
                      <input
                        type="number"
                        id="minimumSalary"
                        name="minimumSalary"
                        value={formData.minimumSalary || ""}
                        onChange={handleInputChange}
                        placeholder="e.g., 20,000"
                      />
                    </div>
                    <div className="form-group form-group--flex">
                      <label htmlFor="maximumSalary">Maximum Salary</label>
                      <input
                        type="number"
                        id="maximumSalary"
                        name="maximumSalary"
                        value={formData.maximumSalary || ""}
                        onChange={handleInputChange}
                        placeholder="e.g., 30,000"
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="card-block__header"
                  style={{ paddingTop: "20px" }}
                >
                  <span className="card-block__title">Job Description</span>
                </div>
                <RichTextEditor
                  setText={handleDescriptionChange}
                  text={formData.description}
                />
              </div>
            )}
          </div>
        )}
      </div>
      </div>

      {/* --- CARD 2: CV Review (from Step4_Review) --- */}
      <div className="layered-card-outer">
      <div className="review-card">
        <div className="review-card-header">
          <div className="header-left">
            <button
              className="collapse-button"
              aria-expanded={isCard2Open}
              onClick={() => setIsCard2Open(!isCard2Open)}
            >
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
        </div>

        {isCard2Open && (
          <div className="review-card-content">
            {!isEditing ? (
              // --- NOT EDITING (Review Mode from Step4_Review) ---
              <>
                <div className="review-grid full-width">
                  <ReviewField
                    label="CV Screening"
                    value={formData.screeningSetting}
                  />
                </div>
                <hr className="review-divider" />
                <div className="review-field">
                  <label>CV Secret Prompt</label>
                  <p
                    className="review-text"
                    style={{ fontStyle: "italic", color: "#555" }}
                  >
                    {formData.workSetupRemarks || // Re-using this field as per Step4
                      "No custom instructions provided."}
                  </p>
                </div>
                <hr className="review-divider" />
                <div className="review-field">
                  <label>Pre-Screening Questions</label>
                  {/* Logic from Step4_Review */}
                  {formData.questions?.length > 0 &&
                  formData.questions[0]?.questions.length > 0 ? (
                    <ol
                      style={{ paddingLeft: "20px", margin: 0, width: "100%" }}
                    >
                      {formData.questions[0].questions.map((q: any) => (
                        <li
                          key={q.id}
                          className="review-text"
                          style={{ marginBottom: "8px" }}
                        >
                          {q.title} {/* Step4 uses q.title */}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p>No custom questions added.</p>
                  )}
                </div>
              </>
            ) : (
              // --- IS EDITING (Form Mode from Step2_CVReview & original snippet) ---
              <div className="form-container">
                <div className="form-section">
                  <h3 className="form-section__title">CV Screening</h3>
                  <div className="form-group">
                    <label htmlFor="screeningSetting">Screening Type</label>
                    <div className="select-wrapper">
                      <select
                        id="screeningSetting"
                        name="screeningSetting"
                        value={formData.screeningSetting || ""}
                        onChange={handleInputChange}
                      >
                        <option value="AI Screening">AI Screening</option>
                        <option value="Manual Screening">Manual Screening</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="workSetupRemarks">CV Secret Prompt</label>
                    <textarea
                      id="workSetupRemarks"
                      name="workSetupRemarks"
                      className="form-control"
                      value={formData.workSetupRemarks}
                      onChange={handleInputChange}
                      placeholder="e.g., Prioritize candidates with 3+ years of experience..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="form-section">
                  <h3 className="form-section__title">
                    Pre-Screening Questions
                  </h3>
                  {/* This is from the user's original JobDescription.tsx snippet */}
                  <InterviewQuestionGeneratorV2
                    questions={formData.questions}
                    setQuestions={(questions: any) =>
                      setFormData({ ...formData, questions: questions })
                    }
                    jobTitle={formData.jobTitle}
                    description={formData.description}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      </div>

      {/* --- CARD 3: AI Interview (from Step4_Review) --- */}
      <div className="layered-card-outer">
      <div className="review-card">
        <div className="review-card-header">
          <div className="header-left">
            <button
              className="collapse-button"
              aria-expanded={isCard3Open}
              onClick={() => setIsCard3Open(!isCard3Open)}
            >
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
        </div>

        {isCard3Open && (
          <div className="review-card-content">
            {!isEditing ? (
              // --- NOT EDITING (Review Mode from Step4_Review) ---
              <>
                <div className="review-grid">
                  <ReviewField
                    label="AI Interview Screening"
                    value={formData.screeningSetting} // Step4 seems to duplicate this
                  />
                  <ReviewField
                    label="Require Video on Interview"
                    value={formData.requireVideo ? "Yes" : "No"}
                  />
                </div>
                <hr className="review-divider" />
                <div className="review-field">
                  <label>AI Interview Secret Prompt</label>
                  <p
                    className="review-text"
                    style={{ fontStyle: "italic", color: "#555" }}
                  >
                    {formData.workSetupRemarks || // Step4 duplicates this field
                      "No custom instructions provided."}
                  </p>
                </div>
                <hr className="review-divider" />
                <div className="review-field">
                  <label>Interview Questions</label>
                  {/* Using the same logic as Card 2 for consistency */}
                  {formData.questions?.length > 0 &&
                  formData.questions[0]?.questions.length > 0 ? (
                    <ol
                      style={{ paddingLeft: "20px", margin: 0, width: "100%" }}
                    >
                      {formData.questions[0].questions.map((q: any) => (
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
              </>
            ) : (
              // --- IS EDITING (Form Mode from Step3_AIInterview / Step1_Details) ---
              <div className="form-container">
                <div className="form-section">
                  <h3 className="form-section__title">Video Settings</h3>
                  <div className="toggle-control">
                    <button
                      type="button"
                      onClick={() => handleToggleChange("requireVideo")}
                      className={`toggle-control__button ${
                        formData.requireVideo
                          ? "toggle-control__button--active"
                          : ""
                      }`}
                    >
                      <span className="toggle-control__knob" />
                    </button>
                    <span className="toggle-control__label">
                      {formData.requireVideo
                        ? "Video is required"
                        : "Video is optional"}
                    </span>
                  </div>
                </div>
                <div className="form-section">
                  <h3 className="form-section__title">
                    AI Interview Secret Prompt
                  </h3>
                  <div className="form-group">
                    <label htmlFor="workSetupRemarks">Prompt</label>
                    <textarea
                      id="workSetupRemarks"
                      name="workSetupRemarks"
                      className="form-control"
                      value={formData.workSetupRemarks}
                      onChange={handleInputChange}
                      placeholder="e.g., Focus on communication skills..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="form-section">
                  <h3 className="form-section__title">
                    AI Interview Questions
                  </h3>
                  <p>
                    Interview questions are managed in the 'CV Review' section
                    above.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
                </div>

                <div className="right-thread">
                    
                    <CareerLink career={formData} />
                    {/* Card for direct interview link */}
                    <DirectInterviewLinkV2 formData={formData} setFormData={setFormData} />
                    {isEditing && 
                    <div style={{ display: "flex", justifyContent: "center", gap: 16, alignItems: "center", marginBottom: "16px", width: "100%" }}>
                         <button className="button-primary" style={{ width: "50%" }} onClick={handleCancelEdit}>Cancel</button>
                        <button className="button-primary" style={{ width: "50%" }} onClick={updateCareer}>Save Changes</button>
                    </div>}
                    <div className="layered-card-outer">
                      <div className="layered-card-middle">
                      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%", gap: 8 }}>
                      <div style={{ width: 32, height: 32, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, background: "#181D27", borderRadius: "60px" }}>
                      <i className="la la-cog" style={{ fontSize: 20, color: "#FFFFFF"}} /> 
                      </div>
                      <span style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}>Advanced Settings</span>
                  </div>

                      <div className="layered-card-content">
                        <button 
                        onClick={() => {
                          deleteCareer();
                        }}
                        style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,backgroundColor: "#FFFFFF", color: "#B32318", borderRadius: "60px", padding: "5px 10px", border: "1px solid #B32318", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
                                <i className="la la-trash" style={{ color: "#B32318", fontSize: 16 }}></i>
                                <span>Delete this career</span>
                        </button>
                        <span style={{ fontSize: "14px", color: "#717680", textAlign: "center" }}>Be careful, this action cannot be undone.</span>
                    </div>
                  </div>
                </div>
                </div>
            </div>


            
            {showEditModal && (
                <div
                className="modal show fade-in-bottom"
                style={{
                  display: "block",
                  background: "rgba(0,0,0,0.45)",
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  zIndex: 1050,
                }}
                >
                    <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                        width: "100vw",
                    }}>
                   
                    <div className="modal-content" style={{ overflowY: "scroll", height: "100vh", width: "90vw", background: "#fff", border: `1.5px solid #E9EAEB`, borderRadius: 14, boxShadow: "0 8px 32px rgba(30,32,60,0.18)", padding: "24px" }}>
                      <CareerForm career={formData} formType="edit" setShowEditModal={setShowEditModal} />
                    </div>
                  </div>
                </div>
            )}
        </div>
    )
}

function ScreeningSettingButton(props) {
    const { onSelectSetting, screeningSetting } = props;
    const [dropdownOpen, setDropdownOpen] = useState(false);
     // Setting List icons
    const settingList = [
        {
        name: "Good Fit and above",
        icon: "la la-check",
        },
        {
        name: "Only Strong Fit",
        icon: "la la-check-double",
        },
        {
        name: "No Automatic Promotion",
        icon: "la la-times",
        },
    ];
    return (
        <div className="dropdown w-100">
        <button
          className="dropdown-btn fade-in-bottom"
          style={{ width: "100%" }}
          type="button"
          onClick={() => setDropdownOpen((v) => !v)}
        >
          <span>
            <i
              className={
                settingList.find(
                  (setting) => setting.name === screeningSetting
                )?.icon
              }
            ></i>{" "}
            {screeningSetting}
          </span>
          <i className="la la-angle-down ml-10"></i>
        </button>
        <div
          className={`dropdown-menu w-100 mt-1 org-dropdown-anim${
            dropdownOpen ? " show" : ""
          }`}
          style={{
            padding: "10px",
          }}
        >
          {settingList.map((setting, index) => (
            <div style={{ borderBottom: "1px solid #ddd" }} key={index}>
              <button
                className={`dropdown-item d-flex align-items-center${
                  screeningSetting === setting.name
                    ? " bg-primary text-white active-org"
                    : ""
                }`}
                style={{
                  minWidth: 220,
                  borderRadius: screeningSetting === setting.name ? 0 : 10,
                  overflow: "hidden",
                  paddingBottom: 10,
                  paddingTop: 10,
                }}
                onClick={() => {
                  onSelectSetting(setting.name);
                  setDropdownOpen(false);
                }}
              >
                <i className={setting.icon}></i> {setting.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    )
}