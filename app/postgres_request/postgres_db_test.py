import pytest
from app.postgres_request.postgres_db import request_template, get_pg_connection
from psycopg2 import sql
from psycopg2.extras import execute_values


@pytest.mark.parametrize(
    "test_input,expected",
    [
        pytest.param("Hello", "Hello!", id="Happy path"),
        pytest.param("mad", "mad!", id="Happy path"),
        pytest.param("angry", "angry!", id="Happy path"),
    ],
)
def test_easy(monkeypatch, test_input, expected):
    try:
        query = """
                select * from time_tracker.time_tracker
                LIMIT 100;
                """
        resp = request_template(query, tuple())
        print(resp)

    except Exception as err:
        print(err)


@pytest.mark.parametrize(
    "table_name,expected",
    [
        pytest.param("time_tracker.activity_list", "Hello!", id="Clear activity_list"),
        pytest.param("time_tracker.time_tracker", "mad!", id="Clear time_tracker"),
    ],
)
def test_delete_queries(monkeypatch, table_name, expected):
    try:
        (conn, close_conn) = get_pg_connection()
        cursor = conn.cursor()
        cursor.execute(
            sql.SQL("DELETE FROM {schema}.{table}").format(
                schema=sql.Identifier("time_tracker"),
                table=sql.Identifier("time_tracker"),
            )
        )
        conn.commit()

        cursor.execute("select * from time_tracker.time_tracker")

        assert cursor.fetchall() == []
        close_conn()

    except Exception as err:
        print(err)


@pytest.mark.parametrize(
    "table_name,expected",
    [
        pytest.param("time_tracker.activity_list", "Hello!", id="Clear activity_list"),
        pytest.param("time_tracker.time_tracker", "mad!", id="Clear time_tracker"),
    ],
)
def test_insert_queries(monkeypatch, table_name, expected):
    try:
        (conn, close_conn) = get_pg_connection()
        cursor = conn.cursor()
        values = (
            ("Running", "63b0f404-d3e9-4e65-8b25-378de26e8cdd"),
            ("Shopping", "63b0f404-d3e9-4e65-8b25-378de26e8cdd"),
            ("Working", "63b0f404-d3e9-4e65-8b25-378de26e8cdd"),
            ("Reading", "63b0f404-d3e9-4e65-8b25-378de26e8cdd"),
            ("Tracking", "63b0f404-d3e9-4e65-8b25-378de26e8cdd"),
        )
        execute_values(
            cursor,
            "INSERT INTO time_tracker.time_tracker (activity, cognito_uuid) VALUES %s",
            values,
        )
        conn.commit()
        cursor.execute("select * from time_tracker.time_tracker")

        assert len(cursor.fetchall()) >= 1
        close_conn()

    except Exception as err:
        print(err)
