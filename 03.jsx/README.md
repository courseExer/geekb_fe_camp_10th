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

autoplay执行的逻辑被分散在了各处，如何利用设计模式让代码更加集中一些呢

当前未考虑组件的生命周期以及元素的解绑

使用classname来做transition的问题主要在于：
- transitionTime是可以配置的，但还需要传值给css变量，虽然可以通过css变量来实现，但还是js中统一处理更好些
- 这个主要还是从使用者角度来看，如何配合更加容易落地
后续全部用style来做吧

## 封装动画

### 问题：
开头几个轮空的tick，需要排查下问题
时间线我当前做成永不停止，这样比较好理解些。但从性能上来说，平白浪费了资源了，后续改为cancelRequestAnimation吧

Object.create(event)
如果将event对象作为原型对象，创建的对象怪怪的：
- 实例对象的属性不对
- const {xx,yy} = newevent，居然报错“Illegal invocation”（非法调用），why？？？

### 其他：
使用requestAnimationFrame时我曾有个疑惑，就是动画在高刷新率的设备和低刷新率的设备上，会不会有快慢之别？
实际上具体看你的实现了，只要时间是一致的动画的播放就不会有快慢之分，只有丝滑与否的区别。
目标上，我们需要将startValue递增或递减到endValue
手段上，让将时间戳差值参与计算，从startTime到startTime+durationTime

我们使用js来实现timeline的功能，目的是替换css的transition。
从api设计上我们可以参考它

chrome浏览器的pc版对触点的支持不好（仅支持一个），虽然mbp的触控板支持多触点
因此pc版中打开devtool切换为mobile模式，仍然是一个触点。
正确的测试应该是去手机的chrome上测试
