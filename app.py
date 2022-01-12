from pymongo import MongoClient
import jwt
import datetime
import hashlib
from flask import Flask, render_template, jsonify, request, redirect, url_for

from datetime import datetime, timedelta

app = Flask(__name__)

SECRET_KEY = 'SPARTA'

client = MongoClient('3.36.96.88', 27017, username="test", password="test")
db = client.Mini1


# 토큰이 있을 때 메인로 넘어가게 해주는 라우터
@app.route('/')
def home():
    # 로그인 후 받아온 토큰
    token_receive = request.cookies.get('mytoken')
    try:
        # 받아온 토큰을 디코드하여 payload를 설정
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        # db에서 설정된 payload에 있는 id와 일치하는 정보를 찾아 유저정보에 부
        user_info = db.mini1.find_one({"id": payload["id"]})
        # 유저 정보를 부여후 메인 페이지로 가기
        return render_template('index.html', user_info=user_info)
    except jwt.ExpiredSignatureError:  # 토큰이 만료 되었을 때
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:  # 토큰을 부여 받지 못 했을때
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))


# 로그인 페이지로 이동하는 라우터
@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('login.html', msg=msg)


# 실질적으로 로그인 역할을 하는 라우터
@app.route('/api/login', methods=['POST'])
def sign_in():
    # 로그인 input엣서 받은 정보를 가지고 옴
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']
    # 가져온 비밀 번호를 hash처리
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    # 일치하는 정보 찾아 result 설정
    result = db.mini1.find_one({'id': id_receive, 'pw': pw_hash})
    # result가 존재 한다면 아이디와 시간을 가지고 토큰 설정 이때 str된 정보를 디코딩
    if result is not None:
        payload = {
            'id': id_receive,
            'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)  # 로그인 24시간 유지
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        return jsonify({'result': 'success', 'token': token, 'msg': '도쿄 구경가자~!'})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})


# 실질적으로 회원가입 하는 라우터
@app.route('/api/register', methods=['POST'])
def register():
    # 회원가입 input에서 가져온 정보를 설정 후 db에 저장
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    doc = {
        "id": id_receive,
        "pw": pw_hash
    }
    db.mini1.insert_one(doc)
    return jsonify({'result': 'success'})


# 아이디 중복을 확인해주는 라우터
@app.route('/register/check_dup', methods=['POST'])
def check_dup():
    # 중복 확인 대상이 되는 아이디 값을 가져옴
    id_receive = request.form['id_give']
    # 가져온 값이 ture인지 false인지 판단
    exists = bool(db.mini1.find_one({"id": id_receive}))
    # print(value_receive, type_receive, exists)
    return jsonify({'result': 'success', 'exists': exists})


# 메인화면에 여행지 디스플레이해주는 라우터
@app.route("/get_lists", methods=['GET'])
def show_lists():
    place_list = list(db.reviews.find({}).sort("title", 1))
    
    for place in place_list:
        place["_id"] = str(place["_id"])
    return jsonify({'all_places': place_list})


# 포스팅 저장해주는 라우터
@app.route('/posting', methods=['POST'])
def posting():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        # 포스팅하기
        user_info = db.mini1.find_one({"id": payload["id"]})
        comment_receive = request.form["comment_give"]
        date_receive = request.form["date_give"]
        print(type(date_receive))
        doc = {
            "id": user_info["id"],
            "comment": comment_receive,
            "date": date_receive
        }
        db.posts.insert_one(doc)
        return jsonify({"result": "success", 'msg': '포스팅 성공'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


# 포스팅 올려주는 라우터
@app.route("/get_posts", methods=['GET'])
def get_posts():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        # id_receive = request.args.get("id_give")
        # if id_receive=="":
        posts = list(db.posts.find({}).sort("date", -1).limit(20))
        # else:
        # posts = list(db.posts.find({"id":id_receive}).sort("date", -1).limit(20))
        for post in posts:
            post["_id"] = str(post["_id"])
        # post["count_heart"] = db.likes.count_documents({"post_id": post["_id"], "type": "heart"})
        # post["heart_by_me"] = bool(db.likes.find_one({"post_id": post["_id"], "type": "heart", "id":payload["id"]}))
        return jsonify({"result": "success", "msg": "포스팅을 가져왔습니다.", "posts": posts})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


@app.route('/update_like', methods=['POST'])
def update_like():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        # 좋아요 수 변경
        user_info = db.posts.find_one({"id": payload["id"]})
        post_id_receive = request.form["post_id_give"]
        type_receive = request.form["type_give"]
        action_receive = request.form["action_give"]
        doc = {
            "post_id": post_id_receive,
            "id": user_info["id"],
            "type": type_receive
        }
        if action_receive == "like":
            db.likes.insert_one(doc)
        else:
            db.likes.delete_one(doc)
        count = db.likes.count_documents({"post_id": post_id_receive, "type": type_receive})
        print(count)
        return jsonify({"result": "success", 'msg': 'updated', "count": count})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


@app.route('/user/<id>')
def user(id):
    # 각 사용자의 프로필과 글을 모아볼 수 있는 공간
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        status = (id == payload["id"])  # 내 프로필이면 True, 다른 사람 프로필 페이지면 False

        user_info = db.mini1.find_one({"id": id}, {"_id": False})
        return render_template('user.html', user_info=user_info, status=status)
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
