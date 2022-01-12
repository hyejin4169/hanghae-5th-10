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

#토큰이 있을 때 메인로 넘어가게 해주는 라우터
@app.route('/')
def home():
    #로그인 후 받아온 토큰
    token_receive = request.cookies.get('mytoken')
    try:
        #받아온 토큰을 디코드하여 payload를 설정
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        #db에서 설정된 payload에 있는 id와 일치하는 정보를 찾아 유저정보에 부
        user_info = db.mini1.find_one({"id": payload["id"]})
        #유저 정보를 부여후 메인 페이지로 가기
        return render_template('index.html', user_info=user_info)
    except jwt.ExpiredSignatureError: # 토큰이 만료 되었을 때
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError: #토큰을 부여 받지 못 했을때
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))
#로그인 페이지로 이동하는 라우터
@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('login.html', msg=msg)
#글작성 페이지
@app.route('/upload')
def uploading():
    return render_template('upload.html')
@app.route('/2')
def main():
    # DB에서 저장된 단어 찾아서 HTML에 나타내기
    return render_template("detail.html")
# 실질적으로 로그인 역할을 하는 라우터
@app.route('/api/login', methods=['POST'])
def sign_in():
    #로그인 input엣서 받은 정보를 가지고 옴
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']
    #가져온 비밀 번호를 hash처리
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    #일치하는 정보 찾아 result 설정
    result = db.mini1.find_one({'id': id_receive, 'pw': pw_hash})
    #result가 존재 한다면 아이디와 시간을 가지고 토큰 설정 이때 str된 정보를 디코딩
    if result is not None:
        payload = {
         'id': id_receive,
         'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)  # 로그인 24시간 유지
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        return jsonify({'result': 'success', 'token': token, 'msg':'도쿄 구경가자~!'})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})
#실질적으로 회원가입 하는 라우터
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
@app.route('/register/check_dup', methods=['POST'])
def check_dup():
    #중복 확인 대상이 되는 아이디 값을 가져옴
    id_receive = request.form['id_give']
    #가져온 값이 ture인지 false인지 판단
    exists = bool(db.mini1.find_one({"id": id_receive}))
    # print(value_receive, type_receive, exists)
    return jsonify({'result': 'success', 'exists': exists})
# 디테일 페이지
@app.route('/detail')
def detail():

    return render_template("detail.html")
@app.route('/detail2')
def detail2():

    return render_template("detail2.html")

@app.route('/detail/<keyword>', methods=["GET"])
def detail_k(keyword):
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        doc = db.posts.find_one({'title': keyword})
        # db에서 설정된 payload에 있는 id와 일치하는 정보를 찾아 유저정보에 부
        print(doc)
        # image = doc.request.form['image']
        title = doc['title']
        desc = doc['desc']
        print(title, desc)
        # name과 desc값 까지 넘겨주는건 성공, 아래 jsonify로 ajax에서 response[]로 값을 받음
        return render_template("detail2.html", title=title, desc=desc)
    except jwt.ExpiredSignatureError:  # 토큰이 만료 되었을 때
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))


# 메인페이지에서 리스트 눌렀을때 값을 받아서 이동하는 디테일 페이지
@app.route('/detail/two', methods=["GET"])
def detail_in():
    token_receive = request.cookies.get('mytoken')
    payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
    print(payload)
    user_info = db.mini1.find_one({'id': payload['id']})
    print(user_info)
    docs = list(db.posts.find({'id' : payload['id']}).sort("date", -1).limit(20))
    print(docs)
    doc=docs[0]
    print(doc)
    # image = doc.request.form['image']
    title = doc['title']
    desc = doc['desc']
    print(title, desc)
    # name과 desc값 까지 넘겨주는건 성공, 아래 jsonify로 ajax에서 response[]로 값을 받음
    return jsonify({"result": "success", 'msg': 'detail/<keyword> 완료 하였습니다',
                    "title": title, "desc": desc})

@app.route('/detail/<keyword>')
def detailing(keyword):
    return render_template("detail2.html", post=keyword)

@app.route("/upload/api/add_List", methods=["POST"])
def upload():
    token_receive = request.cookies.get('mytoken')
    try:
        print("apptest")
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        # 포스팅하기
        user_info = db.mini1.find_one({"id": payload["id"]})
        title_receive = request.form["title_give"]
        desc_receive = request.form["desc_give"]
        date_receive = request.form["date_give"]
        print(date_receive)
        print(type(date_receive))
        doc = {
            "id": user_info["id"],
            "title": title_receive,
            "desc": desc_receive,
            "date": date_receive
        }
        db.posts.insert_one(doc)
        return jsonify({"result": "success", 'msg': '업로드 성공', 'title': title_receive})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))

# 메인화면에 여행지 디스플레이해주는 라우터
@app.route("/get_lists", methods=['GET'])
def show_lists():
    place_list = list(db.reviews.find({}).sort("title", 1))
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


# 마이리스트에 내가 저장한 여행지 보여주는 라우터
@app.route("/get_places", methods=['GET'])
def show_places():
    places_list = list(db.myreviews.find({}).sort("title", 1))
    print(places_list)

    for place in places_list:
        place["_id"] = str(place["_id"])
    return jsonify({'all_places': places_list})


# 마이리스트 페이지로 이동하는 라우터
@app.route('/go_mylist')
def golist():
    return render_template('mylist.html')


# 마이리뷰에 내가 남긴 리뷰 보여주는 라우터
@app.route("/get_reviews", methods=['GET'])
def show_reviews():
    reviews_list = list(db.realreviews.find({}).sort("title", 1))
    print(reviews_list)

    for review in reviews_list:
        review["_id"] = str(review["_id"])
    return jsonify({'all_reviews': reviews_list})


# 마이리뷰 페이지로 이동하는 라우터
@app.route('/go_review')
def go_review():
    return render_template('myreview.html')


"""
@app.route('/upload')
def move_upload():
    return render_template("upload.html")


# 메인페이지에서 리스트 눌렀을때 값을 받아서 이동하는 디테일 페이지
@app.route('/api/list/<name>', methods=["GET"])
def list_in(name):
    # 메인 페이지에서 눌러서 들어가기

    cityname = name

    return render_template("detail.html")

#
#
#
#
#
@app.route('/api/list<title>', methods=["POST"])
def add_List():
    # 추가페이지url
    image_receive = request.form['image_give']
    title_receive = request.form['title_give']
    desc_receive = request.form['desc_give']

    doc = {"image": image_receive, "title": title_receive, "desc": desc_receive}
    db.posts.insert_one(doc)
    return jsonify({"result": "success", 'msg': '업로드 하였습니다'})
    # return render_template("detail.html")
    # 업로드완료시 detail페이지에 업로드한 정보를 가지고 가게 하기
    return redirect(url_for(detail))*/
"""

@app.route('/api/delete', methods=['POST'])
def delete_star():
    title_receive = request.form['title_give']

    db.posts.delete_one({'title': title_receive})

    return jsonify({'msg': '삭제 완료'})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
