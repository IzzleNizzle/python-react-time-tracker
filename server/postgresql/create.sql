-- DROP TABLE time_tracker;

CREATE TABLE IF NOT EXISTS time_tracker (
	id 		SERIAL,
	date	timestamp with time zone NOT NULL DEFAULT NOW(),
	activity varchar(32)
);


INSERT INTO time_tracker 
(activity) 
VALUES ('testing')


select * from time_tracker

select * from time_tracker
where activity = 'testing'
order by date desc



