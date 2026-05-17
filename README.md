# Social-Media-CLI
Command Line utility for Social Media publishing & statistic

基于 OpenCLI 的最小版跨平台内容互动数据抓取子命令（MVP）。

## 支持情况

- B站：优先走 `opencli bilibili video`
- 小红书：优先走 `opencli xiaohongshu note` / `comments`
- 抖音 / 微信公众号 / 微信视频号：先走 `opencli web read` 通用兜底

## 技术栈

- TypeScript 6
- PNPM 11
- 命令行参数：`commander-jsx`
- 内部命令调用：`zx`

## 前提

1. 安装 Node.js 22+
2. 安装 OpenCLI：`npm install -g @jackwener/opencli`
3. 按 OpenCLI 官方文档安装并启用 Browser Bridge 扩展
4. Chrome 中保持相关平台登录态

## 安装

```bash
npm i social-media-cli -g
```

## 用法

完整命令：

```bash
social-media statistic "https://www.bilibili.com/video/BVxxxxxxxxx"
social-media statistic "https://www.xiaohongshu.com/explore/xxxxxxxx"
social-media statistic "https://mp.weixin.qq.com/s/xxxxxxxx"
social-media statistic "https://www.douyin.com/video/xxxxxxxx"
```

缩写别名：

```bash
sm stats "https://www.bilibili.com/video/BVxxxxxxxxx"
```

可强制平台：

```bash
social-media statistic "https://example.com/post/1" --platform generic
```

## 输出结构

- `url`
- `platform`
- `title`
- `author`
- `publishedAt`
- `contentType`
- `statistic.like`
- `statistic.favorite`
- `statistic.share`
- `statistic.comment`
- `statistic.view`
- `statistic.coin`
- `comments`
- `raw`
- `notes`

## 注意

这不是官方 API 客户端。字段可得性取决于：

- OpenCLI 当前适配器能力
- 页面是否公开展示该数据
- 浏览器登录态
- 平台反爬和页面改版
