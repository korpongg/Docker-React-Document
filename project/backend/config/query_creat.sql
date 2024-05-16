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

    [reportlocation] NVARCHAR(MAX) NOT NULL,
	[reportdate] [date] NOT NULL,
	[occurrencedate] [datetime] NOT NULL,
    [deptrelate] NVARCHAR(100) NOT NULL,

	[reporttype] [nvarchar](1) NOT NULL,
	[type] [nvarchar](1) NOT NULL,

	[acceptdate] [datetime] NULL,
	[responsedate] [datetime] NULL,
	[urgenttype] [nvarchar](1) NULL,
	[isnew] [nvarchar](1) NULL,

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

	[level] [nvarchar](1) NOT NULL,
	[description] NVARCHAR(MAX) NOT NULL,
	[effectremark] NVARCHAR(MAX) NOT NULL,

	[reportdoc] [nvarchar](1) NULL,
    [docname] NVARCHAR(100) NULL,

	[medicalrecorded] [nvarchar](1) NULL,

	[reportacknowledge] [nvarchar](1) NULL,

	[reportother] [nvarchar](1) NULL,
    [otherremark] NVARCHAR(100) NULL,

	[impromptusolution] NVARCHAR(MAX) NULL,
	[activefailure] NVARCHAR(MAX) NULL,
	[suggestion] NVARCHAR(MAX) NULL,

	[formstatus] [nvarchar](1) NULL,

	[createby] [varchar](20) NOT NULL,
	[acceptby] [varchar](20) NULL,
	[updateby] [varchar](20) NULL,
	[createAt] [datetime] NULL,
	[acceptAt] [datetime] NULL,
	[updateAt] [datetime] NULL,
	[deleteAt] [datetime] NULL,
);

--DELETE event_logs
--Drop table if exists [event_logs]
CREATE TABLE [event_logs](
	[id] INT IDENTITY(1,1),
	[reportid] [varchar](20) NOT NULL,
	[code] [varchar](20) NOT NULL,
    [deptrelate] NVARCHAR(100) NOT NULL,
	[acceptdate] [datetime] NULL,
	[responsedate] [datetime] NULL,
	[urgenttype] [nvarchar](1) NULL,
	[isnew] [nvarchar](1) NULL,
	[comment] NVARCHAR(MAX) NOT NULL,
	[type] [nvarchar](1) NOT NULL,
	[userid] [varchar](20) NOT NULL,
	[createAt] [datetime] NOT NULL DEFAULT GETDATE(),
);