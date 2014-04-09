/*
 * @about:图片展示网;
 * @publish_date:4-9;
*/
// 全局
var nowBannerIndex = 0;//当前轮播图片序号
var bannerDirector = 1;//轮播的方向

// banner轮播
$('.banner .opt .dot').click(function(){
	var index = parseInt($(this).attr('data-index'));
	$(this).addClass('active');
	$(this).parent('li').siblings('li').find('.dot').removeClass('active');
	var imgs = $('.banner .img');
	for(var i = 0; i < imgs.length; i++){
		if(i === index){
			imgs[i].classList.remove('hide');
			nowBannerIndex = index;
		}
		else{
			imgs[i].classList.add("hide");
		}
	}
});
// 自动播放
function autoBanner(){
	if(nowBannerIndex === 4){
		bannerDirector = -1;
	}
	else if(nowBannerIndex === 0){
		bannerDirector = 1;
	}
	nowBannerIndex += bannerDirector;
	$('.banner .opt .dot')[nowBannerIndex].click();
}
var autoBannerInterval = setInterval(function(){autoBanner()},5000);

//响应式操作栏
$('.navigatorImg .logo').click(function(){
	var $list = $(this).siblings('.navigatorList');
	if($list.hasClass('hide')){
		$list.removeClass('hide');
	}
	else{
		$list.addClass('hide');
	}
});




