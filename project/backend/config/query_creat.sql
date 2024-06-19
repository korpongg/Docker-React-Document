USE occurrence;

CREATE VIEW users AS
SELECT 
    id,
    userid,
    hn,
    password,
    title,
    name,
    lastname,
    affiliation,
    jobtitle,
    faction,
    dep,
    lof,
    startw,
    probation,
    insurance,
    opdamt,
    ipdamt,
    createAt,
    updateAt,
    deleteAt
FROM [tnh_welfare].[dbo].[users]



-- Switch the database context to tnh_welfare
USE tnh_welfare;
GO

-- Drop the existing trigger if it exists
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'InsertRolesTrigger')
BEGIN
    DROP TRIGGER InsertRolesTrigger;
END
GO

-- Create the trigger
CREATE TRIGGER InsertRolesTrigger
ON dbo.users
AFTER INSERT
AS
BEGIN
    -- Check if the userid already exists in the roles table
    IF NOT EXISTS (SELECT 1 FROM [occurrence].[dbo].[roles] r INNER JOIN inserted i ON r.userid = i.userid)
    BEGIN
        -- If not exists, insert the record
        INSERT INTO [occurrence].[dbo].roles (userid, roles, level)
        SELECT 
            userid,
            '1' AS roles,
            '1' AS level
        FROM inserted;
    END
END


---- Create Table User
PRINT 'Creating [user] Table'
GO

--DELETE [user]
--Drop table if exists [user]
CREATE TABLE [user] (
       [id] INT IDENTITY(1,1) PRIMARY KEY
	  ,[userid] NVARCHAR(20) NOT NULL
      ,[hn] NVARCHAR(20) NULL
      ,[password] NVARCHAR(255) NULL
      ,[title] NVARCHAR(20) NULL
      ,[name] NVARCHAR(30) NULL
      ,[lastname] NVARCHAR(30) NULL
      ,[affiliation] NVARCHAR(100) NULL
      ,[jobtitle] NVARCHAR(100) NULL
      ,[faction] NVARCHAR(100) NULL
      ,[dep] NVARCHAR(100) NULL
	  ,[role] NVARCHAR(1) NULL
	  ,[level] NVARCHAR(1) NULL
	  ,[createAt] [datetime] NULL 
	  ,[updateAt] [datetime] NOT NULL DEFAULT GETDATE()
	  ,[deleteAt] [date] NULL 
);

INSERT INTO [dbo].[user] (userid, hn,password,title,name , lastname,affiliation, jobtitle,faction,dep,role,level)
SELECT userid, hn,password,title,name , lastname,affiliation, jobtitle,faction,dep, '1' AS role,'1' AS level
FROM [dbo].[users];



--DELETE affiliation
--Drop table if exists [affiliation]
CREATE TABLE [affiliation](
	[id] INT IDENTITY(1,1),
    [name] NVARCHAR(MAX) NOT NULL,
);

--DELETE faction
--Drop table if exists [faction]
CREATE TABLE [faction](
	[id] INT IDENTITY(1,1),
	[relateid] INT NOT NULL,
    [name] NVARCHAR(MAX) NOT NULL,
);

--DELETE department
--Drop table if exists [department]
CREATE TABLE [department](
	[id] INT IDENTITY(1,1),
	[relateid] INT NOT NULL,
    [name] NVARCHAR(MAX) NOT NULL,
    [email] VARCHAR(50) NULL
);

SELECT d.id,
	d.name AS DepName,
	a.id AS AffID,
	a.name AS AffName
	FROM [occurrence].[dbo].[department] d
	LEFT JOIN [occurrence].[dbo].[affiliation] a ON a.id = d.[relateid]


