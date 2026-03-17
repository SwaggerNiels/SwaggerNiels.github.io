from flask import Flask, render_template, send_from_directory, jsonify, request

app = Flask(__name__,
            static_url_path='', 
            static_folder='./assets',
            template_folder='./templates')

@app.route('/')
def index():
    # return render_template('chart.html')
    # return render_template('minimal.html')
    return render_template('index_target+3D_test.html')

@app.route('/assets/<path:filename>', methods=['GET'])
def send_file(filename):
    return send_from_directory('assets', filename)

if __name__ == '__main__':
    # app.run(host='192.168.1.227', port=80)
    app.run(debug=True)