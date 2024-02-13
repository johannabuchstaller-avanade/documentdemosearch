# Databricks notebook source
# MAGIC %pip install beautifulsoup4  

# COMMAND ----------

# MAGIC %pip install PyPDF2

# COMMAND ----------

# MAGIC %pip install lxml

# COMMAND ----------

from bs4 import BeautifulSoup
import requests
import pandas as pd
from PyPDF2 import PdfReader
import re
from urllib.parse import urlparse
from datetime import datetime
import time
from itertools import chain
from pyspark.sql.functions import *


# COMMAND ----------

def get_base_url(url):
    parsed_uri = urlparse(url)
    base_url = '{uri.scheme}://{uri.netloc}'.format(uri=parsed_uri)
    return base_url

# COMMAND ----------

def get_sub_links (url):
    base_url = get_base_url (url)
    req = requests.get(url)
    content = req.text
    soup = BeautifulSoup(content, features="lxml")
    links = soup.find_all('a')
    links_cleaned = []
    for link in links:
        #print(link)
        if(link.has_attr("href")):
            if('http' in link['href']):
                links_cleaned.append(link['href'])
            else:
                links_cleaned.append(base_url + link['href'])
    return (links_cleaned)

# COMMAND ----------

def get_pdf_links (url):
    req = requests.get(url)
    base_url = get_base_url (url)
    content = req.text
    soup = BeautifulSoup(content, features="lxml")
    pdf_links = soup.find_all('a', href=re.compile(r'(\.pdf)'))
    ashx_links = soup.find_all('a', href=re.compile(r'(\.ashx)'))
    doc_links = pdf_links + ashx_links
    cleaned_links = ['start']
    for link in doc_links:
        if('http' in link['href']):
            cleaned_links.append(link['href'])
        else:
            cleaned_links.append(base_url + link['href'])
    del cleaned_links [0]
    return (cleaned_links)

# COMMAND ----------

def download_pdf(link_to_pdf):
    req_pdf = requests.get(link_to_pdf, allow_redirects=True)#, headers = headers)
    filename = link_to_pdf.rsplit('/', 1)[-1]
    open('/dbfs/FileStore/pdfs_temp/' + filename, 'wb').write(req_pdf.content)

# COMMAND ----------

def get_metadata_from_downloaded_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    #filename = reader.metadata.title
    author = reader.metadata.author
    creation_date = reader.metadata.creation_date
    modification_date = reader.metadata.modification_date
    pdf_page_number = len(reader.pages)
    return (author, creation_date, modification_date,pdf_page_number)

# COMMAND ----------

# MAGIC %run ./helper-functions

# COMMAND ----------

dbutils.fs.mkdirs("dbfs:/FileStore/pdfs_temp/")
#dbutils.fs.mkdirs("dbfs:/FileStore/pdfs_perm/")

# COMMAND ----------

url_df = get_url_list_csv()

# COMMAND ----------

urls_for_crawling = url_df.where(col('Designation') == "url for crawling") 
urls_for_crawling = list(urls_for_crawling.select('URL').toPandas()['URL'])

urls_for_pdf_links = url_df.where(col('Designation') == "url for pdf links") 
urls_for_pdf_links = list(urls_for_pdf_links.select('URL').toPandas()['URL'])

add_to_all_pdf_links = url_df.where(col('Designation') == "pdf") 
add_to_all_pdf_links = list(add_to_all_pdf_links.select('URL').toPandas()['URL'])

texts = url_df.where(col('Designation') == "text on the page") 
texts = list(texts.select('URL').toPandas()['URL'])

# COMMAND ----------

col_names = ['pdflink_on_website', 'filename', 'author', 'creation_date', 'modification_date', 'download_date', 'type', 'path_to_pdf_in_storage', 'number_pages_pdf', 'path_to_pdf_in_dbfs' ]
metadatadataframe = pd.DataFrame(columns = col_names)

# COMMAND ----------

col_names = ['url', 'suburl', 'pdflink', 'errormessage', 'timestamp']
errordataframe = pd.DataFrame(columns = col_names)

# COMMAND ----------

col_names = ['url', 'suburl']
url_suburl_dataframe = pd.DataFrame(columns = col_names)

# COMMAND ----------

#initiate a counter and add document id to metadatatable, also add link to document in blob storage

all_sublinks = []

for url in urls_for_crawling:
    try:
        sublinks = get_sub_links(url)
        temp_meta = pd.DataFrame(sublinks, columns=['suburl'])
        temp_meta['url'] = url
        if sublinks:
            all_sublinks.append(sublinks)
            url_suburl_dataframe = pd.concat([url_suburl_dataframe, temp_meta])
    except Exception as e:
        print(e)
        dct = {'url': url, 'errormessage': str(e) , 'timestamp':datetime.now()}
        dct = {k:[v] for k,v in dct.items()}
        temp = pd.DataFrame(dct)
        errordataframe = pd.concat([errordataframe, temp])

