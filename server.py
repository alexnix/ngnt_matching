from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import pandas as pd
import matching


def dataProcess(df):
    return df


app = Flask(__name__)
CORS(app)


@app.route("/predictOne", methods=["POST"])
def predictOne():
    # Turn into pandas df
    df = pd.read_json(json.dumps(request.json), orient="index")
    # Process into standard columns
    df = dataProcess(df)
    # Predict
    results = matching.predict(df, "Bucuresti", request.args['type'])


    results_joson = json.loads(results.to_json(orient='records'))
    for r in results_joson:
        r['comparables'] = json.loads(r['comparables'])

    return jsonify(results_joson)


@app.route("/predictFile", methods=["POST"])
def predictFile():
    # Read file into pandas df

    # Process file into standard columns

    # Gropu by locality

    # Predict for each group

    return "ok"


if __name__ == "__main__":
    app.run(debug=True)
