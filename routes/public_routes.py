from flask import Blueprint, render_template, abort
from models.database import db
from models.surprise import Surprise

public_bp = Blueprint('public', __name__)

@public_bp.route('/s/<slug>')
def view_surprise(slug):
    surprise = Surprise.query.filter_by(slug=slug, is_published=True).first()
    if not surprise:
        abort(404)

    # Increment view counter
    try:
        surprise.views = (surprise.views or 0) + 1
        db.session.commit()
    except Exception:
        db.session.rollback()

    return render_template('surprise.html', surprise=surprise)
