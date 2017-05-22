    //单击导航栏标签  样式改变
    var lis = $("nav ul li");
    for(let i=0;i<lis.length;i++){
        let that=lis[i];
         $(that).bind('click',()=>{
         	$(that).children('a').addClass('active').parent().siblings().children('a').removeClass('active');
         });
    }

    //窗口卷去部分大于banner偏移量 返回图标展示
    $(window).scroll(()=> {
        if (document.body.scrollTop > $(".box").offset().top) {
            $(".back").fadeIn("slow");
        } else {
            $(".back").fadeOut("normal");
        }
    });