import $ from 'jquery';

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'tab';
const DATA_KEY = 'fe.tab';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api';
const JQUERY_NO_CONFLICT = $.fn[NAME];

const Event = {
  SHOW: `show${EVENT_KEY}`,
  SHOWN: `shown${EVENT_KEY}`,
  HIDE: `hide${EVENT_KEY}`,
  HIDDEN: `hidden${EVENT_KEY}`,
  MOUSEENTER: `mouseenter${EVENT_KEY}`,
  MOUSELEAVE: `mouseleave${EVENT_KEY}`,
  CLICK: `click${EVENT_KEY}`,
  CLICK_DATA_API: `click${EVENT_KEY}${DATA_API_KEY}`
};

const Selector = {
  DATA_TOGGLE: '[data-toggle="tab"]'
};

const Attr = {
  DATA_TARGET: 'data-target'
};

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

let timer;

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
  const that = this;
  const options = that.options;

  if (options.trigger === 'hover') {
    that.$elem.on(Event.MOUSEENTER, function() {
      clearTimeout(timer);
      timer = setTimeout(function() {
        that.show();
      }, options.delay);
    }).on(Event.MOUSELEAVE, function() {
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
  const activeClass = this.options.activeClass;
  const $elem = this.$elem;

  if ($elem.hasClass(activeClass)) {
    return;
  }

  const $target = $($elem.attr(Attr.DATA_TARGET));
  const $list = $elem.closest(this.options.tabList);
  const previous = $list.find(`.${activeClass}`)[0];

  const hideEvent = $.Event(Event.HIDE, {
    relatedTarget: $elem[0]
  });

  const showEvent = $.Event(Event.SHOW, {
    relatedTarget: previous
  });

  if (previous) {
    $(previous).trigger(hideEvent);
  }

  $elem.trigger(showEvent);

  if (hideEvent.isDefaultPrevented() ||
      showEvent.isDefaultPrevented()) {
    return;
  }

  this._activate($elem, $list);
  this._activate($target, $target.parent(), function () {
    const hiddenEvent = $.Event(Event.HIDDEN, {
      relatedTarget: $elem[0]
    });

    const shownEvent = $.Event(Event.SHOWN, {
      relatedTarget: previous
    });

    $(previous).trigger(hiddenEvent);
    $elem.trigger(shownEvent);
  });
};

Tab.prototype._activate = function ($elem, $container, callback) {
  const activeClass = this.options.activeClass;
  const previous = $container.find(`.${activeClass}`)[0];

  $(previous).removeClass(activeClass);
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
    const $this = $(this);
    let data = $this.data(DATA_KEY);
    const _config = $.extend({}, Tab.Default, $this.data(), typeof config === 'object' && config);

    if (!data) {
      data = new Tab(this, _config);
      $this.data(DATA_KEY, data);
    }

    if (typeof config === 'string') {
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
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
}

export default Tab;
