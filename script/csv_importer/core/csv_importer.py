import logging
from sqlalchemy import text
from core.dbms import DBMS

logger = logging.getLogger(__name__)

db = DBMS()

def upload_csvfile(df, model_class) -> None:
    logger.info("Start uploading file")

    with db.get_session() as session:
        try:

            _table_name = model_class.__tablename__
            _schema = model_class.__table_args__['schema']
            logger.debug(f"Truncate table {_schema}.{_table_name}")
            session.execute(text(f'TRUNCATE TABLE {_schema}.{_table_name} RESTART IDENTITY CASCADE;'))
            session.commit()

            logger.debug(f"Insert data into table {_schema}.{_table_name}")
            data = [
                model_class(**row)
                for row in df.to_dict(orient='records')
            ]
            session.bulk_save_objects(data)
        except FileNotFoundError:
            logger.error("SKIP file . File cannot be found")
        except Exception as e:
            logger.error(e)
    logger.info("Finish uploading data into the database")