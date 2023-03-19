import utils from "/js/util.js";

const login = function () {
	//  showLoading('#main-content', 'var(--primary-accent)', 5);
    const email = $('#email').val(),
        password = $('#password').val();
	fetch(utils.apiurl + '/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
	.then(res => res.json())
	.then((res) => {
        console.log(res);
		utils.insertHtml('#message', res.message);
        if(res.success)
            window.location.href = '/home';
    });
}

const loadSignup = () => {
    window.location.href = '/signup';
}

$(() => {
    utils.onclickEvent('#btn-login', login);
    utils.onclickEvent('#signup-link', loadSignup);
});