# component system

## 完成组件的功能

不在节点上监听事件而是在 document 上监听，因为鼠标拖拽时有可能离开 carousel，用户的直觉应该是继续拖动而不是戛然而止。
现代浏览器中去监听 documnt 还有一个额外好处，就是即使鼠标离开了浏览器仍然能够监听到。这个特性能够让体验更加好。

花了好久排查另一个问题，就是在滑动几次之后使用 click 进行轮播，发现顺序会乱。devtool 上调试了好久没有看到逻辑上有什么问题。
后来睡觉的时候才想起来：
mouseup 时有异步的 updateSlide，而 click 则没有写 updateSlide，居然也能实现轮播之后的 slide 更新。
这说明 click 一直在依靠 mouseup 事件在起作用啊，解决：

- mouse 事件和 click 事件做下相斥操作，只能生效一个
- 更新操作在每个事件中有且只有一次

美中不足的是，幻灯片更新中将居中的图片移除后再放入。这样逻辑是简单了屏幕上也看不到，但性能上可否再优化下？

autoplay 执行的逻辑被分散在了各处，如何利用设计模式让代码更加集中一些呢

当前未考虑组件的生命周期以及元素的解绑

使用 classname 来做 transition 的问题主要在于：

- transitionTime 是可以配置的，但还需要传值给 css 变量，虽然可以通过 css 变量来实现，但还是 js 中统一处理更好些
- 这个主要还是从使用者角度来看，如何配合更加容易落地
  后续全部用 style 来做吧

## 封装动画

### 问题：

开头几个轮空的 tick，需要排查下问题
时间线我当前做成永不停止，这样比较好理解些。但从性能上来说，平白浪费了资源了，后续改为 cancelRequestAnimation 吧

Object.create(event)
如果将 event 对象作为原型对象，创建的对象怪怪的：

- 实例对象的属性不对
- const {xx,yy} = newevent，居然报错“Illegal invocation”（非法调用），why？？？

### 其他：

使用 requestAnimationFrame 时我曾有个疑惑，就是动画在高刷新率的设备和低刷新率的设备上，会不会有快慢之别？
实际上具体看你的实现了，只要时间是一致的动画的播放就不会有快慢之分，只有丝滑与否的区别。
目标上，我们需要将 startValue 递增或递减到 endValue
手段上，让将时间戳差值参与计算，从 startTime 到 startTime+durationTime

我们使用 js 来实现 timeline 的功能，目的是替换 css 的 transition。
从 api 设计上我们可以参考它

chrome 浏览器的 pc 版对触点的支持不好（仅支持一个），虽然 mbp 的触控板支持多触点
因此 pc 版中打开 devtool 切换为 mobile 模式，仍然是一个触点。
正确的测试应该是去手机的 chrome 上测试

## 应用

要做的几件事：

- framework 文件中的架构调整
- 应用手势库
- 应用动画库 替换 css 动画
- ？？

touch-action 这个 css 属性对于触屏来说太重要了，属性可以组合，来应对 ios 下的所有浏览器有 touch 相关默认行为的问题，可以定制解决方案

css transition动画（A） 和 去css transition（B） 两种思维方式的优劣：
- A方案更加简单直观，性能好
- B方案复杂，性能损耗也较多（tick一直在狂跑），但细节可控性更好
以下记录一些细节：
？？
### 问题

gesture 在 pc 模式下，pan 的数量明显比 mobile 模式下要多，而且有延时现象

引入timeline之后，发现动画相比css transition不那么流畅，如果carousel尺寸越大则越明显
思考原因是：
设备支持60fps，但仍然没有GPU加速那么的顺畅，而css默认是支持的

最终使用写入`tranform:translate3d(${xxx}px,0,0)`来解决问题，一来可以像素级控制移动，二来利用css的gpu加速

## Attribute 的设计改良
