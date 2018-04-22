from flask import Flask, request
from flask import jsonify
from flask_cors import CORS
from classify_eye import Classify
from werkzeug.utils import secure_filename
from pprint import pprint
import sys, os


app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/classify', methods=['GET', 'POST'])
def classify():

    test = 0
    if request.method == 'POST':
        file = request.files['classify']
        file_path = os.path.join("./to_classify/", secure_filename(file.filename))
        file.save(file_path)
        test = Classify.diabetic_retin(file_path)
        #pprint(vars(request))
        #print(request.files, file=sys.stderr)
    response = jsonify({'result': test})
    print(test)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run(debug=True)
