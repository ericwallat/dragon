from flask import Flask
from flask_cors import CORS, cross_origin
from flask import request
from flask import jsonify
import json


app = Flask(__name__)
CORS(app)

@app.route("/", methods=['GET', 'POST'])

def test():
    with open('data.json', 'w') as outfile:
        json.dump(request.json, outfile)
    return("complete")
if __name__ == "__main__":
    app.run(host='0.0.0.0')