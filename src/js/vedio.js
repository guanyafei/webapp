  //单击导航栏标签  样式改变
  var lis = $("nav ul li");
  for (let i = 0; i < lis.length; i++) {
      let that = lis[i];
      $(that).bind('click', () => {
          $(that).children('a').addClass('active').parent().siblings().children('a').removeClass('active');
      });
  }

  //窗口卷去部分大于banner偏移量 返回图标展示
  $(window).scroll(() => {
      if (document.body.scrollTop > $(".box").offset().top) {
          $(".back").fadeIn("slow");
      } else {
          $(".back").fadeOut("normal");
      }
  });
  //代理  点击播放按钮 视频播放
  $(".content").delegate(".playBtn", "click", function() {
      $("video").each((idx, ele) => {
          if (!ele.paused) {
              ele.load();
              setVedioTime();
              $(ele).siblings("img,span").fadeIn();
          }
      });
      $(this).parent().children("img,span").fadeOut();
      $(this).parent().children("video")[0].play();
  });
  //视频加载后触发  获取视频长度并设置
  var setVedioTime = () => {
      $("video").each((idx, ele) => {
          var vLength = ele.duration;
          if (vLength > 0) {
              //小时  
              var h = parseInt(vLength / (60 * 60));
              //分
              var m = parseInt((vLength % (60 * 60)) / 60);
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
              var time=h === '00' ? m + ':' + s : h + ':' + m + ':' + s;
              $(ele).siblings(".badge").html(time);
          }
      });
  }
