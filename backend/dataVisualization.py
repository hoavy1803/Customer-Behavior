import pandas as pd
import matplotlib.pyplot as plt
import json
from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/')
mydb = client['customer_data']
collect = mydb['general_data']

# Lấy dữ liệu từ collection
data = list(collect.find())

# Chuyển đổi thành DataFrame
df = pd.DataFrame(data)

df['Month'] = df['DeliveryDate'].str.slice(start=3, stop=5, step=1)

#Thống kê theo tháng

# Tổng doanh thu và số lượng sản phẩm theo tháng
sale_month = df.groupby('Month')[['TotalPrice', 'QuantityOrder']].sum()

months = range(1,6)
plt.bar(x=months, height = sale_month['TotalPrice']/10**9, color = 'orange')
plt.xlabel("Tháng")
plt.ylabel("Doanh thu (tỷ)")
plt.title("Tổng doanh thu theo tháng")
value = sale_month['TotalPrice']/ 10**9
for month, value in zip(months, value):
    plt.text(month, value, str(value), ha='center', va='bottom')

plt.show()

# Vẽ đồ thị tổng số lượng sản phẩm theo tháng
plt.bar(x=months, height = sale_month['QuantityOrder'], color = 'orange')
plt.xlabel("Tháng")
plt.ylabel("Số lượng sản phẩm")
plt.title("Tổng số lượng sản phẩm bán ra theo tháng")
for month, value in zip(months, sale_month['QuantityOrder']):
    plt.text(month, value, str(value), ha='center', va='bottom')
plt.show()

# So sánh tháng 1 của năm 2023 với tháng 1 của năm 2024
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
df1 = readFile('MỸ-KHỞI-FORM-TONG-KET-CHAO-OHAYO-T1.xlsb')

eng_name = ['OrderID', 'ProductID', 'ProductName', 'Type', 'DeliveryDate', 'SalesAgent', 'CustomerID','CustomerName','QuantityOrder', 'QuantityDelivery','Price', 'TotalPrice']
df1.columns = eng_name
df1['TotalPrice'] = df1['QuantityDelivery'] * df1['Price']

df1['Month'] = df1['DeliveryDate'].str.slice(start=3, stop=5, step=1)

sale_month_1_2024 = df1.groupby('Month')[['TotalPrice', 'QuantityOrder']].sum()
month1_2023 = df[df['Month'] == '01']
sale_month_1_2023 = month1_2023.groupby('Month')[['TotalPrice', 'QuantityOrder']].sum()

month = ['01/2023', '01/2024']
height = [sale_month_1_2023['TotalPrice'][0], sale_month_1_2024['TotalPrice'][0]]
height_in_billion = [value / 10**9 for value in height]
monthly_revenue = pd.DataFrame(list(zip(month, height)), columns=['Month', 'Height'])


plt.bar(x=month, height=height_in_billion, color='lightgreen')
plt.xlabel('Tháng')
plt.ylabel('Tổng doanh thu (tỷ)')
plt.title("So sánh doanh thu tháng 1 của năm 2023 với năm 2024")
for month, value in zip(month, height_in_billion):
    plt.text(month, value, str(value), ha='center', va='bottom')
plt.show()

#Thống kê theo sản phẩm

sale_product = df.groupby('ProductName')[['TotalPrice', 'QuantityOrder']].sum()
sale_product_df = pd.DataFrame(sale_product).reset_index()


#Lấy ra 10 sản phẩm có doanh thu cao nhất

top_10_products = sale_product_df.nlargest(10, 'TotalPrice')

# Top 5 sản phẩm bán chạy
top_5_products = sale_product_df.nlargest(5, 'QuantityOrder')
last_5_products = sale_product_df.nsmallest(5, 'QuantityOrder')
last_5_products_df = pd.DataFrame(last_5_products).reset_index()
top_5_products_df = pd.DataFrame(top_5_products).reset_index()
a = top_5_products_df['ProductName']
b = last_5_products_df['ProductName']

# Biểu đồ thể hiện số lượng bán các sản phẩm top 5 theo 5 tháng
df2 = df.groupby(['Month', 'ProductName'])['QuantityOrder'].sum()
df3 = pd.DataFrame(df2).reset_index()
product2 = df3[df3['ProductName'] == a[1]]
product1 = df3[df3['ProductName'] == a[0]]
product3 = df3[df3['ProductName'] == a[2]]
product4 = df3[df3['ProductName'] == a[3]]
product5 = df3[df3['ProductName'] == a[4]]
product1

# Top 5 sản phẩm có doanh thu thấp nhất
# Biểu đồ thể hiện số lượng bán các sản phẩm top 5 theo 5 tháng
df2 = df.groupby(['Month', 'ProductName'])['QuantityOrder'].sum()
df3 = pd.DataFrame(df2).reset_index()
product1_l = df3[df3['ProductName'] == b[0]]
product2_l = df3[df3['ProductName'] == b[1]]
product3_l = df3[df3['ProductName'] == b[2]]
product4_l = df3[df3['ProductName'] == b[3]]
product5_l = df3[df3['ProductName'] == b[4]]


plt.plot(product3_l['Month'], product3_l['QuantityOrder'], 'yD-', label = b[2])
plt.plot(product5_l['Month'], product5_l['QuantityOrder'], 'mo-', label = b[4])
plt.plot(product2_l['Month'], product2_l['QuantityOrder'], 'bD-', label = b[1])
plt.plot(product4_l['Month'], product4_l['QuantityOrder'], 'co-', label = b[3])
plt.plot(product1_l['Month'], product1_l['QuantityOrder'], 'go-', label = b[0])
plt.title("Số lượng bán ra mỗi tháng của top 5 sản phẩm bán ít nhất ")
plt.xlabel("Tháng")
plt.ylabel("Số lượng")

