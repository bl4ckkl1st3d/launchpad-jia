// src/lib/components/CareerSteps/Step1_Details.tsx
"use client";

import { useState, useEffect } from "react";
import { CareerStepProps } from "../CareerComponents/NewCareerWizard";
import RichTextEditor from "@/lib/components/CareerComponents/RichTextEditor";
import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";
import philippineCitiesAndProvinces from "../../../../public/philippines-locations.json";

// Import the SCSS file
import "./Step1_Details.scss";

// Define the option type for the custom dropdown
interface DropdownOption {
  label: string;
  value: string;
}

// --- DATA PROCESSING FOR DROPDOWN WORKAROUND ---

// This is our *source of truth* with labels and keys
const allProvincesOptions: DropdownOption[] =
  philippineCitiesAndProvinces.provinces.map(prov => ({
    label: prov.name,
    value: prov.key,
  }));

// This is the *reshaped* array for the dropdown, which only wants 'name'
const allProvincesForDropdown = allProvincesOptions.map(p => ({
  name: p.label,
}));

export default function Step1_Details({
  careerData,
  setCareerData,
}: CareerStepProps) { // 'errors' prop is gone
  const [cities, setCities] = useState<DropdownOption[]>([]);

  // On initial load, set a default province and city if they are empty
  useEffect(() => {
    if (!careerData.province && allProvincesOptions.length > 0) {
      const defaultProvinceKey = allProvincesOptions[0].value;
      const defaultCities = philippineCitiesAndProvinces.cities.filter(
        city => city.province === defaultProvinceKey,
      );
      let defaultCityName = "";
      if (defaultCities.length > 0) {
        defaultCityName = defaultCities[0].name;
      }
      setCareerData(prev => ({
        ...prev,
        province: defaultProvinceKey,
        city: defaultCityName,
      }));
    }
  }, []); // Run only once on mount

  // Effect to update cities when province changes
  useEffect(() => {
    if (careerData.province) {
      const cityOptions = philippineCitiesAndProvinces.cities
        .filter(city => city.province === careerData.province)
        .map(city => ({
          label: city.name,
          value: city.name,
        }));
      setCities(cityOptions);
    } else {
      setCities([]);
    }
  }, [careerData.province]);

  // Generic handler for simple text/select inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    // Fix for potential invalid event
    if (!e || !e.target) {
      console.error("handleInputChange called with invalid event");
      return;
    }
    const { name, value } = e.target;
    setCareerData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handler for custom dropdowns (Province, City)
  const handleDropdownChange = (
    name: "province" | "city",
    clickedName: string, // This is the label, e.g., "Metro Manila"
  ) => {
    setCareerData(prevData => {
      const newData = { ...prevData };
      if (name === "province") {
        // Find the full province object from our source of truth
        const selectedProvince = allProvincesOptions.find(
          p => p.label === clickedName,
        );
        
        // Get the key (e.g., "MM")
        const provinceKey = selectedProvince ? selectedProvince.value : "";

        // Set the *key* in our state
        newData.province = provinceKey;

        // Find cities for the new *key*
        const newCityOptions = philippineCitiesAndProvinces.cities.filter(
          city => city.province === provinceKey,
        );
        // Set the default city
        newData.city =
          newCityOptions.length > 0 ? newCityOptions[0].name : "";
      } else {
        // City is simple, the name is the value
        newData.city = clickedName;
      }
      return newData;
    });
  };

  // Handler for the RichTextEditor
  const handleDescriptionChange = (value: string) => {
    setCareerData(prevData => ({ ...prevData, description: value }));
  };

  // Handler for the salary toggle
  const handleToggleChange = () => {
    setCareerData(prevData => ({
      ...prevData,
      salaryNegotiable: !prevData.salaryNegotiable,
    }));
  };

  // --- Helper variables for dropdown workaround ---
  const citiesForDropdown = cities.map(c => ({ name: c.label }));
  const currentProvinceLabel =
    allProvincesOptions.find(p => p.value === careerData.province)?.label || "";

  return (
    <div className="step1-container">
      {/* --- Left Column --- */}
      <div className="step1-container__main">
        {/* --- 1. Career Information Card --- */}
        <div className="card-block">
          <div className="card-block__header">
            <span className="card-block__title">Career Information</span>
          </div>

          <div className="card-block__content">
            <div className="form-container">
              {/* Basic Information Section */}
              <div className="form-section">
                <h3 className="form-section__title">Basic Information</h3>
                <div className="form-group">
                  <label htmlFor="jobTitle">Job Title</label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={careerData.jobTitle}
                    onChange={handleInputChange}
                    placeholder="Enter job title"
                  />
                </div>
              </div>

              {/* Work Setting Section */}
              <div className="form-section">
                <h3 className="form-section__title">Work Setting</h3>
                <div className="form-row form-row--horizontal">
                  {/* Location Type Dropdown (Arrangement) */}
                  <div className="form-group form-group--flex">
                    <label htmlFor="workSetup">Location Type</label>
                    <div className="select-wrapper">
                      <select
                        id="workSetup"
                        name="workSetup"
                        value={careerData.workSetup || ""}
                        onChange={handleInputChange}
                      >
                        <option value="" disabled>
                          Select location type
                        </option>
                        <option value="On-site">On-site</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
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
                  {/* Employment Type Dropdown */}
                  <div className="form-group form-group--flex">
                    <label htmlFor="employmentType">Employment Type</label>
                    <div className="select-wrapper">
                      <select
                        id="employmentType"
                        name="employmentType"
                        value={careerData.employmentType || ""}
                        onChange={handleInputChange}
                      >
                        <option value="" disabled>
                          Select employment type
                        </option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
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
                </div>
              </div>

              {/* Location Section */}
              <div className="form-section" style={{ zIndex: 2 }}>
                <h3 className="form-section__title">Location</h3>
                <div className="form-row">
                  {/* Country Dropdown */}
                  <div className="form-group form-group--flex">
                    <label htmlFor="country">Country</label>
                    <div className="select-wrapper">
                      <select
                        id="country"
                        name="country"
                        value={careerData.country || "Philippines"}
                        onChange={handleInputChange}
                      >
                        <option value="Philippines">Philippines</option>
                      </select>
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
                  {/* Province Dropdown */}
                  <div className="form-group form-group--flex">
                    <label htmlFor="province">State/Province</label>
                    <CustomDropdown
                      settingList={allProvincesForDropdown}
                      screeningSetting={currentProvinceLabel}
                      onSelectSetting={value =>
                        handleDropdownChange("province", value)
                      }
                      placeholder="Select province"
                    />
                  </div>
                  {/* City Dropdown */}
                  <div className="form-group form-group--flex">
                    <label htmlFor="city">City</label>
                    <CustomDropdown
                      settingList={citiesForDropdown}
                      screeningSetting={careerData.city}
                      onSelectSetting={value =>
                        handleDropdownChange("city", value)
                      }
                      placeholder="Select city"
                      disabled={!careerData.province || cities.length === 0}
                    />
                  </div>
                </div>
              </div>

              {/* Salary Section */}
              <div className="form-section" style={{ zIndex: 1 }}>
                <div className="salary-toggle-wrapper">
                  <h3 className="form-section__title">Salary</h3>
                  <div className="toggle-control">
                    <button
                      type="button"
                      onClick={handleToggleChange}
                      className={`toggle-control__button ${
                        careerData.salaryNegotiable
                          ? "toggle-control__button--active"
                          : ""
                      }`}
                    >
                      <span className="toggle-control__knob" />
                    </button>
                    <span className="toggle-control__label">
                      {careerData.salaryNegotiable
                        ? "Salary is negotiable"
                        : "Salary is fixed"}
                    </span>
                  </div>
                </div>

                <div className="form-row">
                  {/* Minimum Salary */}
                  <div className="form-group form-group--flex">
                    <label htmlFor="minimumSalary">Minimum Salary</label>
                    <div className="salary-input-wrapper">
                      <span className="salary-input-wrapper__currency">
                        ₱
                      </span>
                      <input
                        type="number"
                        id="minimumSalary"
                        name="minimumSalary"
                        value={careerData.minimumSalary || ""}
                        onChange={handleInputChange}
                        placeholder="e.g., 20,000"
                      />
                    </div>
                  </div>
                  {/* Maximum Salary */}
                  <div className="form-group form-group--flex">
                    <label htmlFor="maximumSalary">Maximum Salary</label>
                    <div className="salary-input-wrapper">
                      <span className="salary-input-wrapper__currency">
                        ₱
                      </span>
                      <input
                        type="number"
                        id="maximumSalary"
                        name="maximumSalary"
                        value={careerData.maximumSalary || ""}
                        onChange={handleInputChange}
                        placeholder="e.g., 30,000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 2. Job Description Card --- */}
        <div className="card-block card-block--shadow-inner">
          <div className="card-block__header">
            <span className="card-block__title">Job Description</span>
          </div>

          <div className="card-block__content">
            <RichTextEditor
              setText={handleDescriptionChange}
              text={careerData.description}
            />
          </div>
        </div>
      </div>

      {/* --- Right Column (Tips) --- */}
      <div className="step1-container__sidebar">
        <div className="card-block card-block--tips card-block--shadow-inner">
          {/* Card Header */}
          <div className="card-block__header">
            <i className="la la-lightbulb gradient-icon"></i>
            <span className="card-block__title">Tips</span>
          </div>
          {/* Card Content */}
          <div className="card-block__content">
            <p className="tips-card__text">
              <strong>Use clear, standard job titles</strong> for better
              searchability (e.g., "Software Engineer" instead of "Code Ninja"
              or "Tech Rockstar").
              <br />
              <br />
              <strong>Avoid abbreviations</strong> or internal role codes that
              applicants may not understand (e.g., use "QA Engineer" instead
              of "QE II" or "QA-TL").
              <br />
              <br />
              <strong>Keep it concise</strong> — job titles should be no more
              than a few words (2–4 max), avoiding fluff or marketing terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}