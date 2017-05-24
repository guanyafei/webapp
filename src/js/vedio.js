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

    //设置视频高度与遮罩图片高度一致  防止样式错乱
    $("video").height($("img.img-responsive").height());
    //点击播放按钮 视频播放
    $(".playBtn").click(function(){
        $(this).parent().children("img,span").fadeOut();
        $(this).parent().children("video")[0].play();
    });