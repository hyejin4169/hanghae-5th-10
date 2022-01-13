//로그아웃 함수
function logout() {
    $.removeCookie('mytoken');
    alert('로그아웃!')
    window.location.href = '/login'
}

//마이리스트에 내가 저장한 여행지 보여주는 함수
function show_places() {
    $("#show_place").empty()
    $.ajax({
        type: "GET",
        url: "get_places",
        data: {},
        success: function (response) {
            console.log('success')
            let places_list = response['all_places']
            for (let i = 0; i < places_list.length; i++) {
                let title = places_list[i]['title']
                let desc = places_list[i]['desc']
                let time_post = new Date(places_list["date"])
                let id = places_list[i]['_id']
                let time_before = time2str(time_post)
                console.log(places_list)


                let temp_html =`<div class="cards-box " id="cards-box">
                                            <div class="content">
                                                    <p>
                                                       <small>@${id}</small> <small>${time_before}</small>                                                     
                                                    </p>
                                        <div class="card-body place_body"  onclick="detail2('${title}')">
                                            <h5 class="card-title">${title}</h5>
                                            <p class="card-text contents_ellipsis">${desc}</p>
                                        </div>
                                 
                                        <button onclick="deleteDesc('${title}')">삭제</button>
                                    </div>`
                $('#show_place').append(temp_html)
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


//마이리뷰에 내가 남긴 리뷰보여주는 함수
function show_reviews() {
    $("#show_review").empty()
    $.ajax({
        type: "GET",
        url: "/get_reviews",
        data: {},
        success: function (response) {
            console.log('success')
            let reviews_list = response['all_reviews']
            for (let i = 0; i < reviews_list.length; i++) {
                let title = reviews_list[i]['title']
                let contents = reviews_list[i]['contents']
                let id = reviews_list[i]['_id']
                console.log('dummy : ' + title, contents, id)

                let temp_html = `<div class="reviews-box w-100 mb-3 row" style="width:200px; height:300px; max-width: 350px; max-height: 300px;">
                                            <div class="reviews-body place_body">
                                                <h5 class="reviews-title title">'${title}'</h5>
                                                <p class="reviews-text contents_ellipsis">'${contents}'</p>
                                                <input type="hidden" id="reviews_id" value="${id}">
                                            </div>
                                         </div>`

                $('#show_review').append(temp_html)
            }
        }
    })

}