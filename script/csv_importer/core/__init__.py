from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):

    def to_dict(self) -> dict:
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self) -> str:
        attrs = vars(self)
        attr_str = ', '.join(f"{k}={v!r}" for k, v in attrs.items() if not k.startswith('_'))
        return f"{self.__class__.__name__}({attr_str})"