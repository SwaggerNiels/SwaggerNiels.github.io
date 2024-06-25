from flask import Flask, render_template, send_from_directory, jsonify, request
import flask_cors
import math
import numpy as np

app = Flask(__name__,
            static_url_path='', 
            static_folder='./assets',
            template_folder='./templates')
flask_cors.CORS(app)

@app.route('/')
def index():
    return render_template('chart.html')

app.run(host='192.168.1.227', port=80)