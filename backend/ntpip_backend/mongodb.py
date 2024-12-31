from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_USER = os.getenv('MONGODB_USER')
MONGODB_PASS = os.getenv('MONGODB_PASS')
MONGODB_CLUSTER_URL = os.getenv('MONGODB_CLUSTER_URL')

uri = f"mongodb+srv://{MONGODB_USER}:{MONGODB_PASS}@{MONGODB_CLUSTER_URL}/?retryWrites=true&w=majority"

def get_db():
    client = MongoClient(uri)
    return client['agrosarathi']