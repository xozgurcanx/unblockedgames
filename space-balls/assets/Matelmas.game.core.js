/*
*/
(function () {

	"use strict";

	if (typeof window.Matelmas === "undefined") {
		window.Matelmas = {};
	}

	Matelmas.namespace = function (ns) {
		var parts = ns.split("."),
			parent = Matelmas,
			i;

		if (parts[0] === "Matelmas") {
			parts = parts.slice(1);
		}

		for (i = 0; i < parts.length; i += 1) {
			if (typeof parent[parts[i]] === "undefined") {
				parent[parts[i]] = {};
			}
			parent = parent[parts[i]];
		}
		return parent;
	};

	Matelmas.namespace("Matelmas");

	// ----------------------------------------
	//	jQuery.ajax
	// ----------------------------------------
	$.ajaxSetup({
		cache: false,
		type: "post",
		dataType: "json",
		timeout: 15000, // 15 
	});

	// ----------------------------------------
	//	Url Get 
	//	 ex) var value = $.getParam('');
	// ----------------------------------------
	$.extend({
		getParams: function (name) {
			// unescape는 (* @ - _ + . /) 
			// decodeURI는 (, / ? : @ & = + $ #)
			// decodeURIComponent 
			// var url_string = window.location.href;
			// var url = new URL(url_string);
			// var vars = url.searchParams.get(name);
			// return encodeURIComponent(vars);

			// 리턴값을 위한 변수 선언
			var vars;

			// 현재 URL 가져오기
			var url = window.location.href;

			// get 
			var parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');

			//  paramName  return
			for (var i = 0; i < parameters.length; i++) {
				var varName = parameters[i].split('=')[0];
				// console.log('varName : ' + varName);
				if (varName.toUpperCase() == name.toUpperCase()) {
					vars = parameters[i].split('=')[1];
					return encodeURIComponent(vars);
				}
			}
		},
		getParam: function (name) {
			vars = $.getParams(name);
			// console.log('AAA : ' + vars);
			// vars = vars.replace(/%20/gi, "+");
			// vars = vars.replace(/%2F/gi, "/");
			return decodeURIComponent(vars);
		}
	});

	// ----------------------------------------
	//	
	// ----------------------------------------
	// 
	Matelmas.getDeviceType = function () {

		var userAgent = navigator.userAgent || navigator.vendor || window.opera;

		if (/windows phone/i.test(userAgent)) {
			return "winphone";
		} else if (/android/i.test(userAgent)) {
			return "android";
		} else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
			return "ios";
		} else {
			return "etc";
		}
	};

	// 
	Matelmas.getAdroidWebviewCheck = function () {

		var userAgent = navigator.userAgent

		if(userAgent.indexOf("APP_ANDORID_WEBVIEW")>-1){
			return true;
		}

		return false;
	};
	
	// ----------------------------------------
	//	escapeHtml
	// ----------------------------------------
	Matelmas.escapeHtml = function (str) {
		if (str === null || str.length === 0) {
			return "";
		}
		var escaped = str.replace(/&/g, "&amp;");
		escaped = escaped.replace(/</g, "&lt;");
		escaped = escaped.replace(/>/g, "&gt;");
		escaped = escaped.replace(/"/g, "&quot;");
		escaped = escaped.replace(/'/g, "&#39;"); // Do Not use &apos; -
		// IE does not allow it.''
		return escaped;
	}

	Matelmas.escapeHtmlDelete = function (str) {
		if (str === null || str.length === 0) {
			return "";
		}
		var escaped = str.replace(/&/g, "");
		escaped = escaped.replace(/</g, "");
		escaped = escaped.replace(/>/g, "");
		escaped = escaped.replace(/"/g, "");
		escaped = escaped.replace(/'/g, ""); // Do Not use &apos; -
		// IE does not allow it.''
		return escaped;
		return escaped;
	}

	// ----------------------------------------
	//	modalDialog
	// ----------------------------------------
	$.fn.modalDialog = function (userOptions) {
		var $me = this;
		$me.wrapperContent = $("#wrapperContent");
		var options = $.extend({
			zIndex: 1
		}, $.fn.modalDialog.defaults, userOptions);

		if (typeof userOptions === 'string') {
			doCommand(userOptions);
		} else {
			init();
		}
		var $modalContainer;
		return $me;

		function doCommand(command) {
			var $modal = $me.parent(); // modal

			switch (command) {
				case 'close':
					$modal.fadeOut("slow");
					break;
				case 'open':
					if (options.docBody.prop('scrollHeight') > options.docBody.prop('clientHeight')) {
						options.docBody.css('overflow-y', 'scroll');
					}
					if (options.docBody.width() == options.docWindow.width()) {
						$me.wrapperContent.css('width', '100%');
					}
					options.docBody.find(':enabled').attr('disabled', 'disabled').addClass('__modal-disabled');
					options.docBody.find('div.modal').removeAttr('disabled').removeClass('__modal-disabled');
					options.docBody.find('div.modal').find('.__modal-disabled').removeAttr('disabled').removeClass('__modal-disabled');

					// 백그라운드 fadeIn
					// options.docBody.find('div.modal').removeClass('modal').addClass('modal on');

					var st = $(window).scrollTop();
					var sl = $(window).scrollLeft();
					$me.wrapperContent.addClass('pos-fixed').css('top', -st + 'px').css('left', -sl + 'px');
					$modal.fadeIn('slow');
					$(window).trigger('resize');
					break;
				case 'destroy':
					options.docBody.find('.__modal-disabled').removeAttr('disabled').removeClass('__modal-disabled');

					options.docBody.css('overflow-y', '');
					var st = $me.wrapperContent.css('top');
					st = String(st).replace('px', '');
					var sl = $me.wrapperContent.css('left');
					sl = String(sl).replace('px', '');
					st = Math.abs(st);
					sl = Math.abs(sl);
					$modal.fadeOut("slow").remove();
					$me.wrapperContent.removeClass('pos-fixed').css('top', '').css('left', '').css('width', '');

					// 
					// $(window).scrollTop(st).scrollLeft(sl);

					break;
			}
		}

		function init() {
			$modalContainer = $('<div class="modal" />');
			$me.css({
					'position': 'absolute', // windowHeight
					'z-index': 2
				})
				.data('options', options)
				.data('modalContainer', $modalContainer);

			$modalContainer.css('z-index', options.zIndex).append('<div class="modal_bg" />').append($me);

			options.docBody.append($modalContainer);

			//
			$(window).on('resize', setDialogPosition).trigger('resize');
		}

		function setDialogPosition() {
			var windowWidth = options.docWindow.width();
			var windowHeight = options.docWindow.height();

			var hasOptionWidthHeight = options.windowWidth !== null && options.windowHeight !== null;

			if (hasOptionWidthHeight) {
				windowWidth = options.windowWidth;
				windowHeight = options.windowHeight;
			}

			$modalContainer.css({
				"width": windowWidth + "px",
				"height": windowHeight + "px"
			});

			var top = options.top;
			if (options.top == null) {
				top = (windowHeight - $me.outerHeight()) / 2;
				if (top < 0) {
					top = 0;
				}
			}

			var left = (windowWidth - $me.outerWidth()) / 2;
			if (left < 0) {
				left = 0;
			}

			$me.css({
				'top': top + 'px',
				'left': left + 'px'
			});
		}
	};

	$.fn.modalDialog.defaults = {
		zIndex: 1,
		windowWidth: null,
		windowHeight: null,
		top: null,
		docBody: $('body'),
		docWindow: $(window)
	};

	// ----------------------------------------
	//	 Alert
	// ----------------------------------------
	Matelmas.alert = function (title, message, okFunction) {

		// if(Matelmas.isMobileView){
		// 	alert(message);
		// 	return false;
		// }

		var title = Matelmas.escapeHtml(title);
		title = title.split("\n").join("<br/>");

		var message = Matelmas.escapeHtml(message);
		message = message.split("\n").join("<br/>");

		var $alertMessage = $("<div class='layer_comm' id=''>" +
			"<div class='layer_inner'>" +
			"<div class='alertWrap' >" +
			"<div class='alert_box' >" +
			"<strong class='alert_box_title'>" + title + "</strong>" +
			"<div class='alert_type_area'>" +
			"<div>" +
			"<span>" + message + "</span>" +
			"</div>" +
			"</div>" +
			"<div class='alert_type_btn alert_type_btn_inapp'>" +
			"<div class='alert_type_btn_box'>" +
			"<a href='javascript:;' class='btn_confirm' id='btn_confirm'></a>" +
			"</div>" +
			"</div>" +
			"</div>" +
			"</div>" +
			"</div>");

		// 
		$("#btn_confirm", $alertMessage).bind("click", function () {
			$alertMessage.modalDialog('destroy');
			if (typeof okFunction === 'function') {
				if (typeof eventElement === 'undefined' || eventElement === null) {
					okFunction();
				} else {
					okFunction(eventElement);
				}
			}
			return false;
		});

		$("body").append($alertMessage);

		$alertMessage.modalDialog({
			zIndex: 50000
		});

		$alertMessage.modalDialog("open");

		$("#btn_confirm", $alertMessage).focus();

		// ESC 
		// $(".layer_comm").bind("keydown", function (e) {
		// 	if (e.keyCode == 27) {
		// 		$("#btn_confirm", $alertMessage).click();
		// 	}
		// });
	}

	// ----------------------------------------
	//	 Confirm
	//	
	//	msg
	//
	// ----------------------------------------
	Matelmas.confirm = function (title, msg, okButtonLabel, cancelButtonLabel, okFunction, cancelFunction, eventElement) {

		var title = Matelmas.escapeHtml(title);
		title = title.split("\n").join("<br/>");

		var message = Matelmas.escapeHtml(msg);
		message = message.split("\n").join("<br/>");

		if (typeof okButtonLabel === "undefined" || okButtonLabel === null) {
			okButtonLabel = "확인";
		}

		if (typeof cancelButtonLabel === "undefined" || cancelButtonLabel === null) {
			cancelButtonLabel = "Resume";
		}

		var $alertMessage = $("<div class='layer_comm' id=''>" +
			"<div class='layer_inner'>" +
			"<div class='alertWrap' >" +
			"<div class='alert_box' >" +
			"<strong class='alert_box_title'>" + title + "</strong>" +
			"<div class='alert_type_area'>" +
			"<div>" +
			"<span>" + message + "</span>" +
			"</div>" +
			"</div>" +
			"<div class='alert_type_btn alert_type_btn_inapp'>" +
			"<div class='alert_type_btn_box'>" +
			"<a href='javascript:;' class='btn_confirm' id='btn_confirm'>" + okButtonLabel + "</a>" +
			"<a href='javascript:;' class='btn_cancel' id='btn_cancel'>" + cancelButtonLabel + "</a>" +
			"</div>" +
			"</div>" +
			"</div>" +
			"</div>" +
			"</div>");

		// 확인
		$("#btn_confirm", $alertMessage).bind("click", function () {
			$alertMessage.modalDialog('destroy');

			if (typeof okFunction === 'function') {
				if (typeof eventElement === 'undefined' || eventElement === null) {
					okFunction();
				} else {
					okFunction(eventElement);
				}
			}
			return false;
		});

		// 취소
		$("#btn_cancel", $alertMessage).bind("click", function () {
			$alertMessage.modalDialog('destroy');
			try {
				if (typeof cancelFunction === "function") {
					cancelFunction();
				}
			} catch (e) {}
			return false;
		});

		$("body").append($alertMessage);

		$alertMessage.modalDialog({
			zIndex: 50000
		});

		$alertMessage.modalDialog("open");

		$("#btn_confirm", $alertMessage).focus();

		// ESC 
		// $(".layer_comm").bind("keydown", function (e) {
		// 	if (e.keyCode == 27) {
		// 		$("#btn_confirm", $alertMessage).click();
		// 	}
		// });
	};

	// ----------------------------------------
	//	
	//	Alert
	// ----------------------------------------
	Matelmas.alertLogin = function (title, msg, okButtonLabel, cancelButtonLabel, okFunction, cancelFunction, eventElement) {

		if (typeof okButtonLabel === "undefined" || okButtonLabel === null) {
			okButtonLabel = "";
		}

		if (typeof cancelButtonLabel === "undefined" || cancelButtonLabel === null) {
			cancelButtonLabel = "Resume";
		}

		if (typeof title === "undefined" || title === null) {
			title = "";
		}

		if (typeof msg === "undefined" || msg === null) {
			msg = "";
		}

		var title = Matelmas.escapeHtml(title);
		title = title.split("\n").join("<br/>");

		var msg = Matelmas.escapeHtml(msg);
		msg = msg.split("\n").join("<br/>");

		var $alertMessage = $("<div class='layer_comm' id=''>" +
			"<div class='layer_inner'>" +
			"<div class='alertWrap' >" +
			"<div class='alert_box' >" +
			"<strong class='alert_box_title'>" + title + "</strong>" +
			"<div class='alert_type_area'>" +
			"<div>" +
			"<span>" + msg + "</span>" +
			"</div>" +
			"</div>" +
			"<div class='alert_type_btn alert_type_btn_inapp'>" +
			"<div class='alert_type_btn_box'>" +
			"<a href='javascript:;' class='btn_confirm' id='btn_confirm'>" + okButtonLabel + "</a>" +
			"<a href='javascript:;' class='btn_cancel' id='btn_cancel'>" + cancelButtonLabel + "</a>" +
			"</div>" +
			"</div>" +
			"</div>" +
			"</div>" +
			"</div>");

		// 확인
		$("#btn_confirm", $alertMessage).bind("click", function () {
			$alertMessage.modalDialog('destroy');
			if (okFunction) {
				okFunction();
			} else {
				window.location.href = "";
			}
			return false;
		});

		// 취소
		$("#btn_cancel", $alertMessage).bind("click", function () {
			$alertMessage.modalDialog('destroy');
			try {
				if (typeof cancelFunction === "function") {
					cancelFunction();
				}
			} catch (e) {}
			return false;
		});

		$("body").append($alertMessage);

		$alertMessage.modalDialog({
			zIndex: 50000
		});

		$alertMessage.modalDialog("open");

		// $("#btn_confirm", $alertMessage).focus();

		// ESC 
		// $(".layer_comm").bind("keydown", function (e) {
		// 	if (e.keyCode == 27) {
		// 		$("#btn_confirm", $alertMessage).click();
		// 	}
		// });
	}

	// -------------------------------------
	//	
	// -------------------------------------
	var $dialogHeartUrl;
	Matelmas.dialogHeartClose = function () {
		if (typeof cbHeartChargePageCall === 'function') {
			cbHeartChargePageCall();
		}
		$dialogHeartUrl.modalDialog('destroy');
	}
	var cbHeartChargePageCall = undefined;
	Matelmas.heartChargePageCall = function (user_id, okFunction, eventElement) {
		cbHeartChargePageCall = okFunction;
		if(Matelmas.getAdroidWebviewCheck() === true){
			window.Popcon.game_charge_status();
		}

		var params = "?user_id=" + encodeURIComponent(user_id);
		var $url = "" + params;

		$dialogHeartUrl = $("<div class='overlay_url ani_slideup'>" +
			"<div class='main_header'>" +
			"<div id='header' class='ani_header'>" +
			"<div class='header_fixed' style='background:rgba(0,0,0,0);'>" +
			"<div class='header_gnb' style='background:rgba(0,0,0,0);height:57px;'>" +
			"<div class='close_area' style='position: absolute;top: 0px;right: 0;font-size: 20px;'>" +
			"<a href='javascript:;' id='close_button' class='btn' role='button' style='display: inline-block;height: 57px;margin: 0;padding: 0 20px;border: 0;background: none;line-height: 56px;vertical-align: top;color: #333;' >" +
			"<i class='fas fa-times' style='color:rgba(0,0,0,0);'></i>" +
			"</a>" +
			"</div>" +
			"<div class='tit_area'>" +
			"<h2 class='txt_game' style='margin: 0;padding: 0;'></h2>" +
			"</div>" +
			"</div>" +
			"</div>" +
			"</div>" +
			"</div>" +
			"<div class='overlay_url' style='z-index: -1;overflow:auto; -webkit-overflow-scrolling:touch;'>" +
			"<iframe src='" + $url + "' frameborder='0' style='overflow:hidden;height:100%;width:100%' height='100%' width='100%'></iframe>" +
			"</div>");

		// 
		$("#close_button", $dialogHeartUrl).bind("click", function () {
			$dialogHeartUrl.modalDialog('destroy');

			if (typeof okFunction === 'function') {
				if (typeof eventElement === 'undefined' || eventElement === null) {
					okFunction();
				} else {
					okFunction(eventElement);
				}
			}
			return false;
		});

		$("body").append($dialogHeartUrl);

		$dialogHeartUrl.modalDialog({
			zIndex: 50000
		});

		$dialogHeartUrl.modalDialog('open');
	}

	// -------------------------------------
	//	
	// -------------------------------------
    Matelmas.heartCountCall = function (user_id) {

        return $.ajax({
            url : '', 
            data : { 
                user_id: user_id
            },
            async : true,
            cache : false,
            success	: function(data) {
            },
            error : function() {
            },
            beforeSend:function(){
            },
            complete:function(){
            },
        });
    }

	/**
	 * 
	 * 
	 */
	Matelmas.myGameScoreSave = function ($game_pk, $score) {

		var shareData = new Object();
		shareData.score = $score;
		shareData.game_pk = $game_pk;
		// console.log(shareData);

		var doamin = '';
		var iframe = document.createElement('iframe');
		iframe.id = 'iframe';
		iframe.weight = '0';
		iframe.height = '0';
		iframe.frameborder = '0';
		iframe.scrolling = 'no';
		iframe.style = 'display:none;';
		iframe.src = encodeURI(doamin + '/svc/home/score/');
		document.body.appendChild(iframe);

		var receiver = iframe.contentWindow;
		setTimeout(function () {
			receiver.postMessage(JSON.stringify(shareData), doamin);
		}, 500)
	}

	/**
	 *
	 * 
	 */
	Matelmas.getDeviceType = function () {

		var userAgent = navigator.userAgent || navigator.vendor || window.opera;

		if (/windows phone/i.test(userAgent)) {
			return "winphone";
		} else if (/android/i.test(userAgent)) {
			return "android";
		} else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
			return "ios";
		} else {
			return "etc";
		}
	};

	/**
	 * webview 
	 * 
	 */
	Matelmas.getAdroidWebviewCheck = function () {

		var userAgent = navigator.userAgent

		if(userAgent.indexOf("APP_ANDORID_WEBVIEW")>-1){
			return true;
		}

		return false;
	};

	/**
	 * 애드몹 광고
	 * 
	 */
	var admob_callback = undefined;
	Matelmas.admob = function (data) {
		admob_callback = data.resultCallback;

		if(data.test){
			Matelmas.admob_callback('S100');
			return;
		}
					
		if(Matelmas.getAdroidWebviewCheck() === true){
			window.Popcon.admob(data.game_pk, data.action);
		}
	}

	Matelmas.admob_callback = function (result_code) {
		admob_callback(result_code); 
	}

	/**
	 * 
	 * 
	 */
	Matelmas.numberFormat = function (num) {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

}(jQuery));

// ----------------------------------------
//	Inspired by base2 and Prototype
// ----------------------------------------
(function () {

	var initializing = false,
		fnTest = /xyz/.test(function () {
			xyz;
		}) ? /\b_super\b/ : /.*/;

	// The base Class implementation (does nothing)
	window.Class = function () {};

	// Create a new Class that inherits from this class
	Class.extend = function (prop) {
		var _super = this.prototype;
		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;

		var name;

		// Copy the properties over onto the new prototype
		for (name in prop) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof prop[name] === "function" &&
				typeof _super[name] === "function" &&
				fnTest.test(prop[name]) ? (function (name, fn) {
					return function () {
						var tmp = this._super;

						// Add a new ._super() method that is the same method
						// but on the super-class
						this._super = _super[name];

						// The method only need to be bound temporarily, so we
						// remove it when we're done executing
						var ret = fn.apply(this, arguments);
						this._super = tmp;

						return ret;
					};
				}(name, prop[name])) : prop[name];
		}

		// The dummy class constructor
		function Class() {
			// All construction is actually done in the init method
			if (!initializing && this.init)
				this.init.apply(this, arguments);
		}

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this class extendable
		Class.extend = window.Class.extend;

		return Class;
	};
}(jQuery));
