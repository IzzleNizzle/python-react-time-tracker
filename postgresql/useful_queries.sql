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




-- Queries used for the dashboard
-- weekly
WITH latest_days AS (
    SELECT DISTINCT date_trunc('day', "date") AS day
    FROM time_tracker.time_tracker
    WHERE cognito_uuid = '63b0f404-d3e9-4e65-8b25-378de26e8cdd'
    ORDER BY day DESC
    LIMIT 7
)

SELECT activity,
    count(*) as count,
    MAX("date") as date
    FROM time_tracker.time_tracker
    JOIN latest_days
    ON latest_days.day = date_trunc(
        'day', time_tracker.time_tracker."date"
        )
    WHERE cognito_uuid = '63b0f404-d3e9-4e65-8b25-378de26e8cdd'
    GROUP BY activity,day
    ORDER BY day DESC;

-- daily
WITH latest_hours AS (
    SELECT DISTINCT date_trunc('hour', "date") AS hour
    FROM time_tracker.time_tracker
    WHERE cognito_uuid = '63b0f404-d3e9-4e65-8b25-378de26e8cdd'
    ORDER BY hour DESC
    LIMIT 24
)

SELECT activity,
    count(*) as count,
    MAX("date") as date
    FROM time_tracker.time_tracker
    JOIN latest_hours
    ON latest_hours.hour = date_trunc(
        'hour', time_tracker.time_tracker."date"
        )
    WHERE cognito_uuid = '63b0f404-d3e9-4e65-8b25-378de26e8cdd'
    GROUP BY activity,hour
    ORDER BY hour DESC;

-- monthly
WITH latest_days AS (
    SELECT DISTINCT date_trunc('day', "date") AS day
    FROM time_tracker.time_tracker
    WHERE cognito_uuid = '63b0f404-d3e9-4e65-8b25-378de26e8cdd'
    ORDER BY day DESC
    LIMIT 30
)
SELECT activity,
    count(*) as count,
    MAX("date") as date
    FROM time_tracker.time_tracker
    JOIN latest_days
    ON latest_days.day = date_trunc(
        'day', time_tracker.time_tracker."date"
        )
    WHERE cognito_uuid = '63b0f404-d3e9-4e65-8b25-378de26e8cdd'
    GROUP BY activity,day
    ORDER BY day DESC;




WITH latest_days AS (
                    SELECT DISTINCT date_trunc('day', "date") AS day
                    FROM time_tracker.time_tracker
                    WHERE cognito_uuid = 'daa38dbb-ee91-4898-b48d-61031c5965ed'
                    ORDER BY day DESC
                    LIMIT 7
                )

                SELECT activity,
                    count(*) as count,
                    MAX("date") as date
                    FROM time_tracker.time_tracker
                    JOIN latest_days ON latest_days.day = date_trunc('day', time_tracker.time_tracker."date")
                    where cognito_uuid = 'daa38dbb-ee91-4898-b48d-61031c5965ed'
                    GROUP BY activity,day
                    ORDER BY day DESC;


SELECT DISTINCT activity FROM time_tracker.time_tracker WHERE date("date") = '2023-01-15'

SELECT activity, count(*) as count, date_trunc('hour', "date") as hour FROM time_tracker.time_tracker WHERE date("date") = '2023-01-15' GROUP BY activity, hour ORDER BY count DESC;
SELECT activity, count(*) as count, date_trunc('hour', "date") as hour FROM time_tracker.time_tracker WHERE date("date") in ( '2023-01-15', '2023-01-16', '2023-01-17') GROUP BY activity, hour ORDER BY hour DESC;

-- i think this is the queyr that i want ot use
SELECT activity, count(*) as count, date_trunc('day', "date") as day, extract(dow from "date") as day_of_week FROM time_tracker.time_tracker GROUP BY activity, day, day_of_week ORDER BY day DESC;


-- now i want to know how i can adjust every time that's been inputed to be the uuid of my account
-- UPDATE time_tracker.time_tracker
-- SET cognito_uuid = 'daa38dbb-ee91-4898-b48d-61031c5965ed'



SELECT activity, count(*) as count, date_trunc('month', "date") as month FROM time_tracker.time_tracker GROUP BY activity, month ORDER BY count DESC;


SELECT * FROM time_tracker.time_tracker WHERE date_trunc('day', "date") = '2023-01-15'


SELECT * FROM time_tracker.time_tracker WHERE date("date") = '2023-01-15'



