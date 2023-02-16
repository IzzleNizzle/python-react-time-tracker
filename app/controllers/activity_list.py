from app.postgres_request.postgres_db import request_template


def update_user_activity_list(uuid, activity_list):
    try:
        clear_user_activity_list(uuid)
        query = """
                select * from time_tracker.time_tracker
                LIMIT 100;
                """
        resp = request_template(query, tuple())
        print(resp)

    except Exception as err:
        print(err)

    request_template


def clear_user_activity_list(uuid):
    try:
        query = """
                select * from time_tracker.time_tracker
                LIMIT 100;
                """
        args = (uuid,)
        resp = request_template(query, args)
        print(resp)

    except Exception as err:
        print(err)


def ateta():
    pass
