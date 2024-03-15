from fastapi import FastAPI,Body,Request,Depends
from pydantic import BaseModel,Field
from typing import List
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from database import *
import bcrypt,uuid,time
import jwt as pyjwt
from typing import Dict
import os
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import json
from qiniu import Auth
from bson import ObjectId


DEBUG_MODE = True

SECRET_KEY = 'shelva'
app = FastAPI()
if DEBUG_MODE:
    # 允许所有来源的请求（不允许在生产环境中使用）
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
# 允许特定来源的请求
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[""],  # 将域名替换为您要允许的域名
        allow_credentials=True,  # 如果您的请求需要使用凭据（如Cookie），请设置为True
        allow_methods=["*"],  # 允许所有HTTP方法
        allow_headers=["*"],  # 允许所有HTTP标头
    )
class Event(BaseModel):
    start: datetime
    end: datetime
    title: str
    public: bool
    name: str
    id:str
    # _id: ObjectId = Field(..., alias='_id')

    # class Config:
    #     json_encoders = {ObjectId: str}


@app.get("/timeslots", response_model=List[Event])
async def get_init_events():
    today = datetime.now()
    weekday = today.weekday()
    first_day_of_this_week = today - timedelta(days=weekday+1)  # 修改这里
    print(first_day_of_this_week)
    # 从数据库中获取所有开始时间晚于这周最后一天的事件
    events = list(time_table.find({"start": {"$gte": first_day_of_this_week}}))
    for event in events:
        event['id']=str(event['_id'])
    # event.pop('_id')
    return events

@app.post("/updateslots")
async def update_slots(event: Event):
    print(event.dict())
    time_table.insert_one(event.dict())
    return {"status": "success"}


@app.post("/api/deleteslot")
async def delete_slot(event: Event):
    # print(event.dict())
    event_dict = event.dict()
    # event_dict['start'] = event_dict['start'].replace(tzinfo=None)
    # print(event_dict['id'])
    # event_dict['end'] = event_dict['end'].replace(tzinfo=None)
    # 创建一个新的查询字典，只包含 start，end 和 title 键
    # query_dict = {key: event_dict[key] for key in ['start']}
    # print(query_dict['start'])
    # slot = time_table.find_one()
    # print(slot['start'])
    # print(type(slot['start']))
    # slot = time_table.find_one({'start':query_dict['start']})
    # print(slot)
    # print(type(query_dict['start']))
    event_id = ObjectId(event_dict['id'])
    time_table.delete_one({'_id': event_id})
    # 删除匹配的文档
    return {"status": "success"}

@app.post("/api/register")
async def register(request: Request,user: dict = Body(...), redis: aioredis.Redis = Depends(get_redis)):
    print('new register %s'%user)
    name = user.get('username','')
    phone = user.get('phone',0)
    pwd = user.get('password','')
    exist = user_collection.find_one({'phone':phone}, {'_id': 1})
    if exist:
        return{'status':'error','errMsg':'手机号已存在'}
    hashed_password = bcrypt.hashpw(pwd.encode('utf-8'), bcrypt.gensalt())
    unique_id = str(uuid.uuid4())
    
    user_data ={
        'name':name,
        'phone':phone,
        'uid':unique_id,
        'pass':pwd,
        'salt':hashed_password
    }
    access_token = pyjwt.encode({"user_id": phone, "exp": time.time() + 604800}, SECRET_KEY)
    await redis.set(f'shelva_access_token:{unique_id}',access_token, ex=604800)

    user_collection.insert_one(user_data)

    work_data = {
        'name':name,
        'phone':phone,
        'uid':unique_id,
        'works':[]
    }
    work_collection.insert_one(work_data)
    return {"message": "注册成功","name":user_data['name'],"access_token": access_token,"unique_id":unique_id,"status":'success','action':'register'}

