'use strict';

// 返回上一页
$('.cancle').click(function () {
	window.history.go(-1);
});

//清空搜索框文字
$('.remove').click(function () {
	$('.top  input').val('');
});

//搜索框查询
$('.glyphicon-search').click(function () {
	var inputVal = $('.top .form-control').val();
	alert($.query(inputVal));
});