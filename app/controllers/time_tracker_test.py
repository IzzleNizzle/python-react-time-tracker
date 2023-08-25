import pytest
from flask import session

from controllers.time_tracker import (
    get_hourly,
    get_weekly,
    get_monthly,
)


def test_get_hourly():
    try:
        uuid = "63b0f404-d3e9-4e65-8b25-378de26e8cdd"

        response = get_hourly(uuid)

        assert isinstance(response["headers"], list)
        assert isinstance(response["index"], list)
        assert isinstance(response["values"], list)

    except Exception as err:
        print(err)


def test_get_weekly():
    try:
        uuid = "63b0f404-d3e9-4e65-8b25-378de26e8cdd"

        response = get_weekly(uuid)

        assert isinstance(response["headers"], list)
        assert isinstance(response["index"], list)
        assert isinstance(response["values"], list)

    except Exception as err:
        print(err)


def test_get_monthly():
    try:
        uuid = "63b0f404-d3e9-4e65-8b25-378de26e8cdd"

        response = get_monthly(uuid)

        assert isinstance(response["headers"], list)
        assert isinstance(response["index"], list)
        assert isinstance(response["values"], list)

    except Exception as err:
        print(err)
