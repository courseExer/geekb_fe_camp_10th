# README

一款麻雀虽小但五脏俱全的 cli 浏览器
了解浏览器业务域的相关知识

## 存在的问题

测量长度使用的方法的区别：

- Buffer.byteLength(Buffer | String)
- this.body.toString().length ，是万能的吗？

## 产品特征

- 输入 command 和 options
  - 网址
  - 文件地址
- 输出 bitmap
  - 终端
  - 图片文件
- 程序可配置
- 中间件可编程（使用内置模块的接口）

## 具体特性

- request 模块的接口设计，参考下 fetch 和 axios
- 解析器模块的设计
  - responseParser ？
  - bodyParser
    - 根据 Transfer-Encoding 区分报文体格式格式
      - chunked
      - non-chunked
  - typeParser
    - 根据 Content-Type 解析 bodyText
- AST
  - 数据结构
  - dom 树
  - css 属性挂载
  - 布局计算
- 绘制 bitmap
- 文件输出
  - 显示在终端
  - 生成文件

## 安装

## 使用

## (待整理...)

terminal-image ： Works in any terminal that supports colors.

当 socket 源源不断获得 chunk-data 时，response 解析器和 body 解析器会分工进行逐字符的分析，最后按照 content-type 的不同返回不同的内容。
statusLine 是按行解析的（有且只有一行），解析完毕后就返回 Object；
headers 是按行解析的，解析完一行就返回 Object；
当 headers 解析完毕之后，我们是知道 content-length 和 content-type 的：
如果 connection 实例（net）收到 content-length，那么 body 部分是没有长度标识的；
如果 connection 实例没有收到， 那么 body 部分是有长度标识的。具体就是在 body 最上方格式为“[十六进制数字]\r\n”

在 Transfer-Encoding = chunked 时，为了最大程度的及时响应，我想采用逐个字符的流式解析返回；

内外模块必须要通信：
内部需要将解析后的产物或者状态传递给外层，比如状态行解析完毕、headers 解析完毕、body 解析中以及完毕等等
外层需要将待解析的物质传递给内部去解析
消息通信有两种实现方式：

- 函数的调用和返回
  这种比较直观，理解起来就是代码的封装
  函数调用的时机或者说获知内部模块状态的时机，取决于 connection 的 chunk-data 以及中间模块的遍历.这决定了你拿不拿得到的问题以及拿的频率的问题
  如果最外层模块想要获得内容的解析状态，那么不得不层层传递

- 发布订阅
  就像在出发层和目标层之间插了一根管子，发的人很爽、收的人很爽，可以多对一，但 eventName 需要有一个提前规划，否则管理起来不太舒服

我想比较可靠的书写应该是，如果层级不是那么复杂，模块变动不是那么频繁，那么就先同步写吧；
直到遇到层级复杂，层层传递冗余，那么在最需要的地方插一根管子使用 event 来做会比较好，但要做好 eventname 的管理以及节制使用

为了更快返回结果，需要判断 content-type 是什么类型的内容，然后以特定方式返回；
Transfer-Encoding 和 Content-Encodings 的概念需要了解下

---

传输编码为 chunked 时候的报文格式,称为 chunked 分片
传输编码为非 chunked 时候的报文格式，称为 non-chunked 分片
两个分片的结构是不同的
