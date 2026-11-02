from datetime import datetime, timezone
from models.database import db

def utc_now():
    return datetime.now(timezone.utc)

class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    slug = db.Column(db.String(80), unique=True, nullable=False, index=True)
    description = db.Column(db.String(255), nullable=True)
    icon = db.Column(db.String(10), default='💌')
    created_at = db.Column(db.DateTime, default=utc_now)

    # Relationships
    templates = db.relationship('Template', backref='category', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Category {self.name}>'


class Template(db.Model):
    __tablename__ = 'templates'

    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    default_headline = db.Column(db.String(200), nullable=False)
    default_message = db.Column(db.Text, nullable=False)
    theme_gradient = db.Column(db.String(255), default='linear-gradient(135deg, #fff0f5 0%, #fce7f3 50%, #ede9fe 100%)')
    font_family = db.Column(db.String(100), default="'Playfair Display', serif")
    music_track = db.Column(db.String(50), default='lofi')
    created_at = db.Column(db.DateTime, default=utc_now)

    def __repr__(self):
        return f'<Template {self.name}>'
