//로그아웃 함수
function logout() {
    $.removeCookie('mytoken');
    alert('로그아웃!')
    window.location.href = '/login'
}

//로그인 함수
function login() {
    let id = $("#input-id").val()
    let pw = $("#input-pw").val()

    if (id == "") {
        $("#help-id-login").text("아이디를 입력해주세요.")
        $("#input-id").focus()
        return;
    } else {
        $("#help-id-login").text("")
    }

    if (pw == "") {
        $("#help-password-login").text("비밀번호를 입력해주세요.")
        $("#input-pw").focus()
        return;
    } else {
        $("#help-password-login").text("")
    }
    $.ajax({
        type: "POST",
        url: "/api/login",
        data: {
            id_give: id,
            pw_give: pw
        },
        success: function (response) {
            if (response['result'] == 'success') {
                $.cookie('mytoken', response['token'], {path: '/'});
                alert(response['msg'])
                window.location.replace("/")

            } else {
                alert(response['msg'])
            }
        }
    });
}

// 로그인 박스를 가려주고 회원가입 박스를 나타내주는 함수
function toggle_regist() {
    $("#regist-box").toggleClass("is-hidden")
    $("#div-sign-in-or-up").toggleClass("is-hidden")
    $("#btn-check-dup").toggleClass("is-hidden")
    $("#help-id").toggleClass("is-hidden")
    $("#help-pw").toggleClass("is-hidden")
    $("#help-pw2").toggleClass("is-hidden")
}

//아이디 생성이 가능한 범위를 정해주는 함수
function is_id(asValue) {
    var regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/;
    return regExp.test(asValue);
}

//비밀번호 생성이 가능한 범위를 정해주는 함수
function is_pw(asValue) {
    var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
    return regExp.test(asValue);
}

//아이디 체크해주는 함수
function check_dup() {
    let id = $("#input-id").val()
    if (id == "") {
        $("#help-id").text("아이디를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-id").focus()

        return;
    }
    if (!is_id(id)) {
        $("#help-id").text("아이디의 형식을 확인해주세요. 영문과 숫자, 일부 특수문자(._-) 사용 가능. 2-10자 길이").removeClass("is-safe").addClass("is-danger")
        $("#input-id").focus()
        return;
    }
    $("#help-id").addClass("is-loading")
    $.ajax({
        type: "POST",
        url: "/register/check_dup",
        data: {
            id_give: id
        },
        success: function (response) {

            if (response["exists"]) {
                $("#help-id").text("이미 존재하는 아이디입니다.").removeClass("is-safe").addClass("is-danger")
                $("#input-id").focus()
            } else {
                $("#help-id").text("사용할 수 있는 아이디입니다.").removeClass("is-danger").addClass("is-success")
            }
            $("#help-id").removeClass("is-loading")

        }
    });
}

//회원가입와 비밀번호 2차 입력을 도와주는 함수
function regist() {
    let id = $("#input-id").val()
    let pw = $("#input-pw").val()
    let pw2 = $("#input-pw2").val()


    if ($("#help-id").hasClass("is-danger")) {
        alert("아이디를 다시 확인해주세요.")
        return;
    } else if (!$("#help-id").hasClass("is-success")) {
        alert("아이디 중복확인을 해주세요.")
        return;
    }

    if (pw == "") {
        $("#help-pw").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-pw").focus()
        return;
    } else if (!is_pw(pw)) {
        $("#help-pw").text("비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자").removeClass("is-safe").addClass("is-danger")
        $("#input-pw").focus()
        return
    } else {
        $("#help-pw").text("사용할 수 있는 비밀번호입니다.").removeClass("is-danger").addClass("is-success")
    }
    if (pw2 == "") {
        $("#help-pw2").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-pw2").focus()
        return;
    } else if (pw2 != pw) {
        $("#help-pw2").text("비밀번호가 일치하지 않습니다.").removeClass("is-safe").addClass("is-danger")
        $("#input-pw2").focus()
        return;
    } else {
        $("#help-pw2").text("비밀번호가 일치합니다.").removeClass("is-danger").addClass("is-success")
    }
    $.ajax({
        type: "POST",
        url: "/api/register",
        data: {
            id_give: id,
            pw_give: pw
        },
        success: function (response) {
            alert("가입 완료! 도쿄로 떠나볼까요? ")
            window.location.replace("/login")
        }
    });

}


