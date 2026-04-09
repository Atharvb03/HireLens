from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGODB_URL)
db = client[Config.DATABASE_NAME]

# Collections
job_descriptions_collection = db["job_descriptions"]
resumes_collection = db["resumes"]
matches_collection = db["matches"]

# Drop old indexes if they exist
try:
    matches_collection.drop_index("job_id_1_candidate_id_1")
except:
    pass

# Create indexes
job_descriptions_collection.create_index("job_id", unique=True)
resumes_collection.create_index("job_id")
matches_collection.create_index([("job_id", 1), ("candidate_name", 1)], unique=True)
