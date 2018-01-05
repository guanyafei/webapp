"use strict";

//hammer实现触摸拖动轮播图图片
$(".tab-content").delegate(".carousel", "touchstart", function () {
    var _this = this;

    var hm = new Hammer(this);
    hm.on("panleft", function (e) {
        $(_this).carousel('next');
    });
    hm.on("panright", function (e) {
        $(_this).carousel('prev');
    });
});

//左右滑动标签面板 
// tabTouch();
slideTab();