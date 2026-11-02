import os
import secrets
from flask import Blueprint, render_template, request, redirect, url_for, flash, session, current_app
from werkzeug.utils import secure_filename
from models.database import db
from models.surprise import Surprise, SurpriseImage
from models.settings import SurpriseSettings

surprise_bp = Blueprint('surprise', __name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

def generate_unique_slug():
    while True:
        # Generates an 8-character hex slug like '7f8a92bc'
        slug = secrets.token_hex(4)
        if not Surprise.query.filter_by(slug=slug).first():
            return slug

@surprise_bp.route('/create', methods=['GET', 'POST'])
def create_surprise():
    category = request.args.get('category', 'birthday')
    template = request.args.get('template', '')

    if request.method == 'POST':
        recipient_name = request.form.get('recipient_name', '').strip()
        sender_name = request.form.get('sender_name', '').strip()
        headline = request.form.get('headline', '').strip()
        message = request.form.get('message', '').strip()
        category = request.form.get('category', 'birthday')
        theme_gradient = request.form.get('theme_gradient')
        font_family = request.form.get('font_family')
        text_color = request.form.get('text_color', '#1f2937')
        stickers_json = request.form.get('selected_stickers')
        music_track = request.form.get('music_track', 'lofi')
        passcode = request.form.get('passcode', '3105').strip() or '3105'
        action_type = request.form.get('action_type', 'publish')

        if not recipient_name or not headline or not message:
            flash('Please fill in all required fields (Recipient Name, Headline, and Message).', 'error')
            return render_template('editor.html', category=category)

        slug = generate_unique_slug()
        is_published = (action_type == 'publish')
        user_id = session.get('user_id')

        surprise = Surprise(
            user_id=user_id,
            category=category,
            template_slug=template,
            recipient_name=recipient_name,
            sender_name=sender_name,
            headline=headline,
            message=message,
            theme_gradient=theme_gradient,
            font_family=font_family,
            text_color=text_color,
            stickers_json=stickers_json,
            music_track=music_track,
            passcode=passcode,
            slug=slug,
            is_published=is_published
        )

        db.session.add(surprise)
        db.session.flush()

        # Handle uploaded photos
        files = request.files.getlist('photos')
        upload_folder = current_app.config['UPLOAD_FOLDER']
        os.makedirs(upload_folder, exist_ok=True)

        for file in files:
            if file and allowed_file(file.filename):
                fname = secure_filename(file.filename)
                unique_name = f"{secrets.token_hex(6)}_{fname}"
                filepath = os.path.join(upload_folder, unique_name)
                file.save(filepath)

                img_url = url_for('static', filename=f'uploads/{unique_name}')
                img = SurpriseImage(surprise_id=surprise.id, image_url=img_url)
                db.session.add(img)

        # Create default settings
        settings = SurpriseSettings(surprise_id=surprise.id)
        db.session.add(settings)

        db.session.commit()

        if is_published:
            flash('Your magical surprise has been published! 🎉', 'success')
            return redirect(url_for('surprise.success_page', slug=slug))
        else:
            flash('Draft saved successfully! 📝', 'success')
            return redirect(url_for('surprise.my_creations'))

    return render_template('editor.html', category=category, template=template, surprise=None)

@surprise_bp.route('/edit/<int:id>', methods=['GET', 'POST'])
def edit_surprise(id):
    surprise = Surprise.query.get_or_404(id)

    # Authorization check if user logged in
    user_id = session.get('user_id')
    if surprise.user_id and surprise.user_id != user_id:
        flash('You are not authorized to edit this surprise.', 'error')
        return redirect(url_for('main.index'))

    if request.method == 'POST':
        surprise.recipient_name = request.form.get('recipient_name', '').strip()
        surprise.sender_name = request.form.get('sender_name', '').strip()
        surprise.headline = request.form.get('headline', '').strip()
        surprise.message = request.form.get('message', '').strip()
        surprise.theme_gradient = request.form.get('theme_gradient')
        surprise.font_family = request.form.get('font_family')
        surprise.text_color = request.form.get('text_color', '#1f2937')
        surprise.stickers_json = request.form.get('selected_stickers')
        surprise.music_track = request.form.get('music_track', 'lofi')
        if request.form.get('passcode'):
            surprise.passcode = request.form.get('passcode').strip()

        action_type = request.form.get('action_type', 'publish')
        surprise.is_published = (action_type == 'publish')

        # Handle photos
        files = request.files.getlist('photos')
        upload_folder = current_app.config['UPLOAD_FOLDER']
        os.makedirs(upload_folder, exist_ok=True)

        for file in files:
            if file and allowed_file(file.filename):
                fname = secure_filename(file.filename)
                unique_name = f"{secrets.token_hex(6)}_{fname}"
                filepath = os.path.join(upload_folder, unique_name)
                file.save(filepath)

                img_url = url_for('static', filename=f'uploads/{unique_name}')
                img = SurpriseImage(surprise_id=surprise.id, image_url=img_url)
                db.session.add(img)

        db.session.commit()

        if surprise.is_published:
            flash('Surprise card updated successfully! ✨', 'success')
            return redirect(url_for('surprise.success_page', slug=surprise.slug))
        else:
            flash('Draft updated successfully! 📝', 'success')
            return redirect(url_for('surprise.my_creations'))

    return render_template('editor.html', surprise=surprise, category=surprise.category)

@surprise_bp.route('/success/<slug>')
def success_page(slug):
    surprise = Surprise.query.filter_by(slug=slug).first_or_404()
    return render_template('success.html', surprise=surprise)

@surprise_bp.route('/dashboard')
def dashboard():
    user_id = session.get('user_id')
    if not user_id:
        return redirect(url_for('auth.login'))
    surprises = Surprise.query.filter_by(user_id=user_id).order_by(Surprise.created_at.desc()).all()
    return render_template('dashboard.html', surprises=surprises)

@surprise_bp.route('/my-creations')
def my_creations():
    user_id = session.get('user_id')
    if user_id:
        surprises = Surprise.query.filter_by(user_id=user_id).order_by(Surprise.created_at.desc()).all()
    else:
        # If guest, show recent surprises created in this session or all recent
        surprises = Surprise.query.order_by(Surprise.created_at.desc()).limit(10).all()
    return render_template('my_creations.html', surprises=surprises)

@surprise_bp.route('/delete/<int:id>', methods=['POST'])
def delete_surprise(id):
    surprise = Surprise.query.get_or_404(id)
    user_id = session.get('user_id')

    if surprise.user_id and surprise.user_id != user_id:
        flash('You do not have permission to delete this creation.', 'error')
        return redirect(url_for('surprise.my_creations'))

    db.session.delete(surprise)
    db.session.commit()
    flash('Surprise card deleted successfully.', 'success')
    return redirect(url_for('surprise.my_creations'))
