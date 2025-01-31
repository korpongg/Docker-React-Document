const nodemailer = require("nodemailer");
const sequelize = require("../config/dbConn").sequelize;
const User = require("../models/User"); // Assuming you have a User model
const { Op } = require("sequelize"); // Import the Op object for Sequelize operators
const HA_EMAIL = process.env.HA_EMAIL;
const MIS_EMAIL = process.env.MIS_EMAIL;

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

const findDepartmentEmail = async ( reportCode ) => {
  if (!reportCode) return ["Report Code required"]; // Return an array with an error message

  try {
    let resultQuery = "";
    
    resultQuery = `
      DECLARE @reportCode VARCHAR(20) = :reportCode;
      
      SELECT TOP (1) d.[email] AS email
      FROM [dbo].[event_logs] AS e
      LEFT JOIN [dbo].[department] AS d ON d.id = e.deptrelate
      WHERE e.code = @reportCode`;

    const queryOptions = {
      replacements: { reportCode },
      type: sequelize.QueryTypes.SELECT, // Ensure it's treated as a SELECT query
    };

    const results = await sequelize.query(resultQuery, queryOptions);

    if (!results || results.length === 0) {
      return [`Report Code ${reportCode} not found`]; // Return an array with an error message
    }

    console.log("Email From Query:", results[0].email);
    return results[0].email; // Return the email directly
  } catch (err) {
    console.error(err);
    throw new Error("An error occurred.");
  }
};

const findMedDepartmentEmail = async ( reportCode ) => {
  if (!reportCode) return ["Report Code required"]; // Return an array with an error message

  try {
    let resultQuery = "";
    
    resultQuery = `
      DECLARE @reportCode VARCHAR(20) = :reportCode;
      
      SELECT TOP (1) d.[email] AS email
      FROM [dbo].[medication] AS m
      LEFT JOIN [dbo].[department] AS d ON d.id = m.deptrelate
      WHERE m.reportid = @reportCode`;

    const queryOptions = {
      replacements: { reportCode },
      type: sequelize.QueryTypes.SELECT, // Ensure it's treated as a SELECT query
    };

    const results = await sequelize.query(resultQuery, queryOptions);

    if (!results || results.length === 0) {
      return [`Report Code ${reportCode} not found`]; // Return an array with an error message
    }

    console.log("Email From Query:", results[0].email);
    return results[0].email; // Return the email directly
  } catch (err) {
    console.error(err);
    throw new Error("An error occurred.");
  }
};

const sendEmail = async (to, reportId, subject, text) => {
  try {
    const htmlContent = `${text}<br/><br/><br/>
      เข้าสู่ระบบรายงานอุบัติการณ์: <a href="https://occurences.thainakarin.co.th/login">Login</a><br/><br/>
      หากเข้าสู่ระบบแล้ว ดูรายงานอุบัติการณ์: <a href="https://occurences.thainakarin.co.th/occurrence/form/${reportId}">ดูรายงาน</a>`;

    const mailOptions = {
      from: MIS_EMAIL,
      to,
      subject,
      html: htmlContent,
    };

    console.log("Sending email with options:", mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendExecEmail = async (to, cc, reportId, subject, html) => {
  try {
    const mailOptions = {
      from: HA_EMAIL,
      to,
      // cc,
      subject,
      html,
    };

    console.log("Sending email with options:", mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendGenericEmail = async (to, subject, text, link) => {
  try {
    const htmlContent = `${text}<br/><br/><br/>
      เข้าสู่ระบบรายงานอุบัติการณ์: <a href="https://occurences.thainakarin.co.th/login">Login</a><br/><br/>
      หากเข้าสู่ระบบแล้ว ${link}`;

    const mailOptions = {
      from: HA_EMAIL,
      to,
      subject,
      html: htmlContent,
    };

    console.log("Sending generic email with options:", mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending generic email:", error);
  }
};

const sendEmailEvent = (to, subject, text) => {
  const link = `ดูรายงานอุบัติการณ์ที่เกี่ยวข้องกับแผนก: <a href="https://occurences.thainakarin.co.th/occurrence/event">ดูรายงาน</a>`;
  return sendGenericEmail(to, subject, text, link);
};

const sendEmailEventHA = (to, subject, text) => {
  const link = `ดูรายงานอุบัติการณ์: <a href="https://occurences.thainakarin.co.th/occurrence">ดูรายงานอุบัติการณ์</a><br/><br/>
    หรือ ดูรายงานอุบัติการณ์ที่เกี่ยวข้องกับแผนก: <a href="https://occurences.thainakarin.co.th/occurrence/event">ดูรายงาน</a>`;
  return sendGenericEmail(to, subject, text, link);
};

const sendMedicationEmail = async (from, to, subject, text, link) => {
  try {
    const htmlContent = `${text}<br/><br/><br/>
      เข้าสู่ระบบรายงานความคลาดเคลื่อนทางยา: <a href="https://occurences.thainakarin.co.th/login">Login</a><br/><br/>
      หากเข้าสู่ระบบแล้ว ${link}`;

    const mailOptions = {
      from,
      to,
      subject,
      html: htmlContent,
    };

    console.log("Sending generic email with options:", mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending generic email:", error);
  }
};

const sendEmailMed = async (to, reportId, subject, text) => {
  const from = MIS_EMAIL;
  const link = `ดูรายงานความคลาดเคลื่อนทางยา: <a href="https://occurences.thainakarin.co.th/medication/form/${reportId}">ดูรายงาน</a>`;
  return sendMedicationEmail(from, to, subject, text, link);
};

const sendEmailMedEvent = (to, reportId, subject, text) => {
  const from = HA_EMAIL;
  const link = `ดูรายงานความคลาดเคลื่อนทางยาที่เกี่ยวข้องกับแผนก: <a href="https://occurences.thainakarin.co.th/medication/${reportId}">ดูรายงาน</a>`;
  return sendMedicationEmail(from, to, subject, text, link);
};
const sendEmailMedEventHA = (to, reportId, subject, text) => {
  const from = MIS_EMAIL;
  const link = `ดูรายงานความคลาดเคลื่อนทางยา: <a href="https://occurences.thainakarin.co.th/medication/${reportId}">ดูรายงาน</a>`;
  return sendMedicationEmail(from, to, subject, text, link);
};

module.exports = {
  sendEmail,
  sendExecEmail,
  sendEmailEvent,
  sendEmailEventHA,
  sendEmailMed,
  sendEmailMedEvent,
  sendEmailMedEventHA,
  findDepartmentEmail,
  findMedDepartmentEmail,
};