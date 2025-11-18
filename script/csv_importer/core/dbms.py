import logging
from contextlib import contextmanager
from typing import Generator
from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import sessionmaker, Session
from utils.singleton import Singleton
from script.csv_importer.config import db_engine, db_user, db_pwd, db_host, db_port, db_name,logging_level
from core import Base
from models import * #necessary to import models to create tables in db

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging_level)

class DBMS(metaclass=Singleton):
    """
    Database handler.

    This singleton class manages the creation of Postgres schemas and tables, and 
    
    Attributes:
        engine (Engine): Sqlalchemy engine
        sessionLocal (sessionmaker): Sqlalchemy local session
    """

    def __init__(self) -> None:
        """
        Initialize a new DBMS instance
        """
        try:
            logger.debug(f"{db_engine}://{db_user}:{db_pwd}@{db_host}:{db_port}/{db_name}")
            self.engine:Engine = create_engine(f"{db_engine}://{db_user}:{db_pwd}@{db_host}:{db_port}/{db_name}")
            self.sessionLocal = sessionmaker(bind=self.engine, autoflush=False)
            logger.info("Creating tables if they do not exist")
            Base.metadata.create_all(self.engine)
        except Exception as e:
            logger.error('Unable to access database', repr(e))

    @contextmanager
    def get_session(self) -> Generator[Session, None, None]:
        """
        Context manager that yields a session and ensures proper cleanup.
        Usage:
            with db.get_session() as session:
                # do stuff
        """
        session = self.sessionLocal()
        try:
            yield session
            #flush here??
            session.commit()
        except Exception as e:
            logger.error(e)
            session.rollback()
            raise
        finally:
            session.close()

    def __del__(self) -> None:
        """
        At instance destruction, sqlalchemy engine is disposed to ensure proper cleanup.
        """
        if hasattr(self, "engine"):
            self.engine.dispose()
            logger.info("Database engine disposed")
