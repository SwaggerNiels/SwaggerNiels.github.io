from flask import Flask, render_template, send_from_directory, jsonify, request
import flask_cors
import math
import numpy as np

# import importlib
import sys
# caution: path[0] is reserved for script path (or '' in REPL)
sys.path.insert(1, r'C:\Users\20236275\OneDrive - TU Eindhoven\PhD_OneDrive\Software\01_Python\Models\venv_test\OECT_notebook\src')
from OECT_sympy import SimpleOECT
# importlib.reload(OECT_sympy)

from sympy import Symbol

oect = SimpleOECT(False)
widget = oect.widget_groups['Steady state current']
wg,plots = oect.fp_plots(widget)
class steady_state_equation():
    eq = plots[1]

widget = oect.widget_groups['Transient voltage step response']
wg,plots = oect.fp_plots(widget)
class transient_equation():
    eq = plots[2]


app = Flask(__name__,
            static_url_path='', 
            static_folder='./assets',
            template_folder='./templates')
flask_cors.CORS(app)

@app.route('/')
def index():
    # return render_template('chart.html')
    return render_template('minimal.html')
    # return render_template('index_target+3D_test.html')

@app.route('/calculate_steady_state', methods=['GET'])
def calculate_steady_state():
    V_G = request.args.get('V_G', default=0, type=float)
    eq = steady_state_equation().eq

    V_DS_values = np.linspace(-2, 2, 100)
    eq = eq.subs(Symbol('V_G'), V_G)
    pyfunc_values = [float(eq.subs(Symbol('V_DS'), V_DS)) for V_DS in V_DS_values] 
    return jsonify([list(i) for i in zip(V_DS_values,pyfunc_values)])

@app.route('/calculate_transient', methods=['GET'])
def calculate_transient():
    f = request.args.get('f', default=0, type=float)
    V_DS = request.args.get('V_DS', default=0, type=float)
    eq = transient_equation().eq

    t_values = np.linspace(0, 60, 100)
    eq = eq.subs(Symbol('t0'), 20)
    eq = eq.subs(Symbol('t1'), 40)
    eq = eq.subs(Symbol('V_G_magnitude'), 0.5)
    eq = eq.subs(Symbol('f'), f)
    eq = eq.subs(Symbol('V_DS'), V_DS)
    pyfunc_values = [float(eq.subs(Symbol('t'), t)) for t in t_values]

    return jsonify([list(i) for i in zip(t_values,pyfunc_values)])


@app.route('/assets/<path:filename>', methods=['GET'])
def send_file(filename):
    return send_from_directory('assets', filename)

# @app.route('/assets/namaste_crop_target.mind', methods=['GET'])
# def send_target():
#     return send_from_directory('assets', 'namaste_crop_target.mind')

# @app.route('/assets/OECT.gltf', methods=['GET'])
# def send_gltf():
#     return send_from_directory('assets', 'OECT.gltf')
# @app.route('/assets/OECT.bin', methods=['GET'])
# def send_bin():
#     return send_from_directory('assets', 'OECT.bin')
# ... add other routes and function definitions as needed ...

if __name__ == '__main__':
    # app.run(ssl_context='adhoc')
    app.run(host='192.168.1.227', port=80)
    # app.run(host='127.0.0.1:5000', port=5000)