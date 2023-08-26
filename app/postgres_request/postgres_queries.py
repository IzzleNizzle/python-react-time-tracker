clean_table = "DELETE FROM %s"


data_time_tracker = (
    ("Running", "63b0f404-d3e9-4e65-8b25-378de26e8cdd"),
    ("Shopping", "63b0f404-d3e9-4e65-8b25-378de26e8cdd"),
    ("Working", "63b0f404-d3e9-4e65-8b25-378de26e8cdd"),
    ("Reading", "63b0f404-d3e9-4e65-8b25-378de26e8cdd"),
    ("Tracking", "63b0f404-d3e9-4e65-8b25-378de26e8cdd"),
)

fill_time_tracker = (
    "INSERT INTO time_tracker.time_tracker (activity, cognito_uuid) VALUES %s"
)


fill_activity_list = (
    "INSERT INTO time_tracker.activity_list (activity, cognito_uuid) VALUES %s"
)

insert_time_record = """
    INSERT INTO time_tracker.time_tracker (date, activity, cognito_uuid)
    VALUES (%s, %s, %s);
                """
