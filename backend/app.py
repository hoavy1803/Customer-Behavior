from datetime import datetime
from typing import List
from re import S
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pymongo
from pydantic import BaseModel
from sympy import product


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    role: str
    userId: str
    userName: str
    password: str

class Product(BaseModel):
    name: str
    id: str
    price: int
    image: str

class Account(BaseModel):
    userId: str
    password: str

class Order(BaseModel):
    orderID: str
    productID: List[str]
    quantity: List[int]
    totalPrice: int
    orderDate: datetime
    customerID: str

myclient = pymongo.MongoClient("mongodb://127.0.0.1:27017")
database = myclient["customer_data"]




@app.get('/products')
async def get_products():
    
   
    mycollection_name = "product2"
    resultCollection = database.get_collection(mycollection_name)  # nếu có rồi thì lấy data đã có

    results = list(resultCollection.find({}, {"_id": 0}))
    return results


@app.get('/orders')
async def get_orders():
    
    mycollection_name = "order"
    resultCollection = database.get_collection(mycollection_name)  # nếu có rồi thì lấy data đã có

    results = list(resultCollection.find({}, {"_id": 0}))
    return results



@app.post('/add_product')
async def add_product(product : Product):
   
    mycollection_name = "product2"
    resultCollection = database.get_collection(mycollection_name)  # nếu có rồi thì lấy data đã có

    new_product = {"ProductName" : product.name, "ProductID" : product.id, "Price" : product.price, "Image": product.image}
    result = resultCollection.insert_one(new_product)
    if result.acknowledged:
        return {"message": "Sản phẩm đã được thêm thành công"}
    else:
        raise HTTPException(status_code=500, detail="Đã có lỗi xảy ra khi thêm sản phẩm")

@app.post('/edit_product')
async def edit_product(product: Product):
 
    mycollection_name = "product2"
    resultCollection = database.get_collection(mycollection_name) 

    update = {'$set': {'ProductID': product.id, 'ProductName': product.name, 'Price': product.price, 'Image': product.image}}
    resultCollection.update_one({'ProductID': product.id}, update)
    return {"message": "Sản phẩm đã được cập nhật thành công"}

@app.delete('/products{itemID}')
async def delete_product(itemID):
    mycollection_name = "product2"
    resultCollection = database.get_collection(mycollection_name) 
    resultCollection.delete_one({'ProductID': itemID})


# Đường dẫn để đăng nhập
@app.post("/login")
async def login(account: Account):
    users_collection = database.get_collection("user")
    user = users_collection.find_one({"UserID": account.userId, "Password": account.password})

    if user:
        user["_id"] = str(user["_id"])
        return  user
    else:
        raise HTTPException(status_code=401, detail="Thông tin đăng nhập không hợp lệ!")
    
@app.post('/customer_order')
async def add_order(order : Order):
   
    mycollection_name = "order"
    resultCollection = database.get_collection(mycollection_name)  

    new_product = {"OrderID" : "", "ProductID" : order.productID, "QuantityOrder" : order.quantity, "TotalPrice": order.totalPrice, "DeliveryDate": order.orderDate, "CustomerID": order.customerID}
    result = resultCollection.insert_one(new_product)
    if result.acknowledged:
        return {"message": "Đơn hàng đã được đặt thành công"}
    else:
        raise HTTPException(status_code=500, detail="Đã có lỗi xảy ra khi đặt hàng")
