import numpy as np
import pandas as pd
from time import sleep
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import NoSuchElementException, ElementNotInteractableException

service = Service(executable_path='D:\PyCharmProfessional\Projects\DataMining\Custome_Behavior_PJ\chromedriver-win64\chromedriver.exe')
driver = webdriver.Chrome(service=service)

driver.get('https://eshop.acecookvietnam.vn/collections/all')
sleep(random.randint(5,10))

next_product = driver.find_element('xpath', '//*[@id="collection-body"]/div/div/div[2]/div[2]/div[2]/a')
next_product.click()

count = 1
links, title, price, image = [], [], [], []

while True:
    try:
        print("Crawl Page" + str(count))
        next_product = driver.find_element('xpath', '/html/body/div[1]/main/div/div[2]/div/div/div/div[2]/div[2]/div[2]/a')
        next_product.click()
        sleep(random.randint(5,10))
        count += 1
    except ElementNotInteractableException:
        print("Element Not Interactable Exception")
        break
elems = driver.find_elements(By.CSS_SELECTOR, ".proloop-image [href]")
links = [elem.get_attribute('href') for elem in elems]
title = [elem.get_attribute('title') for elem in elems]
elems_price = driver.find_elements(By.CSS_SELECTOR, ".price")
price = [elem.text for elem in elems_price]
# elems_img = driver.find_elements(By.CSS_SELECTOR, ".lazy-img.first-image")
elems_img2 = driver.find_elements(By.CSS_SELECTOR, ".product--image .lazy-img picture img")
image = [elem.get_attribute('src') for elem in elems_img2]

image1 = image[0:40]
image1_1 = image1[0::2]
image2 = image[40:44]
image3 = image[45:160]
image3_3 = image3[0::2]
add_image = image1_1 + image2 + image3_3
len(add_image)

# Hàm chuyển đổi giá trị từ chuỗi sang số nguyên
def convert_price(price_str):
    cleaned_price_str = np.char.replace(price_str, '₫', '')
    cleaned_price_str = np.char.replace(cleaned_price_str, ',', '')
    return cleaned_price_str

# Áp dụng hàm chuyển đổi cho mảng giá
prices_cleaned_str = convert_price(price)

print(prices_cleaned_str)

df1 = pd.DataFrame(list(zip(links[1::2], title[1::2], price, add_image)), columns=['link', 'title', 'price', 'image'])
def convert_price(price_str):
    cleaned_price_str = price_str.replace('₫', '').replace(',', '')
    return int(cleaned_price_str)

# Áp dụng hàm chuyển đổi cho cột 'price'
df1['price'] = df1['price'].apply(convert_price)

arr = []
for i in image:
    if i.endswith('png'):
        arr.append(i)
len(arr)

links = links[1::2]

product_id = []

for link in links:
    driver.get(link)
    sleep(random.randint(5,10))
    elems_id = driver.find_element(By.CSS_SELECTOR, ".product-heading strong")
    product_id.append(elems_id.text)

df2 = pd.DataFrame(list(zip(title[1::2], product_id, price, add_image)), columns=['ProductName', 'ProductID', 'Price', 'Image'])
df2['Price'] = df2['Price'].apply(convert_price)
df2

# Kết nối tới MongoDB
from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/')
mydb = client['customer_data']
collect = mydb['product2']
def postDataToMGBD(data, collection):
    data_records = data.to_dict(orient='records')

    # Chèn dữ liệu vào MongoDB
    collection.insert_many(data_records)

postDataToMGBD(df2, collect)

driver.get(links[0])
elems_id = driver.find_element(By.CSS_SELECTOR, ".product-thumb__item img")
product_id = elems_id.get_attribute('src')

from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/')
mydb = client['customer_data']
collection = mydb['product2']

# Lấy danh sách tất cả các tài liệu trong collection
documents = collection.find({})
image_link = image[0::2]
for index, document in enumerate(documents):
    document_id = document['_id']
    price1 = image_link[index]
    update = { '$set': { 'Image': price1 } }
    collection.update_one({ '_id': document_id }, update)

print("Đã cập nhật thành công")

image_list = df1['price'].astype(int).values
print(image_list[0])