function post() {
    let comment = $("#textarea-post").val()
    let today = new Date().toISOString()
    $.ajax({
        type: "POST",
        url: "/posting",
        data: {
            comment_give: comment,
            date_give: today
        },
        success: function (response) {
            $("#modal-post").removeClass("is-active")
            window.location.reload()
        }
    })
}//로그아웃 함수
function logout() {
    $.removeCookie('mytoken');
    alert('로그아웃!')
    window.location.href = '/login'
}

//로그인 함수
function login() {
    let id = $("#input-id").val()
    let pw = $("#input-pw").val()

    if (id == "") {
        $("#help-id-login").text("아이디를 입력해주세요.")
        $("#input-id").focus()
        return;
    } else {
        $("#help-id-login").text("")
    }

    if (pw == "") {
        $("#help-password-login").text("비밀번호를 입력해주세요.")
        $("#input-pw").focus()
        return;
    } else {
        $("#help-password-login").text("")
    }
    $.ajax({
        type: "POST",
        url: "/api/login",
        data: {
            id_give: id,
            pw_give: pw
        },
        success: function (response) {
            if (response['result'] == 'success') {
                $.cookie('mytoken', response['token'], {path: '/'});
                alert(response['msg'])
                window.location.replace("/")

            } else {
                alert(response['msg'])
            }
        }
    });
}

// 로그인 박스를 가려주고 회원가입 박스를 나타내주는 함수
function toggle_regist() {
    $("#regist-box").toggleClass("is-hidden")
    $("#div-sign-in-or-up").toggleClass("is-hidden")
    $("#btn-check-dup").toggleClass("is-hidden")
    $("#help-id").toggleClass("is-hidden")
    $("#help-pw").toggleClass("is-hidden")
    $("#help-pw2").toggleClass("is-hidden")
}

//아이디 생성이 가능한 범위를 정해주는 함수
function is_id(asValue) {
    var regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/;
    return regExp.test(asValue);
}

//비밀번호 생성이 가능한 범위를 정해주는 함수
function is_pw(asValue) {
    var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
    return regExp.test(asValue);
}

//아이디 체크해주는 함수
function check_dup() {
    let id = $("#input-id").val()
    if (id == "") {
        $("#help-id").text("아이디를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-id").focus()

        return;
    }
    if (!is_id(id)) {
        $("#help-id").text("아이디의 형식을 확인해주세요. 영문과 숫자, 일부 특수문자(._-) 사용 가능. 2-10자 길이").removeClass("is-safe").addClass("is-danger")
        $("#input-id").focus()
        return;
    }
    $("#help-id").addClass("is-loading")
    $.ajax({
        type: "POST",
        url: "/register/check_dup",
        data: {
            id_give: id
        },
        success: function (response) {

            if (response["exists"]) {
                $("#help-id").text("이미 존재하는 아이디입니다.").removeClass("is-safe").addClass("is-danger")
                $("#input-id").focus()
            } else {
                $("#help-id").text("사용할 수 있는 아이디입니다.").removeClass("is-danger").addClass("is-success")
            }
            $("#help-id").removeClass("is-loading")

        }
    });
}

