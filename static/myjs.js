function logout() {
    $.removeCookie('mytoken');
    alert('로그아웃!')
    window.location.href = '/login'
}

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


function toggle_regist() {
    $("#regist-box").toggleClass("is-hidden")
    $("#div-sign-in-or-up").toggleClass("is-hidden")
    $("#btn-check-dup").toggleClass("is-hidden")
    $("#help-id").toggleClass("is-hidden")
    $("#help-pw").toggleClass("is-hidden")
    $("#help-pw2").toggleClass("is-hidden")
}

function is_id(asValue) {
    var regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/;
    return regExp.test(asValue);
}

function is_pw(asValue) {
    var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
    return regExp.test(asValue);
}

function check_dup() {
    let id = $("#input-id").val()
    console.log(id)
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

function regist() {
    let id = $("#input-id").val()
    let pw = $("#input-pw").val()
    let pw2 = $("#input-pw2").val()
    console.log(id, pw, pw2)


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
            alert("가입 완료~ 도쿄 보러가요~ ")
            window.location.replace("/login")
        }
    });

}