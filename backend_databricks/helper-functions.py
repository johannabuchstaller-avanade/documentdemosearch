# Databricks notebook source
import pandas as pd

# COMMAND ----------

# MAGIC %pip install fsspec

# COMMAND ----------

def get_url_list(): 
    # Constants
    storage_account_name = "storage2023jti"
    storage_account_key = ""
    container = "containerjti"

    # Set Azure Blob Storage configuration
    spark.conf.set(f"fs.azure.account.auth.type.{storage_account_name}.dfs.core.windows.net", "SharedKey")
    spark.conf.set(f"fs.azure.account.key.{storage_account_name}.dfs.core.windows.net", storage_account_key)

    # Define the base path to the directory containing the text file
    text_path = "abfss://testcontainer@storage2023jti.dfs.core.windows.net/List_of_URLs"

    # Read the text file from Azure Blob Storage
    df = spark.read.text(text_path, wholetext=True)

    # Split the content into separate lines
    lines = df.collect()
    url_list = []
    for line in lines:
        urls = line.value.split("\n")
        for url in urls:
            ##print(url)
            url_list.append(url)
    
    return (url_list)


# COMMAND ----------

#url_list = get_url_list()

# COMMAND ----------



# COMMAND ----------

def get_url_list_csv(): 
    # Constants
    storage_account_name = "storage2023jti"
    storage_account_key = ""
    container = "containerjti"

    # Set Azure Blob Storage configuration
    spark.conf.set(f"fs.azure.account.auth.type.{storage_account_name}.dfs.core.windows.net", "SharedKey")
    spark.conf.set(f"fs.azure.account.key.{storage_account_name}.dfs.core.windows.net", storage_account_key)

    # Define the path to the CSV file in Azure Blob Storage
    csv_path = "abfss://testcontainer@storage2023jti.dfs.core.windows.net/List_of_URLs_csv/List_of_Urls_with_designations.csv"

    # Read the CSV file from Azure Blob Storage using PySpark
    df = spark.read.csv(csv_path, header=True, inferSchema=True, sep = ";")

    # Show the content of the CSV file
    df.show()

    # Stop the Spark session when done
    #spark.stop()
    return (df)


# COMMAND ----------

#url_list_csv = get_url_list_csv()

# COMMAND ----------

def save_metadata_dataframe_silver(metadatadataframe): 
    # Constants
    storage_account_name = "storage2023jti"
    storage_account_key = ""
    container = "containerjti"

    # Set Azure Blob Storage configuration
    spark.conf.set(f"fs.azure.account.auth.type.{storage_account_name}.dfs.core.windows.net", "SharedKey")
    spark.conf.set(f"fs.azure.account.key.{storage_account_name}.dfs.core.windows.net", storage_account_key)

    # Define the base path to the directory containing the text file
    blob_path_delta = "abfss://testcontainer@storage2023jti.dfs.core.windows.net/metadata_silver_delta"
    dbutils.fs.mkdirs("dbfs:/FileStore/metadata_silver_csv/")
    dbfs_path_csv = "/dbfs/FileStore/metadata_silver_csv/metadatadataframe_281123.csv"
    blob_path_csv = "abfss://testcontainer@storage2023jti.dfs.core.windows.net/metadata_silver_csv"
    try:
        metadatadataframe.write.format("delta").save(blob_path_delta)
        metadatadataframe_pandas = metadatadataframe.toPandas()
        metadatadataframe_pandas.to_csv(dbfs_path_csv)
        dbutils.fs.cp("dbfs:/FileStore/metadata_silver_csv/metadatadataframe_281123.csv", blob_path_csv)
        message = "metadatadataframe silver successfully saved in blob storage"
    except Exception as e:
        print(e)
        message = "metadatadataframe silver not saved"
    
    return(message)
    


# COMMAND ----------

