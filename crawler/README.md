# 标准文档的爬虫

## 需求

指定了来源和过滤规则之后，爬取到相关的语言标准的定义（单元）的元数据
这些数据如何整合，还没想好

## 架构 - 爬取、解析、阅读

usage

```javascript
const crawler = new Crawler({ cachePath });
crawler.download(url, dest); // 下载html文档
crawler.parse(File, matcher); // 解析文档，返回数据
function matcher(content) {
  // todo
  return data;
}
crawler.view(data, tpl);
```

## 待解决

process 模块的属性和方法

console.log(process.env[1])
console.log(process.argv)
