"""个人工具模块包，集中初始化各工具需要的数据表。"""

from . import deepseek, image_mosaic, image_processing, pdf_processing, storage, watermark, weight


def init_tables():
    """按依赖顺序初始化所有工具表。"""
    storage.init_tables()
    image_mosaic.init_tables()
    image_processing.init_tables()
    pdf_processing.init_tables()
    weight.init_tables()
    deepseek.init_tables()
