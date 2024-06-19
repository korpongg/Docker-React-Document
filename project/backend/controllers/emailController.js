const nodemailer = require("nodemailer");
const sequelize = require("../config/dbConn").sequelize;
const User = require("../models/User"); // Assuming you have a User model
const { Op } = require("sequelize"); // Import the Op object for Sequelize operators

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

function sendEmail(to, reportId, subject, text) {
  // Add <br/> for line breaks in HTML
  const htmlContent = `${text}<br/><br/><br/>
    เข้าสู่ระบบรายงานอุบัติการณ์: <a href="http://10.1.1.95:3001/login">Login</a><br/><br/>
    หากเข้าสู่ระบบแล้ว ดูรายงานอุบัติการณ์: <a href="http://10.1.1.95:3001/occurrence/form/${reportId}">ดูรายงาน</a>
  `;

  const mailOptions = {
    from: "mkt_design@thainakarin.co.th",
    to: to,
    subject: subject,
    html: htmlContent, // Use HTML-formatted content
  };

  console.log("Email sent to HA", mailOptions);

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

function sendEmailEvent(to, subject, text) {
  // Add <br/> for line breaks in HTML
  const htmlContent = `${text}<br/><br/><br/>
    เข้าสู่ระบบรายงานอุบัติการณ์: <a href="http://10.1.1.95:3001/login">Login</a><br/><br/>
    หากเข้าสู่ระบบแล้ว ดูรายงานอุบัติการณ์ที่เกี่ยวข้องกับแผนก: <a href="http://10.1.1.95:3001/occurrence/event">ดูรายงาน</a>
  `;

  const mailOptions = {
    from: "mkt_design@thainakarin.co.th",
    to: to,
    subject: subject,
    html: htmlContent, // Use HTML-formatted content
  };

  console.log("Email sent to Department", mailOptions);

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

function sendEmailEventHA(to, subject, text) {
  // Add <br/> for line breaks in HTML
  const htmlContent = `${text}<br/><br/><br/>
    เข้าสู่ระบบรายงานอุบัติการณ์: <a href="http://10.1.1.95:3001/login">Login</a><br/><br/>
    หากเข้าสู่ระบบแล้ว ดูรายงานอุบัติการณ์: <a href="http://10.1.1.95:3001/occurrence">ดูรายงานอุบัติการณ์</a><br/><br/>
    หรือ ดูรายงานอุบัติการณ์ที่เกี่ยวข้องกับแผนก: <a href="http://10.1.1.95:3001/occurrence/event">ดูรายงาน</a>
  `;

  const mailOptions = {
    from: "mkt_design@thainakarin.co.th",
    to: to,
    subject: subject,
    html: htmlContent, // Use HTML-formatted content
  };

  console.log("Email sent to Department", mailOptions);

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

module.exports = {
  sendEmail,
  sendEmailEvent,
  sendEmailEventHA,
  findDepartmentEmail,
};