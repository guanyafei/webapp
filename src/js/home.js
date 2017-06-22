    //hammer实现触摸拖动轮播图图片
    $(".tab-content").delegate(".carousel", "touchstart", function() {
        var hm = new Hammer(this);
        hm.on("panleft", (e) => {
            $(this).carousel('next');
        });
        hm.on("panright", (e) => {
            $(this).carousel('prev');
        });
    });

    //左右滑动标签面板 
    // tabTouch();
    slideTab();
