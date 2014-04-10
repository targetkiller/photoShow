/*
 * @about:图片展示网;
 * @publish_date:4-9;
 */


//响应式操作栏
$('.navigatorImg .logo').click(function() {
	var $list = $(this).siblings('.navigatorList');
	if ($list.hasClass('hide')) {
		$list.removeClass('hide');
	} else {
		$list.addClass('hide');
	}
});

// 得到瀑布流布局元素的宽度
function getMasonryWidth() {
	var Bwidth = $(window).width() + 15;
	var result = 0;
	if (Bwidth > 768) {
		result = 232;
	} else if (Bwidth > 640) {
		result = 178;
	} else if (Bwidth > 400) {
		result = 201;
	} else {
		result = 160;
	}
	return result;
}


// 瀑布流
$('#masonry .photoList img').load(function() {
	var mansonryWidth = getMasonryWidth();
	$('#masonry .photoList').find('li.all').removeClass('hide');
	$('#masonry .photoList').masonry({
		itemSelector: 'li.all',
		singleMode: true,
		columnWidth: mansonryWidth,
		animate: true,
		gutterWidth: 20
	});
	$('#masonry .photoList').find('li').not('li.all').addClass('hide');
});

// 瀑布流类型过滤
$("#masonry .opt .btn").click(function() {
	var value = $(this).attr("data-type");
	var mansonryWidth = getMasonryWidth();
	$('#masonry .photoList').find('li.all').removeClass('hide');
	$('#masonry .photoList').masonry({
		itemSelector: 'li.' + value,
		singleMode: true,
		columnWidth: mansonryWidth,
		animate: true,
		gutterWidth: 20
	});
	$('#masonry .photoList').find('li').not('.' + value).addClass('hide');
});



