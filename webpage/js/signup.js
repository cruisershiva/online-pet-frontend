import utils from "/js/util.js";

const signup = function () {
    const name = $("#name").val(),
        email = $('#email').val(),
        password = $('#password').val(),
        phone = $('#phone').val();
	fetch(utils.apiurl + '/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            phonenumber: phone
        })
    })
	.then(res => res.json())
	.then((res) => {
        console.log(res);
		// utils.insertHtml('#message', res.message);
        if(res.success)
            window.location.href = '/home';
    });
}

$(() => {
    utils.onclickEvent('#btn-signup', signup)
});