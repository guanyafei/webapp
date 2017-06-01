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
              var time = formatTime(ele, vLength);
              $(ele).siblings(".badge").html(time);
              $(ele).parentsUntil(".box").find(".totalTime").html(time);
          });
      }
      //格式化视频总时间
  var formatTime = (ele, vLength) => {
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
          var time = h === '00' ? m + ':' + s : h + ':' + m + ':' + s;
          return time;
      }
  };
  //自定义视频控制按钮
  // 点击播放按钮  视频播放
  $(".play").each((idx, ele) => {
      $(ele).click(function() {
          if ($(ele).parentsUntil(".box").find(".play").hasClass("pause")) {
              $(ele).parentsUntil(".box").find(".play").toggleClass("pause");
              $(ele).parentsUntil(".box").find("video")[0].pause();
          } else {
              $(ele).parentsUntil(".box").find("video")[0].play();
              onVideoPlay($(ele).parentsUntil(".box").find("video")[0]);
              $(ele).parentsUntil(".box").find(".play").toggleClass("pause");
          }
      });
  });
    // 音量按钮设置
  $(".sound").each((idx, ele) => {
      $(ele).click(function() {
          if ($(ele).parentsUntil(".box").find(".sound").hasClass("mute")) {
              $(ele).parentsUntil(".box").find(".sound").toggleClass("mute");
              $(ele).parentsUntil(".box").find("video")[0].muted=true;
          } else {
              $(ele).parentsUntil(".box").find("video")[0].muted=false;
              $(ele).parentsUntil(".box").find(".sound").toggleClass("mute");
          }
      });
  });

  //当前的播放位置发送改变时触发 改变进度条
  var onVideoPlay = (videoDom) => {
      videoDom.ontimeupdate = () => {
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

  //点击跳转播放位置
  $(".progress").each((idx, ele) => {
      ele.onclick = e => {
          console.log(e.offsetX);
          var percent = e.offsetX / ele.offsetWidth * 100 + '%';
          $(ele).children('.progress-bar').width(percent);
          $(ele).parentsUntil(".box").find("video")[0].currentTime = $(ele).parentsUntil(".box").find("video")[0].duration * e.offsetX / ele.offsetWidth;
      };
  });
  //拖动竖条快进或后退视频
  /*$(".shu").each((idx, ele) => {
      ele.onmousedown = event => {
          var shu = $(ele).get(0);
          var progress = $(ele).siblings(".progress").get(0);
          var e = event || window.event;
          //点击位置
          var pageX = event.pageX || event.clientX + document.documentElement.scrollLeft;
          // 点击瞬间 点击位置在progress中的位置
          var tapX = pageX - progress.offsetLeft;
          //竖条跟着触摸点移动
          progress.onmousemove = event => {
              var pageX = event.pageX || event.clientX + document.documentElement.scrollLeft;
              shu.style.left = pageX - tapX + "px";
          };
          //触摸停止  移动停止
          progress.onmouseup = function() {
              ele.onmousemove = null;
          };
      };
  });*/
  //放大
  $(".fullscreen").each((idx, ele) => {
      $(ele).click(() => {
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
  });
  //声音控制
/*  $(".sound").each((idx,ele)=>{
    $(ele).click(()=>{
      var video = $(ele).parentsUntil(".box").find("video").get(0);
      console.log(video.muted);
      if(!video.muted){
        video.muted=true;
      }else{
        video.muted=false;
      }
    });
  });*/
