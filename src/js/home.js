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


    //窗口卷去部分大于banner偏移量 返回图标展示
    // $(window).scroll(() => {
    //     if (document.body.scrollTop > $(".nav").offset().top) {
    //         $(".back").fadeIn("slow");
    //     } else {
    //         $(".back").fadeOut("normal");
    //     }
    // });
    //左右滑动标签面板 
    tabTouch();
