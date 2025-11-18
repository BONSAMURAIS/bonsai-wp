import logging
import pandas as pd
import requests
from core.csv_importer import upload_csvfile
from core.config import csv_url,logging_level
from models.dim_product import Dim_product
from io import StringIO

logger = logging.getLogger(__name__)

def main():
    try:
        logger.info(f"Start downloading csv from {csv_url}")
        response = requests.get(csv_url)
        response.raise_for_status()  # ensure the download was successful

        logger.info("Start uploading csv into db")
        csv_data = StringIO(response.text)
        df = pd.read_csv(csv_data)
        upload_csvfile(df, Dim_product)
    except Exception as e: 
        logger.error(e)

if __name__ == "__main__":
    logging.basicConfig(level=logging_level)
    main()