// src/lib/components/CareerSteps/Step1_Details.tsx

"use client";

import { useState, useEffect } from "react";
// Import the props interface from the wizard
import { CareerStepProps } from "../CareerComponents/NewCareerWizard";
// Import the RichTextEditor from your existing code
import RichTextEditor from "@/lib/components/CareerComponents/RichTextEditor";

// Define the member type for the API call
interface Member {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function Step1_Details({ careerData, setCareerData }: CareerStepProps) {
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [selectedMemberEmail, setSelectedMemberEmail] = useState("");

  // Fetch members for the dropdown
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("/api/fetch-members"); // API call
      if (!response.ok) throw new Error("Failed to fetch members");
      const data = await response.json();
      setAllMembers(data.members || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  // Generic handler for simple text inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCareerData(prevData => ({ ...prevData, [name]: value }));
  };

  // Handler for the RichTextEditor
  const handleDescriptionChange = (value: string) => {
    setCareerData(prevData => ({ ...prevData, description: value }));
  };

  // --- Team Access Logic ---
  const handleAddMember = () => {
    if (!selectedMemberEmail) return;
    const memberToAdd = allMembers.find(m => m.email === selectedMemberEmail);
    if (
      memberToAdd &&
      !careerData.teamAccess.some(m => m.email === selectedMemberEmail)
    ) {
      const newTeamAccess = [
        ...careerData.teamAccess,
        {
          email: memberToAdd.email,
          name: memberToAdd.name,
          role: "Member" as const,
        },
      ];
      setCareerData(prevData => ({ ...prevData, teamAccess: newTeamAccess }));
      setSelectedMemberEmail(""); // Reset dropdown
    }
  };

  const handleRemoveMember = (email: string) => {
    setCareerData(prevData => ({
      ...prevData,
      teamAccess: prevData.teamAccess.filter(m => m.email !== email),
    }));
  };

  const handleRoleChange = (email: string, role: "Owner" | "Member") => {
    setCareerData(prevData => ({
      ...prevData,
      teamAccess: prevData.teamAccess.map(m =>
        m.email === email ? { ...m, role } : m
      ),
    }));
  };

  return (
    <div className="step-container space-y-6">
      {/* --- 1. Career Information ---
        This JSX is taken directly from your old CareerForm.tsx (lines 300-320)
        I've adapted it to use Tailwind classes for styling instead of inline styles.
      */}
      <div className="layered-card-outer">
        <div className="layered-card-middle">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
              <i className="la la-suitcase text-white text-xl"></i>
            </div>
            <span className="text-lg font-bold text-gray-800">
              Career Information
            </span>
          </div>
          <div className="layered-card-content">
            <span className="text-sm font-medium">Job Title</span>
            <input
              name="jobTitle" // Added name attribute
              value={careerData.jobTitle}
              className="form-control" // This class comes from your CareerForm
              placeholder="Enter job title"
              onChange={handleInputChange}
            />
            <span className="text-sm font-medium mt-4">Description</span>
            <RichTextEditor
              setText={handleDescriptionChange}
              text={careerData.description}
            />
          </div>
        </div>
      </div>

      {/* --- 2. Team Access ---
        This is the new module you requested.
      */}
      <div className="layered-card-outer">
        <div className="layered-card-middle">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
              <i className="la la-users text-white text-xl"></i>
            </div>
            <span className="text-lg font-bold text-gray-800">Team Access</span>
          </div>
          <div className="layered-card-content">
            <p className="section-subtitle mb-4">
              Grant access to other recruiters or team members.
            </p>
            {/* Add Member Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={selectedMemberEmail}
                onChange={e => setSelectedMemberEmail(e.target.value)}
                className="form-control" // Use your app's class
              >
                <option value="" disabled>Select a member...</option>
                {allMembers
                  .filter(
                    member =>
                      !careerData.teamAccess.some(
                        tm => tm.email === member.email
                      )
                  )
                  .map(member => (
                    <option key={member._id} value={member.email}>
                      {member.name} ({member.email})
                    </option>
                  ))}
              </select>
              <button
                onClick={handleAddMember}
                disabled={!selectedMemberEmail}
                className="btn-primary" // Use your app's class
              >
                Add
              </button>
            </div>
            {/* Added Members List */}
            <div className="mt-4 space-y-2">
              {careerData.teamAccess.map(member => (
                <div
                  key={member.email}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={member.role}
                      onChange={e =>
                        handleRoleChange(
                          member.email,
                          e.target.value as "Owner" | "Member"
                        )
                      }
                      className="form-control"
                    >
                      <option value="Member">Member</option>
                      <option value="Owner">Owner</option>
                    </select>
                    <button
                      onClick={() => handleRemoveMember(member.email)}
                      className="btn-danger-outline" // Use your app's class
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}