def save_error_dataframe(errordataframe): 
    # Constants
    storage_account_name = "storage2023jti"
    storage_account_key = ""
    container = "containerjti"

    # Set Azure Blob Storage configuration
    spark.conf.set(f"fs.azure.account.auth.type.{storage_account_name}.dfs.core.windows.net", "SharedKey")
    spark.conf.set(f"fs.azure.account.key.{storage_account_name}.dfs.core.windows.net", storage_account_key)

    # Define the base path to the directory containing the text file
    blob_path_delta = "abfss://testcontainer@storage2023jti.dfs.core.windows.net/errordataframe"
    dbutils.fs.mkdirs("dbfs:/FileStore/errordataframe_csv/")
    dbfs_path_csv = "/dbfs/FileStore/errordataframe_csv/errordataframe_281123.csv"
    blob_path_csv = "abfss://testcontainer@storage2023jti.dfs.core.windows.net/errordataframe_csv"
    try:
        errordataframe.write.format("delta").save(blob_path_delta)
        errordataframe_pandas = errordataframe.toPandas()
        errordataframe_pandas.to_csv(dbfs_path_csv)
        dbutils.fs.cp("dbfs:/FileStore/errordataframe_csv/errordataframe_281123.csv", blob_path_csv)
        message = "errordataframe successfully saved in blob storage"
    except Exception as e:
        print(e)
        message = "errordataframe not saved"
    
    return(message)

# COMMAND ----------

def save_metadata_dataframe_bronze(metadatadataframe): 
    # Constants
    storage_account_name = "storage2023jti"
    storage_account_key = ""
    container = "containerjti"

    # Set Azure Blob Storage configuration
    spark.conf.set(f"fs.azure.account.auth.type.{storage_account_name}.dfs.core.windows.net", "SharedKey")
    spark.conf.set(f"fs.azure.account.key.{storage_account_name}.dfs.core.windows.net", storage_account_key)

    # Define the base path to the directory containing the text file
    blob_path_delta = "abfss://testcontainer@storage2023jti.dfs.core.windows.net/metadata_bronze_delta"
    try:
        metadatadataframe.write.format("delta").save(blob_path_delta)
        message = "metadatadataframe bronze successfully saved in blob storage"
    except Exception as e:
        print(e)
        message = "metadatadataframe bronze not saved"
    
    return(message)

# COMMAND ----------

def copy_pdf_from_filestore_to_blob(filename):
    # Constants
    storage_account_name = "storage2023jti"
    storage_account_key = ""
    container = "containerjti"

    # Set Azure Data Lake Storage configuration
    spark.conf.set(f"fs.azure.account.auth.type.{storage_account_name}.dfs.core.windows.net", "SharedKey")
    spark.conf.set(f"fs.azure.account.key.{storage_account_name}.dfs.core.windows.net", storage_account_key)

    # Define the local path to the PDF file
    dbfs_pdf_path = "dbfs:/FileStore/pdfs_temp/"

    # Define the path for the output PDF in Azure Blob Storage
    blob_pdf_path = "abfss://testcontainer@storage2023jti.dfs.core.windows.net/pdfs_permanent_storage"

    # Use dbutils.fs to copy the PDF file to Azure Blob Storage
    dbutils.fs.cp(dbfs_pdf_path + filename, blob_pdf_path)

    # Print the paths for verification
    print("PDF file copied to Azure Blob Storage at:", blob_pdf_path + "/" + filename)
    return(blob_pdf_path + "/" + filename)


# COMMAND ----------

def copy_pdf_from_temp_to_permanent_storage(filepath):
    # Constants
    storage_account_name = "storage2023jti"
    storage_account_key = ""
    container = "containerjti"

    # Set Azure Data Lake Storage configuration
    spark.conf.set(f"fs.azure.account.auth.type.{storage_account_name}.dfs.core.windows.net", "SharedKey")
    spark.conf.set(f"fs.azure.account.key.{storage_account_name}.dfs.core.windows.net", storage_account_key)

    # Define the local path to the PDF file
    dbfs_pdf_path = "dbfs:/FileStore/pdfs_temp/"

    # Define the path for the output PDF in Azure Blob Storage
    blob_pdf_path = "abfss://testcontainer@storage2023jti.dfs.core.windows.net/pdfs_permanent_storage"

    # Use dbutils.fs to copy the PDF file to Azure Blob Storage
    dbutils.fs.cp(dbfs_pdf_path + filename, blob_pdf_path)

    # Print the paths for verification
    print("PDF file copied to Azure Blob Storage at:", blob_pdf_path + "/" + filename)
    return(blob_pdf_path + "/" + filename)
