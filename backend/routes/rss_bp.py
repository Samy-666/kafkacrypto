from flask import Blueprint
from middleware.auth_middleware import token_required
from controllers.RssController import get_rss_feed, get_rss_feed_by_crypto

rss_bp = Blueprint('rss_bp', __name__)

@rss_bp.route('/getRssFeed', methods=['GET'])
def get_rss():
    return get_rss_feed()

@rss_bp.route('/getRssFeedByCrypto', methods=['POST'])
def get_rss_by_crypto():    
    return get_rss_feed_by_crypto()