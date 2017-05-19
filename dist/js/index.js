"use strict";

//hammer实现触摸拖动轮播图图片
var hm = new Hammer(document.getElementById("carousel-example-generic"));
hm.on("swipeleft", function () {
    $('#carousel-example-generic').carousel('next');
});
hm.on("swiperight", function () {
    $('#carousel-example-generic').carousel('prev');
});

//窗口卷去部分大于banner偏移量 返回图标展示
$(window).scroll(function () {
    if (document.body.scrollTop > $(".nav").offset().top) {
        $(".back").fadeIn("slow");
    } else {
        $(".back").fadeOut("normal");
    }
});
//单击导航栏标签  样式改变
var lis = $("li[role='presentation']");

var _loop = function _loop(i) {
    var that = lis[i];
    $(that).bind('click', function () {
        $(that).children('a').addClass('active').parent().siblings().children('a').removeClass('active');
    });
};

for (var i = 0; i < lis.length; i++) {
    _loop(i);
}