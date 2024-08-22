const DataDict_Med = {
    drugrelate: {
      topic:
        "กลุ่มยาที่เกิดปัญหา",
      options: [
        {
          code: "1",
          title: "High Alert Drug",
          status: false,
        },
        {
          code: "2",
          title: "เคมีบำบัด",
          status: false,
        },
        {
          code: "3",
          title: "ยาเสพติด",
          status: false,
        },
        {
          code: "4",
          title: "ยาเดิมผู้ป่วย",
          status: false,
        },
        {
          code: "5",
          title: "ยา HM",
          status: false,
        },
        {
          code: "6",
          title: "ยาฉีด",
          status: false,
        },
        {
          code: "7",
          title: "ยาทั่วไป",
          status: false,
        },
      ],
    },
    effect: {
      topic:
        "กลุ่มยาที่เกิดปัญหา",
      options: [
        {
          code: "1",
          title: "ไม่มี",
          status: false,
        },
        {
          code: "2",
          title: "ผู้ป่วย",
          status: false,
        },
        {
          code: "3",
          title: "ระบบงาน",
          status: false,
        }
      ],
    },
    rca: {
      topic:
        "สรุปผลการวิเคราะห์สาเหตุที่แท้จริง (RCA) ของความคลาดเคลื่อน",
      options: [
        {
          code: "1",
          title: "การปฐมนิเทศและการอบรมบุคลากร (Orientation & Training of staff)",
          status: false,
        },
        {
          code: "2",
          title: "การประเมินสมรรถนะและความเหมาะสม (Competency assessment / Credentialing)",
          status: false,
        },
        {
          code: "3",
          title: "การกำกับ / นิเทศบุคลากร (Supervisor of staff)",
          status: false,
        },
        {
          code: "4",
          title: "ระดับบุคลากร (Staff Levels)",
          status: false,
          suboption: [
            {
              code: "4.1",
              title: "อัตรากำลังไม่เหมาะสม",
              status: false,
            },
            {
              code: "4.2",
              title: "ระดับบุคลากรที่ปฏิบัติ",
              status: false,
            },
          ]
        },
        {
          code: "5",
          title: "กระบวนการประเมินทางกายภาพ (Physical assessment process)",
          status: false,
          suboption: [
            {
              code: "5.1",
              title: "การตรวจร่างกาย / ซักประวัติ",
              status: false,
            },
            {
              code: "5.2",
              title: "การบันทึกเอกสาร",
              status: false,
            },
          ]
        },
        {
          code: "6",
          title: "การสื่อสารระหว่างทีมผู้ดูแล (Communication among staff members)",
          status: false,
          suboption: [
            {
              code: "6.1",
              title: "ไม่ทวนกลับทวนซ้ำ",
              status: false,
            },
            {
              code: "6.2",
              title: "การสั่งยาทาง PO / VO",
              status: false,
            },
            {
              code: "6.3",
              title: "การใช้ตัวย่อไม่เป็นสากล",
              status: false,
            },
            {
              code: "6.4",
              title: "ขาดช่องทางการสื่อสารที่เหมาะสม",
              status: false,
            }
          ]
        },
        {
          code: "7",
          title: "ความต่อเนื่องของการดูแล (Continue of care)",
          status: false,
          suboption: [
            {
              code: "7.1",
              title: "ไม่มีการทำ Med. Reconciliation",
              status: false,
            },
            {
              code: "7.2",
              title: "ขาดการส่งต่อข้อมูลระหว่างหน่วยงาน / รพ.",
              status: false,
            }
          ]
        },
        {
          code: "8",
          title: "กระบวนการระบุตัวผู้ป่วย (Pt.Identification process)",
          status: false,
        },
        {
          code: "9",
          title: "ความเพียงพอของการสนับสนุนทางเทคโนโลยี (Adequacy of technology support)",
          status: false,
        },
        {
          code: "10",
          title: "สิ่งแวดล้อมทางกายภาพ (Physical environment)",
          status: false,
        },
        {
          code: "11",
          title: "การสื่อสารระหว่างผู้ป่วยและญาติ (Communication with Pt./ Family)",
          status: false,
        },
        {
          code: "12",
          title: "การมีความสามารถในการเข้าถึงข้อมูลหรือสารสนเทศ (Avaiability of information)",
          status: false,
        },
        {
          code: "13",
          title: "การจัดการและบำรุงรักษาด้านอุปกรณ์ เคร่องมือ หรืออุปกรณ์ทางการแพทย์ (Equipment maintainance / Nanagement)",
          status: false,
          suboption: [
            {
              code: "13.1",
              title: "Fax. ไม่ชัดเจน",
              status: false,
            },
            {
              code: "13.2",
              title: "Computer ขัดข้อง",
              status: false,
            }
          ]
        },
        {
          code: "14",
          title: "การจัดการด้านยา (Medication management)",
          status: false,
          suboption: [
            {
              code: "14.1",
              title: "ยา LASA",
              status: false,
            },
            {
              code: "14.2",
              title: "ยาใหม่",
              status: false,
            },
            {
              code: "14.3",
              title: "การเก็บรักษา",
              status: false,
            }
          ]
        },
      ],
    },
};
export default DataDict_Med;
