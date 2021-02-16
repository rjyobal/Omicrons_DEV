# OMICRON TEAM - NFL APP

# IMPORT OF LIBRARIES ---------

from bson import json_util
import json
from flask import Flask, jsonify, render_template
import pymongo
from scrape_nfl import nfl_dict, stats_dict, bowl_dict
import os

# DEFINE DATABASE AND INSERT CURRENT DATA ---------

conn = os.environ.get('DATABASE_URL','')
#conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)
db = client.nfl_db
db.teams.drop()
db.stats.drop()
db.bowl.drop()
db.teams.insert_one(nfl_dict)
db.stats.insert_one(stats_dict)
db.bowl.insert_one(bowl_dict)

# ------------- FLASK APPLICATION -----------

app = Flask(__name__)

# HOME FUNCTION ----------

@app.route("/")
def home():
    # return f"""
    # <h1>Welcome to Omicron Team NFL Project</h1>
    # <p>---------------------------------</p>
    # <h3>Routes available:</h3>
    # <p>/api/v1.0/teams (for total data registered)</p>
    # <p>/api/v1.0/stats (for 2020 stats)</p>
    # <p>/api/v1.0/bowl (for past SuperBowl data)</p>

    # <p>-----------------------------</p>"""
    return render_template('index.html')

# CUSTOM TEAMS JSON HOSTING FUNCTION -------------

@app.route("/api/v1.0/teams")
def rendering_home():
    conn = os.environ.get('DATABASE_URL','')
    #conn = "mongodb://localhost:27017"
    #client = pymongo.MongoClient(conn)
    db = client.nfl_db
    for i in db.teams.find():
        return json.dumps(i, indent=4, default=json_util.default)
    
    return jsonify(nfl_dict)

# CUSTOM 2020 STATS JSON HOSTING FUNCTION -------------

@app.route("/api/v1.0/stats")
def rendering_stats():
    conn = os.environ.get('DATABASE_URL','')
    #conn = "mongodb://localhost:27017"
    client = pymongo.MongoClient(conn)
    db = client.nfl_db
    for i in db.stats.find():
        return json.dumps(i, indent=4, default=json_util.default)

    return jsonify(stats_dict)

# CUSTOM SUPERBOWL JSON HOSTING FUNCTION -------------

@app.route("/api/v1.0/bowl")
def rendering_bowl():
    conn = os.environ.get('DATABASE_URL','')
    #conn = "mongodb://localhost:27017"
    client = pymongo.MongoClient(conn)
    db = client.nfl_db
    for i in db.bowl.find():
        return json.dumps(i, indent=4, default=json_util.default)

    return jsonify(bowl_dict)

# DEBUG FUNCTION ------------

if __name__ == "__main__":
    app.run(debug=True)