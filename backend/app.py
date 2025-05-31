from flask import Flask
from config import Config
from models import db, User
from flask_cors import CORS
from flask_login import LoginManager
from auth import auth_bp
from finance import fin_bp

app= Flask(__name__) #creating the flask app
app.config.from_object(Config) #getting all the details from the config.py file

db.init_app(app) #initializing all the databases
CORS(app, supports_credentials=True) #cross-origin request server created for integration with the frontend


login_manager=LoginManager()
login_manager.init_app(app) #this enable login for the website
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


app.register_blueprint(auth_bp)#gett all the authorization routes from auth.py
app.register_blueprint(fin_bp)#get all the finance routes from finance.py

with app.app_context():
    db.create_all() #create all the databases
    
if __name__=='__main__':
    app.run(debug=True) #run the app