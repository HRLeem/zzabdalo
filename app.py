from pymongo import MongoClient
import flask, hashlib, secrets
from flask import Flask, render_template, jsonify, request, redirect, url_for, session
from datetime import timedelta
from flask_mail import Mail, Message
import random

app = Flask(__name__)

app.secret_key = 'jfnakjfn'
@app.before_request
def make_session_paramanet():
    session.permanent = True
    app.permanent_session_lifetime = timedelta(minutes=30)


# DB
client = MongoClient('localhost', 27017)
db = client.dbtestz

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/one_day')
def one_d():
    session['v?'] = ''
    session['phone'] = ''
    return render_template('one_day.html')

@app.route('/send_v')
def s_v():
    v_num = random.randrange(1000, 9999)
    session['v?'] = v_num
    if v_num :
        return jsonify({"result": 'true', "v_num": v_num})
    else :
        return jsonify({"result": 'false'})


@app.route('/check_v', methods=['POST'])
def c_v(): 
    user_num_receive = request.form['user_num']
    phone_num_receive = request.form['phone_num']
    session['v?'] = str(session['v?'])
    if user_num_receive == session['v?']:
        session['v?'] = 'done'
        session['phone'] = phone_num_receive
        return jsonify({"result": 'true'})
    elif session['v?'] == 'done':
        return jsonify({"result":"already"})
    else:
        session['v?'] = ''
        return jsonify({"result": 'false'})


@app.route('/pay')
def pay():
    if session['v?'] == 'done':
        return jsonify({"result": "true"})
    elif session['v?'] == 'false':
        return jsonify({"result":"false", "reason":"no_verify"})
    else:
        return jsonify({"result":"false", "reason":"no_check"})

@app.route('/oneday_code')
def oc():
    code = random.randrange(100000, 999999)
    phone = session['phone']
    return render_template('oneday_code.html', code=code, phone=phone)

if __name__ == '__main__':
    app.run('127.0.0.1', port=1023, debug=True)