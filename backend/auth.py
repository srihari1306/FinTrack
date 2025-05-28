from flask import Blueprint,request,jsonify
from flask_login import login_user, logout_user, login_required, current_user
from models import db,User

auth_bp = Blueprint('auth',__name__)

@auth_bp.route('/register',methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'username already exists'}),400
    
    new_user = User(username=data['username'])
    new_user.set_password(data['password'])
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'})

@auth_bp.route('/login',methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    
    if user and user.check_password(data['password']):
        login_user(user, remember=True)
        return jsonify({'message': 'Login Successful'})
    return jsonify({'message': 'Invalid Credentials'}), 401

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message':'Logged out'})

@auth_bp.route('/current_user')
def get_current_user():
    return jsonify({'username': current_user.username})