(function (window, document) {
	var w = window,
		doc = document;
	var Kodo = function (selector) {
		return new Kodo.prototype.init(selector);
	}
	//初始化html字体大小
	initHtmlFontSize();
	
	/**获取dom元素并对其进行操作 */
	Kodo.prototype = {
		constructor: Kodo,
		length: 0,
		splice: [].splice,
		selector: '',
		/**根据选择器初始化 */
		init: function (selector) {
			if (!selector) {
				return this;
			}
			//判断参数类型如果为select 则为选择器
			if (typeof selector == 'object') {
				for (var i = 0; i < selector.length; i++) {
					this[i] = selector[i];
				}
				this.length = selector.length;
				return this;
				//如果类型为function则立即执行化传入方法
			} else if (typeof selector == 'function') {
				Kodo.ready(selector);
				return;
			}

			var selector = selector.trim(),
				elm;
			//id选择器
			if (selector.charAt(0) == '#' && !selector.match('\\s')) {
				selector = selector.substring(1);
				this.selector = selector;
				elm = document.getElementById(selector);
				this[0] = elm;
				this.length = 1;
				return this;
			} else {
				//其他选择器
				elm = doc.querySelectorAll(selector);
				for (var i = 0; i < elm.length; i++) {
					this[i] = elm[i];
				}

				this.selector = selector;
				this.length = elm.length;
				return this;
			}


		},
		//修改css
		css: function (attr, val) {
			for (var i = 0; i < this.length; i++) {
				var _this = this[i];
				if (typeof attr == 'string') {
					if (arguments.length == 1) {
						//若传一个参数，则返回属性值
						return getComputedStyle(_this, null)[attr];
					}
					_this.style[attr] = val;
				} else {
					$.each(function (attr, val) {
						_this.style.cssText += '' + attr + ':' + val + ';';
					});
				}
			}
			return this;
		},
		//判断是否有某个class
		hasClass: function (cls) {
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|^)');
			var arr = [];
			for (var i = 0; i < this.length; i++) {
				if (this[i].className.match(reg))
					return true;
				return false;
			}
			return this;
		},
		//添加class
		addClass: function (cls) {
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			for (var i = 0; i < this.length; i++) {
				if (!this[i].className.match(reg))
					this[i].className += ' ' + cls;
			}
			return this;
		},
		//移除class
		removeClass: function (cls) {
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			for (var i = 0; i < this.length; i++) {
				if (this[i].className.match(reg))
					this[i].className = this[i].className.replace(cls, '');
			}
			return this;
		},
		//修改属性
		attr: function (attr, val) {
			for (var i = 0; i < this.length; i++) {
				if (typeof attr == 'string') {
					if (arguments.length == 1) {
						return this[i].getAttribute(attr);
					}
					this[i].setAttribute(attr, val);
				} else {
					var _this = this[i];
					$.each(function (attr, val) {
						_this.setAttribute(attr, val);
					});
				}
			}
		},
		//修改显示的文字
		html: function (value) {
			if (value === undefined && this[0].nodeType === 1) {
				return this[0].innerHTML;
			} else {
				for (var i = 0; i < this.length; i++) {
					this[i].innerHTML = value;
				}
			}
			return this;
		},
		//修改显示的title
		text: function (value) {
			if (value === undefined && this[0].nodeType === 1) {
				return this[0].innerText;
			} else {
				for (var i = 0; i < this.length; i++) {
					this[i].innerText = value;
				}
			}
			return this;
		},
		//当前节点内新增内容
		append: function (str) {
			for (var i = 0; i < this.length; i++) {
				domAppend(this[i], 'beforeend', str);
			}
			return this;
		},
		//当前节点内最前面新增内容
		before: function (str) {
			for (var i = 0; i < this.length; i++) {
				domAppend(this[i], 'beforeBegin', str);
			}
			return this;
		},
		//当前节点后新增内容
		after: function (str) {
			for (var i = 0; i < this.length; i++) {
				domAppend(this[i], 'afterEnd', str);
			}
			return this;
		},
		remove: function () {
			for (var i = 0; i < this.length; i++) {
				this[i].parentNode.removeChild(this[i]);
			}
			return this;
		}
	}
	//修改prototype指向
	Kodo.prototype.init.prototype = Kodo.prototype;
	
	
	/**下面为静态工具方法 */
	//初始化方法
	Kodo.ready = function (fn) {
		doc.addEventListener('DOMContentLoaded', function () {
			//页面加载后执行的方法
			fn && fn();
		}, false);
		doc.removeEventListener('DOMContentLoaded', fn, true);
	}

	Kodo.ajax = function () {
		console.log(this);
	}
	
	//遍历方法
	Kodo.each = function (obj, callback) {
		var len = obj.length,
			constru = obj.constructor,
			i = 0;
		if (constru == w.$) {
			for (; i < len; i++) {
				var val = callback.call(obj[i], i, obj[i]);
				if (val === false) break;
			}
		} else if (isArray(obj)) {
			for (; i < len; i++) {
				var val = callback.call(obj[i], i, obj[i]);
				if (val === false) break;
			}
		} else {
			for (i in obj) {
				var val = callback.call(obj[i], i, obj[i]);
				if (val === false) break;
			}
		}
	}
	
	//请求数据
	Kodo.get = function (url, sucBack, complete) {
		var options = {
			url: url,
			success: sucBack,
			complete: complete
		};
		ajax(options);
	};
	Kodo.post = function (url, data, sucback, complete) {
		var options = {
			url: url,
			type: "POST",
			data: data,
			sucback: sucback,
			complete: complete
		};
		ajax(options);
	};
	
	//loadingDialog的显示与隐藏
	Kodo.loadingShow = function () {
		var loadingLayer = createLoadingLayer();
		loadingLayer.style.display = 'block';
	}

	Kodo.loadingHidden = function () {
		var loadingLayer = createLoadingLayer();
		loadingLayer.style.display = 'none';
	}
	
	/** 内部方法*/
	//判断出入对象是否为数组
	function isArray(obj) {
		return Array.isArray(obj);
	}
	
	//ajax
	function ajax(options) {
		var defaultOptions = {
			url: false,
			type: "GET",
			data: "false",
			success: false,
			complete: false
		};

		for (i in defaultOptions) {
			if (options[i] === undefined) {
				options[i] === defaultOptions[i];
			}
		}

		var xhr = new XMLHttpRequest();
		var url = options.url;
		xhr.open(options.type, url);
		xhr.onreadystatechange = onStateChange;

		if (options.type === 'POST') {
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}

		xhr.send(options.data ? options.data : null);

		function onStateChange() {
			if (xhr.readyState == 4) {
				var result,
					status = xhr.status;

				if ((status >= 200 && status < 300) || status == 304) {
					result = xhr.responseText;
					if (window.JSON) {
						result = JSON.parse(result);
					} else {
						result = eval('(' + result + ')');
					}
					ajaxSuccess(result, xhr)
				} else {
					console.log("ERR", xhr.status);
				}
			}
		}
		function ajaxSuccess(data, xhr) {
			var status = 'success';
			options.success && options.success(data, options, status, xhr)
			ajaxComplete(status)
		}
		function ajaxComplete(status) {
			options.complete && options.complete(status);
		}
	}
	
	//创建一个loading框
	var createLoadingLayer = (function () {
		var div;
		return function () {
			if (!div) {
				div = document.createElement('div');
				div.style.display = 'none';

				var loadingBg = document.createElement('div');
				loadingBg.className = 'loading-bg';
				div.appendChild(loadingBg);

				var loadingContent = document.createElement('div');
				loadingContent.className = 'loading-content';
				var img = document.createElement('img');
				img.src = 'images/hourglass.gif';
				loadingContent.appendChild(img);
				div.appendChild(loadingContent);
				console.log(div);
				document.body.appendChild(div);
			}
			return div;
		}
	})();
	
	//实现append after before操作
	function domAppend(elm, type, str) {
		elm.insertAdjacentHTML(type, str);
	}
	
	//根据屏幕宽度初始化html字体大小
	function initHtmlFontSize() {
		var docEl = doc.documentElement,
			resizeEvt = 'orientationchage' in window ? 'orientationchage' : 'resize',
			recalc = function () {
				var clientWidth = docEl.clientWidth;
				if (!clientWidth) return;
				docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
			};

		if (!doc.addEventListener) return;

		w.addEventListener(resizeEvt, recalc, false);

		doc.addEventListener('DOMContentLoaded', recalc, false);
	}
	
	//暴漏到外面的调用关键字
	window.$ = Kodo;
})(window, document);