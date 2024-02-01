from flask import Blueprint
from flask import render_template


from controllers.UserController import index, create_user, update_user, delete_user, get_user_infos, login, get_user_by_id, register

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/', methods=['GET'])
def get_users():
    return index()

@user_bp.route('/', methods=['POST'])
def create():
    return create_user()

@user_bp.route('/<int:id>', methods=['GET'])
def get_user(id):
    return get_user_by_id(id)

@user_bp.route('/getUserinfo', methods=['GET'])
def get_user_info():
    return get_user_infos()

@user_bp.route('/<int:id>', methods=['PUT'])
def update(id):
    return update_user(id)

@user_bp.route('/<int:id>', methods=['DELETE'])
def delete(id):
    return delete_user(id)

@user_bp.route('/login', methods=['POST'])
def authenticate():
    return login()


@user_bp.route('/register', methods=['POST'])
def create_account():
    return register()