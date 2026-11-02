from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from models.database import db
from models.user import User

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '').strip()

        if not email or not password:
            flash('Please enter both email and password.', 'error')
            return render_template('auth.html')

        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            session['user_id'] = user.id
            session['user_name'] = user.name
            session['user_email'] = user.email
            flash(f'Welcome back, {user.name}! ✨', 'success')
            return redirect(url_for('surprise.dashboard'))
        else:
            flash('Invalid email or password. Please try again.', 'error')

    return render_template('auth.html')

@auth_bp.route('/register', methods=['POST'])
def register():
    name = request.form.get('name', '').strip()
    email = request.form.get('email', '').strip().lower()
    password = request.form.get('password', '').strip()

    if not name or not email or not password:
        flash('All fields are required.', 'error')
        return redirect(url_for('auth.login') + '#register')

    if len(password) < 6:
        flash('Password must be at least 6 characters.', 'error')
        return redirect(url_for('auth.login') + '#register')

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        flash('An account with this email already exists. Please sign in.', 'error')
        return redirect(url_for('auth.login'))

    user = User(name=name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    # Log user in
    session['user_id'] = user.id
    session['user_name'] = user.name
    session['user_email'] = user.email

    flash('Account created successfully! Welcome to SurpriseLink 🎉', 'success')
    return redirect(url_for('surprise.dashboard'))

@auth_bp.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out safely.', 'success')
    return redirect(url_for('main.index'))
