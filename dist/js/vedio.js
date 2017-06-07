'use strict';

var flag = false; //控制条是否显示标志
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
            $(ele).parentsUntil(".box").children(".middle").css("backgroundColor", "white");
            setVedioTime();
            $(ele).siblings("img,span").fadeIn();
            $(ele).parentsUntil(".box").find(".play").toggleClass("pause");
        }
    });
    $(this).parentsUntil(".box").children(".middle").css("backgroundColor", "black");
    $(this).parent().children("img,span").fadeOut();
    $(this).parent().children("video")[0].play();
    onVideoPlay($(this).parent().children("video")[0]);
    $(this).parentsUntil(".box").find(".play").toggleClass("pause");
    flag = true;
    controllerOpt($(this).parent().children("video")[0], flag);
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
            flag = false;
            $(ele).parentsUntil(".box").find("video")[0].pause();
            $(ele).parentsUntil(".box").find(".playBtn").fadeIn();
        } else {
            $(ele).parentsUntil(".box").find("video")[0].play();
            flag = true;
            onVideoPlay($(ele).parentsUntil(".box").find("video")[0]);
            $(ele).parentsUntil(".box").find(".play").toggleClass("pause");
        }
    });
});
// 音量按钮设置
$(".sound").each(function (idx, ele) {
    $(ele).click(function () {
        if ($(ele).parentsUntil(".box").find(".sound").hasClass("mute")) {
            $(ele).parentsUntil(".box").find(".sound").toggleClass("mute");
            $(ele).parentsUntil(".box").find("video")[0].muted = false;
        } else {
            $(ele).parentsUntil(".box").find("video")[0].muted = true;
            $(ele).parentsUntil(".box").find(".sound").toggleClass("mute");
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
        $(videoDom).parentsUntil(".box").find(".progress-bar").width(percent);
        // 竖条位置
        var shu = $(videoDom).parentsUntil(".box").find(".shu").get(0);
        shu.style.left = $(videoDom).parentsUntil(".box").find(".progress-bar").width() + "px";
    };
};

//点击进度条  跳转到播放位置
$(".progress").each(function (idx, ele) {
    $(ele).click(function (e) {
        var percent = e.offsetX / ele.offsetWidth * 100 + '%';
        $(ele).children('.progress-bar').width(percent);
        $(ele).parentsUntil(".box").find("video")[0].currentTime = $(ele).parentsUntil(".box").find("video")[0].duration * e.offsetX / ele.offsetWidth;
    });
});
//放大
$(".fullscreen").each(function (idx, ele) {
    $(ele).click(function () {
        var video = $(ele).parentsUntil(".box").find("video").get(0);
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullScreen) {
            // 如果 在谷歌里面全屏 
            // 可以再这里 指定 dom元素的大小
            video.webkitRequestFullScreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
        }
    });
});
//触摸video区域  控制条显示  5秒后消失
var controllerOpt = function controllerOpt(ele, flag) {
    $(ele).on('touchstart', function () {
        if (flag) {
            $(ele).parent().next(".VController").animate({ bottom: '0' }, "slow");
        }
    });
    $(ele).on('touchend', function () {
        setTimeout(function () {
            $(ele).parent().next(".VController").animate({ bottom: '-44px' }, "slow");
        }, 1000000);
    });
};

//拖动竖条快进或后退视频
$(".shu").each(function (idx, ele) {
    //手指触摸位置
    var startX = 0;
    //手指移动距离
    var moveX = 0;
    //移动距离
    var distanceX = 0;
    // 触摸开始
    $(ele).on('touchstart', function (e) {
        //记录触摸位置
        startX = e.touches[0].clientX;
    });
    //触摸中
    $(ele).on('touchmove', function (e) {
        //移动期间视频暂停播放
        $(ele).parentsUntil(".box").find("video")[0].pause();
        //计算移动距离
        moveX = e.touches[0].clientX - startX;
        distanceX = moveX;
        //修改竖条移动距离
        //progress-bar当前宽度
        var currentWidth = $(ele).prev(".progress").children(".progress-bar").width();
        //progress宽度
        var progressWidth = $(ele).prev(".progress").width();
        distanceX = currentWidth + moveX;
        var percent = distanceX / progressWidth * 100 + '%';
        $(ele).prev(".progress").children(".progress-bar").width(percent);
        // 竖条位置
        ele.style.left = $(ele).parentsUntil(".box").find(".progress-bar").width() + "px";
        $(ele).parentsUntil(".box").find("video")[0].currentTime = $(ele).parentsUntil(".box").find("video")[0].duration * distanceX / progressWidth;
    });
    //触摸结束
    $(ele).on('touchend', function () {
        //触摸结束 恢复播放
        $(ele).parentsUntil(".box").find("video")[0].play();
    });
});