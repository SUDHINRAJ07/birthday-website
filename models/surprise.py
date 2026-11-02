import json
from datetime import datetime, timezone
from models.database import db

def utc_now():
    return datetime.now(timezone.utc)

class Surprise(db.Model):
    __tablename__ = 'surprises'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True) # nullable for guest creators
    category = db.Column(db.String(80), default='birthday')
    template_slug = db.Column(db.String(100), nullable=True)
    
    # Content Fields
    recipient_name = db.Column(db.String(120), nullable=False)
    sender_name = db.Column(db.String(120), nullable=True)
    headline = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)

    # Design & Customization
    theme_gradient = db.Column(db.String(255), default='linear-gradient(135deg, #fff0f5 0%, #fce7f3 50%, #ede9fe 100%)')
    font_family = db.Column(db.String(100), default="'Playfair Display', serif")
    text_color = db.Column(db.String(30), default='#1f2937')
    stickers_json = db.Column(db.Text, default='["🎂", "✨", "💖"]')
    music_track = db.Column(db.String(50), default='lofi')

    # Security & Public Access
    slug = db.Column(db.String(32), unique=True, nullable=False, index=True)
    is_published = db.Column(db.Boolean, default=True)
    views = db.Column(db.Integer, default=0)

    # Timestamps
    created_at = db.Column(db.DateTime, default=utc_now)
    updated_at = db.Column(db.DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    images = db.relationship('SurpriseImage', backref='surprise', lazy=True, cascade="all, delete-orphan")

    @property
    def stickers(self):
        try:
            return json.loads(self.stickers_json) if self.stickers_json else ['🎂', '✨', '💖']
        except Exception:
            return ['🎂', '✨', '💖']

    def __repr__(self):
        return f'<Surprise {self.slug} for {self.recipient_name}>'


class SurpriseImage(db.Model):
    __tablename__ = 'surprise_images'

    id = db.Column(db.Integer, primary_key=True)
    surprise_id = db.Column(db.Integer, db.ForeignKey('surprises.id'), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=utc_now)

    def __repr__(self):
        return f'<SurpriseImage {self.id}>'