plt.grid(False)
plt.legend(fontsize='xx-small')
plt.show()

plt.plot(product1['Month'], product1['QuantityOrder'], 'go-', label = a[0])
plt.plot(product2['Month'], product2['QuantityOrder'], 'bD-', label = a[1])
plt.plot(product3['Month'], product3['QuantityOrder'], 'yD-', label = a[2])
plt.plot(product4['Month'], product4['QuantityOrder'], 'co-', label = a[3])
plt.plot(product5['Month'], product5['QuantityOrder'], 'mo-', label = a[4])
plt.title("Số lượng bán ra mỗi tháng của top 5 sản phẩm bán chạy nhất ")
plt.xlabel("Tháng")
plt.ylabel("Số lượng")
plt.ylim(0, 9000)
plt.legend(fontsize='xx-small')
plt.show()

# Top 5 sản phẩm bán chạy nhất theo số lượng
plt.barh(top_5_products['ProductName'], top_5_products['QuantityOrder'], color='#B0E0E6')
plt.title("Top 5 sản phẩm bán chạy nhất")
plt.xlabel("Số lượng")
plt.ylabel("Tên sản phẩm")
plt.show()

# Top 5 sản phẩm bán ít nhất theo số lượng
plt.barh(last_5_products['ProductName'], last_5_products['QuantityOrder'], color='#B0E0E6')
plt.title("Top 5 sản phẩm bán ít nhất")
plt.xlabel("Số lượng")
plt.ylabel("Tên sản phẩm")
plt.show()

# Top 10 sản phẩm bán chạy
plt.barh(top_10_products['ProductName'], top_10_products['TotalPrice'], color='#8470FF')
plt.title("Top 10 sản phẩm bán chạy nhất")
plt.xlabel("Doanh thu")
plt.ylabel("Tên sản phẩm")
plt.show()

top_10_products_of_month = df.groupby(['Month', 'ProductName'])['TotalPrice'].sum()
top_10_products_of_month_df = pd.DataFrame(top_10_products_of_month).reset_index()


def product_of_month(month, top_10_products_of_month_df):
    result = top_10_products_of_month_df[top_10_products_of_month_df['Month'] == month].nlargest(10, 'TotalPrice')
    return result

# Vẽ biểu đồ sản phẩm bán chạy theo từng tháng
top_10_products_of_01 = product_of_month('01', top_10_products_of_month_df)
plt.barh(top_10_products_of_01['ProductName'], top_10_products_of_01['TotalPrice'], color='#8470FF')
plt.title("Top 10 sản phẩm bán chạy nhất tháng 1")
plt.xlabel("Doanh thu")
plt.ylabel("Tên sản phẩm")
plt.show()

# Vẽ biểu đồ sản phẩm bán chạy theo tháng 2
top_10_products_of_02 = product_of_month('02', top_10_products_of_month_df)
plt.barh(top_10_products_of_02['ProductName'], top_10_products_of_02['TotalPrice'], color='#8470FF')
plt.title("Top 10 sản phẩm bán chạy nhất tháng 2")
plt.xlabel("Doanh thu")
plt.ylabel("Tên sản phẩm")
plt.show()

# Vẽ biểu đồ sản phẩm bán chạy theo tháng 3
top_10_products_of_03 = product_of_month('03', top_10_products_of_month_df)
plt.barh(top_10_products_of_03['ProductName'], top_10_products_of_03['TotalPrice'], color='#8470FF')
plt.title("Top 10 sản phẩm bán chạy nhất tháng 3")
plt.xlabel("Doanh thu")
plt.ylabel("Tên sản phẩm")
plt.show()

# Vẽ biểu đồ sản phẩm bán chạy theo tháng 4
top_10_products_of_04 = product_of_month('04', top_10_products_of_month_df)
plt.barh(top_10_products_of_04['ProductName'], top_10_products_of_04['TotalPrice'], color='#8470FF')
plt.title("Top 10 sản phẩm bán chạy nhất tháng 4")
plt.xlabel("Doanh thu")
plt.ylabel("Tên sản phẩm")
plt.show()

# Vẽ biểu đồ sản phẩm bán chạy theo tháng 5
top_10_products_of_05 = product_of_month('05', top_10_products_of_month_df)
plt.barh(top_10_products_of_05['ProductName'], top_10_products_of_05['TotalPrice'], color='#8470FF')
plt.title("Top 10 sản phẩm bán chạy nhất tháng 5")
plt.xlabel("Doanh thu")
plt.ylabel("Tên sản phẩm")
plt.show()

#Thống kê theo khách hàng

# Khách hàng mua nhiều nhất
df1 = df.groupby('CustomerName')[['TotalPrice', 'QuantityOrder']].sum()
sorted_df = df1.sort_values('TotalPrice', ascending=False)
sale_customer_df = pd.DataFrame(sorted_df).reset_index()
df1

#Top 10 khách hàng mua nhiều nhất

top_10_customer = sale_customer_df.nlargest(10, 'TotalPrice')


# Vẽ biểu đồ
plt.barh(top_10_customer['CustomerName'], top_10_customer['TotalPrice'], color='#008B45')
plt.title("Top 10 khách hàng mua nhiều nhất")
plt.xlabel("Doanh thu")
plt.ylabel("Tên khách hàng")
plt.show()

# Top 10 khách hàng mua ít nhất
last_10_customer = sale_customer_df.nsmallest(10, 'TotalPrice')


# Vẽ biểu đồ
plt.barh(last_10_customer['CustomerName'], last_10_customer['TotalPrice'], color='#008B45')
plt.title("Top 10 khách hàng mua ít nhất")
plt.xlabel("Doanh thu")
plt.ylabel("Tên khách hàng")
plt.show()