--DELETE occurrences
--Drop table if exists [occurrences]
CREATE TABLE [occurrences](
	[id] INT IDENTITY(1,1) PRIMARY KEY,
	[reportid] [varchar](20) NULL,
	
	[hn] [nvarchar](20) NULL,						-- HN
	[an] [nvarchar](20) NULL,						-- AN
	[age] [nvarchar](20) NULL,						-- อายุ
	[gender] [nvarchar](20) NULL,					-- เพศ
    [dx] NVARCHAR(MAX) NULL,						-- Dx
    [pct] NVARCHAR(MAX) NULL,						-- PCT ที่เกี่ยวข้อง

    [reportlocation] NVARCHAR(MAX) NOT NULL,		-- สถานที่เกิดเหตุ
	-- [reportdate] [date] NOT NULL,
	[occurrencedate] [datetime] NOT NULL,			-- วัน-เวลาที่เกิดเหตุการณ์
    -- [affrelate] NVARCHAR(100) NOT NULL,
    [deptrelate] NVARCHAR(100) NOT NULL,			-- หน่วยงานที่เกี่ยวข้อง

	[reporttype] [nvarchar](1) NOT NULL,			-- ประเภทอุบัติการณ์	General Risk, Clinical Risk
	[type] NVARCHAR(3) NOT NULL,					-- ประเภทอุบัติการณ์	OPD, IPD

	[acceptdate] [datetime] NULL,					-- วันที่รับเรื่อง (ยังไม่ได้ใช้งาน)
	[responsedate] [datetime] NULL,					-- วันที่รับคืน (ยังไม่ได้ใช้งาน)
	-- [urgenttype] [nvarchar](1) NULL,				-- เร่งด่วน, ไม่เร่งด่วน
	-- [isnew] [nvarchar](1) NULL,					-- อุบัติการณ์ใหม่, อุบัติการณ์ซ้ำ

	[patientcare] NVARCHAR(MAX) NULL,				-- 1. กระบวนการดูแลผู้ป่วย
	[patientcareremark] NVARCHAR(MAX) NULL,			-- 1- อื่นๆ
	[patientsupport] NVARCHAR(MAX) NULL,			-- 2. ระบบงานสนับสนุนการดูแลผู้ป่วย
	[patientsupportremark] NVARCHAR(MAX) NULL,		-- 2- อื่นๆ
	[utility] NVARCHAR(MAX) NULL,					-- 3. ระบบสาธารณูปโภค / ระบบสำรอง
	[utilityremark] NVARCHAR(MAX) NULL,				-- 3- อื่นๆ
	[equipment] NVARCHAR(MAX) NULL,					-- 4.ระบบเครื่องมือ / อุปกรณ์
	[equipmentremark] NVARCHAR(MAX) NULL,			-- 4- อื่นๆ
	[safety] NVARCHAR(MAX) NULL,					-- 5. ความปลอดภัย และสิ่งแวดล้อม
	[safetyremark] NVARCHAR(MAX) NULL,				-- 5- อื่นๆ
	[service] NVARCHAR(MAX) NULL,					-- 6. ระบบงานบริการ
	[serviceremark] NVARCHAR(MAX) NULL,				-- 6- อื่นๆ
	[management] NVARCHAR(MAX) NULL,				-- 7. ระบบบริหารงาน
	[managementremark] NVARCHAR(MAX) NULL,			-- 7- อื่นๆ

	[level] [nvarchar](1) NOT NULL,					-- ระดับความรุนแรงของเหตุการณ์
	[description] NVARCHAR(MAX) NOT NULL,			-- บรรยายสรุปเหตุการณ์ (เกิดเหตุการณ์อะไร เกิดที่ไหน เกิดเมื่อไหร่ ใครคือผู้เกี่ยวข้อง เกี่ยวข้องอย่างไร)
	[renew] NVARCHAR(MAX) NULL,						-- สรุปรายละเอียดเหตุการณ์ by HA 
	[effectremark] NVARCHAR(MAX) NOT NULL,			-- ระบุความเสียหายที่เกิดขึ้น

	[reportdoc] [nvarchar](1) NULL,					-- รายงานแพทย์
    [docname] NVARCHAR(100) NULL,					-- ชื่อแพทย์

	[medicalrecorded] [nvarchar](1) NULL,			-- การบันทึก เวชระเบียน

	[reportacknowledge] [nvarchar](1) NULL,			-- รายงานหัวหน้าแผนก / ผู้จัดการฝ่าย / ผู้ตรวจการพยาบาล รับทราบ

	[reportother] [nvarchar](1) NULL,				-- อื่นๆ
    [otherremark] NVARCHAR(100) NULL,				-- ระบุอื่นๆ

	[impromptusolution] NVARCHAR(MAX) NULL,			-- การแก้ไขปัญหาเฉพาะหน้า
	[activefailure] NVARCHAR(MAX) NULL,				-- ความคลาดเคลื่อนที่เกิดขึ้น (Active Failure) : ระบุความผิดพลาด/การละเมิดต่อมาตรการที่เกิดขึ้น
	[suggestion] NVARCHAR(MAX) NULL,				-- ข้อเสนอแนะเพื่อการแก้ไขปัญหา / แนวทางแก้ไขปัญหา (ถ้ามี)

	[formstatus] [nvarchar](1) NOT NULL,			-- สถานะ Occ
	[comment] NVARCHAR(MAX) NULL,					-- หมายเหตุการปิดอุบัติการณ์ by HA

	[createby] [varchar](20) NOT NULL,				-- ผู้ร้องเรียน
	[createAt] [datetime] NULL,						-- วันที่ร้องเรียน
	[updateby] [varchar](20) NULL,					-- ผู้แก้ไข
	[updateAt] [datetime] NULL,						-- วันที่แก้ไข
	[acceptby] [varchar](20) NULL,					-- ผู้รับ (ยังไม่ได้ใช้งาน)
	[acceptAt] [datetime] NULL,						-- วันที่รับ (ยังไม่ได้ใช้งาน)
	[deleteAt] [datetime] NULL,						-- วันที่ลบ (ยกเลิก formstatus 3)
);

