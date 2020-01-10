from flask import (
    Blueprint,
    current_app,
    flash,
    redirect,
    render_template,
    request,
    url_for,
)
from flask_login import login_required, login_user, logout_user
from server.user.models import User
from server.extensions import db

blueprint = Blueprint("public", __name__)



@blueprint.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists("src/client/" + path):
        return send_from_directory('src/client', path)
    else:
        return send_from_directory('src/client', 'index.html')


@blueprint.route('/signup', methods=['POST', 'GET'])
def signupfunc():
    if request.method == 'POST':
        robj = request.get_json()
        user = User(username=robj['name'], email=robj['email'])
        user.set_password(robj['password'])
        user.ip_address='0.00.'
        user.activation_selector = '0000'
        user.activation_code = '0000'
        user.forgotten_password_selector = '0000'
        user.forgotten_password_code = '0000'
        user.forgotten_password_time ='0000'
        user.remember_selector = '0000'
        user.remember_code = '0000'
        user.created_on = '0000'
        user.last_login = '0000'
        user.active = '0000'
        user.first_name = '0000'
        user.last_name = '0000'
        user.company = '0000'
        user.phone ='0000'
        user.country = '0000'
        user.image = '0000'
        user.bio = '0000'
        user.core = '0000'
        user.external_source ='0000'
        user.external_id = '0000'
        user.session_hash = '0000'
        user.password_hash ='0000'
        db.session.add(user)
        db.session.commit()
        print('signedup')
        return 'signedup'
    return 'notyet'





@blueprint.route('/logout')
@login_required
def logout():
    return redirect(url_for('index'))