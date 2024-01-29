import os
from psycopg2 import pool, sql

_conn_pool = pool.SimpleConnectionPool(
    0,
    100,
    database=os.getenv("DB_NAME", "postgres"),
    host=os.getenv("DB_HOST", "localhost"),
    user=os.getenv("DB_USER", "postgres"),
    password=os.getenv("DB_PASS", "postgres"),
    port=os.getenv("DB_PORT", "5432"),
)


def get_pg_connection():
    try:
        conn = _conn_pool.getconn()
        return (conn, lambda: _conn_pool.putconn(conn))
    except Exception as err:
        print(err)
        raise err


def request_template(query, params):
    try:
        (conn, close_conn) = get_pg_connection()
        cursor = conn.cursor()
        cursor.execute(
            query,
            params,
        )
        conn.commit()
        return cursor.fetchall()
    except Exception as err:
        print(err)
        return "Bad Request", 400
    finally:
        if "cursor" in locals():
            cursor.close()
        if "close_conn" in locals():
            close_conn()


def delete_table_data(schema, table_name):
    try:
        (conn, close_conn) = get_pg_connection()
        cursor = conn.cursor()
        cursor.execute(
            sql.SQL("DELETE FROM {schema}.{table}").format(
                schema=sql.Identifier(schema),
                table=sql.Identifier(table_name),
            )
        )
        conn.commit()
        close_conn()
    except Exception as err:
        print(err)
