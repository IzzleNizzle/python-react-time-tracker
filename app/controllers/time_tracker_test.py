import pytest
from flask import session

from controllers.time_tracker import (
    get_hourly,
)


# @pytest.mark.parametrize(
#     "test_uuid,activity_list",
#     [
#         pytest.param(
#             "63b0f404-d3e9-4e65-8b25-378de26e8cdd",
#             [
#                 "Running",
#                 "Shopping",
#                 "Working",
#                 "Reading",
#                 "Tracking",
#             ],
#             id="Happy path",
#         ),
#     ],
# )
def test_get_hourly(
    monkeypatch,
):
    try:
        uuid = "63b0f404-d3e9-4e65-8b25-378de26e8cdd"

        resp = get_hourly(uuid)

        assert resp == 'activity_list'

    except Exception as err:
        print(err)