//회원가입와 비밀번호 2차 입력을 도와주는 함수
function regist() {
    let id = $("#input-id").val()
    let pw = $("#input-pw").val()
    let pw2 = $("#input-pw2").val()


    if ($("#help-id").hasClass("is-danger")) {
        alert("아이디를 다시 확인해주세요.")
        return;
    } else if (!$("#help-id").hasClass("is-success")) {
        alert("아이디 중복확인을 해주세요.")
        return;
    }

    if (pw == "") {
        $("#help-pw").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-pw").focus()
        return;
    } else if (!is_pw(pw)) {
        $("#help-pw").text("비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자").removeClass("is-safe").addClass("is-danger")
        $("#input-pw").focus()
        return
    } else {
        $("#help-pw").text("사용할 수 있는 비밀번호입니다.").removeClass("is-danger").addClass("is-success")
    }
    if (pw2 == "") {
        $("#help-pw2").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-pw2").focus()
        return;
    } else if (pw2 != pw) {
        $("#help-pw2").text("비밀번호가 일치하지 않습니다.").removeClass("is-safe").addClass("is-danger")
        $("#input-pw2").focus()
        return;
    } else {
        $("#help-pw2").text("비밀번호가 일치합니다.").removeClass("is-danger").addClass("is-success")
    }
    $.ajax({
        type: "POST",
        url: "/api/register",
        data: {
            id_give: id,
            pw_give: pw
        },
        success: function (response) {
            alert("가입 완료! 도쿄로 떠나볼까요? ")
            window.location.replace("/login")
        }
    });

}


// 메인화면에 여행지 보여주는 함수

function show_lists() {
    $("#place_list").empty()
    $.ajax({
        type: "GET",
        url: "/get_lists",
        data: {},
        success: function (response) {
            console.log('success')
            let place_list = response['all_places']
            for (let i = 0; i < place_list.length; i++) {
                let title = place_list[i]['title']
                let contents = place_list[i]['contents']
                let id = place_list[i]['_id']
                console.log('test : ' + title, contents, id)

                let temp_html = `<div class="cards-box w-100 mb-3 row" style="width:200px; height:300px; max-width: 350px; max-height: 300px;">
                                            <div class="card-body place_body">
                                                <h5 class="card-title title">${title}</h5>
                                                <p class="card-text contents_ellipsis">${contents}</p>
                                                <input type="hidden" id="place_id" value="${id}">
                                            </div>
                                         </div>`

                $('#place_list').append(temp_html)
            }
        }
    })

}


function post() {
    let comment = $("#textarea-post").val()
    let today = new Date().toISOString()
    $.ajax({
        type: "POST",
        url: "/posting",
        data: {
            comment_give: comment,
            date_give: today
        },
        success: function (response) {
            $("#modal-post").removeClass("is-active")
            window.location.reload()
        }
    })
}

function get_posts() {
    $("#post-box").empty()
    $.ajax({
        type: "GET",
        url: `/get_posts`,
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let posts = response["posts"]
                for (let i = 0; i < posts.length; i++) {
                    let post = posts[i]
                    let time_post = new Date(post["date"])
                    let time_before = time2str(time_post)

                    let class_heart = post['heart_by_me'] ? "fa-heart" : "fa-heart-o"

                    let temp_html = `<div class="box" id="${post["_id"]}">
                                        <article class="media">
                                            <div class="media-left">
                                                <a class="image is-64x64" href="/user/${post['id']}">
                                                    <img class="is-rounded" src="/static/${post['profile_pic_real']}"
                                                         alt="Image">
                                                </a>
                                            </div>
                                            <div class="media-content">
                                                <div class="content">
                                                    <p>
                                                        <small>@${post['id']}</small> <small>${time_before}</small>
                                                        <br>
                                                        ${post['comment']}
                                                    </p>
                                                </div>
                                                <nav class="level is-mobile">
                                                    <div class="level-left">
                                                        <a class="level-item is-sparta" aria-label="heart" onclick="toggle_like('${post['_id']}', 'heart')">
                                                            <span class="icon is-small"><i class="fa ${class_heart}"
                                                                                           aria-hidden="true"></i></span>&nbsp;<span class="like-num">${num2str(post["count_heart"])}</span>
                                                        </a>
                                                    </div>

                                                </nav>
                                            </div>
                                        </article>
                                    </div>`
                    $("#post-box").append(temp_html)
                }
            }
        }
    })
}




