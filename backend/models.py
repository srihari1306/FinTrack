from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

db = SQLAlchemy()

class User(db.Model,UserMixin): #for user detailes
    id=db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash= db.Column(db.String(128), nullable=False)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password) #Hashes a plain text password so that it can be safely stored in a database.
    def check_password(self, password):
        return check_password_hash(self.password_hash, password) #Verifies whether a plain text password matches the hashed password stored in the database.
    
    

class Transaction(db.Model): # for transactions
    id=db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(10), nullable=False)  # income or expense
    category = db.Column(db.String(50), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    description = db.Column(db.String(300), nullable=False)

class BudgetLimit(db.Model): #for limits
    id=db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),nullable=False)
    category = db.Column(db.String(50), nullable=False)
    limit = db.Column(db.Float, nullable=False)