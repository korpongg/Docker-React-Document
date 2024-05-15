const DataDict_MedicationForm = {
    prescribing: {
      topic:
        "ความคลาดเคลื่อนในการสั่งใช้ยา – คัดลอกยา (Prescribing Errors – Transcribing Errors)",
      options: [
        {
          code: "4.1.1",
          title: "ไม่ได้สั่งยา / สั่งยาไม่ครบ",
          status: false,
        },
        {
          code: "4.1.2",
          title: "สั่งยาผิดจำนวน / ซ้ำซ้อน",
          status: false,
        },
        {
          code: "4.1.3",
          title: "สั่งยาผิดขนาด / ผิดความแรง",
          status: false,
        },
        {
          code: "4.1.4",
          title: "สั่งยาผิดชนิด",
          status: false,
        },
        {
          code: "4.1.5",
          title: "สั่งยาผิดรูปแบบ",
          status: false,
        },
        {
          code: "4.1.6",
          title: "สั่งยาผิดเทคนิค",
          status: false,
        },
        {
          code: "4.1.7",
          title: "สั่งยาผิดทาง",
          status: false,
        },
        {
          code: "4.1.8",
          title: "สั่งยาที่ความเร็วผิด",
          status: false,
        },
        {
          code: "4.1.9",
          title: "สั่งยาในระยะเวลาที่ผิด",
          status: false,
        },
        {
          code: "4.1.10",
          title: "สั่งยาผิดคน",
          status: false,
        },
        {
          code: "4.1.11",
          title: "สั่งยาผู้ป่วยที่มีประวัติแพ้ยา",
          status: false,
        },
        {
          code: "4.1.12",
          title:
            "สั่งยาที่มีปฏิกิริยากับยาอื่นที่ผู้ป่วยใช้ / โรคประจำตัวของผู้ป่วย",
          status: false,
        },
        {
          code: "4.1.13",
          title: "คำสั่งให้ยาไม่ชัดเจน",
          status: false,
        },
        {
          code: "4.1.14",
          title: "รับคำสั่งไม่ชัดเจน / ผิดพลาด (RN)",
          status: false,
        },
        {
          code: "4.1.15",
          title: "แพทย์สั่งยาซ้ำซ้อน",
          status: false,
        },
        {
          code: "4.1.16",
          title: "สั่งจ่ายยาที่ไม่มีจำหน่ายใน รพ.",
          status: false,
        },
        {
          code: "4.1.17",
          title: "Remark",
          status: false,
          remark: "",
        },
      ],
    },
    dispensing: {
      topic: "ความคลาดเคลื่อนในการจัด – จ่ายยา (Dispensing Errors)",
      options: [
        {
          code: "4.2.1",
          title: "ไม่ได้จัด / ไม่ได้จ่ายยา",
          status: false,
        },
        {
          code: "4.2.2",
          title: "การจัด / จ่ายยาผิดจำนวน / ซ้ำซ้อน",
          status: false,
        },
        {
          code: "4.2.3",
          title: "การจัด / จ่ายยาผิดขนาด / ผิดความแรง",
          status: false,
        },
        {
          code: "4.2.4",
          title: "การจัด / จ่ายยาผิดชนิด",
          status: false,
        },
        {
          code: "4.2.5",
          title: "การจัด / จ่ายยาผิดรูปแบบ",
          status: false,
        },
        {
          code: "4.2.6",
          title: "การจัด / จ่ายยาผิดเทคนิค",
          status: false,
        },
        {
          code: "4.2.7",
          title: "การจัด / จ่ายยาผิดทาง",
          status: false,
        },
        {
          code: "4.2.8",
          title: "การจัด / จ่ายยาที่ความเร็วในการให้ยาผิด",
          status: false,
        },
        {
          code: "4.2.9",
          title: "การจัด / จ่ายยาในระยะเวลาที่ผิด",
          status: false,
        },
        {
          code: "4.2.10",
          title: "การจัด / จ่ายยาผิดเวลาที่กำหนด",
          status: false,
        },
        {
          code: "4.2.11",
          title: "การจัด / จ่ายยาผิดคน",
          status: false,
        },
        {
          code: "4.2.12",
          title: "การจัด / จ่ายยาที่ผู้ป่วยมีประวัติแพ้ยา",
          status: false,
        },
        {
          code: "4.2.13",
          title: "การให้ยาที่มีปฏิกิริยากับยาที่ผู้ป่วยใช้",
          status: false,
        },
        {
          code: "4.2.14",
          title: "ลงบันทึกใน MAR ผิด / ไม่ครบ / ไม่ชัดเจน",
          status: false,
        },
        {
          code: "4.2.15",
          title: "เบิกคืนยา / เวชภัณฑ์ผิด",
          status: false,
        },
        {
          code: "4.2.16",
          title: "ส่งยา / เวชภัณฑ์ผิดแผนก",
          status: false,
        },
        {
          code: "4.2.17",
          title: "ติดฉลากยาผิด (จัดยาถูก)",
          status: false,
        },
        {
          code: "4.2.18",
          title: "จัด – จ่ายที่แพทย์ไม่ได้สั่ง / สั่ง off แล้ว",
          status: false,
        },
        {
          code: "4.2.19",
          title: "ให้ข้อมูลในการใช้ / เก็บรักษายาผิดพลาด, ไม่ชัดเจน",
          status: false,
        },
        {
          code: "4.2.20",
          title: "Remark",
          status: false,
          remark: "",
        },
      ],
    },
    Administration: {
      topic: "ความคลาดเคลื่อนในการบริหารยา (Administration Errors)",
      options: [
        {
          code: "4.3.1",
          title: "ไม่ได้ให้ยาผู้ป่วยจนถึงการให้ยามื้อต่อไป",
          status: false,
        },
        {
          code: "4.3.2",
          title: "ให้ยาผิดจำนวน / ให้ยาซ้ำซ้อน",
          status: false,
        },
        {
          code: "4.3.3",
          title: "ให้ยาผิดความแรง / ผิดขนาด",
          status: false,
        },
        {
          code: "4.3.4",
          title: "ให้ยาผิดชนิด",
          status: false,
        },
        {
          code: "4.3.5",
          title: "ให้ยาผิดรูปแบบ",
          status: false,
        },
        {
          code: "4.3.6",
          title: "ให้ยาผิดเทคนิครวมถึงการบดยาที่ไม่ควรบด",
          status: false,
        },
        {
          code: "4.3.7",
          title: "ให้ยาผิดทาง",
          status: false,
        },
        {
          code: "4.3.8",
          title: "ให้ยาผิดความเร็ว (เร็ว / ช้า)",
          status: false,
        },
        {
          code: "4.3.9",
          title: "ให้ยาผิดระยะเวลา (ทุก 6 ช.ม. , ทุก 8 ช.ม.)",
          status: false,
        },
        {
          code: "4.3.10",
          title: "ให้ยาผิดระยะเวลาที่กำหนด (Stat, Pre-Op.)",
          status: false,
        },
        {
          code: "4.3.11",
          title: "ให้ยาผิดคน",
          status: false,
        },
        {
          code: "4.3.12",
          title: "ให้ยาที่ผู้ป่วยมีประวัติแพ้ยา",
          status: false,
        },
        {
          code: "4.3.13",
          title: "ให้ยาที่หมดอายุ / ยาเสื่อมสภาพ",
          status: false,
        },
        {
          code: "4.3.14",
          title:
            "บ่งชี้ตัวผู้ป่วยในการเบิก/คืนยาไม่ชัดเจน/ผิดพลาด (รวมถึงการบ่งชี้อื่นๆ)",
          status: false,
        },
        {
          code: "4.3.15",
          title: "เตรียมยาให้ผู้ป่วยผิดพลาด",
          status: false,
        },
        {
          code: "4.3.16",
          title: "ให้ยาผู้ป่วยโดยที่แพทย์สั่ง off  แล้ว",
          status: false,
        },
        {
          code: "4.3.17",
          title: "ลืมเบิก / ลืมยาให้ผู้ป่วยกลับบ้าน",
          status: false,
        },
        {
          code: "4.3.18",
          title:
            "ลืมเบิก-คืนยา / เบิก-คืนไม่ครบรายการ / เบิก-คืนไม่ชัดเจน / เบิก-คืนผิด",
          status: false,
        },
        {
          code: "4.3.19",
          title:
            "บันทึกการให้ยาผู้ป่วยผิดพลาด / ไม่ได้บันทึก / บันทึกไม่ชัดเจน",
          status: false,
        },
        {
          code: "4.3.20",
          title: "Remark",
          status: false,
          remark: "",
        },
      ],
    },
};
export default DataDict_MedicationForm;