--DELETE event_logs
--Drop table if exists [event_logs]
CREATE TABLE [event_logs](
	[id] INT IDENTITY(1,1),
	[reportid] [varchar](20) NOT NULL,					-- Parent Report ID : 0010524
	[code] [varchar](20) NOT NULL,						-- Running No with reportid-running no : 0010524-01, -02
    -- [affrelate] INT NULL,							-- สังกัดที่เกี่ยวข้อง by HA
    [deptrelate] INT NOT NULL,							-- แผนกที่เกี่ยวข้อง by HA
	[urgenttype] [nvarchar](1) NOT NULL,				-- ความเร่งด่วน by HA
	[isnew] [nvarchar](1) NULL,							-- อุบัติการณ์ใหม่, อุบัติการณ์ซ้ำ by HA
	[summarydetail] NVARCHAR(MAX) NOT NULL,				-- สรุปเหตุการณ์ไม่พึงประสงค์ by HA
	[risk] NVARCHAR(MAX) NULL,							-- สรุปเหตุการณ์ความเสี่ยง / เหตุการณ์ไม่พึงประสงค์ที่เกิดขึ้น by deptrelate
	[factors] NVARCHAR(MAX) NULL,						-- ปัจจัยกระตุ้นที่ส่งผลต่อความผิดพลาด / การละเมิดต่อมาตรการป้องกันที่เกิดขึ้น by deptrelate
	[comment] NVARCHAR(MAX) NULL,						-- สาเหตุที่แท้จริงของความเสี่ยง / เหตุการณ์ไม่พึงประสงค์ที่เกิดขึ้น by deptrelate
	[suggestion] NVARCHAR(MAX) NULL,					-- แนวทางการแก้ไขปัญหา / มาตรการป้องกันความเสี่ยงที่กำหนดขึ้น by deptrelate
	[forwardtxt] NVARCHAR(MAX) NULL,					-- สิ่งที่หน่วยงานต้องการประสานงานกับหน่วยงานอื่น / คณะกรรมการที่เกี่ยวข้อง by deptrelate
	[status] [nvarchar](1) NOT NULL,					-- ส่งทบทวน หลังจากสร้าง 1, ทบทวนแล้ว	มีการอัพเดท comment 2, ทบทวนซ้ำ	กดจากปุ่ม จะโชว์เฉพาะ 2
	[createby] [varchar](20) NOT NULL,					-- create by HA
	[createAt] [datetime] NOT NULL DEFAULT GETDATE(),	-- วันที่สร้าง
	[acceptby] [varchar](20) NULL,						-- คนรับเรื่อง อัพเดท comment
	[acceptAt] [datetime] NULL,							-- วันที่รับเรื่อง อัพเดท comment
	[repeatAt] [datetime] NULL,							-- วันที่ทบทวนซ้ำ
	[responsedate] [datetime] NULL,						-- วันที่รับคืน (ยังไม่มีการอัพเดทข้อมูลในส่วนนี้)
);

