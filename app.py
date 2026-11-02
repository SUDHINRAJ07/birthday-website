import os
from flask import Flask, render_template
from config import Config
from models.database import db
from models.category import Category, Template
from routes import main_bp, auth_bp, surprise_bp, public_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)

    # Register Blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(surprise_bp)
    app.register_blueprint(public_bp)

    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Error Handlers
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('404.html'), 404

    @app.errorhandler(500)
    def internal_server_error(e):
        return render_template('404.html'), 500

    # Auto seed initial categories and database tables
    with app.app_context():
        db.create_all()
        seed_categories_and_templates()

    return app

def seed_categories_and_templates():
    if Category.query.first():
        return  # Already seeded

    seed_data = [
        ('Birthday Wishes', 'birthday', 'Celebrate birthdays with confetti and festive joy', '🎂'),
        ('Love & Romance', 'love', 'Express deep romantic feelings with letters and flowers', '💖'),
        ('Anniversary', 'anniversary', 'Cherish another year together with memories and love', '💍'),
        ('Marriage Proposal', 'proposal', 'Pop the big question with a cinematic surprise card', '✨'),
        ('Sorry / Apology', 'sorry', 'Mend hearts and bring back smiles with sincere apologies', '🥺'),
        ('Friendship', 'friendship', 'Remind best friends how precious they are to you', '👯'),
        ('Thank You', 'thankyou', 'Show genuine heartfelt gratitude to someone special', '💐'),
        ('Valentine\'s Day', 'valentine', 'Romantic surprises for Valentine\'s week', '🌹'),
        ('Special Memories', 'memories', 'Revisit unforgettable shared milestones and trips', '📸'),
        ('Custom Surprise', 'custom', 'Blank canvas with full creative freedom', '🪄')
    ]

    for name, slug, desc, icon in seed_data:
        cat = Category(name=name, slug=slug, description=desc, icon=icon)
        db.session.add(cat)

    db.session.commit()

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 7788))
    print(f"\n==========================================")
    print(f">> SurpriseLink is running live on: http://localhost:{port}")
    print(f"==========================================\n")
    app.run(host='0.0.0.0', port=port, debug=False)
