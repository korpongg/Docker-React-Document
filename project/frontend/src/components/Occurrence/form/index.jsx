import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";

import GeneralInfo from "../../form/GeneralInfo";
import ReportLog from "../../form/ReportLog";
import ReportInfo from "../../form/ReportInfo";
import ReportType from "../../form/ReportType";
import SelectBoxList from "../../form/SelectBoxList";
import RadioList from "../../form/RadioList";
import ReportDescription from "../../form/ReportDescription";
import ReportStaff from "../../form/ReportStaff";

import DataDict_OccurrenceForm from "../../../data/form/DataDict_OccurrenceForm";
import DataDict_Risk from "../../../data/form/DataDict_Risk";

const Occurrence = () => {
  const [FormData, setFormData] = useState({});

  const handleDataChange = (event, name) => {
    const Text = event.target.value;
    setFormData({ ...FormData, [name]: Text });
  };

  const handleDataChangeCheckbox = (dataarray, columnname) => {
    setFormData({ ...FormData, [columnname]: dataarray });
  };

  const handleDataSingleChange = (data, name) => {
    // const Text = event.target.value;
    setFormData({ ...FormData, [name]: data });
  };
  return (
    <>
      {console.log("FormData", FormData)}
      occurrence index
      <GeneralInfo data={FormData} setDataFunction={handleDataChange} />
      <ReportLog data={FormData} setDataFunction={handleDataChange} />
      <ReportInfo data={FormData} setDataFunction={handleDataChange} />
      <ReportType data={FormData} setDataFunction={handleDataChange} />
      <SelectBoxList
        data={FormData}
        optionsdata={DataDict_OccurrenceForm}
        datacolumn="patientcare"
        remark={true}
        remarkno="199"
        remarkcolumn="patientcareremark"
        handleDataChangeCheckbox={handleDataChangeCheckbox}
        handleDataChange={handleDataChange}
      />
      <SelectBoxList
        data={FormData}
        optionsdata={DataDict_OccurrenceForm}
        datacolumn="patientsupport"
        remark={true}
        remarkno="299"
        remarkcolumn="patientsupportremark"
        handleDataChangeCheckbox={handleDataChangeCheckbox}
        handleDataChange={handleDataChange}
      />
      <SelectBoxList
        data={FormData}
        optionsdata={DataDict_OccurrenceForm}
        datacolumn="utility"
        remark={true}
        remarkno="399"
        remarkcolumn="utilityremark"
        handleDataChangeCheckbox={handleDataChangeCheckbox}
        handleDataChange={handleDataChange}
      />
      <SelectBoxList
        data={FormData}
        optionsdata={DataDict_OccurrenceForm}
        datacolumn="equipment"
        remark={true}
        remarkno="499"
        remarkcolumn="equipmentremark"
        handleDataChangeCheckbox={handleDataChangeCheckbox}
        handleDataChange={handleDataChange}
      />
      <SelectBoxList
        data={FormData}
        optionsdata={DataDict_OccurrenceForm}
        datacolumn="safety"
        remark={true}
        remarkno="599"
        remarkcolumn="safetyremark"
        handleDataChangeCheckbox={handleDataChangeCheckbox}
        handleDataChange={handleDataChange}
      />
      <SelectBoxList
        data={FormData}
        optionsdata={DataDict_OccurrenceForm}
        datacolumn="service"
        remark={true}
        remarkno="699"
        remarkcolumn="serviceremark"
        handleDataChangeCheckbox={handleDataChangeCheckbox}
        handleDataChange={handleDataChange}
      />
      <SelectBoxList
        data={FormData}
        optionsdata={DataDict_OccurrenceForm}
        datacolumn="management"
        remark={true}
        remarkno="799"
        remarkcolumn="managementremark"
        handleDataChangeCheckbox={handleDataChangeCheckbox}
        handleDataChange={handleDataChange}
      />
      <RadioList
        data={FormData}
        optionsdata={DataDict_Risk}
        datacolumn="ClinicalRisk"
        remark={false}
        handleDataChangeCheckbox={handleDataChangeCheckbox}
        handleDataChange={handleDataChange}
      />
      <RadioList
        data={FormData}
        optionsdata={DataDict_Risk}
        datacolumn="GeneralRisk"
        remark={false}
        handleDataChangeCheckbox={handleDataChangeCheckbox}
        handleDataChange={handleDataChange}
      />

      <ReportDescription data={FormData} setDataFunction={handleDataChange} />
      <ReportStaff data={FormData} setDataFunction={handleDataChange} setData={handleDataSingleChange} />
      {/* </occurrenceStyle> */}
    </>
  );
};

export default Occurrence;
