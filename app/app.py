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
import logging
from datetime import timedelta, datetime
from werkzeug.utils import secure_filename

from izauth.cognito import authenticate_with_cognito, logout
from controllers.time_tracker import get_hourly, get_weekly, get_monthly
from controllers.activity_list import (
    update_user_activity_list,
    get_activity_list,
)
from postgres_request.postgres_queries import insert_time_record

logging.getLogger().setLevel(logging.DEBUG)

session_lifetime = timedelta(days=30)
app = Flask(__name__, static_folder="build/static", template_folder="build")
app.secret_key = os.environ.get("FLASK_SESSION_SECRET")
app.permanent_session_lifetime = session_lifetime
app.config["SESSION_PERMANENT"] = False


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
