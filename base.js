/*
 * @about:图片展示网;
 * @publish_date:4-9;
 */
// 全局
var nowBannerIndex = 0; //当前轮播图片序号
var bannerDirector = 1; //轮播的方向

// 点击显示图片展示
$('.link').click(function() {
	var index = $(this).attr('data-index');
	$('.layout').addClass('hide');
	switch(index){
		case '1':$('#equalHeight').removeClass('hide');break;
		case '2':$('#masonry').removeClass('hide');break;
		case '3':$('#verticalShowcase').removeClass('hide');break;
		case '4':$('#imageBox').removeClass('hide');break;
		case '5':$('#bookReview').removeClass('hide');break;
		default:$('#masonry').removeClass('hide');break;
	}
});

// banner轮播
$('.banner .opt .dot').click(function() {
	var index = parseInt($(this).attr('data-index'));
	$(this).addClass('active');
	$(this).parent('li').siblings('li').find('.dot').removeClass('active');
	var imgs = $('.banner .img');
	for (var i = 0; i < imgs.length; i++) {
		if (i === index) {
			imgs[i].classList.remove('hide');
			nowBannerIndex = index;
		} else {
			imgs[i].classList.add("hide");
		}
	}
});
// 自动播放
function autoBanner() {
	if (nowBannerIndex === 4) {
		bannerDirector = -1;
	} else if (nowBannerIndex === 0) {
		bannerDirector = 1;
	}
	nowBannerIndex += bannerDirector;
	$('.banner .opt .dot')[nowBannerIndex].click();
}
var autoBannerInterval = setInterval(function() {
	autoBanner()
}, 5000);

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

// verticalShowcase
Slider.init();

