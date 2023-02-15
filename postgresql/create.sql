CREATE SCHEMA IF NOT EXISTS time_tracker AUTHORIZATION postgres;
GRANT USAGE ON SCHEMA time_tracker TO postgres;
GRANT SELECT ON ALL TABLES IN SCHEMA time_tracker TO postgres;

CREATE TABLE IF NOT EXISTS time_tracker.time_tracker (
	id 		SERIAL,
	date	timestamp with time zone NOT NULL DEFAULT NOW(),
	activity varchar(32),
    cognito_uuid character varying(36)
);

INSERT INTO time_tracker.time_tracker 
(activity, cognito_uuid) 
VALUES ('testing', '63b0f404-d3e9-4e65-8b25-378de26e8cdd');

select * from time_tracker.time_tracker;

CREATE TABLE IF NOT EXISTS time_tracker.activity_list (
	id 		SERIAL,
	activity varchar(32),
    cognito_uuid character varying(36)
);

INSERT INTO time_tracker.activity_list 
(activity, cognito_uuid) 
VALUES ('Coding', '63b0f404-d3e9-4e65-8b25-378de26e8cdd');

INSERT INTO time_tracker.activity_list 
(activity, cognito_uuid) 
VALUES ('Reading', '63b0f404-d3e9-4e65-8b25-378de26e8cdd');

INSERT INTO time_tracker.activity_list 
(activity, cognito_uuid) 
VALUES ('Break', '63b0f404-d3e9-4e65-8b25-378de26e8cdd');

select * from time_tracker.activity_list;
