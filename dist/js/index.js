"use strict";

//页面默认加载home页
createIframe("home");

window.onload = function () {
    clickLoad();
    backController();
};
//创建内联框架
function createIframe(pageName) {
    var parentDom = document.getElementsByClassName("index")[0];
    var siblingDom = document.getElementsByClassName("navbar")[0];
    var ifm = document.createElement("iframe");
    ifm.id = "iframepage";
    ifm.name = "iframepage";
    ifm.style.border = "0px";
    ifm.seamless = true;
    ifm.src = './page/' + pageName + '.html';
    ifm.height = document.documentElement.clientHeight - 5;
    ifm.width = "100%";
    parentDom.insertBefore(ifm, siblingDom);
}

//点击创建前先清除iframe框架
function removeIframe() {
    var parentDom = document.getElementsByClassName("index")[0];
    var ifm = document.getElementById("iframepage");
    parentDom.removeChild(ifm);
    $(".back").fadeOut("normal");
}

//点击底部导航  框架加载相应页
function clickLoad() {
    $(".footer > a").each(function (idx, ele) {
        $(ele).click(function () {
            if (idx != 2) {
                removeIframe();
                var pageName = $(ele).attr("myAttr");
                $(ele).addClass('active').siblings().removeClass("active");
                $(".loading").show();
                setTimeout(function () {
                    createIframe(pageName);
                    backController();
                    $(".loading").hide(200);
                }, 1000);
            }
        });
    });
}
//窗口卷去部分大于100 返回图标展示
function backController() {
    var ifm = document.getElementById('iframepage');
    var ifmScrollTop;
    ifm.contentWindow.onscroll = function () {
        ifmScrollTop = ifm.contentWindow.document.body.scrollTop;
        if (ifmScrollTop > 100) {
            $(".back").fadeIn("slow");
        } else {
            $(".back").fadeOut("normal");
        }
    };
}

//点击back图标 窗口回到顶部
$(".back").click(function () {
    var ifm = document.getElementById('iframepage');
    ifm.contentWindow.scrollTo(0, 0);
});