@app.post("/api/login")
async def login(user: dict = Body(...), redis: aioredis.Redis = Depends(get_redis)):
    print('new login')
    print(user)
    phone = user.get('phone')  
    password = user.get('password')  
    user_data = user_collection.find_one({"phone": phone})
    if user_data is None:
        return {"errorMsg": "手机号不存在","status":'error','action':'lgoin'}
    if not bcrypt.checkpw(password.encode('utf-8'), user_data["salt"]):
        return {"errorMsg": "密码错误","status":'error','action':'lgoin'}
    unique_id = user_data['uid']
    role = user_data.get('admin',False)
    access_token = pyjwt.encode({"user_id": phone, "exp": time.time() + 604800}, SECRET_KEY)
    await redis.set(f'shelva_access_token:{unique_id}',access_token, ex=604800)
    return {"message": "登陆成功","name":user_data['name'],"access_token": access_token,"unique_id":unique_id,"status":'success','action':'lgoin','role':role}


@app.post("/api/newWork")
async def create_new_work(newWork: List = Body(...)):
    # unique_id = request.cookies.get("unique_id")
    # print("Unique ID from cookie:", unique_id)
    print("New Work:", newWork)
    for work in newWork:
        uid = work.get('uid','')
        homework = work.get('works',[])
        homework_without_archive = [ea for ea in homework if 'archive' not in ea]
        work_collection.update_one({'uid': uid}, {'$set': {'works': homework_without_archive}})

        # for ea in homework:
        #     if 'archive' in ea:
        #         print('passs')
        #         homework.pop(ea)
        # work_collection.update_one({'uid':uid},{'$set':{'works':homework}})
    return {"message": "New work received"}

@app.get("/api/getWorks")
async def get_works(unique_id:str):
    print("Unique ID from cookie:", unique_id)
    user = user_collection.find_one({'uid':unique_id})
    if not user:
        return{'no user!'}
    role = user.get('admin',False)
    if role:
        print('teacher!')
        works = work_collection.find({},{'_id':0})
        works = list(works)
        return works
    else:
        works = work_collection.find_one({'uid':unique_id},{'_id':0})
        return [works]

@app.post("/api/addcomment")
async def addcomment(request: Request, msg: Dict):
    unique_id = request.cookies.get("unique_id")
    print("Unique ID from cookie:", unique_id)
    vali = user_collection.find_one({'uid':unique_id})
    if not vali:
        return{'no cookies'}

    comment_collection.insert_one(msg)
    
    return {"message": "New mnsg received"}

@app.post("/api/addmessage")
async def addmessage( msg: Dict):
    print("New msg:", msg)

    exhibition_collection.insert_one(msg)
    
    return {"message": "New mnsg received"}

@app.get("/messages")
async def msgs():
    comments = exhibition_collection.find({},{'_id':0})
    comments = list(comments)
    return comments


@app.get("/api/comments")
async def get_comments():
    comments = comment_collection.find({},{'_id':0})
    comments = list(comments)
    return comments


access_key = 'QMSlDbxxASPhI0mh8apXUkOiq0oYSd8S3EvDkWGo'  # 你的七牛云账号的 Access Key
secret_key = 'jtanKRSXlY-4JiC4EXRNbJo8YSjzy7qikKQB6pFO'  # 你的七牛云账号的 Secret Key
bucket_name = 'coretecs'  # 你的七牛云存储空间的名字

q = Auth(access_key, secret_key)

@app.get("/upload_token")
def get_upload_token():
    token = q.upload_token(bucket_name)
    return {"token": token}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
build_path = os.path.join(os.path.dirname(BASE_DIR),'backend', "build")
app.mount("/static", StaticFiles(directory=os.path.join(build_path, "static")), name="static")

@app.get("/{full_path:path}", response_class=HTMLResponse)
async def catch_all(request: Request, full_path: str):
    with open(os.path.join(build_path, "index.html")) as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)


if __name__ == "__main__":
    uvicorn.run("main:app", host='0.0.0.0', port=8002, reload=True)
