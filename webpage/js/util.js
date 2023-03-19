var utils = {};
utils.apiurl = 'http://localhost:8080/api/v1';

utils.insertHtml = function (selector, html) {
	var targetElem = document.querySelector(selector);
	targetElem.innerHTML = html;
};

utils.appendHtml = function (selector, html) {
	var targetElem = document.querySelector(selector);
	targetElem.innerHTML += html;
};

utils.insertProperty = function (string, propName, propValue) {
	var propToReplace = "{{" + propName + "}}";
	string = string
		.replace(new RegExp(propToReplace, "g"), propValue);
	return string;
};

utils.onclickEvent = function (selector, callback) {
	$(selector).on('click', callback);
}

utils.hide = function (selector) {
	$(selector).addClass('d-none');
}

utils.show = function (selector) {
	$(selector).removeClass('d-none');
}

utils.showLoading = function (selector, color, size) {
	var html = `<div class='d-flex justify-content-center center'>
	<div class='spinner-border' role='status'
	style='color:${color};width:${size}em;height:${size}em;'>
	<span class='sr-only'></span >
	</div></div>`;
	insertHtml(selector, html);
};

export default utils;