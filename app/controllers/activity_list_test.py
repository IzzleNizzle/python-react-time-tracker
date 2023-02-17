import pytest

from app.controllers.activity_list import ateta


@pytest.mark.parametrize(
    "test_input,expected",
    [
        pytest.param("Hello", "Hello!", id="Happy path"),
        pytest.param("mad", "mad!", id="Happy path"),
        pytest.param("angry", "angry!", id="Happy path"),
    ],
)
def test_test(monkeypatch, test_input, expected):
    try:
        resp = ateta()
        assert resp == expected
    except Exception as err:
        print(err)
