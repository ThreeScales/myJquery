(function (window, document) {
	var w = window,
		doc = document;
	var Kodo = function (selector) {
		return new Kodo.prototype.init(selector);
	}
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
				if (arguments.length == 1) {
					//若传一个参数，则返回属性值
					return getComputedStyle(this[i], null)[attr];
				}
				this[i].style[attr] = val;
			}
			return this;
		},
		//判断是否有某个class
		hasClass: function (cls) {
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|^)');
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
		}
	}
	//修改prototype指向
	Kodo.prototype.init.prototype = Kodo.prototype;

	Kodo.ajax = function () {
		console.log(this);
	}

	window.$ = Kodo;

})(window, document);