from flask import Flask

app=Flask(__name__)

@app.route("/")
def index():
    return "halo berhasil nich"
    
@app.route("/about")
def about():
    return "About Us"

@app.route("/contact")
def contact():
    return "Contact Us"

@app.route("/profile")
def profile():
    return "Profile"

@app.route("/profile/<username>")
def profile_name(username):
    return "halo %s" % username

app.run(debug=True)