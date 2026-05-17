# opencli-social-stats

基于 OpenCLI 的最小版跨平台内容互动数据抓取工具（MVP）。

## 支持情况

- B站：优先走 `opencli bilibili video`
- 小红书：优先走 `opencli xiaohongshu note` / `comments`
- 抖音 / 微信公众号 / 微信视频号：先走 `opencli web read` 通用兜底

## 技术栈要求

- TypeScript（`next`，对应 TS 6 线）
- PNPM（package manager 标记为 `pnpm@11`）
- 命令行参数：`commander-jsx`
- 内部命令调用：`zx`

## 前提

1. 安装 Node.js 20+
2. 安装 OpenCLI：`npm install -g @jackwener/opencli`
3. 按 OpenCLI 官方文档安装并启用 Browser Bridge 扩展
4. Chrome 中保持相关平台登录态

## 安装

```bash
pnpm install
pnpm build
pnpm link --global
```

## 用法

```bash
social-stats "https://www.bilibili.com/video/BVxxxxxxxxx"
social-stats "https://www.xiaohongshu.com/explore/xxxxxxxx"
social-stats "https://mp.weixin.qq.com/s/xxxxxxxx"
social-stats "https://www.douyin.com/video/xxxxxxxx"
```

可强制平台：

```bash
social-stats "https://example.com/post/1" --platform generic
```

## 输出结构

- `url`
- `platform`
- `title`
- `author`
- `publishedAt`
- `contentType`
- `stats.like`
- `stats.favorite`
- `stats.share`
- `stats.comment`
- `stats.view`
- `stats.coin`
- `comments`
- `raw`
- `notes`

## 注意

这不是官方 API 客户端。字段可得性取决于：

- OpenCLI 当前适配器能力
- 页面是否公开展示该数据
- 浏览器登录态
- 平台反爬和页面改版
