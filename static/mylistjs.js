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
                let contents = places_list[i]['contents']
                let id = places_list[i]['_id']
                console.log('test : ' + title, contents, id)

                let temp_html = `<div class="cards-boxes w-100 mb-3 row" style="width:200px; height:300px; max-width: 350px; max-height: 300px;">
                                            <div class="cards-body place_body">
                                                <h5 class="cards-title title">${title}</h5>
                                                <p class="cards-text contents_ellipsis">${contents}</p>
                                                <input type="hidden" id="places_id" value="${id}">
                                            </div>
                                         </div>`

                $('#show_place').append(temp_html)
            }
        }
    })

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
                                                <h5 class="reviews-title title">${title}</h5>
                                                <p class="reviews-text contents_ellipsis">${contents}</p>
                                                <input type="hidden" id="reviews_id" value="${id}">
                                            </div>
                                         </div>`

                $('#show_review').append(temp_html)
            }
        }
    })

}