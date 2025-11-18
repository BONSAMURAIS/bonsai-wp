from core import Base
from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column


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
    __table_args__ = {"schema": "public"}

    code: Mapped[str] = mapped_column(Text, primary_key=True)
    uuid: Mapped[str] = mapped_column(Text)
    name: Mapped[str] = mapped_column(Text)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    cpa_category: Mapped[str] = mapped_column(Text)
    scope: Mapped[str] = mapped_column(Text, nullable=True)
    created_by: Mapped[str] = mapped_column(Text)
    parent: Mapped[str] = mapped_column(Text, nullable=True)
    reference_unit: Mapped[str | None] = mapped_column(Text, nullable=True)