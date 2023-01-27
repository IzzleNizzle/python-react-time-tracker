import os
from flask import Flask, session, redirect, send_file
from datetime import timedelta

from app.izauth.cognito import authenticate_with_cognito, logout

app = Flask(__name__, static_folder="build/static", template_folder="build")
app.secret_key = os.environ.get("FLASK_SESSION_SECRET")
app.permanent_session_lifetime = timedelta(minutes=1)
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
                INSERT INTO time_tracker.time_tracker (date, activity)
                VALUES (%s, %s);
                """,
            (mtn_timestamp, json_data["activity"]),
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
        conn = psycopg2.connect(
            database=os.environ["DB_NAME"],
            host=os.environ["DB_HOST"],
            user=os.environ["DB_USER"],
            password=os.environ["DB_PASS"],
            port=os.environ["DB_PORT"],
        )
        cursor = conn.cursor()
        cursor.execute(
            """
                select * from time_tracker.time_tracker;
                """
        )
        return cursor.fetchall()
    except Exception as err:
        print(err)
        return "Bad Request", 400
    finally:
        cursor.close()
        conn.close()


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
