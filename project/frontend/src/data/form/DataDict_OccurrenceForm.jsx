const DataDict_OccurrenceForm = {
  patientcare:{
    topic: "กระบวนการดูแลผู้ป่วย",
    options: [
      {
        code: 101,
        title: "การเข้าถึงและเข้ารับบริการ",
        status: false,
      },
      {
        code: 102,
        title: "การประเมินผู้ป่วยแรกรับ/ รับใหม่ /รับย้าย",
        status: false,
      },
      {
        code: 103,
        title: "การส่งตรวจเพื่อประกอบการวินิจฉัยโรค",
        status: false,
      },
      {
        code: 104,
        title:
          "การบ่งชี้ผู้ป่วย/ทารก ถูกคน ถูกแฟ้ม ให้เลือด เก็บสิ่ง ส่งตรวจ ให้ยา ทำหัตถการ (PSG 1)",
        status: false,
      },
      {
        code: 105,
        title: "การวินิจฉัยโรค",
        status: false,
      },
      {
        code: 106,
        title: "การวางแผนการรักษา",
        status: false,
      },
      {
        code: 107,
        title: "การวางแผนจำหน่าย",
        status: false,
      },
      {
        code: 108,
        title: "การดูแลทั่วไป",
        status: false,
      },
      {
        code: 109,
        title: "การป้องกันแผลกดทับ",
        status: false,
      },
      {
        code: 110,
        title: "การพลัดตกหกล้ม (PSG 6)",
        status: false,
      },
      {
        code: 112,
        title: "การประเมินซ้ำขณะอยู่ในรพ.-ก่อนจำหน่าย",
        status: false,
      },
      {
        code: 113,
        title: "Tube / Catheter / Invasive line เลื่อนหลุด",
        status: false,
      },
      {
        code: 114,
        title: "การดูแลผู้ป่วยและการให้บริการที่มีความเสี่ยงสูง",
        status: false,
      },
      {
        code: 115,
        title: "ผู้ป่วยติดเชื้อในกระแสเลือด (Sepsis)",
        status: false,
      },
      {
        code: 116,
        title: "การตอบสนองผู้ป่วยที่มีอาการทรุดลง",
        status: false,
      },
      {
        code: 117,
        title: "การระงับความรู้สึก",
        status: false,
      },
      {
        code: 118,
        title: "การสื่อสาร การส่งเวรและประสานงานภายในทีม(PSG2)",
        status: false,
      },
      {
        code: 119,
        title: "การเตรียมก่อนการผ่าตัด-การผ่าตัด-การดูแลหลังผ่าตัด",
        status: false,
      },
      {
        code: 120,
        title: "การเตรียมก่อนการทำ-ขณะทำ-การดูแลหลังทำหัตถการ",
        status: false,
      },
      {
        code: 121,
        title: "การป้องกันการผ่าตัดผิดคน ผิดข้าง ผิดตำแหน่ง (PSG4)",
        status: false,
      },
      {
        code: 122,
        title: "ANC - การคลอด - การดูแลหลังคลอด",
        status: false,
      },
      {
        code: 123,
        title: "อาหารผู้ป่วย / โภชนบำบัด",
        status: false,
      },
      {
        code: 124,
        title: "การดูแลผู้ป่วยระยะสุดท้าย",
        status: false,
      },
      {
        code: 125,
        title: "การบำบัดอาการเจ็บปวด (Pain Management)",
        status: false,
      },
      {
        code: 126,
        title: "การฟื้นฟูสภาพ",
        status: false,
      },
      {
        code: 127,
        title: "การให้ข้อมูลและเสริมพลัง",
        status: false,
      },
      {
        code: 128,
        title: "การดูแลต่อเนื่อง/ การเตือนนัด /การนัดหมาย F/U",
        status: false,
      },
      {
        code: 129,
        title: "สิทธิผู้ป่วย และจริยธรรมวิชาชีพ",
        status: false,
      },
      {
        code: 130,
        title: "สิ่งแวดล้อมเอื้อต่อการรักษา",
        status: false,
      },
      // {
      //   code: 199,
      //   title: "Remark",
      //   status: false,
      //   remark: "",
      // },
    ],
  },
  patientsupport:{
    topic: "ระบบงานสนับสนุนการดูแลผู้ป่วย",
    options: [
      {
        code: 201,
        title: "การส่งตรวจ  วิเคราะห์  รายงานผล  Lab.",
        status: false,
      },
      {
        code: 202,
        title: "การบริหารคลังโลหิต /ผลิตภัณฑ์จากโลหิต",
        status: false,
      },
      {
        code: 203,
        title: "การส่งตรวจ วิเคราะห์  รายงานผลด้านรังสี",
        status: false,
      },
      {
        code: 204,
        title: "Prescribing  Errors",
        status: false,
      },
      {
        code: 205,
        title: "Dispensing  Errors",
        status: false,
      },
      {
        code: 206,
        title: "Administration Errors (PSG 3)",
        status: false,
      },
      {
        code: 207,
        title:
          "เคมีบำบัด/  High Alert Drugs (PSG 3) /   Anaphylaxis/  Drug Interaction/ ADR",
        status: false,
      },
      {
        code: 208,
        title: "การบันทึกข้อมูลในเวชระเบียน / EMR",
        status: false,
      },
      {
        code: 209,
        title: "ระบบการเฝ้าระวังการติดเชื้อ/ป้องกัน(PSG5)",
        status: false,
      },
      {
        code: 210,
        title: "บริการจ่ายกลาง",
        status: false,
      },
      {
        code: 211,
        title: "บริการซักฟอก",
        status: false,
      },
      {
        code: 212,
        title: "บริการเคลื่อนย้ายผู้ป่วย",
        status: false,
      },
      {
        code: 213,
        title: "บริการรถพยาบาล",
        status: false,
      },
      {
        code: 214,
        title: "การรักษาสภาพศพ",
        status: false,
      },
      // {
      //   code: 299,
      //   title: "Remark",
      //   status: false,
      //   remark: "",
      // },
    ],
  },
  utility:{
    topic: "ระบบสาธารณูปโภค / ระบบสำรอง",
    options: [
      {
        code: 301,
        title: "น้ำประปา / น้ำสำรอง",
        status: false,
      },
      {
        code: 302,
        title: "ไฟฟ้า / ไฟฟ้าสำรอง",
        status: false,
      },
      {
        code: 303,
        title: "น้ำรั่ว / ท่อแตก",
        status: false,
      },
      {
        code: 304,
        title: "การคัดแยก / กำจัดขยะ / ของเสียอันตราย",
        status: false,
      },
      {
        code: 305,
        title: "ระบบบำบัดน้ำทิ้ง",
        status: false,
      },
      {
        code: 306,
        title: "การป้องกันอัคคีภัย",
        status: false,
      },
      {
        code: 307,
        title: "ปรับอากาศ / ระบายอากาศ",
        status: false,
      },
      {
        code: 308,
        title: "ก๊าซทางการแพทย์",
        status: false,
      },
      {
        code: 309,
        title: "ลิฟต์",
        status: false,
      },
      // {
      //   code: 399,
      //   title: "Remark",
      //   status: false,
      //   remark: "",
      // },
    ],
  },
  equipment:{
    topic: "ระบบเครื่องมือ / อุปกรณ์",
    options: [
      {
        code: 401,
        title: "ระบบคอมพิวเตอร์ / SSB",
        status: false,
      },
      {
        code: 402,
        title: "เครื่องมือทางการแพทย์",
        status: false,
      },
      {
        code: 403,
        title: "เวชภัณฑ์/วัสดุ /อุปกรณ์ทางการแพทย์",
        status: false,
      },
      {
        code: 404,
        title: "วัสดุ / อุปกรณ์ทั่วไป / อุปกรณ์สำนักงาน",
        status: false,
      },
      // {
      //   code: 499,
      //   title: "Remark",
      //   status: false,
      //   remark: "",
      // },
    ],
  },
  safety:{
    topic: "ความปลอดภัย และสิ่งแวดล้อม",
    options: [
      {
        code: 501,
        title: "โครงสร้าง อาคาร สถานที่",
        status: false,
      },
      {
        code: 502,
        title: "อากาศ / กลิ่น / ควัน",
        status: false,
      },
      {
        code: 503,
        title: "คนแปลกปลอม",
        status: false,
      },
      {
        code: 504,
        title: "ทรัพย์สิน (ผู้ใช้บริการ / รพ.)",
        status: false,
      },
      {
        code: 505,
        title: "อุบัติเหตุ",
        status: false,
      },
      {
        code: 506,
        title: "สัตว์พาหะ / สัตว์พิษ/ สัตว์รบกวน",
        status: false,
      },
      {
        code: 507,
        title: "อาชีวอนามัย",
        status: false,
      },
      // {
      //   code: 599,
      //   title: "Remark",
      //   status: false,
      //   remark: "",
      // },
    ],
  },
  service:{
    topic: "ระบบงานบริการ",
    options: [
      {
        code: 601,
        title: "การลงทะเบียน / ต้อนรับ",
        status: false,
      },
      {
        code: 602,
        title:
          "เวชระเบียน (จัดเก็บ/การส่ง/ลงรหัส/รักษาความลับ/เอกสารทางการแพทย์)",
        status: false,
      },
      {
        code: 603,
        title: "การรับผู้ป่วยใน / Day case surgery",
        status: false,
      },
      {
        code: 604,
        title: "กระบวนการบริหารจัดการด้านยา / คลังยา",
        status: false,
      },
      {
        code: 605,
        title: "ประเมินค่าใช้จ่าย/ สิทธิการรักษา",
        status: false,
      },
      {
        code: 606,
        title: "การคิดเงิน",
        status: false,
      },
      {
        code: 607,
        title: "โทรจองเวลาเข้าพบแพทย์ / โอนสาย",
        status: false,
      },
      {
        code: 608,
        title: "การรักษาความปลอดภัย",
        status: false,
      },
      {
        code: 609,
        title: "การตลาด / ลูกค้าสัมพันธ์",
        status: false,
      },
      {
        code: 610,
        title: "อาหาร/เครื่องดื่ม (ไม่ใช่ผู้ป่วย)",
        status: false,
      },
      {
        code: 611,
        title: "ความสะอาดสถานที่",
        status: false,
      },
      {
        code: 612,
        title: "พฤติกรรมบริการ",
        status: false,
      },
      // {
      //   code: 699,
      //   title: "Remark",
      //   status: false,
      //   remark: "",
      // },
    ],
  },
  management:{
    topic: "ระบบบริหารงาน",
    options: [
      {
        code: 701,
        title: "ระบบบริหารงานบุคคล",
        status: false,
      },
      {
        code: 702,
        title: "ระบบพัฒนาบุคลากร",
        status: false,
      },
      {
        code: 703,
        title: "สวัสดิการ / ค่าตอบแทน / ค่า DF",
        status: false,
      },
      {
        code: 704,
        title: "ระบบบัญชี – การเงิน",
        status: false,
      },
      {
        code: 705,
        title: "ระบบการติดตามหนี้",
        status: false,
      },
      {
        code: 706,
        title: "ระบบการตรวจสอบ",
        status: false,
      },
      {
        code: 707,
        title: "ระบบการจัดซื้อ – จัดจ้าง",
        status: false,
      },
      // {
      //   code: 799,
      //   title: "Remark",
      //   status: false,
      //   remark: "",
      // },
    ],
  },
};

export default DataDict_OccurrenceForm;
