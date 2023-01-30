-- DROP TABLE time_tracker.time_tracker;

CREATE TABLE IF NOT EXISTS time_tracker.time_tracker (
	id 		SERIAL,
	date	timestamp with time zone NOT NULL DEFAULT NOW(),
	activity varchar(32),
    cognito_uuid character varying(36)
);


INSERT INTO time_tracker.time_tracker 
(activity) 
VALUES ('testing')


select * from time_tracker.time_tracker

select * from time_tracker.time_tracker
where activity = 'testing'
order by date desc


-- ALTER TABLE time_tracker.time_tracker
-- ADD COLUMN cognito_uuid character varying(36);
