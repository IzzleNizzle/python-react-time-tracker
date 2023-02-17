import pytest

from app.postgres_request.postgres_db import request_template


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
