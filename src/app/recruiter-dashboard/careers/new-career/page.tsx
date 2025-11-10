/* // src/app/recruiter-dashboard/careers/new-career/page.tsx

"use client";

import React from "react";
import HeaderBar from "@/lib/PageComponent/HeaderBar";
// Import the new wizard component
import NewCareerWizard from "@/lib/components/CareerComponents/NewCareerWizard";

export default function NewCareerPage() {
  return (
    <>
      <HeaderBar
        activeLink="Careers"
        currentPage="Add new career"
        icon="la la-suitcase"
      />
      <div className="container-fluid mt--7" style={{ paddingTop: "6rem" }}>
        <div className="row">
          <div className="col">

            <div className="bg-white rounded-lg shadow-lg">

              <div className="p-8 border-b">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Add New Career
                </h1>
              </div>


              <NewCareerWizard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 
*/


"use client";

import React from "react";
import HeaderBar from "@/lib/PageComponent/HeaderBar";
import CareerForm from "@/lib/components/CareerComponents/CareerForm";
import NewCareerWizard from "@/lib/components/CareerComponents/NewCareerWizard";
import { useSearchParams } from "next/navigation";

export default function NewCareerPage() {
  const searchParams = useSearchParams();
  const careerId = searchParams.get("id");
    return (
        <>
        <HeaderBar activeLink="Careers" currentPage="Add new career" icon="la la-suitcase" />
        <div className="container-fluid mt--7" style={{ paddingTop: "6rem" }}>
          <div className="row">
            <NewCareerWizard careerId={careerId}/>

            {/* <CareerForm formType="add" /> */}
          </div>
        </div>
      </>
    )
}