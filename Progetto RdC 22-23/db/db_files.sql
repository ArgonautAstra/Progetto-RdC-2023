USE unihub;

CREATE TABLE File(
	fileId int PRIMARY KEY AUTO_INCREMENT,
	fileName varchar(255) NOT NULL,
	filePath varchar(255) NOT NULL,
	uploadDate DATETIME not null,
	uploadUser int references USER(id) NOT NULL
);

CREATE TABLE ProjectFiles(
	projectId int REFERENCES Project(projectId),
	fileId int REFERENCES File(fileId)
);