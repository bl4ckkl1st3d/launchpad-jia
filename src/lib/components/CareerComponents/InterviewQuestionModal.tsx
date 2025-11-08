"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // <-- Import createPortal

export default function InterviewQuestionModal({ groupId, questionToEdit, action, onAction }: { groupId: number, questionToEdit?: { id: number, question: string }, action: string, onAction: (action: string, groupId?: number, question?: string, questionId?: number) => void }) {
    const [question, setQuestion] = useState(questionToEdit?.question || "");
    const [isMounted, setIsMounted] = useState(false);

    const actions = {
        "add": {
            icon: "la-pencil-alt",
            color: "#181D27",
            iconColor: "#039855",
            iconBgColor: "#D1FADF",
            title: "Add Interview Question",
            buttonText: "Save Changes",
        },
        "edit": {
            icon: "la-pencil-alt",
            color: "#181D27",
            iconColor: "#DC6803",
            iconBgColor: "#FEF0C7",
            title: "Edit Interview Question",
            buttonText: "Save Changes",
        },
        "delete": {
            icon: "la-trash-alt",
            color: "#D92D20",
            iconColor: "#D92D20",
            iconBgColor: "#FEE4E2",
            title: "Delete Interview Question",
            subtext: "Are you sure you want to delete this question? This action cannot be undone.",
            buttonText: "Delete",
        },
    };

    // This ensures document.body is available before trying to create the portal
    useEffect(() => {
        setIsMounted(true);
        // Cleanup function
        return () => setIsMounted(false);
    }, []);

    // This is the modal JSX.
    // The outer div is now a flex container that does the centering.
    const modalContent = (
        <div className="modal show fade-in-bottom"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "rgba(0,0,0,0.45)",
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 1050,
            }}
        >
            {/* This is the white modal box */}
            <div
                style={{
                    overflowY: "auto",
                    height: "fit-content",
                    width: "fit-content",
                    minWidth: "400px", 
                    background: "#fff",
                    border: `1.5px solid #E9EAEB`,
                    borderRadius: 14,
                    boxShadow: "0 8px 32px rgba(30,32,60,0.18)",
                    padding: "24px",
                }}
            >
                {/* All your original modal content... */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
                    <div style={{ border: "1px solid #E9EAEB", borderRadius: "50%", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: actions[action]?.iconBgColor }}>
                        <i className={`la ${actions[action]?.icon}`} style={{ fontSize: 24, color: actions[action]?.iconColor }}></i>
                    </div>
                    <h3 className="modal-title">{actions[action]?.title}</h3>
                    {action === "delete" ? <p style={{ maxWidth: "352px" }}>{actions[action]?.subtext}</p> : <textarea
                        className="interview-question-input"
                        placeholder="Enter your question here..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        // Added some basic styles for the textarea
                        style={{ width: '100%', minHeight: '100px', padding: '8px', boxSizing: 'border-box', borderRadius: '8px', borderColor: '#E9EAEB' }}
                    />}
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 16, width: "100%" }}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onAction("");
                            }}
                            style={{ display: "flex", width: "50%", flexDirection: "row", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 8, backgroundColor: "#FFFFFF", borderRadius: "60px", border: "1px solid #D5D7DA", cursor: "pointer", padding: "10px 0px" }}>
                            Cancel
                        </button>
                        <button
                            disabled={!question?.trim() && action !== "delete"}
                            onClick={(e) => {
                                e.preventDefault();
                                onAction(action, groupId, question, questionToEdit?.id);
                            }}
                            style={{ display: "flex", width: "50%", flexDirection: "row", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 8, backgroundColor: !question?.trim() && action !== "delete" ? "#D5D7DA" : actions[action]?.color, color: "#FFFFFF", borderRadius: "60px", border: "1px solid #D5D7DA", cursor: "pointer", textTransform: "capitalize" }}>
                            {actions[action]?.buttonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // If the component isn't mounted yet, render nothing.
    if (!isMounted) {
        return null;
    }

    // Once mounted, create the portal and render the modal content in document.body
    return createPortal(modalContent, document.body);
}