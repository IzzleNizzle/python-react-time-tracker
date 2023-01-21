import psycopg2
from flask import Flask, request, render_template
import os
from datetime import datetime

app = Flask(__name__, static_folder="build/static", template_folder="build")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/health")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/api/time", methods=["POST"])
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


def get_time_stamp():
    timestamp = datetime.now()
    print(timestamp)
    return timestamp
