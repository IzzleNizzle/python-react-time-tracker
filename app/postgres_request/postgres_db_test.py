import pytest

from app.postgres_request.postgres_db import testing_easy, conn_pool


@pytest.mark.parametrize(
    "test_input,expected",
    [
        pytest.param("Hello", "Hello!", id="Happy path"),
        pytest.param("mad", "mad!", id="Happy path"),
        pytest.param("angry", "angry!", id="Happy path"),
    ],
)
def test_easy(monkeypatch, test_input, expected):
    # Arrange
    monkeypatch.setenv("some_env", "na for this test")

    # Act
    actual = testing_easy(test_input)
    conn = conn_pool.getconn()
    cursor = conn.cursor()
    query = """
                select * from time_tracker.time_tracker
                LIMIT 100;
                """
    cursor.execute(query)
    print(cursor.fetchall())
    # Assert
    assert actual == expected
