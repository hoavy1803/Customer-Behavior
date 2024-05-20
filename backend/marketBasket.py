
#ĐỌC DỮ LIỆU TỪ TỪNG FILE

import pandas as pd
from pyparsing import col

#Hàm đọc file dữ liệu

def readFile(pathFile):
    sheet_index = 1
    df = pd.read_excel(pathFile, sheet_name=sheet_index, header=2)
    df['Mã đơn hàng'] = df['Mã đơn hàng'].astype(str)
    df['Khuyến mãi / Trả thưởng'].fillna(0, inplace=True)
    df = df.drop(df[(df['Đơn giá'] == 0) | (df['Đơn giá'] == 1000) | (df['Đơn giá'] == 1)].index)
    df = df.iloc[:,:12]
    df = df.dropna()
    return df
df1 = readFile('MỸ-KHỞI-BG-TK-PHỞ-ĐỆ-NHẤT-T3.2023.xlsb')

df2 =  readFile('MỸ-KHỞI-TK-MÌ-CAO-CẤP-KM-T1.2023.xlsb')

df3 = readFile('MỸ-KHỞI-TỔNG-KẾT-MÌ-ZEPPIN-GÓI-MÌ-LY-ZEPPIN-T2.2023.xlsb')

df4 = readFile('MỸ-KHỞI-FORM-TK-PHỞ-ĐỆ-NHẤT-HỦ-TIẾU-KM-T4.2023.xlsb')

#GỘP DỮ LIỆU TỪ 4 DATAFRAME
#%%
merged_df = pd.concat([df1, df2, df3, df4], axis=0)
eng_name = ['OrderID', 'ProductID', 'ProductName', 'Type', 'DeliveryDate', 'SalesAgent', 'CustomerID','CustomerName','QuantityOrder', 'QuantityDelivery','Price', 'TotalPrice']
merged_df.columns = eng_name
merged_df['TotalPrice'] = merged_df['QuantityDelivery'] * merged_df['Price']


#Đẩy dữ liệu lên MongoDB

from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/')
mydb = client['customer_data']
collect = mydb['general_data']
# Chuyển DataFrame thành danh sách các bản ghi dạng dict
# data_records = merged_df.to_dict(orient='records')
#
# # Chèn dữ liệu vào MongoDB
# collect.insert_many(data_records)
# Bỏ comment đoạn này nếu chưa chèn dữ liệu lần nào

# Đóng kết nối với MongoDB

#Hàm đẩy dữ liệu lên mongoDB

def postDataToMGBD(data, collection):
    data_records = data.to_dict(orient='records')

    # Chèn dữ liệu vào MongoDB
    collection.insert_many(data_records)

#Hàm lấy ra các dữ liệu cần thiết từ MongoDB và chuyển thành dạng DataFrame

def getDataFromMGDB(collectName, colName):
    data = collectName.find({}, colName)
    dataFrame = pd.DataFrame(data)
    return dataFrame
# colName = ['OrderID', 'ProductID'] # Thay đổi các cột muốn lấy ở đây
# data = getDataFromMGDB(collect, colName)
# data

import pandas as pd

#PHẦN THIẾT KẾ DATABASE

client = MongoClient('mongodb://localhost:27017/')
mydb = client['customer_data']
customer_colection = mydb['customer']
products_colection = mydb['product']
orders_colection = mydb['order']

#BẢNG KHÁCH HÀNG

# Mã khách hàng, tên khách hàng
customer_data = getDataFromMGDB(collect, ['CustomerID', 'CustomerName'])
customer_data = customer_data.drop_duplicates(subset='CustomerID')
postDataToMGBD(customer_data,customer_colection)


df5 = getDataFromMGDB(customer_colection, ['CustomerID', 'CustomerName'])


# Lấy danh sách tất cả các tài liệu trong collection
customer_colection = mydb['user']
documents = customer_colection.find({})

for index, document in enumerate(documents):
    document_id = document['_id']
    update = { '$set': { 'Password': '123456789' } }
    customer_colection.update_one({ '_id': document_id }, update)

print("Đã cập nhật thành công")

customer_colection.update_many({}, { '$rename': { 'CustomerID': 'UserID', 'CustomerName': 'UserName' } })

collect.update_many({}, { '$unset': { 'Role': '' } })
collect.insert_one({"Role" : "Nhân viên", "UserID":"001@ladh", "UserName":"Nguyễn Văn Cường"})
collect.insert_one({"Role" : "Nhân viên", "UserID":"002@ladh", "UserName":"Nguyễn Văn Đức"})
collect.insert_one({"Role" : "Nhân viên", "UserID":"003@ladh", "UserName":"Phạm Văn Thanh"})

#BẢNG SẢN PHẨM

product_data = getDataFromMGDB(collect, ['ProductID', 'ProductName', 'Price'])
product_data = product_data.drop_duplicates(subset='ProductID')
postDataToMGBD(product_data, products_colection)

#BẢNG ĐƠN HÀNG

order_data = getDataFromMGDB(collect, ['OrderID', 'CustomerID', 'DeliveryDate', 'QuantityOrder', 'QuantityDelivery','TotalPrice', 'ProductID'])

grouped = order_data.groupby('OrderID').agg({'ProductID': list, 'QuantityOrder': list, 'TotalPrice': 'sum'}).reset_index()
grouped2 = order_data.drop_duplicates(subset='OrderID')
deleteCol = ['ProductID', 'QuantityOrder', 'QuantityDelivery', '_id', 'TotalPrice']
grouped2 = grouped2.drop(deleteCol, axis=1)
grouped = pd.merge(grouped, grouped2, on = 'OrderID', how = 'outer')

postDataToMGBD(grouped, orders_colection)

# Thực hiện phép lookup để tham chiếu từ collection "orders" đến "products"
result = orders_colection.aggregate([
    {
        "$unwind": "$ProductID"  # Giải nén mảng ProductID
    },
    {
        "$lookup": {
            "from": "product",
            "localField": "ProductID",
            "foreignField": "ProductID",
            "as": "ordered_products"
        }
    },
    {
        "$unwind": "$ordered_products"  # Giải nén mảng ordered_products
    },
    {
        "$group": {
            "_id": "$OrderID",  # Nhóm theo OrderID
            "products": {
                "$push": "$ordered_products.ProductName"  # Lưu các tên sản phẩm vào mảng
            }
        }
    }
])

# In kết quả
for order in result:
    print("Order ID:", order["_id"])
    print("Products:", ", ".join(order["products"]))  # In ra các tên sản phẩm được phân tách bởi dấu phẩy
    print("----------------------------------")