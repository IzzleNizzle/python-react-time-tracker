import pytest

from psycopg2.extras import execute_values
from app.postgres_request.postgres_db import (
    get_pg_connection,
    delete_table_data,
)
from app.postgres_request.postgres_queries import (
    data_time_tracker,
    fill_time_tracker,
    fill_activity_list,
)


@pytest.fixture()
def postgres_seed_data_fixture():
    """Seed db before tests, delete after."""
    # Clean Tables
    delete_table_data("time_tracker", "time_tracker")
    delete_table_data("time_tracker", "activity_list")
    # Setup : seed db
    (conn, close_conn) = get_pg_connection()
    cursor = conn.cursor()
    data_time_tracker

    execute_values(
        cursor,
        fill_time_tracker,
        data_time_tracker,
    )

    execute_values(
        cursor,
        fill_activity_list,
        data_time_tracker,
    )

    conn.commit()
    close_conn()

    yield  # this is where the testing happens
