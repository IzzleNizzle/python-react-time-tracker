import psycopg2
import os
import pandas as pd
from flask import Flask, session, redirect, render_template, request
from datetime import timedelta, datetime

from app.izauth.cognito import authenticate_with_cognito, logout
from app.postgres_request.postgres_db import request_template

ENVIRONMENT = os.environ.get("ENVIRONMENT")
if ENVIRONMENT == "develop":
    session_lifetime = timedelta(minutes=1)
else:
    session_lifetime = timedelta(days=1)
app = Flask(__name__, static_folder="build/static", template_folder="build")
app.secret_key = os.environ.get("FLASK_SESSION_SECRET")
app.permanent_session_lifetime = session_lifetime
app.config["SESSION_PERMANENT"] = False


@app.route("/")
@authenticate_with_cognito
def index():
    return render_template("index.html")


@app.route("/api/health")
def hello_world():
    return "OK"


@app.route("/api/time", methods=["POST"])
@authenticate_with_cognito
def time_receive():
    try:
        conn = psycopg2.connect(
            database=os.environ["DB_NAME"],
            host=os.environ["DB_HOST"],
            user=os.environ["DB_USER"],
            password=os.environ["DB_PASS"],
            port=os.environ["DB_PORT"],
        )
        json_data = request.get_json()
        cursor = conn.cursor()
        mtn_timestamp = get_time_stamp()
        if json_data["activity"] is None:
            return "Bad Request", 400
        cursor.execute(
            """
                INSERT INTO time_tracker.time_tracker (date, activity, cognito_uuid)
                VALUES (%s, %s, %s);
                """,
            (mtn_timestamp, json_data["activity"], session["uuid"]),
        )
        conn.commit()
        return "OK"
    except Exception as err:
        print(err)
        return "Bad Request", 400
    finally:
        cursor.close()
        conn.close()


@app.route("/api/time", methods=["GET"])
@authenticate_with_cognito
def get_times():
    try:
        query = """
                select * from time_tracker.time_tracker
                WHERE cognito_uuid = %s;
                """
        params = (session["uuid"],)
        data = request_template(query, params)
        return data
    except Exception as err:
        print(err)
        return "Bad Request", 400


@app.route("/api/daily-time", methods=["GET"])
# @authenticate_with_cognito
def get_daily_times():
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
                    JOIN latest_days ON latest_days.day = date_trunc('day', time_tracker.time_tracker."date")
                    where cognito_uuid = %s
                    GROUP BY activity,day
                    ORDER BY day DESC;

                """
        params = (
            "daa38dbb-ee91-4898-b48d-61031c5965ed",
            "daa38dbb-ee91-4898-b48d-61031c5965ed",
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
            "headers": result.columns,
            "index": result.index,
            "values": result.values,
        }
        return better_response
    except Exception as err:
        print(err)
        return "Bad Request", 400


@app.route("/sign-in-redirect")
@authenticate_with_cognito
def sign_in_redirect():
    print(f'sign_in_redirect: Logged in as {session["uuid"]}')
    return redirect("/")


@app.route("/logout")
def user_logout():
    logout()
    return "OK"


def get_time_stamp():
    timestamp = datetime.now()
    print(timestamp)
    return timestamp
