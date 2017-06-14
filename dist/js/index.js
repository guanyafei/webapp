"use strict";

//页面默认加载home页
createIframe("home");

window.onload = function () {
    clickLoad();
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
}

//点击底部导航  框架加载相应页
function clickLoad() {
    $(".footer > a").each(function (idx, ele) {
        $(ele).click(function () {
            if (idx != 2) {
                removeIframe();
                var pageName = $(ele).attr("class");
                createIframe(pageName);
            }
        });
    });
}