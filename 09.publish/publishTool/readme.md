# publishTool

## 需求说明

## 架构说明

## server 端 3000

## publishServer 端 8000

鉴权操作：

- 路由：
  - auth：
    - 接收 code 参数，然后拿 code、client_id、client_secret 来换 access_token
    - 使用 github 接口（带上 access_token）查询用户信息
    - 查询用户的权限

发布操作：

- 路由：
  - publish
    - 发布

## publishTool 端
