if (typeof(gtalklet) !== 'undefined') {
	var layer = gtalklet.$('#gtalklet_layer').hide();
	var html = gtalklet.$('html');
	var body = gtalklet.$('body', html);

	function gtalklet_align_right() {
		var htmlOverflowY = html.css('overflowY');
		var bodyOverflowY = body.css('overflowY');
		var scrollBarVisible =  htmlOverflowY === 'scroll' || bodyOverflowY === 'scroll' || (gtalklet.$(document).height() > gtalklet.$(window).height() && htmlOverflowY !== 'hidden' && bodyOverflowY !== 'hidden');
		
		var $style = gtalklet.$('#gtalklet_right_css');
		var scrollbarWidth = gtalklet.$.scrollbarWidth();
		// lion
		if (scrollbarWidth == 0) {
			scrollbarWidth = 13;
			scrollBarVisible = false;
		}

		if (!scrollBarVisible) {
			var content = '#gtalklet_layer {right: ' + scrollbarWidth + 'px!important;}';
		} else {
			var content = '';
		}

		if ($style.length) {
			$style.html(content);
		} else {
			gtalklet.$("<style type='text/css' media='screen' id='gtalklet_right_css'>" + content + "</style>").appendTo(body); 
		}
		layer.show();
	};

	// ??body?????????????
	body.get(0).addEventListener('overflowchanged', function() {
		if (gtalklet_align_right) {
			gtalklet_align_right();
		}
	}, false);

	gtalklet_align_right();
}
