import logging


def str_to_bool(value):
    return value.lower() in ("true", "1", "yes", "on")

# env file
# db
db_engine = "mysql+pymysql"
db_user = "postgres"
db_pwd = "postgres"
db_host = "localhost"
db_port = 3306
db_name = "internal_db"
logging_level = logging.INFO

csv_url = "https://lca.aau.dk/api/products/?version=latest&csv=true"