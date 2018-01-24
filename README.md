# Tab

## TODO

* 滑块功能
* 自动切换
* 动态添加 Tab ?

## Usage

无需写任何 JavaScript 来激活 Tab , 只需在元素上简单的指定 `data-toggle="tab"` 和 `data-target="#ID"`。

一般来说，在写 Tab 的 DOM 结构式, 需要先手动的指定当前打开的 Tab 标签, 这可以通过指定样式类 `active` 来实现.

```html
<ul class="nav">
  <li><a href="javascript:void(0);" class="active" data-toggle="tab" data-target="#tab1-1">市场分析</a></li>
  <li><a href="javascript:void(0);" data-toggle="tab" data-target="#tab1-2">用户调研</a></li>
  <li><a href="javascript:void(0);" data-toggle="tab" data-target="#tab1-3">美图欣赏</a></li>
</ul>
<div class="content">
  <div id="tab1-1" class="content-item active">...市场分析内容...</div>
  <div id="tab1-2" class="content-item">...用户调研内容...</div>
  <div id="tab1-3" class="content-item">...美图欣赏内容...</div>
</div>
```

### 关于 DOM 结构

默认使用 `<ul>` 来包含一组标签, 你还可以通过 `data-tab-list` 来指定一组标签的父元素. 至于标签面板, 要求所有面板属于兄弟节点关系.

## Options

参数可以通过 data attributes 或者 JavaScript 两种方式来配置.

Name | Type | Default | Description
---- | ---- | ------- | -----------
trigger | string | `'click'` | 标签触发方式 `click|hover`.
delay | number | `150` | 标签的触发延时时长，当 `trigger` 为 `hover` 时才有效.
activeClass | string | `'active'` | 标签激活状态样式类.
tabList | string | `'[data-tab-list]'` | 标签父容器

## Methods

### `.tab(options)`

初始化 Tab 控件, 可以接受参数进行配置. 注意, 需要将一组 Tab 标签都初始化, 比如下面的代码中的 `$('.video-list a[data-tab]')` 代表了一组 Tab 标签.

```javascript
$('.video-list a[data-tab]').tab({
  trigger: 'hover',
  delay: 50
});
```

### `.tab('show')`

激活并显示某个 Tab 标签, 同时关闭同一组的其他标签.

```javascript
$('.nav li a:first').tab('show'); // 选择第一个标签
$('.nav li a:last').tab('show'); // 选择最后一个标签
$('.nav li:eq(2) a').tab('show'); // 选择第三个标签
```

## Event

Event Type | Description
---------- | -----------
show.fe.tab | 事件在标签显示时触发. 使用 `event.target` 和 `event.relatedTarget` 分别来定位当前活动标签和上一个选择的标签(如果有的话).
shown.fe.tab | 事件在标签显示完毕时触发. 使用 `event.target` 和 `event.relatedTarget` 分别来定位当前活动标签和上一个选择的标签(如果有的话).
hide.fe.tab | 事件在标签隐藏时触发. 使用 `event.target` 和 `event.relatedTarget` 分别来定位当前标签和将要显示的标签.
hidden.fe.tab | 事件在标签隐藏完毕时触发. 使用 `event.target` 和 `event.relatedTarget` 分别来定位当前标签和将要显示的标签.

```javascript
$('a[data-toggle="tab"]').on('shown.fe.tab', function (e) {
  // e.relatedTarget
  // e.target
})
```

# End

Thanks to [Bootstrap](http://getbootstrap.com/)