const DataDict_Risk = {
  ClinicalRisk: {
    topic: "ClinicalRisk",
    options: [
      {
        code: "A",
        title: "ยังไม่เกิดแต่มีโอกาสเกิด",
      },
      {
        code: "B",
        title: "เกิดแล้วแต่ยังไม่ถึงตัวผู้ป่วย",
      },
      {
        code: "C",
        title: "ถึงตัวผู้ป่วยแล้วแต่ยังไม่เกิดอันตราย",
      },
      {
        code: "D",
        title: "ต้องเฝ้าระวังการเกิดอันตราย",
      },
      {
        code: "E",
        title: "ให้การรักษาเพิ่มเติม",
      },
      {
        code: "F",
        title: "การรักษานานขึ้น",
      },
      {
        code: "G",
        title: "มีผลระยะยาว / พิการถาวร",
      },
      {
        code: "H",
        title: "ต้องทำหัตถการฟื้นคืนชีพ",
      },
      {
        code: "I",
        title: "ผู้ป่วยเสียชีวิต",
      },
    ],
  },
  GeneralRisk: {
    topic: "GeneralRisk",
    options: [
      {
        code: "1",
        title: "ยังไม่มีผลกระทบ",
      },
      {
        code: "2",
        title: "มีผลกระทบต่ำที่ควบคุมได้",
      },
      {
        code: "3",
        title: "มีผลกระทบปานกลางที่ต้องทำการแก้ไข",
      },
      {
        code: "4",
        title: "มีผลกระทบสูงทำให้การดำเนินงานไม่ประสบผล",
      },
      {
        code: "5",
        title: "มีผลกระทบสูงมาก ทำให้ภารกิจขององค์กรเสียหายอย่างร้ายแรง",
      },
    ],
  },
};

export default DataDict_Risk;
