from psycopg2.extras import execute_values
from app.postgres_request.postgres_db import request_template, get_pg_connection


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
