import pytest

from controllers.activity_list import (
    clear_user_activity_list,
    update_user_activity_list,
    get_activity_list,
)
from postgres_request.postgres_db import request_template


@pytest.mark.parametrize(
    "test_uuid,activity_list",
    [
        pytest.param(
            "63b0f404-d3e9-4e65-8b25-378de26e8cdd",
            [
                "Running",
                "Shopping",
                "Working",
                "Reading",
                "Tracking",
            ],
            id="Happy path",
        ),
    ],
)
def test_get_activity_list(
    monkeypatch, test_uuid, activity_list, postgres_seed_data_fixture
):
    try:
        resp = get_activity_list(test_uuid)

        assert resp == activity_list

    except Exception as err:
        print(err)


@pytest.mark.parametrize(
    "test_uuid,activity_list",
    [
        pytest.param(
            "63b0f404-d3e9-4e65-8b25-378de26e8cdd",
            [
                "Running",
                "Shopping",
                "Working",
                "Reading",
                "Tracking",
            ],
            id="Happy path",
        ),
        pytest.param(
            "63b0f404-d3e9-4e65-8b25-378de26e8cdd",
            ["Greeting", "Smiling", "Turning"],
            id="Happy path",
        ),
    ],
)
def test_input_activity_list(
    monkeypatch, test_uuid, activity_list, postgres_seed_data_fixture
):
    try:
        resp = update_user_activity_list(test_uuid, activity_list)
        data_resp = request_template(
            "select * from time_tracker.activity_list WHERE cognito_uuid = %s",
            (test_uuid,),
        )
        slim_data = [row[1] for row in data_resp]
        assert resp is True
        assert slim_data == activity_list

    except Exception as err:
        print(err)


@pytest.mark.parametrize(
    "test_input,expected",
    [
        pytest.param("63b0f404-d3e9-4e65-8b25-378de26e8cdd", [], id="Happy path"),
    ],
)
def test_clear_activity_list(
    monkeypatch, test_input, expected, postgres_seed_data_fixture
):
    try:
        clear_user_activity_list(test_input)
        data_resp = request_template(
            "select * from time_tracker.activity_list", tuple()
        )
        assert data_resp == expected
    except Exception as err:
        print(err)
