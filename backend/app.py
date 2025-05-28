from flask import Flask
from config import Config
from models import db, User
from flask_cors import CORS
from flask_login import LoginManager
from auth import auth_bp
from finance import fin_bp

app= Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
CORS(app, supports_credentials=True)

login_manager=LoginManager()
login_manager.init_app(app)
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


app.register_blueprint(auth_bp)
app.register_blueprint(fin_bp)

with app.app_context():
    db.create_all()
    
if __name__=='__main__':
    app.run(debug=True)