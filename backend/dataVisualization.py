import pandas as pd
import matplotlib.pyplot as plt
import json
from pymongo import MongoClient

# Kết nối đến cơ sở dữ liệu
client = MongoClient('mongodb://localhost:27017/')
mydb = client['customer_data']
collect = mydb['general_data']

# Lấy dữ liệu từ collection
data = list(collect.find())

# Chuyển đổi thành DataFrame
df = pd.DataFrame(data)
df

# Thống kê theo tháng
# Thêm cột tháng vào dataFrame
df['Month'] = df['DeliveryDate'].str.slice(start=3, stop=5, step=1)

# Tổng doanh thu và số lượng sản phẩm theo tháng
sale_month = df.groupby('Month')[['TotalPrice', 'QuantityOrder']].sum()
sale_month_df = pd.DataFrame(sale_month).reset_index()

# Vẽ đồ thị tổng doanh thu theo tháng
months = range(1,6)

plt.figure(figsize=(10, 6))
plt.bar(x=months, height = sale_month['TotalPrice'], color = 'orange')
plt.xlabel("Tháng")
plt.ylabel("Doanh thu")
plt.title("Tổng doanh thu theo tháng")
plt.savefig('tong_doanh_thu_theo_thang.png')
plt.show()

# Vẽ đồ thị tổng số lượng sản phẩm theo tháng
plt.figure(figsize=(10, 6))
plt.bar(x=months, height = sale_month['QuantityOrder'], color = 'orange')
plt.xlabel("Tháng")
plt.ylabel("Số lượng sản phẩm")
plt.title("Tổng số lượng sản phẩm bán ra theo tháng")
plt.savefig('Customer-Behavior\\frontend\\src\\assets\\tong_san_pham_theo_thang.png')
plt.show()


# So sánh doanh thu của tháng 1/2023 với tháng 1/2024
# Đọc file tháng 1 năm 2024
def readFile(pathFile):
    sheet_index = 1
    df = pd.read_excel(pathFile, sheet_name=sheet_index, header=2)
    df['Mã đơn hàng'] = df['Mã đơn hàng'].astype(str)
    df['Khuyến mãi / Trả thưởng'].fillna(0, inplace=True)
    df = df.drop(df[(df['Đơn giá'] == 0) | (df['Đơn giá'] == 1000) | (df['Đơn giá'] == 1)].index)
    df = df.iloc[:,:12]
    df = df.dropna()
    return df
df1 = readFile('Customer-Behavior\\data\\MỸ-KHỞI-FORM-TONG-KET-CHAO-OHAYO-T1.xlsb')
# df1
eng_name = ['OrderID', 'ProductID', 'ProductName', 'Type', 'DeliveryDate', 'SalesAgent', 'CustomerID','CustomerName','QuantityOrder', 'QuantityDelivery','Price', 'TotalPrice']
df1.columns = eng_name
df1['TotalPrice'] = df1['QuantityDelivery'] * df1['Price']
df1['Month'] = df1['DeliveryDate'].str.slice(start=3, stop=5, step=1)
sale_month_1_2024 = df1.groupby('Month')[['TotalPrice', 'QuantityOrder']].sum()
month1_2023 = df[df['Month'] == '01']
sale_month_1_2023 = month1_2023.groupby('Month')[['TotalPrice', 'QuantityOrder']].sum()
month = ['01/2023', '01/2024']
height = [sale_month_1_2023['TotalPrice'][0], sale_month_1_2024['TotalPrice'][0]]

plt.figure(figsize=(20, 6))
plt.bar(x=month, height=height, color='lightgreen')
plt.xlabel('Tháng')
plt.ylabel('Tổng doanh thu')
plt.title("So sánh doanh thu tháng 1 của năm 2023 với năm 2024")
plt.savefig('Customer-Behavior\\frontend\\src\\assets\\so_sanh.png')
plt.show()


# Thống kê theo sản phẩm
# Tổng doanh thu và số lượng theo sản phẩm
sale_product = df.groupby('ProductName')[['TotalPrice', 'QuantityOrder']].sum()
sale_product_df = pd.DataFrame(sale_product).reset_index()



# Lấy ra 5 sản phẩm có doanh thu cao nhất
top_5_products = sale_product_df.nlargest(5, 'TotalPrice')
top_5_products_df = pd.DataFrame(top_5_products).reset_index()
name_product = top_5_products_df['ProductName']
# Doanh số của sản phẩm này theo từng tháng
df2 = df.groupby(['Month', 'ProductName'])['QuantityOrder'].sum()
df3 = pd.DataFrame(df2).reset_index()
product2 = df3[df3['ProductName'] == name_product[1]]
product1 = df3[df3['ProductName'] == name_product[0]]
product3 = df3[df3['ProductName'] == name_product[2]]
product4 = df3[df3['ProductName'] == name_product[3]]
product5 = df3[df3['ProductName'] == name_product[4]]
# Đoạn này vẽ biểu đồ đường chồng lên nhau
plt.plot(product1['Month'], product1['QuantityOrder'], 'go-')
plt.plot(product2['Month'], product2['QuantityOrder'], 'bD-')
plt.plot(product3['Month'], product3['QuantityOrder'], 'yD-')
plt.plot(product4['Month'], product4['QuantityOrder'], 'co-')
plt.plot(product5['Month'], product5['QuantityOrder'], 'mo-')
plt.title("Số lượng bán ra mỗi tháng của top 5 sản phẩm bán chạy nhất ")
plt.xlabel("Tháng")
plt.ylabel("Số lượng")
plt.savefig('Customer-Behavior\\frontend\\src\\assets\\top5products.png')
plt.show()

