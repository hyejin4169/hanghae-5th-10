from flask import Flask, render_template, request, jsonify, redirect, url_for
from pymongo import MongoClient
import requests

app = Flask(__name__)

# client = MongoClient('localhost', 27017)
# client = MongoClient('13.125.248.85', 27017, username="test", password="test")
client = MongoClient('3.36.96.88', 27017, username="test", password="test")
db = client.Mini1


@app.route('/')
def main():
    # DB에서 저장된 단어 찾아서 HTML에 나타내기
    return render_template("detail.html")


# 디테일 페이지
@app.route('/detail')
def detail():
    # API에서 단어 뜻 찾아서 결과 보내기
    # r = requests.get(f"localhost:5000/detail/{keyword}", headers={"Authorization": "Token [토큰]"})
    # result = r.json()

    return render_template("detail.html")


# 메인페이지에서 리스트 눌렀을때 값을 받아서 이동하는 디테일 페이지
@app.route('/detail/<keyword>', methods=["GET"])
def detail_in(keyword):
    # API에서 단어 뜻 찾아서 결과 보내기
    # keyword는 db에서 name
    doc = db.testdb.find_one({'name': keyword})
    print(doc)
    # image = doc.request.form['image']
    name = doc['name']
    desc = doc['desc']
    print(name, desc)
    # name과 desc값 까지 넘겨주는건 성공, 아래 jsonify로 ajax에서 response[]로 값을 받음
    return jsonify({"result": "success", 'msg': 'detail/<keyword> 완료 하였습니다',
                    "name":name, "desc":desc})


@app.route("/upload/api/add_List", methods=["POST"])
def upload():
    # 현재루트로 잘들어 왔는지 체크 출력
    print("apptest")
    # image_receive = request.form['image_give']
    # ajax에서 name,desc 값 받아옴
    name_receive = request.form['name_give']
    desc_receive = request.form['desc_give']
    # 데이터 정상 체크
    print(name_receive, desc_receive)
    doc = {"name": name_receive, "desc": desc_receive}
    # data doc으로 만들어주고 db.testdb에 정보 입력
    db.testdb.insert_one(doc)
    return jsonify({"result": "success", 'msg': '업로드 하였습니다', 'name': name_receive})


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
@app.route('/api/list<name>', methods=["POST"])
def add_List():
    # 추가페이지url
    image_receive = request.form['image_give']
    name_receive = request.form['name_give']
    desc_receive = request.form['desc_give']

    doc = {"image": image_receive, "name": name_receive, "desc": desc_receive}
    db.insert_one(doc)
    return jsonify({"result": "success", 'msg': '업로드 하였습니다'})
    # return render_template("detail.html")
    # 업로드완료시 detail페이지에 업로드한 정보를 가지고 가게 하기
    return redirect(url_for(detail))


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
