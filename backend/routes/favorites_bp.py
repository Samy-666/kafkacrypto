from flask import Blueprint
from middleware.auth_middleware import token_required
from controllers.FavoritesController import index, get_users_favorites, add_item_to_favorites, remove_item_from_favorites

favorites_bp = Blueprint('favorites_bp', __name__)

@favorites_bp.route('/', methods=['GET'])
def get_favorites():
    return index()

@favorites_bp.route('/getUsersFavorite', methods=['GET'])
@token_required
def get_users_favorite(current_user):
    return get_users_favorites(current_user)

@favorites_bp.route('/addToFavorites', methods=['POST'])
@token_required
def add_item_to_favorite(current_user):
    return add_item_to_favorites(current_user)

@favorites_bp.route('/removeItemFromFavorites', methods=['POST'])
@token_required
def remove_item_from_favorite(current_user):
    return remove_item_from_favorites(current_user)




