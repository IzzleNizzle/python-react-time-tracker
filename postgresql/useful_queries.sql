select * from time_tracker.time_tracker
order by date desc
limit 250;



SELECT DISTINCT activity FROM time_tracker.time_tracker WHERE date("date") = '2023-01-15';

SELECT activity, count(*) as count, date_trunc('hour', "date") as hour FROM time_tracker.time_tracker WHERE date("date") = '2023-01-15' GROUP BY activity, hour ORDER BY count DESC;
SELECT activity, count(*) as count, date_trunc('hour', "date") as hour FROM time_tracker.time_tracker WHERE date("date") in ( '2023-01-15', '2023-01-16', '2023-01-17') GROUP BY activity, hour ORDER BY hour DESC;


SELECT activity, count(*) as count, date_trunc('day', "date") as day, extract(dow from "date") as day_of_week FROM time_tracker.time_tracker GROUP BY activity, day, day_of_week ORDER BY day DESC;

SELECT activity, count(*) as count, date_trunc('month', "date") as month FROM time_tracker.time_tracker GROUP BY activity, month ORDER BY count DESC;


SELECT * FROM time_tracker.time_tracker WHERE date_trunc('day', "date") = '2023-01-15';


SELECT * FROM time_tracker.time_tracker WHERE date("date") = '2023-01-15';



