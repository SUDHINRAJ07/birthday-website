import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'surpriselink-super-secret-key-2026')
    
    # Database Configuration:
    # Uses MySQL URL from environment (e.g. mysql+pymysql://user:pass@host/dbname on Render or local MySQL),
    # with an automated fallback to sqlite:///surpriselink.db for effortless offline development.
    db_url = os.environ.get('DATABASE_URL') or os.environ.get('MYSQL_URL')
    if db_url and db_url.startswith('mysql://'):
        db_url = db_url.replace('mysql://', 'mysql+pymysql://', 1)
    
    SQLALCHEMY_DATABASE_URI = db_url or f"sqlite:///{os.path.join(BASE_DIR, 'surpriselink.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Image Uploads
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max limit
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}
