# Databricks notebook source
# MAGIC %pip install lxml

# COMMAND ----------

# MAGIC %md
# MAGIC test

# COMMAND ----------

# MAGIC %pip install beautifulsoup4  

# COMMAND ----------

# MAGIC %pip install PyPDF2

# COMMAND ----------

from PyPDF2 import PdfReader
import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urlparse
import pandas as pd

# COMMAND ----------

#list of single page urls
urls = []

# COMMAND ----------

url = "https://www.tourismtoday.com/statistics/foreign-arrivals-air-sea-data"

# COMMAND ----------

################################################################################inspecting content of pdf reader ######################################################

# COMMAND ----------

#pdf_name = "https://www.imf.org/-/media/Files/Publications/CR/2022/English/1BHSEA2022001.ashx"
#req_pdf = requests.get(pdf_name, allow_redirects=True)
#pdf_content_type = req_pdf.headers.get('content-type')
#print(req_pdf.url)
#print(req_pdf.text)
#print(req_pdf.links)
#print(req_pdf.raw)
#print(req_pdf.json)
#reader = PdfReader(pdf_path)
#print(reader.metadata.title)

# COMMAND ----------

def get_base_url(url):
    parsed_uri = urlparse(url)
    base_url = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
    return base_url

#get all pdf links and metadata from a single page website and download file to Databricks FileStore 
def get_list_of_pdf_links_info_and_content_from_site (url):
    req = requests.get(url)
    content = req.text
    soup = BeautifulSoup(content, features="lxml")
    links = soup.find_all('a', href=re.compile(r'(\.pdf)'))
    list_of_links = []
    list_of_content_type = []
    list_of_creation_date = []
    list_of_authors = []
    for link in links:
        if ('http' in link['href']):
            pdf_name = link['href']
            print (pdf_name)
            req_pdf = requests.get(pdf_name, allow_redirects=True)
            pdf_content_type = req_pdf.headers.get('content-type')
            filename = pdf_name.rsplit('/', 1)[-1]
            open('/dbfs/FileStore/' + filename, 'wb').write(req_pdf.content)
            reader = PdfReader('/dbfs/FileStore/' + filename)
            creation_date = reader.metadata.creation_date
            print(creation_date)

        else:
            pdf_name = "https://www.tourismtoday.com" + link['href']
            print(pdf_name)
            req_pdf = requests.get(pdf_name, allow_redirects=True)
            pdf_content_type = req_pdf.headers.get('content-type')
            filename = pdf_name.rsplit('/', 1)[-1]
            open('/dbfs/FileStore/' + filename, 'wb').write(req_pdf.content)
            reader = PdfReader('/dbfs/FileStore/' + filename)
            print(reader.pdf_header)
            creation_date = reader.metadata.creation_date
            print(creation_date)
            
        list_of_links.append(pdf_name)
        result_dataframe = pd.DataFrame({'pdf_links':list_of_links})
        list_of_content_type.append(pdf_content_type)
        list_of_creation_date.append(creation_date)
        result_dataframe['pdf_content_type'] = list_of_content_type
        result_dataframe['creation_date'] = list_of_creation_date

    return result_dataframe


# COMMAND ----------

base_url = get_base_url(url)
print(base_url)
#needs to be added to pdf info extraction and download

# COMMAND ----------

pdf_link_df = get_list_of_pdf_links_info_and_content_from_site(url)

# COMMAND ----------

pdf_link_df['pdf_links'][1]

# COMMAND ----------

pdf_link_df['website'] = base_url

# COMMAND ----------

df_spark=spark.createDataFrame(pdf_link_df)

# COMMAND ----------

df_spark.show(20, False)

# COMMAND ----------

#checking content of FileStore
dbutils.fs.ls("dbfs:/FileStore/")

# COMMAND ----------

file_list = dbutils.fs.ls("dbfs:/FileStore")

# COMMAND ----------

for element in file_list:
    print((element.name))

# COMMAND ----------

for element in file_list:
    print(element.name)
    if '.pdf' in element.name:
        reader = PdfReader('/dbfs/FileStore/' + element.name)
        print(str(reader.metadata))
        print(reader.metadata.creation_date) 
