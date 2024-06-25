from flask import Flask, render_template, send_from_directory, jsonify, request
# import flask_cors
import math
import numpy as np

app = Flask(__name__,
            static_url_path='', 
            static_folder='./assets',
            template_folder='./templates')
# flask_cors.CORS(app)

@app.route('/')
def index():
    return render_template('chart.html')

<<<<<<< HEAD
# app.run(host='192.168.1.227', port=80)
=======
app.run()
>>>>>>> 0dfcb7d06dd6c0f02cb9717d78ffb7cd2fe252eb