# COMMAND ----------

url_suburl_dataframe

# COMMAND ----------

all_sublinks = list(chain.from_iterable(all_sublinks))

# COMMAND ----------

print(len(all_sublinks))

# COMMAND ----------

counter = 1

# COMMAND ----------

all_sublinks = all_sublinks + urls_for_pdf_links

# COMMAND ----------

all_sublinks

# COMMAND ----------

col_names = ['suburl', 'pdflink']
suburl_pdflink_dataframe = pd.DataFrame(columns = col_names)

# COMMAND ----------

all_pdf_links = []

for link in all_sublinks:
    counter = counter + 1
    print(counter)
    try:
        pdf_links = get_pdf_links(link)
        temp_meta = pd.DataFrame(pdf_links, columns=['pdflink'])
        temp_meta['suburl'] = link
        if pdf_links:
            all_pdf_links.append(pdf_links)
            suburl_pdflink_dataframe = pd.concat([suburl_pdflink_dataframe, temp_meta])
    except Exception as e:
        #print(e)
        dct = {'suburl': link, 'errormessage': str(e) , 'timestamp':datetime.now()}
        dct = {k:[v] for k,v in dct.items()}
        temp = pd.DataFrame(dct)
        errordataframe = pd.concat([errordataframe, temp])

# COMMAND ----------

print(suburl_pdflink_dataframe)

# COMMAND ----------

print(errordataframe)

# COMMAND ----------

print(all_pdf_links)

# COMMAND ----------

all_pdf_links = list(chain.from_iterable(all_pdf_links))    

# COMMAND ----------

print(all_pdf_links)

# COMMAND ----------

print(len(all_pdf_links))

# COMMAND ----------

all_pdf_links = all_pdf_links + add_to_all_pdf_links

# COMMAND ----------

counter = 1

# COMMAND ----------

len(all_pdf_links)

# COMMAND ----------

if len(all_pdf_links) < 500:
    for link in all_pdf_links:
        print(counter)
        counter = counter + 1
        print(link)
        try:
            download_pdf(link)
            time.sleep(10)
            filename = link.rsplit('/', 1)[-1]
            print(filename)
            author, creation_date, modification_date, pdf_length = get_metadata_from_downloaded_pdf('/dbfs/FileStore/pdfs_temp/' + filename)
            #copy to temp storage
            path_to_pdf_in_blob_storage = copy_pdf_from_filestore_to_blob(filename)
            path_to_pdf_in_dbfs_storage = "/dbfs/FileStore/pdfs_temp/" + filename
            print(filename)
            print(author)
            print(creation_date)
            print(modification_date)
            dct = {'pdflink_on_website': link, 'filename': filename, 'author':author, 'creation_date':creation_date, 'modification_date': modification_date, 'download_date':datetime.now(), 'type': 'pdf', 'path_to_pdf_in_storage': path_to_pdf_in_blob_storage,'number_pages_pdf' : pdf_length, 'path_to_pdf_in_dbfs' : path_to_pdf_in_dbfs_storage}
            dct = {k:[v] for k,v in dct.items()}
            temp = pd.DataFrame(dct)
            print(temp)
            metadatadataframe = pd.concat([metadatadataframe, temp])
        except Exception as e:
            print(e)
            dct = {'pdflink': link, 'errormessage': str(e) , 'timestamp':datetime.now()}
            dct = {k:[v] for k,v in dct.items()}
            temp = pd.DataFrame(dct)
            errordataframe = pd.concat([errordataframe, temp])



# COMMAND ----------

metadatadataframe

# COMMAND ----------

metadatadataframe_spark = spark.createDataFrame(metadatadataframe)

# COMMAND ----------

metadatadataframe_spark.show(50, 50)

# COMMAND ----------

print(errordataframe)

# COMMAND ----------

errordataframe_spark = spark.createDataFrame(errordataframe)

# COMMAND ----------

errordataframe_spark.show(5, 50)

# COMMAND ----------

save_metadata_dataframe_silver(metadatadataframe_spark)

# COMMAND ----------

save_error_dataframe(errordataframe_spark)

# COMMAND ----------

# MAGIC %sql
# MAGIC DROP TABLE IF EXISTS silver

# COMMAND ----------

# MAGIC %sql
# MAGIC CREATE TABLE silver LOCATION "abfss://testcontainer@storage2023jti.dfs.core.windows.net/metadata_silver_delta";

# COMMAND ----------

# MAGIC %sql
# MAGIC ALTER TABLE silver SET TBLPROPERTIES (delta.enableChangeDataFeed = true)

# COMMAND ----------

#move to perm temp storage inside DB
#dbutils.fs.cp("dbfs:/FileStore/pdfs_temp/","dbfs:/FileStore/pdfs_perm/",recurse=True)

# COMMAND ----------

#clear temp storage
#dbutils.fs.rm("dbfs:/FileStore/pdfs_temp/",True)
