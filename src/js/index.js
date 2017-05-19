    //hammer实现触摸拖动轮播图图片
    var hm = new Hammer(document.getElementById("carousel-example-generic"));
    hm.on("swipeleft", ()=> {
        $('#carousel-example-generic').carousel('next');
    });
    hm.on("swiperight", ()=> {
        $('#carousel-example-generic').carousel('prev');
    });

    //窗口卷去部分大于banner偏移量 返回图标展示
    $(window).scroll(()=> {
        if (document.body.scrollTop > $(".nav").offset().top) {
            $(".back").fadeIn("slow");
        } else {
            $(".back").fadeOut("normal");
        }
    });
    //单击导航栏标签  样式改变
    var lis = $("li[role='presentation']");
    for(let i=0;i<lis.length;i++){
        let that=lis[i];
         $(that).bind('click',()=>{
         	$(that).children('a').addClass('active').parent().siblings().children('a').removeClass('active');
         });
    }
