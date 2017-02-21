function sc_move (json) {
	var $ele,
		initCSS,
		targetCSS,
		duration,
		delay;
	if(json.target) {$ele = json.target};
	if(json.initCSS) {initCSS = json.initCSS};
	if(json.targetCSS)  {targetCSS = json.targetCSS};
	if(json.duration) {duration = json.duration};
	if(json.delay) {delay = json.delay};
	$ele.css(initCSS);
	setTimeout(function () {
		$ele.css('transition','all ' + duration/1000 + 's ' + 'ease ' + delay/1000 + 's');	
	}, 500);
	$ele.on('trigger_swipe', function () {
		$ele.css(targetCSS);
	})
	$ele.on('trigger_hide', function () {
		$ele.css(initCSS);
	})
}
var _sc = {
	_width:0,// body width
	_height:0,// body height
	_sc_num:0,// pages count
	_pos:0,// page positions now
	changePosition: function (num) {
		var _this = this,
			_height_ = -_this._height * num;
		$('.slide_outer').css('transform', 'translate3d(0,' + _height_ + 'px,0)');	
	},
	getDirection: function (starty, endy) {
		if(starty - endy > 0) {
			return 1; // up
		}else if(starty - endy < 0) {
			return 0; // down
		}else {
			return -1; // no slide
		}
	},
	triggerHide: function (num) {
		$('.need_show',$('.sc_item').eq(num)).trigger('trigger_hide');
	},
	triggerSwipe: function (num) {
		$('.need_show',$('.sc_item').eq(num)).trigger('trigger_swipe');
	},
	touchScreen: function () {
		var _this = this,
			_dir = 0;
		function handleDirection (dir) {
			if(dir == 1) {
				if(_this._pos == _this._sc_num - 1) {
					console.log('down all');
				}else {
					_this.triggerHide(_this._pos);
					_this._pos += 1;	
					$('.slide_outer').addClass('moving');
				}
				
			}else if (dir == 0) {
				if(_this._pos == 0) {
					console.log('up all');
				}else {
					_this.triggerHide(_this._pos);
					_this._pos -= 1;
					$('.slide_outer').addClass('moving');
				}
			}else {
				console.log('no slide');
			}
		}
		$('body').off().on('touchstart', function (e) {
			var event = e || window.event,
				starty = event.targetTouches[0].clientY;
			event.stopPropagation(); 
			event.preventDefault();
			$('body').off('touchmove').on('touchmove', function (eee) {
				var event1 = eee || window.event;
				event1.stopPropagation(); 
				event1.preventDefault();
			})
			$('body').off('touchend').on('touchend', function (ee) {
				var event2 = ee || window.event,
					endy = event2.changedTouches[0].clientY;
				event2.stopPropagation(); 
				event2.preventDefault();
				_dir = _this.getDirection(starty, endy);
				if(!$('.slide_outer').hasClass('moving')) {
					handleDirection(_dir);
					_this.changePosition(_this._pos);
				}
			})
			$('.slide_outer').off('transitionend').on('transitionend',function () {
				$('.slide_outer').removeClass('moving');
				_this.triggerSwipe(_this._pos);
			})
				
		})
	},
	init: function () {
		var _this = this;
		_this._width = $('body').width();
		_this._height = $('body').height();
		_this._sc_num = $('.sc_item').length;
		$('.slide_outer').css('transform', 'translate3d(0,0,0)');
		$('.sc_item').css('width', _this._width).css('height', _this._height);
		_this.touchScreen();
		window.onload = function () {
			setTimeout(function () {
				_this.triggerSwipe(0);	
			}, 500);
			
		}
	},
}
_sc.init();