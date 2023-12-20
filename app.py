from flask import Flask, request, render_template, url_for, redirect, flash, session
import os
import numpy as np
import pandas as pd
import joblib
from flask_mysqldb import MySQL
import bcrypt
from datetime import datetime
from MySQLdb.cursors import DictCursor

# Flask App
app = Flask(__name__, static_folder='static')

# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'stuntingdb'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
app.secret_key = 'your_secret_key'
mysql = MySQL(app)




@app.route('/')
def index():
    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password'].encode('utf-8')

        curl = mysql.connection.cursor(DictCursor)
        curl.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = curl.fetchone()
        curl.close()

        if user is not None:
            if bcrypt.hashpw(password, user["password"].encode('utf-8')) == user["password"].encode('utf-8'):
                session['name'] = user['name']
                session['email'] = user['email']
                session['password'] = user['password']
                return redirect(url_for('diagnosis'))
            else:
                flash('Password and email do not match.', 'error')
        else:
             flash('User not found.', 'error')
             
    return render_template('login.html')
    



@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password'].encode('utf-8')
        hash_password = bcrypt.hashpw(password, bcrypt.gensalt())

        cur = mysql.connection.cursor()
        try:
            # Check if email is already registered
            cur.execute("SELECT * FROM users WHERE email = %s", (email,))
            existing_user = cur.fetchone()

            if existing_user:
                flash('Email already registered. Please use a different email.', 'error')
                return redirect(url_for('register'))

            # If the email is not registered, add the new user
            cur.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)", (name, email, hash_password))
            mysql.connection.commit()
            session['name'] = request.form['name']
            session['email'] = request.form['email']
            cur.close()

            flash('Registration successful! Please log in.', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            print(f"Error inserting data into the database: {str(e)}")

    return render_template('register.html')

@app.route('/logout')
def logout():
    session.pop('user_id', None)  # Menghapus data sesi pengguna
    return redirect(url_for('login'))

@app.route('/protected')
def protected():
    if 'user_id' in session:
        # Logika untuk halaman yang dilindungi
        return render_template('protected.html')
    else:
        return redirect(url_for('login'))
    

@app.route('/riwayat')
def riwayat():
    # Get the logged-in user's email from the session
    email = session.get('email')

    # Fetch history data from the database based on the user's email
    cur = mysql.connection.cursor(DictCursor)
    cur.execute("SELECT time, usia, diagnosis FROM history WHERE email = %s", (email,))
    history_data = cur.fetchall()
    cur.close()

    return render_template('riwayat.html', history_data=history_data)

@app.route('/profil')
def profil():
    return render_template('profil.html')

@app.route('/diagnosis')
def diagnosis():
    return render_template('diagnosis.html')

@app.route('/submit', methods=['POST'])
def submit_form():
    gender = request.form.get('gender')
    age = request.form.get('age')
    birth_weight = request.form.get('birth_weight')
    birth_height = request.form.get('birth_height')
    current_weight = request.form.get('current_weight')
    current_height = request.form.get('current_height')
    exclusive_breastfeeding = request.form.get('exclusive_breastfeeding')

    # Lakukan sesuatu dengan data yang dikirim
    if gender == "laki-laki":
        gender = 0
    else :
        gender = 1


    predx = pd.DataFrame({
        'Gender': gender,  # Ganti dengan jenis kelamin (Male/Female)
        'Age': [age],          # Ganti dengan usia
        'Birth_Weight': [birth_weight],  # Ganti dengan berat lahir
        'Birth_Length': [birth_height],  # Ganti dengan panjang lahir
        'Body_Weight': [current_weight],   # Ganti dengan berat badan
        'Body_Length': [current_height]})
    
    model = joblib.load('stunting_model.joblib')

    tes=model.predict(predx)
    prediksi = tes[0]

    if prediksi == 0:
        diagnosis = "Tidak Stunting"
    else :
        diagnosis = "Stunting"


    email = session.get('email')        #NANTI GANTI PAKAI OTOMATIS AMBIL DARI DATA AKUN YANG LOGIN SKRG

    time = datetime.now()
    time_formatted = time.strftime('%Y-%m-%d %H:%M:%S')
    cur = mysql.connection.cursor()
    cur.execute('INSERT INTO history (email, time, usia, diagnosis) VALUES (%s, %s, %s, %s)', (email, time_formatted, age, diagnosis))
    mysql.connection.commit()
    cur.close()


    return redirect(url_for('riwayat'))

@app.route('/update_profile', methods=['POST'])
def update_profile():
    if 'email' not in session:
        return redirect(url_for('login'))

    email = session['email']
    old_password = request.form.get('old_password')
    new_name = request.form.get('new_name')
    new_password = request.form.get('new_password')

    # Fetch the hashed password from the database
    cur = mysql.connection.cursor(DictCursor)
    cur.execute("SELECT password FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    
    # Check if the old password matches
    if bcrypt.checkpw(old_password.encode('utf-8'), user['password'].encode('utf-8')):
        # Update the user's name in the database
        if new_name:
            cur.execute("UPDATE users SET name = %s WHERE email = %s", (new_name, email))
            mysql.connection.commit()

        # Update the user's password in the database
        if new_password:
            hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
            cur.execute("UPDATE users SET password = %s WHERE email = %s", (hashed_password, email))
            mysql.connection.commit()

        # Update session information
        session['name'] = new_name
        session['password'] = hashed_password  # Update hashed password in session

        flash('Profile updated successfully!', 'success')
        cur.close()
        return redirect(url_for('profil'))
    else:
        return ('Old password is incorrect')




if __name__ == '__main__':
    app.run(debug=True)

