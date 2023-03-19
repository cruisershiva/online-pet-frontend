import utils from "./util.js";
const apiurl = 'http://localhost:8080/api/v1';

const logout = () => {
	fetch(utils.apiurl + '/logout', {
		method: 'GET',
		credentials: 'include'
	})
	.then(res => window.location.href = '/')
};

$(() => {
	utils.onclickEvent('#btn-dropdown', () => $('#dropdown').toggle());
	utils.onclickEvent('#logout', logout);
})