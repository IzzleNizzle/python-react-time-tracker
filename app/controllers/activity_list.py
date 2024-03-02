from datetime import datetime, timedelta
from psycopg2.extras import execute_values
from postgres_request.postgres_db import request_template, get_pg_connection


def get_activity_list(uuid):
    query = """
        select activity from time_tracker.activity_list
        WHERE cognito_uuid = %s;
        """
    params = (uuid,)
    data = request_template(query, params)
    return [activity[0] for activity in data]


def get_sessions_list(uuid, days_lookback):
    current_date = datetime.now().date()
    start_date = current_date - timedelta(days=days_lookback)
    query = f"""
        SELECT *
        FROM time_tracker.time_tracker
        WHERE cognito_uuid = %s
        AND date >= %s;
    """
    params = (uuid, start_date)
    data = request_template(query, params)
    return data


def update_user_activity_list(uuid, activity_list):
    try:
        clear_user_activity_list(uuid)
        uuid_activity_list = create_activity_list_w_uuid(uuid, activity_list)
        return insert_activity_list(uuid_activity_list)

    except Exception as err:
        print(err)


def insert_activity_list(uuid_activity_list):
    try:
        (conn, close_conn) = get_pg_connection()
        cursor = conn.cursor()
        execute_values(
            cursor,
            "INSERT INTO time_tracker.activity_list (activity, cognito_uuid) VALUES %s",
            uuid_activity_list,
        )
        conn.commit()
        cursor.execute("select * from time_tracker.time_tracker")
        close_conn()
        return True

    except Exception as err:
        print(err)


def create_activity_list_w_uuid(uuid, activity_list):
    activity_tuple = tuple((activity, uuid) for activity in activity_list)
    return activity_tuple


def clear_user_activity_list(uuid):
    try:
        query = """
                DELETE FROM time_tracker.activity_list WHERE cognito_uuid = %s;
                """
        args = (uuid,)
        resp = request_template(query, args)
        print(resp)

    except Exception as err:
        print(err)
