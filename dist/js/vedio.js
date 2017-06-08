'use strict';

var flag = false;
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
        ele.tag = true; //控制条显现标志   false隐藏
        if (!ele.paused || ele.currentTime != 0) {
            $(ele).parentsUntil(".box").find(".VController").animate({ bottom: '-44px', opacity: '0' }, 0);
            ele.load();
            //修改控制条标志 控制条隐藏
            ele.tag = false;
            $(ele).siblings("img,span").fadeIn();
            $(ele).parentsUntil(".box").find(".play").toggleClass("pause");
        }
    });
    $(this).parent().children("img,span").fadeOut();
    $(this).parent().children("video")[0].play();
    ctrPlayBtn($(this).parentsUntil(".box").find(".play").get(0));
    ctrSoundBtn($(this).parentsUntil(".box").find(".sound").get(0));
    ctrProgress($(this).parentsUntil(".box").find(".progress").get(0));
    ctrFullscreenBtn($(this).parentsUntil(".box").find(".fullscreen").get(0));
    ctrShuBtn($(this).parentsUntil(".box").find(".shu").get(0));
    onVideoPlay($(this).parent().children("video")[0]);
    $(this).parentsUntil(".box").find(".play").toggleClass("pause");
    controllerOpt($(this).parent().children("video")[0]);
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
var ctrPlayBtn = function ctrPlayBtn(ele) {
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
};

// 音量按钮设置
var ctrSoundBtn = function ctrSoundBtn(ele) {
    $(ele).click(function () {
        if ($(ele).parentsUntil(".box").find(".sound").hasClass("mute")) {
            $(ele).parentsUntil(".box").find(".sound").toggleClass("mute");
            $(ele).parentsUntil(".box").find("video")[0].muted = false;
        } else {
            $(ele).parentsUntil(".box").find("video")[0].muted = true;
            $(ele).parentsUntil(".box").find(".sound").toggleClass("mute");
        }
    });
};

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
var ctrProgress = function ctrProgress(ele) {
    $(ele).click(function (e) {
        var percent = e.offsetX / ele.offsetWidth * 100 + '%';
        $(ele).children('.progress-bar').width(percent);
        $(ele).parentsUntil(".box").find("video")[0].currentTime = $(ele).parentsUntil(".box").find("video")[0].duration * e.offsetX / ele.offsetWidth;
    });
};

//放大
var ctrFullscreenBtn = function ctrFullscreenBtn(ele) {
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
};

//触摸video区域  控制条显示  5秒后消失
var controllerOpt = function controllerOpt(ele) {
    $(ele).on('touchstart', function () {
        if (ele.tag) {
            $(ele).parent().next(".VController").animate({ bottom: '0', opacity: '1' }, "slow");
        }
    });
    $(ele).on('touchend', function () {
        setTimeout(function () {
            $(ele).parent().next(".VController").animate({ bottom: '-44px', opacity: '0' }, "slow");
        }, 1000000);
    });
};

//拖动竖条快进或后退视频
var ctrShuBtn = function ctrShuBtn(ele) {
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
        //修改竖条移动距离
        //progress-bar当前宽度
        var currentWidth = $(ele).prev(".progress").children(".progress-bar").width();
        //progress宽度
        var progressWidth = $(ele).prev(".progress").width();
        var percent = (distanceX + moveX) / progressWidth * 100 + '%';
        $(ele).prev(".progress").children(".progress-bar").width(percent);
        // 竖条位置
        ele.style.left = $(ele).parentsUntil(".box").find(".progress-bar").width() + "px";
        $(ele).parentsUntil(".box").find("video")[0].currentTime = $(ele).parentsUntil(".box").find("video")[0].duration * (distanceX + moveX) / progressWidth;
    });
    //触摸结束
    $(ele).on('touchend', function () {
        distanceX = distanceX + moveX;
        //触摸结束 恢复播放
        $(ele).parentsUntil(".box").find("video")[0].play();
    });
};