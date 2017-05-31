'use strict';

//单击导航栏标签  样式改变
var lis = $("nav ul li");

var _loop = function _loop(i) {
    var that = lis[i];
    $(that).bind('click', function () {
        $(that).children('a').addClass('active').parent().siblings().children('a').removeClass('active');
    });
};

for (var i = 0; i < lis.length; i++) {
    _loop(i);
}

//窗口卷去部分大于banner偏移量 返回图标展示
$(window).scroll(function () {
    if (document.body.scrollTop > $(".box").offset().top) {
        $(".back").fadeIn("slow");
    } else {
        $(".back").fadeOut("normal");
    }
});
//代理  点击播放按钮 视频播放
$(".content").delegate(".playBtn", "click", function () {
    $("video").each(function (idx, ele) {
        if (!ele.paused) {
            ele.load();
            setVedioTime();
            $(ele).siblings("img,span").fadeIn();
        }
    });
    $(this).parent().children("img,span").fadeOut();
    $(this).parent().children("video")[0].play();
});
//视频加载后触发  获取视频长度并设置
var setVedioTime = function setVedioTime() {
    $("video").each(function (idx, ele) {
        var vLength = ele.duration;
        var time = formatTime(ele, vLength);
        $(ele).siblings(".badge").html(time);
        $(ele).parentsUntil(".box").find(".totalTime").html(time);
    });
};
//格式化视频总时间
var formatTime = function formatTime(ele, vLength) {
    if (vLength > 0) {
        //小时  
        var h = parseInt(vLength / (60 * 60));
        //分
        var m = parseInt(vLength % (60 * 60) / 60);
        //秒
        var s = parseInt(vLength % 60);

        if (h < 10) {
            h = '0' + h;
        }
        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }
        var time = h === '00' ? m + ':' + s : h + ':' + m + ':' + s;
        return time;
    }
};
//自定义视频控制按钮
// 点击播放按钮  视频播放
$(".play").each(function (idx, ele) {
    $(ele).click(function () {
        if ($(ele).parentsUntil(".box").find(".play").hasClass("pause")) {
            $(ele).parentsUntil(".box").find(".play").toggleClass("pause");
            $(ele).parentsUntil(".box").find("video")[0].pause();
        } else {
            $(ele).parentsUntil(".box").find("video")[0].play();
            onVideoPlay($(ele).parentsUntil(".box").find("video")[0]);
            $(ele).parentsUntil(".box").find(".play").toggleClass("pause");
        }
    });
});

//当前的播放位置发送改变时触发 改变进度条
var onVideoPlay = function onVideoPlay(videoDom) {
    videoDom.ontimeupdate = function () {
        //设置当前播放时间
        var vLength = videoDom.currentTime;
        var time = formatTime(videoDom, vLength);
        $(videoDom).parentsUntil(".box").find(".runTime").html(time);
        //进度条进度
        var percent = videoDom.currentTime / videoDom.duration * 100 + "%";
        // console.log($(videoDom).parentsUntil(".box").find(".progress-bar").get(0));
        $(videoDom).parentsUntil(".box").find(".progress-bar").width(percent);
    };
};

//点击跳转播放位置

var onSkip = function onSkip(videoDom) {
    console.log($(videoDom).parentsUntil(".box").find(".progress").width());
};