--DELETE medication
--Drop table if exists [medication]
CREATE TABLE [medication](
	[id] INT IDENTITY(1,1) PRIMARY KEY,
	[reportid] [varchar](20) NULL,
	
	[hn] [nvarchar](20) NULL,						-- HN
	[an] [nvarchar](20) NULL,						-- AN
	[age] [nvarchar](20) NULL,						-- อายุ
	[gender] [nvarchar](20) NULL,					-- เพศ
    [dx] NVARCHAR(MAX) NULL,						-- Dx
    [pct] NVARCHAR(MAX) NULL,						-- PCT ที่เกี่ยวข้อง
	
	[occurrencedate] [datetime] NOT NULL,			-- วัน-เวลาที่เกิดเหตุการณ์
    [deptrelate] INT NOT NULL,						-- หน่วยงานที่เกี่ยวข้อง

	[reporttype] [nvarchar](1) NOT NULL,			-- ประเภทอุบัติการณ์	General Risk, Clinical Risk
	[type] NVARCHAR(3) NOT NULL,					-- ประเภทอุบัติการณ์	OPD, IPD

	[acceptdate] [datetime] NULL,					-- วันที่รับเรื่อง (ยังไม่ได้ใช้งาน)
	[responsedate] [datetime] NULL,					-- วันที่รับคืน (ยังไม่ได้ใช้งาน)

	[prescribing] NVARCHAR(MAX) NULL,				-- 1. ความคลาดเคลื่อนในการสั่งใช้ยา - คัดลอกยา
	[prescribingremark] NVARCHAR(MAX) NULL,			-- 1- อื่นๆ
	[dispensing] NVARCHAR(MAX) NULL,				-- 2. ความคลาดเคลื่อนในการจัดยา - จ่ายยา
	[dispensingremark] NVARCHAR(MAX) NULL,			-- 2- อื่นๆ
	[administration] NVARCHAR(MAX) NULL,			-- 3. ความคลาดเคลื่อนในการบริหารยา
	[administrationremark] NVARCHAR(MAX) NULL,		-- 3- อื่นๆ

	[description] NVARCHAR(MAX) NOT NULL,			-- บรรยายสรุปเหตุการณ์ที่เกิดชึ้น
	[level] [nvarchar](1) NOT NULL,					-- ระดับความรุนแรงของเหตุการณ์
	[effect] NVARCHAR(MAX) NOT NULL,				-- ผลลัพธ์ที่เกิดขึ้น
	[effectremark] NVARCHAR(MAX) NULL,				-- ระบบงาน ระบุผลกระทบที่เกิดขึ้น
	[drugrelate] NVARCHAR(MAX) NOT NULL,			-- กลุ่มยาที่เกิดปัญหา
	[drugremark] NVARCHAR(MAX) NULL,				-- อื่นๆ

	[renew] NVARCHAR(MAX) NULL,						-- สรุปรายละเอียดเหตุการณ์ by HA 

	[reportdoc] [nvarchar](1) NULL,					-- รายงานแพทย์
    [docname] NVARCHAR(100) NULL,					-- ชื่อแพทย์

	[medicalrecorded] [nvarchar](1) NULL,			-- การบันทึก เวชระเบียน

	[reportacknowledge] [nvarchar](1) NULL,			-- รายงานหัวหน้าแผนก / ผู้จัดการฝ่าย / ผู้ตรวจการพยาบาล รับทราบ

	[reportother] [nvarchar](1) NULL,				-- อื่นๆ
    [otherremark] NVARCHAR(100) NULL,				-- ระบุอื่นๆ

	[analysis] NVARCHAR(MAX) NULL,					-- ผลการวิเคราะห์สาเหตุ	by mng
	[solution] NVARCHAR(MAX) NULL,					-- แนวทางการแก้ไข / ป้องกันปัญหาในเชิงระบบ by mng

	[rca] NVARCHAR(MAX) NULL,						-- สรุปผลการงิเคราะห์สาเหตุที่แท้จริง by mng
	[rcaremark] NVARCHAR(MAX) NULL,					-- อื่นๆ (ระบุ) by mng

	[formstatus] [nvarchar](1) NOT NULL,			-- สถานะ medication
	[comment] NVARCHAR(MAX) NULL,					-- หมายเหตุการปิด medication by HA

	[createby] [varchar](20) NOT NULL,				-- ผู้ร้องเรียน
	[createAt] [datetime] NULL,						-- วันที่ร้องเรียน
	[updateby] [varchar](20) NULL,					-- ผู้แก้ไข
	[updateAt] [datetime] NULL,						-- วันที่แก้ไข
	[approveby] [varchar](20) NULL,					-- ผู้รับ by mng
	[approveAt] [datetime] NULL,					-- วันที่รับ by mng
	[deleteAt] [datetime] NULL,						-- วันที่ลบ (ยกเลิก formstatus 3)
);




INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('คลังยา', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('คอลเซ็นเตอร์', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('เคหกรรม', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('งานอาคารและรักษาความปลอดภัย', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ซักรีด', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ดูแลรักษาความสะอาด', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('บริการทั่วไป และประสานงานกลาง', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('บริหารงานเวชสารและธุรการ', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('บริหารจัดการแฟ้ม', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('บริหารจัดการระบบเบิกจ่ายภาครัฐ', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ประเมินราคา และ Finance', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ประสานสิทธิ์', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('เภสัชกรรมคลินิก', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ยานพาหนะ', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ลงทะเบียนผู้ป่วยและเดินแฟ้ม', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ลูกค้าสัมพันธ์', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('วิเคราะห์โรค', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('เวชระเบียนอิเล็กทรอนิกส์', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('เวชสถิติ', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('เวรเปล', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ศูนย์สารสนเทศทางยา', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('โอเปอเรเตอร์', 1);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('Digital Marketing & Creative', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('Events', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('การเงินกลาง', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('การเงินนอก', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('การเงินผู้ป่วยนอก', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('การเงินผู้ป่วยใน', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('การตลาดองค์กร', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('การพัฒนาองค์กร', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ค่าตอบแทนและผลประโยชน์', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('จัดซื้อเครื่องมือแพทย์ ยา และเวชภัณฑ์', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('จัดซื้อทั่วไป', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ซ่อมบำรุง', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ตรวจสอบคุณภาพการบันทึกเวชระเบียน', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('บริการ', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('บริหารโครงการเทคโนโลยีสารสนเทศ', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('บริหารจัดการฐานข้อมูล และสารสนเทศขององค์กร', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('บริหารจัดการหนี้', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('บัญชีจ่าย', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('บัญชีทั่วไป', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('บัญชีบริหาร', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('บันทึกเวลา', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ปฏิบัติการควบคุมอุปกรณ์คอมพิวเตอร์ และระบบเครือข่าย', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('พัฒนาซอฟต์แวร์', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('พัฒนาทรัพยากรมนุษย์', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('พัฒนาผลิตภัณฑ์', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('โภชนบำบัด', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('โภชนาการ', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ระบบคอมพิวเตอร์ทางธุรกิจองค์กร', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('รับและทะเบียนคุม', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('สนับสนุนงานระบบ', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('สรรหาและว่าจ้าง', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('สวัสดิการและสร้างเสริมสุขภาพ', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('สารสนเทศทรัพยากรมนุษย์', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('โสตทัศนูปกรณ์', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ออกแบบและควบคุมโครงการ', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ไอที', 2);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('กองตรวจการพยาบาล', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('คลินิกแพทย์แผนจีน', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ฉุกเฉิน', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ซีซียู', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ไตเทียม', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ทันตกรรม', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ทารกแรกเกิด', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ผิวหนัง', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('พยาบาล', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('พัฒนาบุคลากรทางการพยาบาล', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('รับผู้ป่วยใน', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('วิสัญญี', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ศัลยกรรม', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ศูนย์กระดูกและข้อ', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ศูนย์ตรวจสุขภาพ', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ศูนย์ตา', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ศูนย์ทางเดินอาหาร', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ศูนย์ปลูกถ่ายไต', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ศูนย์มะเร็งและรังสีรักษา', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ศูนย์เวชศาสตร์ชะลอวัย', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ศูนย์สมองและระบบประสาท', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ศูนย์สูติ-นรีเวช', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ศูนย์หัวใจคนไข้นอก', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('สราญรมย์', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('สวนหัวใจ', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('สำนักงานพยาบาล', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('หน่วยจ่ายกลาง', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ห้องคลอด', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ห้องผ่าตัด', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ห้องพยาบาลประจำบริษัทคู่สัญญา', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ห้องยาผู้ป่วยนอก', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ห้องยาผู้ป่วยใน', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('หอผู้ป่วยในชั้น 10', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('หอผู้ป่วยในชั้น 5', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('หอผู้ป่วยในชั้น 6', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('หอผู้ป่วยในชั้น 7', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('หอผู้ป่วยในชั้น 8', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('หอผู้ป่วยในชั้น 9', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('หู คอ จมูก', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('อายุรกรรม', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ไอซียู', 3);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ควบคุมเอกสารคุณภาพ', 4);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('บริหารข้อร้องเรียน', 4);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('บริหารอุบัติการณ์', 4);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('กายภาพบำบัด', 5);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('กิจกรรมบำบัด', 5);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('กุมารเวช', 5);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('คลังพัสดุ', 6);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ธุรการ', 6);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('ธุรการ นิติการ', 6);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('นิติการ', 6);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('สำนักอำนวยการบริหาร', 6);
INSERT INTO [occurrence].[dbo].[department] ([name], [relateid]) VALUES ('สำนักอำนวยการแพทย์', 6);




-----------------------


INSERT INTO department (relateid, name, email) VALUES ('1', 'คลังยา', 'pharmaciststore@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('1', 'คอลเซ็นเตอร์', 'callcenter@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('1', 'เคหกรรม', 'hks@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('1', 'งานอาคารและรักษาความปลอดภัย', 'sec@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('1', 'ซักรีด', 'hks@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('1', 'ดูแลรักษาความสะอาด', 'hks@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('1', 'บริการทั่วไป และประสานงานกลาง', 'hks@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('1', 'บริหารงานเวชสารและธุรการ', NULL);
INSERT INTO department (relateid, name, email) VALUES ('1', 'บริหารจัดการแฟ้ม', 'medicalrecord@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('1', 'บริหารจัดการระบบเบิกจ่ายภาครัฐ', 'rmd@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('1', 'ประเมินราคา และ Finance', 'insurance@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('1', 'ประสานสิทธิ์', 'Insurance@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('1', 'เภสัชกรรมคลินิก', 'pharmaciststore@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('1', 'ยานพาหนะ', 'car_g@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('1', 'ลงทะเบียนผู้ป่วยและเดินแฟ้ม', 'registration@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('1', 'ลูกค้าสัมพันธ์', 'international@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('1', 'วิเคราะห์โรค', 'labtnh@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('1', 'เวชระเบียนอิเล็กทรอนิกส์', 'EMR@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('1', 'เวชสถิติ', 'coder@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('1', 'เวรเปล', NULL);
INSERT INTO department (relateid, name, email) VALUES ('1', 'ศูนย์สารสนเทศทางยา', 'dis@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('1', 'โอเปอเรเตอร์', 'opt_b@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'Digital Marketing & Creative', 'corporatesales@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'Events', 'Marketing@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'การเงินกลาง', 'fc@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'การเงินนอก', 'cashier_opd@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'การเงินผู้ป่วยนอก', 'cashier_opd@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'การเงินผู้ป่วยใน', 'cashier_ipd@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'การตลาดองค์กร', 'corporatesales@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'การพัฒนาองค์กร', NULL);
INSERT INTO department (relateid, name, email) VALUES ('2', 'ค่าตอบแทนและผลประโยชน์', 'hrm_recruit@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'จัดซื้อเครื่องมือแพทย์ ยา และเวชภัณฑ์', 'purchase@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'จัดซื้อทั่วไป', 'purchase@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'ซ่อมบำรุง', 'eng_b@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'ตรวจสอบคุณภาพการบันทึกเวชระเบียน', 'medicalrecord@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'บริการ', 'opt_b@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'บริหารโครงการเทคโนโลยีสารสนเทศ', 'mis@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'บริหารจัดการฐานข้อมูล และสารสนเทศขององค์กร', 'mis@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'บริหารจัดการหนี้', 'credit@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'บัญชีจ่าย', 'account@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'บัญชีทั่วไป', 'account@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'บัญชีบริหาร', 'account@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'บันทึกเวลา', 'hris2@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'ปฏิบัติการควบคุมอุปกรณ์คอมพิวเตอร์ และระบบเครือข่าย', 'mis@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'พัฒนาซอฟต์แวร์', 'mis@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'พัฒนาทรัพยากรมนุษย์', 'training@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'พัฒนาผลิตภัณฑ์', NULL);
INSERT INTO department (relateid, name, email) VALUES ('2', 'โภชนบำบัด', 'cddg@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'โภชนาการ', 'nut_g@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'ระบบคอมพิวเตอร์ทางธุรกิจองค์กร', 'mis@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'รับและทะเบียนคุม', 'account@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'สนับสนุนงานระบบ', 'hrm_dev@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'สรรหาและว่าจ้าง', 'hrm_recruit@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'สวัสดิการและสร้างเสริมสุขภาพ', 'hrm_welfare@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'สารสนเทศทรัพยากรมนุษย์', 'hris2@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'โสตทัศนูปกรณ์', 'hrm_dev@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'ออกแบบและควบคุมโครงการ', 'eng_b@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('2', 'ไอที', 'ittnh@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'กองตรวจการพยาบาล', 'refaral@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'คลินิกแพทย์แผนจีน', 'ctm@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ฉุกเฉิน', 'err_g@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ซีซียู', 'ccu@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ไตเทียม', 'HEM@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ทันตกรรม', 'dental@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ทารกแรกเกิด', 'nsy_5@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ผิวหนัง', 'skin@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'พยาบาล', 'don@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'พัฒนาบุคลากรทางการพยาบาล', 'don@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'รับผู้ป่วยใน', 'admit@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'วิสัญญี', 'ane_2@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ศัลยกรรม', 'sur_g@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ศูนย์กระดูกและข้อ', 'bone@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ศูนย์ตรวจสุขภาพ', 'tnh-checkup@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ศูนย์ตา', 'eye_opd@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ศูนย์ทางเดินอาหาร', 'mgi@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ศูนย์ปลูกถ่ายไต', 'tckttnh@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ศูนย์มะเร็งและรังสีรักษา', 'hoc@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ศูนย์เวชศาสตร์ชะลอวัย', 'wellness@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ศูนย์สมองและระบบประสาท', 'bnc@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ศูนย์สูติ-นรีเวช', 'opg@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ศูนย์หัวใจคนไข้นอก', 'heart@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'สราญรมย์', 'mhc@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'สวนหัวใจ', 'ccu@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'สำนักงานพยาบาล', 'don@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'หน่วยจ่ายกลาง', 'suppaly@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ห้องคลอด', 'lrr_2@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ห้องผ่าตัด', 'OR@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ห้องพยาบาลประจำบริษัทคู่สัญญา', 'don@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ห้องยาผู้ป่วยนอก', 'phr_l@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ห้องยาผู้ป่วยใน', 'phr_6@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'หอผู้ป่วยในชั้น 10', 'ward10@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'หอผู้ป่วยในชั้น 5', 'ward5@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'หอผู้ป่วยในชั้น 6', 'ward6@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'หอผู้ป่วยในชั้น 7', 'ward7@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'หอผู้ป่วยในชั้น 8', 'ward8@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'หอผู้ป่วยในชั้น 9', 'ward9@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'หู คอ จมูก', 'ent_l@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'อายุรกรรม', 'med_g@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('3', 'ไอซียู', 'icu_1@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('4', 'ควบคุมเอกสารคุณภาพ', 'qdc@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('4', 'บริหารข้อร้องเรียน', 'qdc@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('4', 'บริหารอุบัติการณ์', 'qdc@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('5', 'กายภาพบำบัด', 'ptt_l@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('5', 'กิจกรรมบำบัด', 'ptt_l@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('5', 'กุมารเวช', 'ped@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('6', 'คลังพัสดุ', 'str2_11@thainakarin.co.th');
INSERT INTO department (relateid, name, email) VALUES ('6', 'ธุรการ', 'lgb_3@thainakarin.coth');
INSERT INTO department (relateid, name, email) VALUES ('6', 'ธุรการ นิติการ', 'legal@thainakarin.coth');
INSERT INTO department (relateid, name, email) VALUES ('6', 'นิติการ', 'legal@thainakarin.coth');
INSERT INTO department (relateid, name, email) VALUES ('6', 'สำนักอำนวยการบริหาร', 'mdo@thainakarin.coth');
INSERT INTO department (relateid, name, email) VALUES ('6', 'สำนักอำนวยการแพทย์', 'doctor@thainakarin.co.th');