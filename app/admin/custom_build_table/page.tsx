// pages/custom-builds.tsx
import CustomBuildTable from "@/components/BuildTable";
import React from "react";

const CustomBuildTablePage = () => {
  return (
    <div className="min-h-screen pt-16 flex flex-col items-center">
      <CustomBuildTable />
    </div>
  );
};

export default CustomBuildTablePage;
