from flask import Blueprint, render_template, request

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return render_template('index.html')

@main_bp.route('/categories')
def categories():
    return render_template('categories.html')

@main_bp.route('/templates')
def templates_gallery():
    category = request.args.get('category', 'all')
    return render_template('templates.html', current_category=category)
