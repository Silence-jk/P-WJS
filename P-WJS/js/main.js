/**
 * Created by Silence-JK on 2016/12/11.
 */
'use strict'

//入口函数，当文档加载完成才会执行
$(function () {

    function resize(){
        //获得当前屏幕的尺寸
        var windowWidth=$(window).width();
        var isSmallScreen=windowWidth<768;
        //根据界面大小为每张轮播图设置背景
        //$('#main_ad>.carousel-inner>.item')  //获取到的是一个dom数组
        $('#main_ad>.carousel-inner>.item').each(function (index,ele) {
            var $ele=$(ele); //ele得到的是dom对象，转为jQuery对象
            //var imgSrc=$ele.data(isSmallScreen?'image-xs':'image-lg');与下面等同
            var imgSrc=isSmallScreen?$ele.data('image-xs'):$ele.data('image-lg');
            //设置背景图片
            $ele.css('backgroundImage','url("'+imgSrc+'")');
            //当屏幕小到一定程度时，为使图片根据屏幕缩放，采用img标签处理
            if(isSmallScreen){
                $ele.html('<img src="'+imgSrc+'" alt=""/>');
            }else{
                $ele.empty();
            }
        });

        var $ulWrapper=$('.ul-wrapper');
        var ul=$('.nav-tabs');
        var width=30; // 因为原本ul上有padding-left,而且box-sizing:border-box怪异模式，width算padding
        //计算li的总宽度，动态为ul父容器设置宽度
        ul.children().each(function (index,ele) {
            width+=ele.clientWidth; //用js的属性(效率高)，不用jQuery的方法$(ele).width();
        });
        //ul.css('width',width);

        //解决pc经上述调整后也显示横向滚动条
        // 判断当前UL的宽度是否超出屏幕，如果超出就显示横向滚动条
        if(width > $(window).width()){
            ul.css('width',width);
            $ulWrapper.css('overflow-x','scroll');
        }else{
            ul.css('width',1120);
            $ulWrapper.css('overflow-x','auto');
        }

    }
    //trigger()触发事件,若不加则首次打开轮播图不显示。只有尺寸变化才显示
    $(window).on('resize',resize).trigger('resize');

    //初始化工具提示
    $('[data-toggle="tooltip"]').tooltip();

    //利用data属性更换新闻列表区title
    var $newtitle=$('#news .news-title');
    var a=$('#news .nav-stacked li a');
    a.on('click', function () {
        //获取当前点击元素
        var $this=$(this);
        //获取对应的title值
        var title=$this.data('title');
        //将title设到相应的地方(注:只设文本用text效率高，有标签时用innerHTML)
        $newtitle.text(title);
    });

    //获取手指在轮播图上的滑动方向
    //1、获取界面上的轮播图容器
    var $carousels=$('.carousel');
    var startX,endX; //记录手指滑动前，与离开屏幕时的位置
    var offset=50; //设置判断是否滑动的临界值
    //2、注册滑动事件
    $carousels.on('touchstart', function (e) {
        //记录手指触碰的X坐标(e.originalEvent.获得js原生的事件)
        startX= e.originalEvent.touches[0].clientX;
        //console.log(startX);
    });

    $carousels.on('touchmove', function (e) {
        //每次移动后一个总会覆盖前一个,结束的一瞬间记录手指所在坐标
        endX= e.originalEvent.touches[0].clientX;
    });

    $carousels.on('touchend', function (e) {
        console.log(e);
        //比大小，来判断向左，向右
        var distance=Math.abs(endX-startX);
        if(distance > offset){
            //大于临界值，则有方向变化
            console.log(startX>endX?'->':'<-');
            //根据得到的方向选择上一张，下一张(2种方法)
            /*
           - $('a').click();
           - 原生的carousel方法实现 http://v3.bootcss.com/javascript/#carousel-methods
             */
         //   $carousels.carousel(startX>endX?'next':'prev');
         // 不用$carousels，因为若有多个轮播图，滑动一个同时控制多个，我们指向控制滑动的本身那个
            $(this).carousel(startX>endX?'next':'prev');
        }
    });
});