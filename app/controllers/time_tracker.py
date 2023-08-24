from postgres_request.postgres_db import request_template
import pandas as pd


def get_hourly(uuid):
    try:
        query = """
                WITH latest_hours AS (
                    SELECT DISTINCT date_trunc('hour', "date") AS hour
                    FROM time_tracker.time_tracker
                    WHERE cognito_uuid = %s
                    ORDER BY hour DESC
                    LIMIT 24
                )

                SELECT activity,
                    count(*) as count,
                    MAX("date") as date
                    FROM time_tracker.time_tracker
                    JOIN latest_hours
                    ON latest_hours.hour = date_trunc(
                        'hour', time_tracker.time_tracker."date"
                        )
                    WHERE cognito_uuid = %s
                    GROUP BY activity,hour
                    ORDER BY hour DESC;

                """
        params = (
            uuid,
            uuid,
        )
        data = request_template(query, params)
        data = pd.DataFrame(data, columns=["activity", "count", "date"])
        data = date_to_est(data)
        dates = pd.to_datetime(data["date"]).dt.strftime("%y-%m-%d")
        data["activity"] = data["activity"].replace("", "None")
        weekday_series = pd.to_datetime(data["date"]).dt.strftime("%A")
        data["weekday"] = weekday_series
        data = data.rename(dates)
        data = data.sort_values("date")
        result = data.pivot_table(
            index="activity",
            columns="weekday",
            values="count",
            fill_value=0,
            sort=False,
        )
        better_response = {
            "headers": result.columns.tolist(),
            "index": result.index.tolist(),
            "values": result.values.tolist(),
        }
        return better_response
    except Exception as err:
        print(err)
        return "Bad Request", 400


def get_weekly(uuid):
    try:
        query = """
                WITH latest_days AS (
                    SELECT DISTINCT date_trunc('day', "date") AS day
                    FROM time_tracker.time_tracker
                    WHERE cognito_uuid = %s
                    ORDER BY day DESC
                    LIMIT 7
                )

                SELECT activity,
                    count(*) as count,
                    MAX("date") as date
                    FROM time_tracker.time_tracker
                    JOIN latest_days
                    ON latest_days.day = date_trunc(
                        'day', time_tracker.time_tracker."date"
                        )
                    WHERE cognito_uuid = %s
                    GROUP BY activity,day
                    ORDER BY day DESC;

                """
        params = (
            uuid,
            uuid,
        )
        data = request_template(query, params)
        data = pd.DataFrame(data, columns=["activity", "count", "date"])
        dates = date_to_est(data)
        weekday_series = pd.to_datetime(data["date"]).dt.strftime("%A")
        data["activity"] = data["activity"].replace("", "None")
        data["weekday"] = weekday_series
        data = data.rename(dates)
        data = data.sort_values("date")
        result = data.pivot_table(
            index="activity",
            columns="weekday",
            values="count",
            fill_value=0,
            sort=False,
        )
        better_response = {
            "headers": result.columns.tolist(),
            "index": result.index.tolist(),
            "values": result.values.tolist(),
        }
        return better_response
    except Exception as err:
        print(err)
        return "Bad Request", 400


def get_monthly(uuid):
    try:
        query = """
                WITH latest_days AS (
                    SELECT DISTINCT date_trunc('day', "date") AS day
                    FROM time_tracker.time_tracker
                    WHERE cognito_uuid = %s
                    ORDER BY day DESC
                    LIMIT 30
                )
                SELECT activity,
                    count(*) as count,
                    MAX("date") as date
                    FROM time_tracker.time_tracker
                    JOIN latest_days
                    ON latest_days.day = date_trunc(
                        'day', time_tracker.time_tracker."date"
                        )
                    WHERE cognito_uuid = %s
                    GROUP BY activity,day
                    ORDER BY day DESC;

                """
        params = (
            uuid,
            uuid,
        )
        data = request_template(query, params)
        data = pd.DataFrame(data, columns=["activity", "count", "date"])
        dates = date_to_est(data)
        weekday_series = pd.to_datetime(data["date"]).dt.strftime("%m-%d - %A")
        data["weekday"] = weekday_series
        data = data.rename(dates)
        data = data.sort_values("date")
        data["activity"] = data["activity"].replace("", "None")
        result = data.pivot_table(
            index="activity",
            columns="weekday",
            values="count",
            fill_value=0,
            sort=False,
        )
        better_response = {
            "headers": result.columns.tolist(),
            "index": result.index.tolist(),
            "values": result.values.tolist(),
        }
        return better_response
    except Exception as err:
        print(err)
        return "Bad Request", 400


def date_to_est(df):
    df["date"] = pd.to_datetime(df["date"])
    df["date"] = df["date"].dt.tz_convert("US/Eastern")
    df["date"] = df["date"].dt.strftime("%Y-%m-%d %H:%M:%S")
    return df
