from flask import Flask
# coding=utf-8
import os
import numpy as np

# Keras
#from keras.models import load_model
#from keras.utils import img_to_array
#from keras.utils import load_img

# Flask utils
from flask import Flask, request, render_template
#from werkzeug.utils import secure_filename

# Mendefinisikan App Flask
app = Flask(__name__)
app = Flask(__name__, static_folder='static')

@app.route('/', methods=['GET'])
def index():
    # Halaman Utama
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('register.html')
