$(() => {
    date()
})

const date = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = (1 + date.getMonth());
    let day = date.getDate();
    day = day >= 10 ? day : '0' + day;
    let hour = date.getHours();
    hour = hour > 12 ? hour - 12 : hour;
    let pre = `${year}-${month}-${day}`
    let ed = `${year}-${month}-${day + 1}`
    $('span.date').text(`${pre}~${ed} ${hour}시까지`)
}

const send_verify = () => {
    if ($('.timeout').css('color') == 'red') {
        $('.timeout').css('color', 'black');
    }


    let j_num = 0;
    $('input.p1').val() ? j_num += 1 : j_num += 0;
    $('input.p2').val() ? j_num += 1 : j_num += 0;
    $('input.p3').val() ? j_num += 1 : j_num += 0;
    j_num == 3 ? (
        $.ajax({
            type: "GET",
            url: "/send_v",
            data: {},
            success: (res) => {
                if (res) {
                    console.log(res['v_num']);
                    alert('인증번호가 전송되었습니다.');
                    timetimer();
                } else { alert('알 수 없는 에러가 발생하였습니다.') }
            }
        })
    ) : (
            alert('휴대전화 번호를 다시 한 번 확인해주세요.')
        )
}

let verify_interval = ''

const timetimer = () => {
    let time = 180;
    let min = '';
    let sec = ''
    verify_interval = setInterval(() => {
        min = parseInt(time / 60)
        sec = time % 60;
        sec = sec > 10 ? sec : '0' + sec
        $('.timeout').text(`남은시간 ${min} : ${sec}`);
        time--;

        if (time < 0 || $('.timeout').text() == '') {
            clearInterval();
            $('.timeout').text(`남은시간 0 : 0`);
            $('.timeout').css('color', 'red');
        }
    }, 1000)
}

const timestop = () => {
    console.log('timestop')
    clearInterval(verify_interval)
    $('.timeout').css('color', '#000');
    $('.timeout').text(' ');
    console.log('timestop-done')
}

const check_verify = () => {
    let phone_num = $('.p1').val() + $('.p2').val() + $('.p3').val();
    if ($('.timeout').css('color') == 'rgb(255,0,0)') {
        alert('시간이 만료되었습니다. 인증번호를 다시 받아주세요.')
    } else {
        let user_num = $('input.ver_num').val();
        console.log(user_num)
        console.log(phone_num)
        user_num ? (
        $.ajax({
            type: "POST",
            url: "/check_v",
            data: {
                "user_num": user_num,
                "phone_num": phone_num
            },
            success: (res) => {
                if (res) {
                    console.log(res['result'])
                    if (res['result'] == 'true') {
                        alert('인증이 완료되었습니다.')
                        timestop();
                    } else if (res['result'] == 'already') {
                        alert('이미 인증이 완료되었습니다.');
                    } else {
                        alert('인증번호가 틀렸습니다.')
                    }
                } else { alert('에러 발생') }
            }
        })
        ) : (
    alert("휴대전화 번호를 입력하여 인증번호를 받아주세요.")
)

    }
}

const pay = () => {
    let chk = $('.chk').is(":checked");
    chk ? (
        $.ajax({
            type: "GET",
            url: "/pay",
            data: {},
            success: (res) => {
                console.log(res['result'])
                res['result'] == 'true' ? location.href='/oneday_code' : (
                    res['reason'] == 'no_verify' ? (
                        alert("인증번호를 받아서 인증을 완료해주세요.")
                    ) : (
                            alert("인증번호 확인을 눌러 인증을 완료해주세요.")
                        )
                )
            }
        })
    ) : (
            alert(`짭 페달로 이용은 만 13세 이상부터 가능합니다.\n만 13세 이상이시면 체크 후 시도하여주세요.`)
        )
}

// TODO
// 인증번호 확인 함수 - chkbox && 번호 조회
// 결제하기 시에 인증번호 확인이 끝났는지 확인해야 함.