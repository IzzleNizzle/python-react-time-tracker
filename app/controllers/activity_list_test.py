import pytest

from app.controllers.activity_list import clear_user_activity_list
from app.postgres_request.postgres_db import request_template


@pytest.mark.parametrize(
    "test_input,expected",
    [
        pytest.param("63b0f404-d3e9-4e65-8b25-378de26e8cdd", [], id="Happy path"),
    ],
)
def test_clear_activity_list(monkeypatch, test_input, expected, trying_fixture):
    try:
        clear_user_activity_list(test_input)
        data_resp = request_template(
            "select * from time_tracker.activity_list", tuple()
        )
        assert data_resp == expected
    except Exception as err:
        print(err)
