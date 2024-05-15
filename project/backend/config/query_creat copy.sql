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



CREATE TRIGGER InsertUserFromView
ON users
INSTEAD OF INSERT
AS
BEGIN
    -- Check if the userid already exists in the roles table
    IF NOT EXISTS (SELECT 1 FROM [dbo].[user] r INNER JOIN inserted i ON r.userid = i.userid)
    BEGIN
        -- If not exists, insert the record
        INSERT INTO [dbo].[user] (userid, hn, password, title, name, lastname, affiliation, jobtitle, faction, dep, role, level, createAt, updateAt, deleteAt)
        SELECT 
        userid, hn, password, title, name, lastname, affiliation, jobtitle, faction, dep, '1' AS role, '1' AS level, GETDATE(), GETDATE(), NULL
        FROM inserted;
    END
END;