function time2str(date) {
    let today = new Date()
    let time = (today - date) / 1000 / 60  // 분

    if (time < 60) {
        return parseInt(time) + "분 전"
    }
    time = time / 60  // 시간
    if (time < 24) {
        return parseInt(time) + "시간 전"
    }
    time = time / 24
    if (time < 7) {
        return parseInt(time) + "일 전"
    }
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

function num2str(count) {
    if (count > 10000) {
        return parseInt(count / 1000) + "k"
    }
    if (count > 500) {
        return parseInt(count / 100) / 10 + "k"
    }
    if (count == 0) {
        return ""
    }
    return count
}


function toggle_like(post_id, type) {
    console.log(post_id, type)
    let $a_like = $(`#${post_id} a[aria-label='${type}']`)
    let $i_like = $a_like.find("i")
    let class_s = {"heart": "fa-heart", "star": "fa-star", "like": "fa-thumbs-up"}
    let class_o = {"heart": "fa-heart-o", "star": "fa-star-o", "like": "fa-thumbs-o-up"}
    if ($i_like.hasClass(class_s[type])) {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "unlike"
            },
            success: function (response) {
                console.log("unlike")
                $i_like.addClass(class_o[type]).removeClass(class_s[type])
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "like"
            },
            success: function (response) {
                console.log("like")
                $i_like.addClass(class_s[type]).removeClass(class_o[type])
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })

    }
}

function get_posts() {
    $("#post-box").empty()
    $.ajax({
        type: "GET",
        url: `/get_posts`,
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let posts = response["posts"]
                for (let i = 0; i < posts.length; i++) {
                    let post = posts[i]
                    let time_post = new Date(post["date"])
                    let time_before = time2str(time_post)

                    let class_heart = post['heart_by_me'] ? "fa-heart" : "fa-heart-o"

                    let temp_html = `<div class="box" id="${post["_id"]}">
                                        <article class="media">
                                            <div class="media-left">
                                                <a class="image is-64x64" href="/user/${post['id']}">
                                                    <img class="is-rounded" src="/static/${post['profile_pic_real']}"
                                                         alt="Image">
                                                </a>
                                            </div>
                                            <div class="media-content">
                                                <div class="content">
                                                    <p>
                                                        <small>@${post['id']}</small> <small>${time_before}</small>
                                                        <br>
                                                        ${post['comment']}
                                                    </p>
                                                </div>
                                                <nav class="level is-mobile">
                                                    <div class="level-left">
                                                        <a class="level-item is-sparta" aria-label="heart" onclick="toggle_like('${post['_id']}', 'heart')">
                                                            <span class="icon is-small"><i class="fa ${class_heart}"
                                                                                           aria-hidden="true"></i></span>&nbsp;<span class="like-num">${num2str(post["count_heart"])}</span>
                                                        </a>
                                                    </div>

                                                </nav>
                                            </div>
                                        </article>
                                    </div>`
                    $("#post-box").append(temp_html)
                }
            }
        }
    })
}

function time2str(date) {
    let today = new Date()
    let time = (today - date) / 1000 / 60  // 분

    if (time < 60) {
        return parseInt(time) + "분 전"
    }
    time = time / 60  // 시간
    if (time < 24) {
        return parseInt(time) + "시간 전"
    }
    time = time / 24
    if (time < 7) {
        return parseInt(time) + "일 전"
    }
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

function num2str(count) {
    if (count > 10000) {
        return parseInt(count / 1000) + "k"
    }
    if (count > 500) {
        return parseInt(count / 100) / 10 + "k"
    }
    if (count == 0) {
        return ""
    }
    return count
}


function toggle_like(post_id, type) {
    console.log(post_id, type)
    let $a_like = $(`#${post_id} a[aria-label='${type}']`)
    let $i_like = $a_like.find("i")
    let class_s = {"heart": "fa-heart", "star": "fa-star", "like": "fa-thumbs-up"}
    let class_o = {"heart": "fa-heart-o", "star": "fa-star-o", "like": "fa-thumbs-o-up"}
    if ($i_like.hasClass(class_s[type])) {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "unlike"
            },
            success: function (response) {
                console.log("unlike")
                $i_like.addClass(class_o[type]).removeClass(class_s[type])
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "like"
            },
            success: function (response) {
                console.log("like")
                $i_like.addClass(class_s[type]).removeClass(class_o[type])
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })

    }
}