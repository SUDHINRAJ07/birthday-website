import os
import json
from flask import Flask, render_template
from config import Config
from models.database import db
from models.category import Category, Template
from models.surprise import Surprise, SurpriseImage
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
        try:
            db.create_all()
            seed_categories_and_templates()
            seed_permanent_surprises()
        except Exception as err:
            app.logger.error(f"Database initialization notice: {err}")

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

def seed_permanent_surprises():
    vanitha_msg = (
        "Happy Birthday to my super special person 🫂\n"
        "Blood relation illa... aana heart-ku romba close aana relationships irukku.\n\n"
        "Unexpected-ah life-la vandhavanga, konjam konjama namma manasula oru idam pidichutanga... parennnn 🤔\n\n"
        "Distance irundhaalum, bond mattum konjam kooda change aagadhu. Sila bonds-ku explanation thevai illa... feel pannina podhum. Stay blessed always!"
    )

    couple_img = "/static/images/couple_portrait.png"

    permanent_configs = [
        {
            'slug': 'vanitha',
            'recipient_name': 'Vanitha',
            'headline': 'Happy Birthday Vanitha!',
            'passcode': '8285',
            'template_slug': 'penguin-scrapbook',
            'music_track': 'custom_song',
            'message': vanitha_msg,
            'special_date': 'Nov 4',
            'bond_traits_json': json.dumps(['Sweet', 'Loyal', 'Bestie']),
            'wishes_json': json.dumps([
                "You make my world beautiful 🌸",
                "Forever yours 🤍",
                "You are my sunshine ☀️",
                "I'm lucky to have you 🥺",
                "You are my favorite person 💕",
                "Happy Birthday! 💖"
            ]),
            'images': [couple_img]
        },
        {
            'slug': 'cd69b3cd',
            'recipient_name': 'Vanitha',
            'headline': 'Happy Birthday!',
            'passcode': '8285',
            'template_slug': 'penguin-scrapbook',
            'music_track': 'custom_song',
            'message': vanitha_msg,
            'special_date': 'Nov 4',
            'bond_traits_json': json.dumps(['Sweet', 'Loyal', 'Bestie']),
            'wishes_json': json.dumps([
                "You make my world beautiful 🌸",
                "Forever yours 🤍",
                "You are my sunshine ☀️",
                "I'm lucky to have you 🥺",
                "You are my favorite person 💕",
                "Happy Birthday! 💖"
            ]),
            'images': [couple_img]
        },
        {
            'slug': '9ac53501',
            'recipient_name': 'Vanitha',
            'headline': 'Happy Birthday!',
            'passcode': '8285',
            'template_slug': 'classic-birthday',
            'music_track': 'custom_song',
            'message': vanitha_msg,
            'special_date': 'Nov 4',
            'bond_traits_json': json.dumps(['Sweet', 'Loyal', 'Bestie']),
            'wishes_json': json.dumps([
                "You make my world beautiful 🌸",
                "Forever yours 🤍",
                "You are my sunshine ☀️",
                "I'm lucky to have you 🥺",
                "You are my favorite person 💕",
                "Happy Birthday! 💖"
            ]),
            'images': [couple_img]
        },
        {
            'slug': 'penguin',
            'recipient_name': 'Vanitha',
            'headline': 'Happy Birthday Vanitha ♡',
            'passcode': '8285',
            'template_slug': 'penguin-scrapbook',
            'music_track': 'custom_song',
            'message': vanitha_msg,
            'special_date': 'Nov 4',
            'bond_traits_json': json.dumps(['Sweet', 'Loyal', 'Bestie']),
            'wishes_json': json.dumps([
                "You make my world beautiful 🌸",
                "Forever yours 🤍",
                "You are my sunshine ☀️",
                "I'm lucky to have you 🥺",
                "You are my favorite person 💕",
                "Happy Birthday! 💖"
            ]),
            'images': [couple_img]
        }
    ]

    for cfg in permanent_configs:
        existing = Surprise.query.filter_by(slug=cfg['slug']).first()
        if not existing:
            surp = Surprise(
                slug=cfg['slug'],
                recipient_name=cfg['recipient_name'],
                headline=cfg['headline'],
                passcode=cfg['passcode'],
                template_slug=cfg['template_slug'],
                music_track=cfg['music_track'],
                message=cfg['message'],
                special_date=cfg['special_date'],
                bond_traits_json=cfg['bond_traits_json'],
                wishes_json=cfg['wishes_json'],
                is_published=True
            )
            db.session.add(surp)
            db.session.flush()

            for img_url in cfg['images']:
                s_img = SurpriseImage(surprise_id=surp.id, image_url=img_url)
                db.session.add(s_img)
            db.session.commit()
        else:
            # Ensure images are populated if missing
            if not existing.images:
                for img_url in cfg['images']:
                    s_img = SurpriseImage(surprise_id=existing.id, image_url=img_url)
                    db.session.add(s_img)
                db.session.commit()

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 7788))
    print(f"\n==========================================")
    print(f">> SurpriseLink is running live on: http://localhost:{port}")
    print(f"==========================================\n")
    app.run(host='0.0.0.0', port=port, debug=False)
