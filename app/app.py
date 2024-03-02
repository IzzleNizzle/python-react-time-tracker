import psycopg2
import os
from flask import (
    Flask,
    session,
    redirect,
    send_from_directory,
    render_template,
    request,
)
import pandas as pd
import logging
from datetime import timedelta, datetime
from werkzeug.utils import secure_filename

from izauth.cognito import authenticate_with_cognito, logout
from controllers.time_tracker import get_hourly, get_weekly, get_monthly
from controllers.activity_list import (
    update_user_activity_list,
    get_activity_list,
    get_sessions_list,
)
from postgres_request.postgres_queries import insert_time_record
from flask_socketio import SocketIO
from dotenv import load_dotenv

logging.getLogger().setLevel(logging.DEBUG)

if os.getenv("FLASK_DEBUG") == "1":
    load_dotenv(".env")
    print("Environment variables loaded from .env file.")
else:
    print("FLASK_DEBUG is not set to 1; .env file not loaded.")


session_lifetime = timedelta(days=30)
app = Flask(__name__, static_folder="build/static", template_folder="build")
app.secret_key = os.environ.get("FLASK_SESSION_SECRET")
app.permanent_session_lifetime = session_lifetime
app.config["SESSION_PERMANENT"] = False
socketio = SocketIO(app, cors_allowed_origins="*")


@socketio.on("connect")
def handle_connect():
    logging.info("socketio.on(connect")
    print("Client connected")


@socketio.on("activity_change")
def handle_activity_change(activity):
    print(f"Received activity change: {activity}")
    # Broadcast to all clients
    socketio.emit("activity_change", activity)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
@authenticate_with_cognito
def serve(path):
    path = secure_filename(path)
    if path and os.path.exists(os.path.join(app.template_folder, path)):
        return send_from_directory(app.template_folder, path)
    else:
        return render_template("index.html")


@app.route("/manifest.json")
def manifest():
    return send_from_directory(app.template_folder, "manifest.json")


@app.route("/api/health")
def hello_world():
    logging.info("Health check")
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
            insert_time_record,
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


@app.route("/api/time/<string:timeframe>")
@authenticate_with_cognito
def get_times(timeframe):
    try:
        match timeframe:
            case "hourly":
                return get_hourly(session["uuid"])
            case "weekly":
                return get_weekly(session["uuid"])
            case "monthly":
                return get_monthly(session["uuid"])
            case _:
                return "Bad Request", 400
    except Exception as err:
        print(err)
        return "Bad Request", 400


@app.route("/api/activity-list", methods=["GET"])
@authenticate_with_cognito
def get_activity_list_items():
    try:
        activity_list = get_activity_list(session["uuid"])
        return {"data": activity_list}
    except Exception as err:
        print(err)
        return "Bad Request", 400


@app.route("/api/sessions-list/<int:days_lookback>", methods=["GET"])
@authenticate_with_cognito
def get_sessions_list_items(days_lookback):
    try:
        if days_lookback is None:
            return "Bad Request", 400
        sessions_list = get_sessions_list(session["uuid"], days_lookback)
        df = pd.DataFrame(
            sessions_list, columns=["id", "date", "activity", "cognito_uuid"]
        )
        df_sorted = df.sort_values("date", ascending=False)
        df_sorted["time_diff"] = df_sorted["date"].shift(1) - df_sorted["date"]
        high_time_delta_rows = df_sorted[
            df_sorted["time_diff"] > pd.Timedelta(minutes=15)
        ]
        high_delta_indexes = high_time_delta_rows.index.tolist()
        newest_index = df_sorted["date"].idxmax()
        lowest_index = 0
        session_index_tuples = list_to_tuples(
            high_delta_indexes, newest_index, lowest_index
        )
        session_slices = split_df_into_slices(df_sorted, session_index_tuples)
        final_data = final_data_shaping(session_slices)
        return {"data": final_data}
    except Exception as err:
        print(err)
        return "Bad Request", 400


def list_to_tuples(lst, newest_index, oldest_index):
    return [
        (
            (newest_index, lst[i])
            if i == 0
            else (lst[i], lst[i + 1] if i + 1 < len(lst) else oldest_index)
        )
        for i in range(len(lst))
    ]


def split_df_into_slices(df, slice_index_tuples):
    df_slices = []
    for i in range(0, len(slice_index_tuples), 1):
        df_slices.append(
            df.loc[(slice_index_tuples[i][0]) : (slice_index_tuples[i][1] + 1)]
        )
    return df_slices


def final_data_shaping(df_slices):
    final_data = []
    for i in range(0, len(df_slices), 1):
        final_data.append(
            {
                "date": df_slices[i]["date"].iloc[0].strftime("%Y-%m-%d"),
                "activity": df_slices[i].to_json(orient="records"),
            }
        )
    return final_data


@app.route("/api/activity-list", methods=["POST"])
@authenticate_with_cognito
def update_activity_list_items():
    try:
        json_data = request.get_json()
        if json_data["activityList"] is None:
            return "Bad Request", 400
        update_user_activity_list(session["uuid"], json_data["activityList"])
        activity_list = get_activity_list(session["uuid"])
        return {"data": activity_list}
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


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3009))
    socketio.run(app, host="0.0.0.0", port=port, debug=True)
