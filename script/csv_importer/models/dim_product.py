from core import Base
from sqlalchemy import Text, String
from sqlalchemy.orm import Mapped, mapped_column
from script.csv_importer.config import db_name


class Dim_product(Base):
    """
    SQLAlchemy ORM model representing a data product record.

    Attributes:
        code (str): 
        uuid (str): 
        name (str): 
        description (str): 
        cpa_category (int): 
        scope (str): 
        created_by (str): 
        parent (str): 
        reference_unit (str, optional): 
    """
    __tablename__ = "dim_product"
    __table_args__ = {"schema": db_name }

    code: Mapped[str] = mapped_column(String(255), primary_key=True)
    uuid: Mapped[str] = mapped_column(Text)
    name: Mapped[str] = mapped_column(Text)
    description: Mapped[str] = mapped_column(Text)
    cpa_category: Mapped[str] = mapped_column(Text,nullable=True)
    scope: Mapped[str] = mapped_column(Text, nullable=True)
    created_by: Mapped[str] = mapped_column(Text,nullable=True)
    parent: Mapped[str] = mapped_column(Text, nullable=True)
    reference_unit: Mapped[str | None] = mapped_column(Text, nullable=True)