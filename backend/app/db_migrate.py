"""
启动时补齐与 ORM 不一致的列，避免已有库在模型增加字段后直接 500（如 tags.sort_order）。
"""

from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine


def ensure_tags_sort_order(engine: Engine) -> None:
    insp = inspect(engine)
    if not insp.has_table("tags"):
        return
    cols = {c["name"] for c in insp.get_columns("tags")}
    if "sort_order" in cols:
        return

    dialect = engine.dialect.name
    with engine.begin() as conn:
        if dialect == "mysql":
            conn.execute(
                text(
                    "ALTER TABLE tags ADD COLUMN sort_order INT NOT NULL DEFAULT 0 "
                    "COMMENT 'display order' AFTER color"
                )
            )
            try:
                conn.execute(text("CREATE INDEX ix_tags_sort_order ON tags (sort_order)"))
            except Exception:
                pass
        elif dialect == "sqlite":
            conn.execute(
                text("ALTER TABLE tags ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0")
            )
        else:
            # 其他方言：尽力添加整型列
            conn.execute(
                text("ALTER TABLE tags ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0")
            )
