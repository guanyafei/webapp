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
        if ($(ele).hasClass("pause")) {
            $(ele).toggleClass("pause");
            $(ele).parentsUntil(".box").find("video")[0].pause();
        } else {
            $(ele).parentsUntil(".box").find("video")[0].play();
            onVideoPlay($(ele).parentsUntil(".box").find("video")[0]);
            $(ele).toggleClass("pause");
        }
    });
};

// 音量按钮设置
var ctrSoundBtn = function ctrSoundBtn(ele) {
    $(ele).click(function () {
        if ($(ele).hasClass("mute")) {
            $(ele).toggleClass("mute");
            $(ele).parentsUntil(".box").find("video")[0].muted = false;
        } else {
            $(ele).parentsUntil(".box").find("video")[0].muted = true;
            $(ele).toggleClass("mute");
        }
    });
};

//当前的播放位置发生改变时触发 改变进度条
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

tabTouch();
//左右滑动标签面板 

function tabTouch() {
    // 一. 获取变量
    //手指触摸位置
    var startX = 0;
    //手指移动距离
    var moveX = 0;
    //导航栏标签
    var lis = $("li[role='presentation']");
    //面板个数
    var count = lis.length;
    //面板容器标签
    var tabBox = $(".tab-box");
    //面板标签
    var tabPane = $(".tab-pane");
    //设置面板容器宽度
    tabBox.width(lis.length * 100 + "%");
    //每个面板标签的宽度
    var tabWidth = $(".tab-box").width() / lis.length;

    //设置每个面板标签的宽度
    tabPane.width(tabWidth);

    // 定义变量 记录索引
    var index = 0;

    // 封装 需要重复出现的代码
    // 点击nav标签跳转到相应面板
    var navClick = function navClick() {
        var _loop2 = function _loop2(i) {
            var that = lis[i];
            $(that).bind('click', function () {
                $(that).children('a').addClass('active').parent().siblings().children('a').removeClass('active');
                clearTransition();
                index = i;
                setTransform(index * tabWidth * -1);
            });
        };

        for (var i = 0; i < lis.length; i++) {
            _loop2(i);
        }
    };
    // 修改tabBox的移动距离
    var setTransform = function setTransform(distance) {
        tabBox.offset({ left: distance });
    };

    // 开启过渡
    var setTransition = function setTransition() {
        tabBox.css({ transition: "all .3s" });
    };

    // 关闭过渡
    var clearTransition = function clearTransition() {
        tabBox.css({ transition: "none" });
    };

    navClick();
    // 注册touch事件
    // 触摸开始
    tabBox.on('touchstart', function (event) {
        // 记录
        startX = event.touches[0].clientX;
        // 关闭过渡效果
        clearTransition();
    });

    // 触摸中
    tabBox.on('touchmove', function (event) {
        // 计算移动距离
        moveX = event.touches[0].clientX - startX;
        // 修改tabBox的移动距离
        if (index >= 0 && index <= count - 1) {
            setTransform(moveX + index * tabWidth * -1);
        }
    });

    // 触摸结束
    tabBox.on('touchend', function (event) {
        console.log('end');
        // 判断 是否需要吸附回去 小于 1/4宽度 吸附回去 大于 1/4宽度 跳一张
        // 计算绝对值
        if (Math.abs(moveX) > tabWidth / 4) {
            if (moveX > 0) {
                index--;
                index = index < 0 ? 0 : index;
            } else {
                index++;
                index = index > count - 1 ? count - 1 : index;
            }
        };
        // 开启过渡效果
        setTransition();
        // 吸附回去 
        setTransform(index * tabWidth * -1);
        //修改导航栏
        $(lis[index]).children('a').addClass('active').parent().siblings().children('a').removeClass('active');
    });
}