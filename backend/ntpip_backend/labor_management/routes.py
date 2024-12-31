# backend/labor_management/routes.py

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from backend.labor_management.models.labor_profile import LaborProfileModel
from backend.mongodb import get_db

db = get_db()
labor_profile_model = LaborProfileModel(db)

labor_profile_bp = Blueprint('labor_profile', __name__)

@labor_profile_bp.route('/api/labor_profiles', methods=['POST'])
@jwt_required()
def create_labor_profile():
    try:
        data = request.get_json()
        labor_profile_id = labor_profile_model.create_labor_profile(data)
        return jsonify({'labor_profile_id': str(labor_profile_id)}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@labor_profile_bp.route('/api/labor_profiles/<profile_id>', methods=['GET'])
@jwt_required()
def get_labor_profile(profile_id):
    profile = labor_profile_model.get_labor_profile(profile_id)
    if profile:
        profile['_id'] = str(profile['_id'])
        return jsonify(profile), 200
    return jsonify({"error": "Labor profile not found"}), 404

@labor_profile_bp.route('/api/labor_profiles', methods=['GET'])
@jwt_required()
def list_labor_profiles():
    profiles = labor_profile_model.list_labor_profiles()
    for profile in profiles:
        profile['_id'] = str(profile['_id'])
    return jsonify(profiles), 200

@labor_profile_bp.route('/api/labor_profiles/<profile_id>', methods=['PUT'])
@jwt_required()
def update_labor_profile(profile_id):
    data = request.get_json()
    result = labor_profile_model.update_labor_profile(profile_id, data)
    if result.matched_count:
        return jsonify({'success': True}), 200
    return jsonify({"error": "Profile not found"}), 404

@labor_profile_bp.route('/api/labor_profiles/<profile_id>', methods=['DELETE'])
@jwt_required()
def delete_labor_profile(profile_id):
    result = labor_profile_model.delete_labor_profile(profile_id)
    if result.deleted_count:
        return jsonify({'success': True}), 200
    return jsonify({"error": "Profile not found"}), 404