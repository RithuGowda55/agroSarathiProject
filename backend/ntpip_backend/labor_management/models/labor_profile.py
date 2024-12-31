# backend/labor_management/models/labor_profile.py

from pymongo.collection import Collection
from bson import ObjectId

class LaborProfileModel:
    def __init__(self, db):
        self.collection: Collection = db['labor_profiles']
    
    def create_labor_profile(self, data):
        return self.collection.insert_one(data).inserted_id

    def get_labor_profile(self, profile_id):
        return self.collection.find_one({"_id": ObjectId(profile_id)})

    def list_labor_profiles(self):
        return list(self.collection.find())

    def update_labor_profile(self, profile_id, data):
        return self.collection.update_one({"_id": ObjectId(profile_id)}, {"$set": data})

    def delete_labor_profile(self, profile_id):
        return self.collection.delete_one({"_id": ObjectId(profile_id)})