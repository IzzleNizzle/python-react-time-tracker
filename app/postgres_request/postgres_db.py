from psycopg2 import pool
import os

conn_pool = pool.SimpleConnectionPool(
    0,
    100,
    database=os.environ["DB_NAME"],
    host=os.environ["DB_HOST"],
    user=os.environ["DB_USER"],
    password=os.environ["DB_PASS"],
    port=os.environ["DB_PORT"],
)


def request_template(query, params):
    try:
        conn = psycopg2.connect(
            database=os.environ["DB_NAME"],
            host=os.environ["DB_HOST"],
            user=os.environ["DB_USER"],
            password=os.environ["DB_PASS"],
            port=os.environ["DB_PORT"],
        )
        cursor = conn.cursor()
        cursor.execute(
            query,
            params,
        )
        return cursor.fetchall()
    except Exception as err:
        print(err)
        return "Bad Request", 400
    finally:
        cursor.close()
        conn.close()
