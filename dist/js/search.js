'use strict';

// 返回上一页
$('.cancle').click(function () {
	window.history.go(-1);
});

// 清除搜索历史子条目
$(".searchHistory").delegate('span', 'click', function () {
	if ($(".searchHistory .item").length === 1) {
		$(".searchHistory .list-group").remove();
	} else {
		$(this).parent().remove();
	}
	return false;
});
//清除全部搜索历史条目
$(".list-group a:last").click(function () {
	$(".searchHistory .list-group").remove();
});

//搜索框查询
$('.glyphicon-search').click(function () {
	var inputVal = $('.top .form-control').val();
	alert($.query(inputVal));
	window.open('http://localhost:3000/page/searchResult.html', '_self', '', true);
});