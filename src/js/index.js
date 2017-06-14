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
    $(window).scroll(() => {
        if (document.body.scrollTop > $(".nav").offset().top) {
            $(".back").fadeIn("slow");
        } else {
            $(".back").fadeOut("normal");
        }
    });

    tabTouch();
    //左右滑动标签面板 

    function tabTouch() {
        // 一. 获取变量
        //手指触摸位置
        var startX = 0;
        var startY = 0;
        //手指移动距离
        var moveX = 0;
        var moveY = 0;
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
        var navClick = function() {
            for (let i = 0; i < lis.length; i++) {
                let that = lis[i];
                //单击导航栏标签  样式改变
                $(that).bind('click', () => {
                    $(that).children('a').addClass('active').parent().siblings().children('a').removeClass('active');
                    clearTransition();
                    index = i;
                    setTransform(index * tabWidth * -1);
                });
            }
        };
        // 修改tabBox的移动距离
        var setTransform = function(distance) {
            tabBox.offset({ left: distance });
        };

        // 开启过渡
        var setTransition = function() {
            tabBox.css({ transition: "all .6s" });
        };

        // 关闭过渡
        var clearTransition = function() {
            tabBox.css({ transition: "none" });
        };

        navClick();
        // 注册touch事件
        // 触摸开始
        tabBox.on('touchstart', (event) => {
            // 记录
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;

            // 关闭过渡效果
            clearTransition();
        });

        // 触摸中
        tabBox.on('touchmove', (event) => {
            // 计算移动距离
            moveX = event.touches[0].clientX - startX;
            moveY = event.touches[0].clientY - startY;
            if (event.target.className === "carousel-img" || moveY < -30 || moveY > 30) {
                return;
            }

            // 修改tabBox的移动距离
            if (index === 0 && moveX > 0) {
                setTransform(index);
            } else if (index === count - 1 && moveX < 0) {
                setTransform(index * tabWidth * -1);
            } else {
                setTransform(moveX + index * tabWidth * -1);
            }
        });

        // 触摸结束
        tabBox.on('touchend', (event) => {
            // 判断 是否需要吸附回去 小于 1/4宽度 吸附回去 大于 1/4宽度 跳一张
            // 计算绝对值
            if (event.target.className === "carousel-img") {
                return;
            }
            if (moveY > -30 && moveY < 30) {
                if (Math.abs(moveX) > (tabWidth / 5)) {
                    if (moveX > 0) {
                        index--;
                        index = index < 0 ? 0 : index;
                    } else {
                        index++;
                        index = index > count - 1 ? count - 1 : index;
                    }
                }
            }
            // 开启过渡效果
            setTransition();
            // 吸附回去 
            setTransform(index * tabWidth * -1);
            //修改导航栏
            $(lis[index]).children('a').addClass('active').parent().siblings().children('a').removeClass('active');
        });
    }
