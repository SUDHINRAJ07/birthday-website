import unittest
import json
from app import create_app
from models.database import db
from models.user import User
from models.surprise import Surprise
from config import Config

class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False

class SurpriseLinkTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestConfig)
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def test_homepage_loads(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Surprise', response.data)

    def test_categories_page(self):
        response = self.client.get('/categories')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Birthday Wishes', response.data)
        self.assertIn(b'Love & Romance', response.data)

    def test_template_gallery(self):
        response = self.client.get('/templates')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Classic Birthday', response.data)

    def test_user_registration_and_login(self):
        # Register
        reg_resp = self.client.post('/auth/register', data={
            'name': 'Test User',
            'email': 'tester@example.com',
            'password': 'password123'
        }, follow_redirects=True)
        self.assertEqual(reg_resp.status_code, 200)

        user = User.query.filter_by(email='tester@example.com').first()
        self.assertIsNotNone(user)
        self.assertTrue(user.check_password('password123'))

        # Logout
        self.client.get('/auth/logout')

        # Login
        login_resp = self.client.post('/auth/login', data={
            'email': 'tester@example.com',
            'password': 'password123'
        }, follow_redirects=True)
        self.assertEqual(login_resp.status_code, 200)

    def test_create_and_view_surprise(self):
        # Create surprise
        resp = self.client.post('/create', data={
            'recipient_name': 'Ananya',
            'sender_name': 'Vikram',
            'headline': 'Happy Birthday Ananya!',
            'message': 'Wishing you all joy and smiles!',
            'category': 'birthday',
            'theme_gradient': 'linear-gradient(135deg, #fff0f5 0%, #fce7f3 50%, #ede9fe 100%)',
            'font_family': 'Playfair Display',
            'text_color': '#1f2937',
            'selected_stickers': json.dumps(['🎂', '✨']),
            'music_track': 'birthday',
            'action_type': 'publish'
        }, follow_redirects=True)
        self.assertEqual(resp.status_code, 200)

        surprise = Surprise.query.filter_by(recipient_name='Ananya').first()
        self.assertIsNotNone(surprise)
        self.assertTrue(len(surprise.slug) >= 8)

        # Public recipient view without login
        public_resp = self.client.get(f'/s/{surprise.slug}')
        self.assertEqual(public_resp.status_code, 200)
        self.assertIn(b'Happy Birthday Ananya!', public_resp.data)
        self.assertIn(b'ANANYA', public_resp.data)

    def test_invalid_slug_gives_404(self):
        resp = self.client.get('/s/non_existent_slug_999')
        self.assertEqual(resp.status_code, 404)
        self.assertIn(b'404', resp.data)

if __name__ == '__main__':
    unittest.main()
