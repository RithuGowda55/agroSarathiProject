# backend/auth.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

# Create a Blueprint for authentication
auth_bp = Blueprint('auth', __name__)

# User "database"
users = [
    {"username": "manager1", "password": generate_password_hash("managerpass"), "role": "manager"},
    {"username": "laborer1", "password": generate_password_hash("laborerpass"), "role": "laborer"}
]

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Lookup user and verify password
    user = next((u for u in users if u['username'] == username), None)
    if user and check_password_hash(user['password'], password):
        access_token = create_access_token(identity={'username': username, 'role': user['role']})
        return jsonify(access_token=access_token), 200

    return jsonify({"msg": "Invalid username or password"}), 401

@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    user = get_jwt_identity()
    return jsonify(logged_in_as=user), 200