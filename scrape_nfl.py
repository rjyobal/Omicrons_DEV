# // IMPORT OF MODULES //

import json
import csv
import pandas as pd

# // DEFINE LIST //

with open('Data/nfl_teams.json') as json_file:
    allteams = json.load(json_file)
    list_teams=[]
    list_teams.append(allteams)
 
nfl_dict = {"data": list_teams}

# // DEFINE 2020 DATABASE //


data = pd.read_csv('Data/2020_nfl_data.csv', encoding='utf-8')
result = data.to_json(orient="records")
parsed = json.loads(result)
json.dumps(parsed, indent=4)

stats_dict = {"data": parsed}

# // DEFINE SUPERBOWL DATABASE // 

Bowl = pd.read_csv('Data/superbowl.csv', encoding='utf-8')
result = Bowl.to_json(orient="records")
parsed = json.loads(result)
json.dumps(parsed, indent=4)

bowl_dict = {"data": parsed}