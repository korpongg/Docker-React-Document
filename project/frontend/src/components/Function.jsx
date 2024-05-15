import axios from "axios";

// เช็คสิทธิ์ Admin
// export function chkAdmin(param) {
//   if (new Set("3").has(param)) {
//     return true;
//   } else {
//     return false;
//   }
// }
export function chkAdmin(param) {
  return new Set("3").has(param);
}

// เช็คสิทธิ์ Admin และ Editor
// export function chkAdmins(param) {
//   if (new Set(["2", "3"]).has(param)) {
//     return true;
//   } else {
//     return false;
//   }
// }
export function chkAdmins(param) {
  return new Set(["2", "3"]).has(param);
}

export function isMobileChk() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ฟังก์ชั่นแปลง value ให้เป็นค่าเงิน โดยการเช็คค่าว่าเป็น string หรือ number
// export function varCurrency(params) {
//   if (params)
//     if (typeof params === "string") {
//       return parseFloat(params).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, });
//     } else {
//       return params.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, });
//     }
//   else
//   return '-';
// }
export function varCurrency(params) {
  return params ? 
    (typeof params === "string" ? parseFloat(params) : params).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
    : '0.00';
}

//ตรวจสอบ orderid ว่าเป็น ส่วนลดไหม || result : boolean
// export function chkDiscount(arr, code) {
//   if (arr.includes(code)) {
//     return true;
//   } else {
//     return false;
//   }
// }
export function chkDiscount(arr, code) {
  return arr.includes(code);
}

// เช็ค File Exitst
export async function checkFileExists(url) {
  try {
    const response = await axios.head(url);
    return response;
  } catch (error) {
    return false;
  }
}

//รวมยอดของ key ในอาเรย์โดยชี้ไปทีละชั้น
//const result = sumByKey(data, ['data_a', 'data_b', 'd']);
export function sumByKey(data, keys) {
  return data.reduce((acc, obj) => {
    let value = obj;

    for (const key of keys) {
      if (value && value.hasOwnProperty(key)) {
        value = value[key];
      } else {
        value = undefined;
        break;
      }
    }

    if (typeof value === "number") {
      return acc + value;
    }
    else {
      return acc + parseFloat(value);
    }

    // return acc;
  }, 0);
}
export function totalsumByKey(data, keys) {
  return data.reduce((acc, obj) => {
    let value = obj;

    for (const key of keys) {
      if (value && key in value) {
        value = value[key];
      } else {
        value = undefined;
        break;
      }
    }

    if (Array.isArray(value)) {
      // If the value is an array, sum the 'net_amount' values
      value = value.reduce((sum, item) => {
        if (item && item.net_amount) {
          return sum + parseFloat(item.net_amount);
        }
        return sum;
      }, 0);
    }

    if (typeof value === "number") {
      return acc + value;
    } else {
      return acc + parseFloat(value);
    }
  }, 0);
}

// GetDateWithFormat YYYY-MM-DD
export function GettodayDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}
export function ConvertDateFormat(date) {
  const currentDate = new Date(date);
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}
export function GetDebitMonth(date) {
  const currentDate = new Date(date);
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-01`;
  return formattedDate;
}

export function ConvertDatetoTH(datestring, fm) {
  const currentDate = new Date(datestring);
  var formatmonth = fm;
  var MonthList = {
    '01': 'ม.ค.',
    '02': 'ก.พ.',
    '03': 'มี.ค.',
    '04': 'เม.ย.',
    '05': 'พ.ค.',
    '06': 'มิ.ย.',
    '07': 'ก.ค.',
    '08': 'ส.ค.',
    '09': 'ก.ย.',
    '10': 'ต.ค.',
    '11': 'พ.ย.',
    '12': 'ธ.ค.',
  };

  if(formatmonth)
  {
    if(formatmonth==="full"||formatmonth==="fullcutdate")
    {
      MonthList = {
        '01': 'มกราคม',
        '02': 'กุมภาพันธ์',
        '03': 'มีนาคม',
        '04': 'เมษายน',
        '05': 'พฤษภาคม',
        '06': 'มิถุนายน',
        '07': 'กรกฎาคม',
        '08': 'สิงหาคม',
        '09': 'กันยายน',
        '10': 'ตุลาคม',
        '11': 'พฤศจิกายน',
        '12': 'ธันวาคม',
      };
    }
  }
  
  // console.log(MonthList['01']);
  const year = currentDate.getFullYear()+543;
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  
  const day = currentDate.getDate().toString().padStart(2, '0');
  
  if(formatmonth==="fullcutdate"){
    const formattedDate = `${MonthList[month]} ${year}`;
    return formattedDate;
  }else{
    const formattedDate = `${day} ${MonthList[month]} ${year}`;
    return formattedDate;
  }
  
}
//คำนวนอายุงาน
export function GetDays(startdate) {
  const currentDate = new Date();
  const notsocurrentDate = new Date(startdate);
  const timeDiff = currentDate - notsocurrentDate;
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  if(days<0){
    const zero = 0;
    const result = zero+" ปี "+zero+" เดือน "+zero+" วัน";
    return result;
  }else{
    const years = Math.floor(days / 365);
    const remainingDaysAfterYears = days % 365;

    const months = Math.floor(remainingDaysAfterYears / 30);
    const ldays = remainingDaysAfterYears % 30;

    const result = years+" ปี "+months+" เดือน "+ldays+" วัน";
    return result;
  }
  
}

//ผ่านวันไปรึยังนะ
export function isPassDate(thatdate) {
  const currentDate = new Date();
  const notsocurrentDate = new Date(thatdate);

  if (currentDate > notsocurrentDate) {
    return "ชำระแล้ว";
  }else{
    return "รอชำระ";
  }  
}

export function getFullMonthTH(ThatMonthNumber) {
  const MonthList = {
    '01': 'มกราคม',
    '02': 'กุมภาพันธ์',
    '03': 'มีนาคม',
    '04': 'เมษายน',
    '05': 'พฤษภาคม',
    '06': 'มิถุนายน',
    '07': 'กรกฎาคม',
    '08': 'สิงหาคม',
    '09': 'กันยายน',
    '10': 'ตุลาคม',
    '11': 'พฤศจิกายน',
    '12': 'ธันวาคม',
  };
return MonthList[ThatMonthNumber];
}

export function filteredDataByMonth(data, targetMonth){
  return data.filter(entry => {
    const visitDate = new Date(entry.visitdate);
    return visitDate.getMonth() + 1 === parseInt(targetMonth);
  });
};

export function formatDateTime(dateString, type) {
  if (dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Pad single-digit day, month, hours, minutes, and seconds with leading zeros
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    if (type === "full") {
      return `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else if (type === "time") {
      return `${formattedHours}:${formattedMinutes}`;
    } else {
      return `${formattedDay}/${formattedMonth}/${year}`;
    }
  }
}