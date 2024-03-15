import platform
from pymongo import MongoClient
import aioredis

OS_NAME = platform.system()
if OS_NAME == 'Linux':
    mongo_client = MongoClient("")
else:   
    mongo_client = MongoClient("mongodb://localhost:27017/")

db = mongo_client["shelvadatabase"]
time_table = db["timetable"]
user_collection = db['users']
work_collection = db['works']
comment_collection = db['comment']
exhibition_collection = db['exhibition']


async def get_redis():
    if OS_NAME == 'Linux':
        redis = await aioredis.from_url("")
    else:   
        redis = await aioredis.from_url("redis://localhost")
    yield redis
    await redis.close()