// imageBox
var $ibWrapper = $('#ib-main-wrapper'),

	Template = (function() {

		// true if dragging the container
		var kinetic_moving = false,
			// current index of the opened item
			current = -1,
			// true if the item is being opened / closed
			isAnimating = false,
			// items on the grid
			$ibItems = $ibWrapper.find('div.ib-main > a'),
			// image items on the grid
			$ibImgItems = $ibItems.not('.ib-content'),
			// total image items on the grid
			imgItemsCount = $ibImgItems.length,
			init = function() {

				// add a class ib-image to the image items
				$ibImgItems.addClass('ib-image');
				// apply the kinetic plugin to the wrapper
				loadKinetic();
				// load some events
				initEvents();

			},
			loadKinetic = function() {

				setWrapperSize();

				$ibWrapper.kinetic({
					moved: function() {

						kinetic_moving = true;

					},
					stopped: function() {

						kinetic_moving = false;

					}
				});

			},
			setWrapperSize = function() {

				var containerMargins = $('#ib-top').outerHeight(true) + $('#header').outerHeight(true) + parseFloat($ibItems.css('margin-top'));
				$ibWrapper.css('height', $(window).height() - containerMargins)

			},
			initEvents = function() {

				// open the item only if not dragging the container
				$ibItems.bind('click.ibTemplate', function(event) {

					if (!kinetic_moving)
						openItem($(this));

					return false;

				});

				// on window resize, set the wrapper and preview size accordingly
				$(window).bind('resize.ibTemplate', function(event) {

					setWrapperSize();

					$('#ib-img-preview, #ib-content-preview').css({
						width: $(window).width(),
						height: $(window).height()
					})

				});

			},
			openItem = function($item) {

				if (isAnimating) return false;

				// if content item
				if ($item.hasClass('ib-content')) {

					isAnimating = true;
					current = $item.index('.ib-content');
					loadContentItem($item, function() {
						isAnimating = false;
					});

				}
				// if image item
				else {

					isAnimating = true;
					current = $item.index('.ib-image');
					loadImgPreview($item, function() {
						isAnimating = false;
					});

				}

			},
			// opens one image item (fullscreen)
			loadImgPreview = function($item, callback) {

				var largeSrc = $item.children('img').data('largesrc'),
					description = $item.children('span').text(),
					largeImageData = {
						src: largeSrc,
						description: description
					};

				// preload large image
				$item.addClass('ib-loading');

				preloadImage(largeSrc, function() {

					$item.removeClass('ib-loading');

					var hasImgPreview = ($('#ib-img-preview').length > 0);

					if (!hasImgPreview)
						$('#previewTmpl').tmpl(largeImageData).insertAfter($ibWrapper);
					else
						$('#ib-img-preview').children('img.ib-preview-img')
							.attr('src', largeSrc).end()
							.find('span.ib-preview-descr')
							.text(description);

					//get dimentions for the image, based on the windows size
					var dim = getImageDim(largeSrc);

					$item.removeClass('ib-img-loading');

					//set the returned values and show/animate preview
					$('#ib-img-preview').css({
						width: $item.width(),
						height: $item.height(),
						left: $item.offset().left,
						top: $item.offset().top
					}).children('img.ib-preview-img').hide().css({
						width: dim.width,
						height: dim.height,
						left: dim.left,
						top: dim.top
					}).fadeIn(400).end().show().animate({
						width: $(window).width(),
						left: 0
					}, 500, 'easeOutExpo', function() {

						$(this).animate({
							height: $(window).height(),
							top: 0
						}, 400, function() {

							var $this = $(this);
							$this.find('span.ib-preview-descr, span.ib-close').show()
							if (imgItemsCount > 1)
								$this.find('div.ib-nav').show();

							if (callback) callback.call();

						});

					});

					if (!hasImgPreview)
						initImgPreviewEvents();

				});

			},
			// opens one content item (fullscreen)
			loadContentItem = function($item, callback) {

				var hasContentPreview = ($('#ib-content-preview').length > 0),
					teaser = $item.children('div.ib-teaser').html(),
					content = $item.children('div.ib-content-full').html(),
					contentData = {
						teaser: teaser,
						content: content
					};

				if (!hasContentPreview)
					$('#contentTmpl').tmpl(contentData).insertAfter($ibWrapper);

				//set the returned values and show/animate preview
				$('#ib-content-preview').css({
					width: $item.width(),
					height: $item.height(),
					left: $item.offset().left,
					top: $item.offset().top
				}).show().animate({
					width: $(window).width(),
					left: 0
				}, 500, 'easeOutExpo', function() {

					$(this).animate({
						height: $(window).height(),
						top: 0
					}, 400, function() {

						var $this = $(this),
							$teaser = $this.find('div.ib-teaser'),
							$content = $this.find('div.ib-content-full'),
							$close = $this.find('span.ib-close');

						if (hasContentPreview) {
							$teaser.html(teaser)
							$content.html(content)
						}

						$teaser.show();
						$content.show();
						$close.show();

						if (callback) callback.call();

					});

				});

				if (!hasContentPreview)
					initContentPreviewEvents();

			},
			// preloads an image
			preloadImage = function(src, callback) {

				$('<img/>').load(function() {

					if (callback) callback.call();

				}).attr('src', src);

			},
			// load the events for the image preview : navigation ,close button, and window resize
			initImgPreviewEvents = function() {

				var $preview = $('#ib-img-preview');

				$preview.find('span.ib-nav-prev').bind('click.ibTemplate', function(event) {

					navigate('prev');

				}).end().find('span.ib-nav-next').bind('click.ibTemplate', function(event) {

					navigate('next');

				}).end().find('span.ib-close').bind('click.ibTemplate', function(event) {

					closeImgPreview();

				});

				//resizing the window resizes the preview image
				$(window).bind('resize.ibTemplate', function(event) {

					var $largeImg = $preview.children('img.ib-preview-img'),
						dim = getImageDim($largeImg.attr('src'));

					$largeImg.css({
						width: dim.width,
						height: dim.height,
						left: dim.left,
						top: dim.top
					})

				});

			},
			// load the events for the content preview : close button
			initContentPreviewEvents = function() {

				$('#ib-content-preview').find('span.ib-close').bind('click.ibTemplate', function(event) {

					closeContentPreview();

				});

			},
			// navigate the image items in fullscreen mode
			navigate = function(dir) {

				if (isAnimating) return false;

				isAnimating = true;

				var $preview = $('#ib-img-preview'),
					$loading = $preview.find('div.ib-loading-large');

				$loading.show();

				if (dir === 'next') {

					(current === imgItemsCount - 1) ? current = 0 : ++current;

				} else if (dir === 'prev') {

					(current === 0) ? current = imgItemsCount - 1 : --current;

				}

				var $item = $ibImgItems.eq(current),
					largeSrc = $item.children('img').data('largesrc'),
					description = $item.children('span').text();

				preloadImage(largeSrc, function() {

					$loading.hide();

					//get dimentions for the image, based on the windows size
					var dim = getImageDim(largeSrc);

					$preview.children('img.ib-preview-img')
						.attr('src', largeSrc)
						.css({
							width: dim.width,
							height: dim.height,
							left: dim.left,
							top: dim.top
						})
						.end()
						.find('span.ib-preview-descr')
						.text(description);

					$ibWrapper.scrollTop($item.offset().top)
						.scrollLeft($item.offset().left);

					isAnimating = false;

				});

			},
			// closes the fullscreen image item
			closeImgPreview = function() {

				if (isAnimating) return false;

				isAnimating = true;

				var $item = $ibImgItems.eq(current);

				$('#ib-img-preview').find('span.ib-preview-descr, div.ib-nav, span.ib-close')
					.hide()
					.end()
					.animate({
						height: $item.height(),
						top: $item.offset().top
					}, 500, 'easeOutExpo', function() {

						$(this).animate({
							width: $item.width(),
							left: $item.offset().left
						}, 400, function() {

							$(this).fadeOut(function() {
								isAnimating = false;
							});

						});

					});

			},
			// closes the fullscreen content item
			closeContentPreview = function() {

				if (isAnimating) return false;

				isAnimating = true;

				var $item = $ibItems.not('.ib-image').eq(current);

				$('#ib-content-preview').find('div.ib-teaser, div.ib-content-full, span.ib-close')
					.hide()
					.end()
					.animate({
						height: $item.height(),
						top: $item.offset().top
					}, 500, 'easeOutExpo', function() {

						$(this).animate({
							width: $item.width(),
							left: $item.offset().left
						}, 400, function() {

							$(this).fadeOut(function() {
								isAnimating = false;
							});

						});

					});

			},
			// get the size of one image to make it full size and centered
			getImageDim = function(src) {

				var img = new Image();
				img.src = src;

				var w_w = $(window).width(),
					w_h = $(window).height(),
					r_w = w_h / w_w,
					i_w = img.width,
					i_h = img.height,
					r_i = i_h / i_w,
					new_w, new_h,
					new_left, new_top;

				if (r_w > r_i) {

					new_h = w_h;
					new_w = w_h / r_i;

				} else {

					new_h = w_w * r_i;
					new_w = w_w;

				}

				return {
					width: new_w,
					height: new_h,
					left: (w_w - new_w) / 2,
					top: (w_h - new_h) / 2
				};

			};

		return {
			init: init
		};

	})();

Template.init();