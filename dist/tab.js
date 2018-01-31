/*!
 * @autofe/tab v0.1.2
 * (c) 2018 Autohome Inc.
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
	typeof define === 'function' && define.amd ? define(['jquery'], factory) :
	(global.AutoFE = global.AutoFE || {}, global.AutoFE.Tab = factory(global.jQuery));
}(this, (function ($) { 'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var NAME = 'tab';
var DATA_KEY = 'fe.tab';
var EVENT_KEY = '.' + DATA_KEY;
var DATA_API_KEY = '.data-api';
var JQUERY_NO_CONFLICT = $.fn[NAME];

var Event = {
  SHOW: 'show' + EVENT_KEY,
  SHOWN: 'shown' + EVENT_KEY,
  HIDE: 'hide' + EVENT_KEY,
  HIDDEN: 'hidden' + EVENT_KEY,
  MOUSEENTER: 'mouseenter' + EVENT_KEY,
  MOUSELEAVE: 'mouseleave' + EVENT_KEY,
  CLICK: 'click' + EVENT_KEY,
  CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY
};

var Selector = {
  DATA_TOGGLE: '[data-toggle="tab"]'
};

var Attr = {
  DATA_TARGET: 'data-target'
};

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

var timer = void 0;

function Tab(elem, options) {
  this.options = $.extend({}, Tab.Default, options);
  this.$elem = $(elem);

  this._init();
}

Tab.Default = {
  delay: 150,
  trigger: 'click', // 默认 'click' , 可以是 'hover'
  activeClass: 'active',
  tabList: '[data-tab-list], ul'
};

Tab.prototype._init = function () {
  var that = this;
  var options = that.options;

  if (options.trigger === 'hover') {
    that.$elem.on(Event.MOUSEENTER, function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        that.show();
      }, options.delay);
    }).on(Event.MOUSELEAVE, function () {
      clearTimeout(timer);
    });
  } else {
    that.$elem.on(Event.CLICK, function (e) {
      e.preventDefault();
      that.show();
    });
  }
};

Tab.prototype.show = function () {
  var activeClass = this.options.activeClass;
  var $elem = this.$elem;

  if ($elem.hasClass(activeClass)) {
    return;
  }

  var $target = $($elem.attr(Attr.DATA_TARGET));
  var $list = $elem.closest(this.options.tabList);
  var previous = $list.find('.' + String(activeClass))[0];

  var hideEvent = $.Event(Event.HIDE, {
    relatedTarget: $elem[0]
  });

  var showEvent = $.Event(Event.SHOW, {
    relatedTarget: previous
  });

  if (previous) {
    $(previous).trigger(hideEvent);
  }

  $elem.trigger(showEvent);

  if (hideEvent.isDefaultPrevented() || showEvent.isDefaultPrevented()) {
    return;
  }

  this._activate($elem, $(previous));
  this._activate($target, $target.parent().children('.' + String(activeClass)), function () {
    var hiddenEvent = $.Event(Event.HIDDEN, {
      relatedTarget: $elem[0]
    });

    var shownEvent = $.Event(Event.SHOWN, {
      relatedTarget: previous
    });

    $(previous).trigger(hiddenEvent);
    $elem.trigger(shownEvent);
  });
};

Tab.prototype._activate = function ($elem, $previous, callback) {
  var activeClass = this.options.activeClass;

  $previous.removeClass(activeClass);
  $elem.addClass(activeClass);

  callback && callback();
};

/**
 * ------------------------------------------------------------------------
 * Plugin Definition
 * ------------------------------------------------------------------------
 */

function Plugin(config) {
  return this.each(function () {
    var $this = $(this);
    var data = $this.data(DATA_KEY);
    var _config = $.extend({}, Tab.Default, $this.data(), typeof config === 'object' && config);

    if (!data) {
      data = new Tab(this, _config);
      $this.data(DATA_KEY, data);
    }

    if (typeof config === 'string') {
      if (typeof data[config] === 'undefined') {
        throw new TypeError('No method named "' + config + '"');
      }
      data[config]();
    }
  });
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(function () {
  Plugin.call($(Selector.DATA_TOGGLE));
});

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Plugin;
$.fn[NAME].Constructor = Tab;
$.fn[NAME].noConflict = function () {
  $.fn[NAME] = JQUERY_NO_CONFLICT;
  return Plugin;
};

return Tab;

})));
