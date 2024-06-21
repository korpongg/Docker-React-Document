const SubmitForm_Medication = {
  //generalinfo
  hn: "",
  an: "",
  age: "",
  gender: "",
  dx: "",
  pct: "",
  //reportlog
  reportlocation: "",
  reportdate: "",
  occurrencedate: "",
  occurrencetime: "",
  deptrelate: "",
  //
  reporttype: null,
  type: null,
  //
  reportid: "",
  acceptdate: "",
  responsedate: "",
  urgenttype: null,
  //part1
  //form
  prescribing: [],
  prescribingremark: "",
  dispensing: [],
  Administration: [],
  // prescribing: ["4.1.1", "4.1.2"],
  // prescribingremark: "test remark",
  // dispensing: ["4.2.5", "4.2.6"],
  // Administration: ["4.3.5", "4.3.8"],
  //
  description: "",
  level: null,
  effect:null,
  effectremark:"",
  drugrelate:null,
  drugremark:"",
  //
  userreport:"",
  approvereportby:"",

  //part2

  reportdoc:false,
  docname:"",
  medicalrecorded:null,

  reportstaff:false,
  reportstaffremark:"",

  //part3
  occurrenceanalysis:"",
  occurrencesolution:"",

  //part4
  

};
export default SubmitForm_Medication;
