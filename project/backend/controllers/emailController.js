const nodemailer = require("nodemailer");
const sequelize = require("../config/dbConn").sequelize;
const User = require("../models/User"); // Assuming you have a User model
const { Op } = require("sequelize"); // Import the Op object for Sequelize operators
const HA_EMAIL = process.env.HA_EMAIL;

let transporter = nodemailer.createTransport({
  host: "smtp.csloxinfo.com",
  port: 25,
  secure: false,
  auth: {
    user: "mkt_design@thainakarin.co.th",
    pass: "123456*z",
  },
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

const sendEmail = async (to, reportId, subject, text) => {
  try {
    const htmlContent = `${text}<br/><br/><br/>
      เข้าสู่ระบบรายงานอุบัติการณ์: <a href="https://occurences.thainakarin.co.th/login">Login</a><br/><br/>
      หากเข้าสู่ระบบแล้ว ดูรายงานอุบัติการณ์: <a href="https://occurences.thainakarin.co.th/occurrence/form/${reportId}">ดูรายงาน</a>`;

    const mailOptions = {
      from: "mis@thainakarin.co.th",
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
      cc,
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
      from: "mis@thainakarin.co.th",
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

const sendEmailMed = async (to, reportId, subject, text) => {
  try {
    const htmlContent = `${text}<br/><br/><br/>
      เข้าสู่ระบบรายงานความคลาดเคลื่อนยา: <a href="https://occurences.thainakarin.co.th/login">Login</a><br/><br/>
      หากเข้าสู่ระบบแล้ว ดูรายงานความคลาดเคลื่อนยา: <a href="https://occurences.thainakarin.co.th/medication/form/${reportId}">ดูรายงาน</a>`;

    const mailOptions = {
      from: "mis@thainakarin.co.th",
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

module.exports = {
  sendEmail,
  sendExecEmail,
  sendEmailEvent,
  sendEmailEventHA,
  sendEmailMed,
  findDepartmentEmail,
};