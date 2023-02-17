import pytest

from app.controllers.activity_list import ateta
from app.postgres_request.postgres_db import request_template


@pytest.mark.parametrize(
    "test_input,expected",
    [
        pytest.param("Hello", "Hello!", id="Happy path"),
        pytest.param("mad", "mad!", id="Happy path"),
        pytest.param("angry", "angry!", id="Happy path"),
    ],
)
def test_test(monkeypatch, test_input, expected, trying_fixture):
    try:
        request_template("select * from time_tracker.time_tracker", tuple())
        resp = ateta()
        assert resp == expected
    except Exception as err:
        print(err)
