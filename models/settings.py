from datetime import datetime, timezone
from models.database import db

def utc_now():
    return datetime.now(timezone.utc)

class SurpriseSettings(db.Model):
    __tablename__ = 'surprise_settings'

    id = db.Column(db.Integer, primary_key=True)
    surprise_id = db.Column(db.Integer, db.ForeignKey('surprises.id'), nullable=False, unique=True)
    envelope_seal_icon = db.Column(db.String(20), default='💌')
    enable_confetti = db.Column(db.Boolean, default=True)
    enable_music_autoplay = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=utc_now)

    def __repr__(self):
        return f'<SurpriseSettings for surprise {self.surprise_id}>'
