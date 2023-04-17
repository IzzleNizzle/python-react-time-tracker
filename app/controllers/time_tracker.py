from flask import Flask, session, redirect, render_template, request
from app.postgres_request.postgres_db import request_template
import pandas as pd


def get_daily():
    pass


def get_weekly():
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
            session["uuid"],
            session["uuid"],
        )
        data = request_template(query, params)
        data = pd.DataFrame(data, columns=["activity", "count", "date"])
        dates = pd.to_datetime(data["date"]).dt.strftime("%y-%m-%d")
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


def get_monthly():
    pass
