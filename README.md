# YOYA 项目简报 · 分享包

两个入口，别搞混：

- **`index.html` = 展示版**：可以填、可以勾，顶部固定 `DEMO / 展示版 · 不提供导出`，**没有导出按钮**。给外人看。
- **`tool.html` = 使用版**：复制给 AI / 存 `.zip`。给朋友、给自己用。

## 怎么发

- 把**整个 `share` 文件夹**打包发出去，或直接发 `yoya-brief-share.zip`。
- 不要只发 HTML：图片在 `assets/img/`，纹理和动效库在 `motion/lib/`，缺了会裂图。
- 对方解压到任意位置都能用，页面路径全是相对路径。

## 对方怎么用（不用懂文件）

1. 打开 `tool.html`（Chrome / Edge）。
2. 01–11 填内容，04 选风格，07 勾动效。
3. 点右上「**复制给 AI**」——构建指令直接进剪贴板。
4. 打开 AI 对话框，粘贴。不需要下载、解压、找文件。

如果要给本地 AI，或想留一份可归档的包：点「**存 .zip**」。
zip 里是 `构建指令.md` + `index.html` + `tool.html` + `assets/` + `motion/` + `README.md`；
浏览器本地打包，不联网、不上传。

> 本地 `file://` 打开时浏览器不允许 fetch 打包，`存 .zip` 会提示改用在线版或直接复制。
> 在线（GitHub Pages / 本地 HTTP）打开时正常。

## 文件结构

```
share/
├─ index.html                 展示版（可填，不导出）
├─ tool.html                  使用版（复制 / 打包）
├─ assets/img/                主标、图形标、墙面、细节图、favicon
├─ motion/lib/                22 个动效库 + 等高线纹理瓦片
└─ README.md
```

## 规则

- **页数不是固定的**：`tool.html` 里是示例；导出时选「按内容自动」，AI 按 CONTENT 的信息量决定页数，5 种版面循环，导航/进度按实际页数生成。
- `.md` 分 `CONTENT`（只改文本/标题/素材/需求/文案）、`STYLE`（已选风格）、`CONTRACT`（锁定 logo/色板/字体/纹理/版式/导航/动效）、`BUILD STEPS`、`ACCEPTANCE`、English digest。
- 导出是**本地**的：复制走剪贴板，zip 走浏览器本地打包；没有服务器，不上传内容。
- 字体走 Google Fonts（Noto Sans SC 900 / Noto Serif SC / Inter Tight）；没网会回退系统字体，导出本身不受影响。
- 展示版不是安全系统：静态页面的源码仍可看。真要防住，用登录/密码或只发截图。

## 传 GitHub Pages（联网版）

1. 新建 **public** 仓库，把 `share/` 里的全部文件传到根目录（不要传整个 `LOGO`，PSD/原图会超限）。
2. `.github/workflows/pages.yml` 用教程里的 30 行静态站工作流，`path: .`。
3. Settings → Pages → Source = **GitHub Actions**。
4. 线上：
   - `/` → 展示版
   - `/tool.html` → 使用版
5. 联网打开 `tool.html` 时，导出的 `.md` 会自动写公开资产 URL；远程 AI 能取图。

GitHub Pages 是公开的；`tool.html` 只是没在展示版里链接，不是权限控制。真要限制，用 Cloudflare Access / Netlify 密码。

## 想改

- 文案：改 `tool.html` 的中文；再把同样的文案同步到 `index.html`（展示版）。
- 颜色/字体：只改两份文件的 `:root` 变量。
- 图片：替换 `assets/img/` 同名文件。
- 版式：搜索 `/* ===== BANDS ===== */`，5 种版面在 `data-lay` 的 CSS 里。
- 展示版一定不要加回导出按钮、`#out`、`gen()`；它的定位就是“可填、不可导出”。
