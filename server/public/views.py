from flask import (
    Blueprint,
    current_app,
    flash,
    redirect,
    render_template,
    request,
    url_for,
)
from server.user.models import User
from server.extensions import db
import datetime, hashlib
from server.utils import  forgot_password_email, confirmation_email
from flask_cors import CORS

blueprint = Blueprint("public", __name__)

CORS(blueprint)


# TODO: do we really need this function
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
        user.set_session_hash()
        user.ip_address=request.remote_addr
        user.activation_selector = 'x100f0'
        user.activation_code = '0000'
        user.forgotten_password_selector = '00ffs0'
        user.forgotten_password_code = '0000'
        user.forgotten_password_time ='0000'
        user.remember_selector = '01f0s0'
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
        user.password_hash ='0000'
        db.session.add(user)
        db.session.commit()
        print('signedup')
        return 'signedup'
    return 'notyet'

@blueprint.route('/forgotpassword', methods=['POST'])
def password():
    jobj = request.get_json()
    timestamp = datetime.datetime.now()
    timestamp = timestamp.strftime("%d %H")
    md5_digest = hashlib.md5(timestamp.encode()).hexdigest()
    user = User.query.filter_by(email=jobj['email']).first()
    user.update_forgotten_code(md5_digest)
    #user.update_forgotten_time(timestamp)
    forgot_password_email(user.email, md5_digest)
    db.session.merge(user)
    db.session.commit()
    return "codesent"