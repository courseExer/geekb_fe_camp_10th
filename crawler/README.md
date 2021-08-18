# 标准文档的爬虫

## 需求

css 标准文档比较分散，做一个爬虫来整合原数据
具体的使用场景待定...

## 架构(data, tpl);

- 下载
- 解析
- 生成 html 文档查看

## 待解决

process 模块的属性和方法

console.log(process.env[1])
console.log(process.argv)

## 优化项

设置一张表(caches)，用来记录已缓存的文件名（不含 hash）和 hash 值的关系

check，检查 tmp 文件夹和 cache 文件夹中文件的 hash 值。若有不同，则列出来。
download，下载到 tmp 文件夹中去（覆盖）。调用 check
parse，调用 check。解析出 matcher 定义的数据
view，生成视图
