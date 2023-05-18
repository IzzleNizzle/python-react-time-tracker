weekly_counts = '''
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
    JOIN latest_days
    ON latest_days.day = date_trunc(
        'day', time_tracker.time_tracker."date"
        )
    WHERE cognito_uuid = 'daa38dbb-ee91-4898-b48d-61031c5965ed'
    GROUP BY activity,day
    ORDER BY day DESC;
    '''
