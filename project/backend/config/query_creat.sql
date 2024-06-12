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
	
	[hn] [nvarchar](20) NULL,
	[an] [nvarchar](20) NULL,
	[age] [nvarchar](20) NULL,
	[gender] [nvarchar](20) NULL,
    [dx] NVARCHAR(MAX) NULL,
    [pct] NVARCHAR(MAX) NULL,

    [reportlocation] NVARCHAR(MAX) NOT NULL,		-- สถานที่เกิดเหตุ
	-- [reportdate] [date] NOT NULL,
	[occurrencedate] [datetime] NOT NULL,			-- วัน-เวลาที่เกิดเหตุการณ์
    -- [affrelate] NVARCHAR(100) NOT NULL,
    [deptrelate] NVARCHAR(100) NOT NULL,			-- หน่วยงานที่เกี่ยวข้อง

	[reporttype] [nvarchar](1) NOT NULL,			-- ประเภทอุบัติการณ์	General Risk, Clinical Risk
	[type] NVARCHAR(3) NOT NULL,					-- ประเภทอุบัติการณ์	OPD, IPD

	[acceptdate] [datetime] NULL,
	[responsedate] [datetime] NULL,
	-- [urgenttype] [nvarchar](1) NULL,
	-- [isnew] [nvarchar](1) NULL,					-- อุบัติการณ์ใหม่, อุบัติการณ์ซ้ำ

	[patientcare] NVARCHAR(MAX) NULL,
	[patientcareremark] NVARCHAR(MAX) NULL,
	[patientsupport] NVARCHAR(MAX) NULL,
	[patientsupportremark] NVARCHAR(MAX) NULL,
	[utility] NVARCHAR(MAX) NULL,
	[utilityremark] NVARCHAR(MAX) NULL,
	[equipment] NVARCHAR(MAX) NULL,
	[equipmentremark] NVARCHAR(MAX) NULL,
	[safety] NVARCHAR(MAX) NULL,
	[safetyremark] NVARCHAR(MAX) NULL,
	[service] NVARCHAR(MAX) NULL,
	[serviceremark] NVARCHAR(MAX) NULL,
	[management] NVARCHAR(MAX) NULL,
	[managementremark] NVARCHAR(MAX) NULL,

	[level] [nvarchar](1) NOT NULL,					-- ระดับความเสี่ยง
	[description] NVARCHAR(MAX) NOT NULL,			-- บรรยายสรุปเหตุการณ์ (เกิดเหตุการณ์อะไร เกิดที่ไหน เกิดเมื่อไหร่ ใครคือผู้เกี่ยวข้อง เกี่ยวข้องอย่างไร)
	[renew] NVARCHAR(MAX) NULL,						-- สรุปรายละเอียดเหตุการณ์ by HA 
	[effectremark] NVARCHAR(MAX) NOT NULL,			-- ระบุความเสียหายที่เกิดขึ้น

	[reportdoc] [nvarchar](1) NULL,
    [docname] NVARCHAR(100) NULL,

	[medicalrecorded] [nvarchar](1) NULL,

	[reportacknowledge] [nvarchar](1) NULL,

	[reportother] [nvarchar](1) NULL,
    [otherremark] NVARCHAR(100) NULL,

	[impromptusolution] NVARCHAR(MAX) NULL,			-- การแก้ไขปัญหาเฉพาะหน้า
	[activefailure] NVARCHAR(MAX) NULL,				-- ความคลาดเคลื่อนที่เกิดขึ้น (Active Failure) : ระบุความผิดพลาด/การละเมิดต่อมาตรการที่เกิดขึ้น
	[suggestion] NVARCHAR(MAX) NULL,				-- ข้อเสนอแนะเพื่อการแก้ไขปัญหา / แนวทางแก้ไขปัญหา (ถ้ามี)

	[formstatus] [nvarchar](1) NOT NULL,			-- สถานะ Occ

	[createby] [varchar](20) NOT NULL,
	[createAt] [datetime] NULL,
	[updateby] [varchar](20) NULL,
	[updateAt] [datetime] NULL,
	[acceptby] [varchar](20) NULL,
	[acceptAt] [datetime] NULL,
	[deleteAt] [datetime] NULL,
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