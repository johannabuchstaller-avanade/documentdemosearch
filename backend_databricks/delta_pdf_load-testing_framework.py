# Databricks notebook source
# MAGIC %pip install PyPDF2

# COMMAND ----------

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

    #connect to storage account
    storage_account_name = "storage2023jti"
    storage_account_key = ""
    container = "containerjti"

    # Set Azure Blob Storage configuration
    spark.conf.set(f"fs.azure.account.auth.type.{storage_account_name}.dfs.core.windows.net", "SharedKey")
    spark.conf.set(f"fs.azure.account.key.{storage_account_name}.dfs.core.windows.net", storage_account_key)

# COMMAND ----------

path_pdfs = "abfss://testcontainer@storage2023jti.dfs.core.windows.net/PDF_Files"

# COMMAND ----------

df_pdf_storage_paths = spark.read.format("binaryFile").load(path_pdfs)
display(df_pdf_storage_paths)

# COMMAND ----------

#test setup for metadatadataframe
col_names = ['pdflink', 'filename', 'author', 'creation_date', 'modification_date', 'download_date', 'type']
metadatadataframe = pd.DataFrame(columns = col_names)

# COMMAND ----------

dbutils.fs.rm("dbfs:/FileStore/Text_Output_Delta/",True)

# COMMAND ----------

dbutils.fs.mkdirs("dbfs:/FileStore/Text_Output_Delta/")

# COMMAND ----------

def get_pdf(link_to_pdf):
    filename = link_to_pdf.rsplit('/', 1)[-1]
    print(filename)
    local_pdf_path = "dbfs:/FileStore/Text_Output_Delta/" + filename
    #print(filename)
    dbutils.fs.cp(link_to_pdf,local_pdf_path)

# COMMAND ----------

def get_metadata_from_downloaded_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    #filename = reader.metadata.title
    author = reader.metadata.author
    creation_date = reader.metadata.creation_date
    modification_date = reader.metadata.modification_date
    return (author, creation_date, modification_date)

# COMMAND ----------

#pdf_path = '/dbfs/FileStore/Text_Output_Delta/' + "Testfile_for_delta_load.pdf"

# COMMAND ----------

#author, creation_date, modification_date = get_metadata_from_downloaded_pdf(pdf_path)

# COMMAND ----------

#modification_date

# COMMAND ----------

all_pdf_links = list(df_pdf_storage_paths.select('path').toPandas()['path'])

# COMMAND ----------

all_pdf_links

# COMMAND ----------

counter = 1

# COMMAND ----------

for link in all_pdf_links:
    print(counter)
    counter = counter + 1
    print(link)
    try:
        get_pdf(link)
        filename = link.rsplit('/', 1)[-1]
        author, creation_date, modification_date = get_metadata_from_downloaded_pdf('/dbfs/FileStore/Text_Output_Delta/' + filename)
        print(filename)
        print(author)
        print(creation_date)
        print(modification_date)
        dct = {'pdflink': link, 'filename': filename, 'author':author, 'creation_date':creation_date, 'modification_date': modification_date, 'download_date':datetime.now(), 'type': 'pdf'}
        dct = {k:[v] for k,v in dct.items()}
        temp = pd.DataFrame(dct)
        print(temp)
        metadatadataframe = pd.concat([metadatadataframe, temp])
    except Exception as e:
        print(e)
        #dct = {'pdflink': link, 'errormessage': str(e) , 'timestamp':datetime.now()}
        #dct = {k:[v] for k,v in dct.items()}
        #temp = pd.DataFrame(dct)
        #errordataframe = pd.concat([errordataframe, temp])

# COMMAND ----------

metadatadataframe_spark = spark.createDataFrame(metadatadataframe)

# COMMAND ----------

################################################################COMMENT AFTER FIRST RUN #################################################################################################

# COMMAND ----------

#blob_path = "abfss://testcontainer@storage2023jti.dfs.core.windows.net/metadata_delta_test_initial"
#try:
    #metadatadataframe_spark.write.format("delta").save(blob_path)
   # message = "metadatadataframe successfully saved in blob storage"
#except Exception as e:
    #print(e)
    #message = "metadatadataframe not saved"

# COMMAND ----------

#load silver
#path_silver = "abfss://testcontainer@storage2023jti.dfs.core.windows.net/metadata_delta_test_initial"

#df_silver = spark.read.format("delta").load(path_silver)

# COMMAND ----------

#display(df_silver)

# COMMAND ----------

#df_silver.count()

# COMMAND ----------

#dbutils.notebook.exit("done with silver")

# COMMAND ----------

###then upload pdf to blob, comment section and rerun

# COMMAND ----------

############################################################################################################################################################################################

# COMMAND ----------

metadatadataframe_spark = spark.createDataFrame(metadatadataframe)

# COMMAND ----------

blob_path = "abfss://testcontainer@storage2023jti.dfs.core.windows.net/metadata_delta_test_increment"
try:
    metadatadataframe_spark.write.mode("overwrite").format("delta").save(blob_path)
    message = "metadatadataframe successfully saved in bronze"
except Exception as e:
    print(e)
    message = "metadatadataframe not saved"

# COMMAND ----------

path_silver = "abfss://testcontainer@storage2023jti.dfs.core.windows.net/metadata_delta_test_initial"

df_silver = spark.read.format("delta").load(path_silver)

# COMMAND ----------

#load bronze
path_bronze = "abfss://testcontainer@storage2023jti.dfs.core.windows.net/metadata_delta_test_increment"

df_bronze = spark.read.format("delta").load(path_bronze)

# COMMAND ----------

display(df_bronze)

# COMMAND ----------

from delta.tables import *

# COMMAND ----------

df_silver_delta = DeltaTable.forPath(spark, path_silver)

# COMMAND ----------

(df_silver_delta.alias('silver')
  .merge(df_bronze.alias('bronze'), "bronze.filename = silver.filename AND bronze.modification_date = silver.modification_date")
  .whenNotMatchedInsertAll() #Insert all rows from the source that are not already in the target table.
  .whenNotMatchedBySourceDelete() #Delete all target rows that have no matches in the source table.
  .execute()
)

# COMMAND ----------

display(df_silver)

# COMMAND ----------

#mock record with same name and different mod date

# COMMAND ----------

#drop duplicates on filename and keep latest
#create temp table from silver

#silver_temp = (
  #spark.sql("SELECT *, ROW_NUMBER() OVER (PARTITION BY filename ORDER BY modification_date DESC) rn FROM df_silver_delta"))#.filter(f.col('rn') > 1).drop('rn').distinct()

#https://stackoverflow.com/questions/61674476/how-to-drop-duplicates-in-delta-table

# COMMAND ----------

df_silver.count()

# COMMAND ----------

display(df_silver)

# COMMAND ----------