# Top 10 sản phẩm có doanh thu cao nhất
top_10_products = sale_product_df.nlargest(10, 'TotalPrice')
top_10_products_df = pd.DataFrame(top_10_products).reset_index()
plt.figure(figsize=(20, 6))
plt.barh(top_10_products['ProductName'], top_10_products['TotalPrice'], color='#8470FF')
plt.title("Top 10 sản phẩm bán chạy nhất")
plt.xlabel("Doanh thu")
plt.ylabel("Tên sản phẩm")
plt.savefig('Customer-Behavior\\frontend\\src\\assets\\top10products.png')
plt.show()

# Top 10 sản phẩm có doanh thu cao nhất tháng 1, 2, 3, 4, 5
top_10_products_of_month = df.groupby(['Month', 'ProductName'])['TotalPrice'].sum()
top_10_products_of_month_df = pd.DataFrame(top_10_products_of_month).reset_index()
def product_of_month(month, top_10_products_of_month_df):
    result = top_10_products_of_month_df[top_10_products_of_month_df['Month'] == month].nlargest(10, 'TotalPrice')
    return result

top_10_products_01 = product_of_month('01', top_10_products_of_month_df)
plt.figure(figsize=(20, 6))
plt.barh(top_10_products_01['ProductName'], top_10_products_01['TotalPrice'], color='#8470FF')
plt.title("Top 10 sản phẩm bán chạy nhất tháng 1")
plt.xlabel("Doanh thu")
plt.ylabel("Tên sản phẩm")
plt.savefig('Customer-Behavior\\frontend\\src\\assets\\top10jan.png')
plt.show()

top_10_products_02 = product_of_month('02', top_10_products_of_month_df)
plt.figure(figsize=(20, 6))
plt.barh(top_10_products_02['ProductName'], top_10_products_02['TotalPrice'], color='#8470FF')
plt.title("Top 10 sản phẩm bán chạy nhất tháng 2")
plt.xlabel("Doanh thu")
plt.ylabel("Tên sản phẩm")
plt.savefig('Customer-Behavior\\frontend\\src\\assets\\top10feb.png')
plt.show()

top_10_products_03 = product_of_month('03', top_10_products_of_month_df)
plt.figure(figsize=(20, 6))
plt.barh(top_10_products_03['ProductName'], top_10_products_03['TotalPrice'], color='#8470FF')
plt.title("Top 10 sản phẩm bán chạy nhất tháng 3")
plt.xlabel("Doanh thu")
plt.ylabel("Tên sản phẩm")
plt.savefig('Customer-Behavior\\frontend\\src\\assets\\top10mar.png')
plt.show()

top_10_products_04 = product_of_month('04', top_10_products_of_month_df)
plt.figure(figsize=(20, 6))
plt.barh(top_10_products_04['ProductName'], top_10_products_04['TotalPrice'], color='#8470FF')
plt.title("Top 10 sản phẩm bán chạy nhất tháng 4")
plt.xlabel("Doanh thu")
plt.ylabel("Tên sản phẩm")
plt.savefig('Customer-Behavior\\frontend\\src\\assets\\top10apr.png')
plt.show()

top_10_products_05 = product_of_month('05', top_10_products_of_month_df)
plt.figure(figsize=(20, 6))
plt.barh(top_10_products_05['ProductName'], top_10_products_05['TotalPrice'], color='#8470FF')
plt.title("Top 10 sản phẩm bán chạy nhất tháng 5")
plt.xlabel("Doanh thu")
plt.ylabel("Tên sản phẩm")
plt.savefig('Customer-Behavior\\frontend\\src\\assets\\top10may.png')
plt.show()


# Thống kê theo khách hàng
sale_customer = df.groupby('CustomerName')[['TotalPrice', 'QuantityOrder']].sum()
sale_customer_df = pd.DataFrame(sale_customer).reset_index()

# Top 10 khách hàng mua nhiều nhất
top_10_customer = sale_customer_df.nlargest(10, 'TotalPrice')
plt.figure(figsize=(20, 6))
plt.barh(top_10_customer['CustomerName'], top_10_customer['TotalPrice'], color='#008B45')
plt.title("Top 10 khách hàng mua nhiều nhất")
plt.xlabel("Doanh thu")
plt.ylabel("Tên khách hàng")
plt.savefig('Customer-Behavior\\frontend\\src\\assets\\top10customers.png')
plt.show()


# Top 10 khách hàng mua ít nhất
last_10_customer = sale_customer_df.nsmallest(10, 'TotalPrice')
plt.figure(figsize=(20, 6))
plt.barh(last_10_customer['CustomerName'], last_10_customer['TotalPrice'], color='#008B45')
plt.title("Top 10 khách hàng mua ít nhất")
plt.xlabel("Doanh thu")
plt.ylabel("Tên khách hàng")
plt.savefig('Customer-Behavior\\frontend\\src\\assets\\bot10customers.png')
plt.show()
