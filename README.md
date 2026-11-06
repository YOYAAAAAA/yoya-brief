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

## IP / CONTENT / STYLE

- **IP v1.0.0（锁定）**：logo、红切角、色板、三种字体、纹理、5 种版面、导航/进度、红色语义、免责页、合同。
- **CONTENT（可改）**：01/02/03/06/08/09/10 的字段值与文案、标题。
- **STYLE（预设）**：04/05/07 的页面规则、导航、纹理、红色强度、字体、输出、动效勾选。
- 每节标题旁有 `CONTENT` / `IP 预设` / `IP 参考` 标签；合同里写 `IP_VERSION: 1.0.0` 和 `CHANGE SCOPE: CONTENT ONLY`。
- 改文案只动 CONTENT；改 IP 必须由用户明确说“改 IP”，并升版本号。Agent 不得自行改 IP。

## 规则

- **页数不是固定的**：`tool.html` 里是示例；导出时选「按内容自动」，AI 按 CONTENT 的信息量决定页数，5 种版面循环，导航/进度按实际页数生成。
- `.md` 分 `READ FIRST`（先读 logo/素材文件夹，读不到就提示下载 zip）、`CONTENT`（只改文本/标题/素材/需求/文案）、`STYLE`（已选风格）、`CONTRACT`（锁定 logo/色板/字体/纹理/版式/导航/动效）、`BUILD STEPS`、`ACCEPTANCE`、English digest。
- 复制/打包出的构建指令顶部会要求 AI 先读 `F:\Practice_New\LOGO`；读不到时**不要生成**，直接提示下载 `yoya-brief-share.zip` 或整个 `share` 文件夹。页面自身也会在素材缺失时弹提示。
- 导出是**本地**的：复制走剪贴板，zip 走浏览器本地打包；没有服务器，不上传内容。
- 字体走 Google Fonts（Noto Sans SC 900 / Noto Serif SC / Inter Tight）；没网会回退系统字体，导出本身不受影响。
- 展示版不是安全系统：静态页面的源码仍可看。真要防住，用登录/密码或只发截图。

## GitHub Pages（已上线）

- 展示版：https://yoyaaaaaa.github.io/yoya-brief/
- 使用版：https://yoyaaaaaa.github.io/yoya-brief/tool.html
- 仓库：https://github.com/YOYAAAAAA/yoya-brief

复刻方法（**不需要 workflow**）：

1. 新建 public 仓库，把 `share/` 里的全部文件传到根目录（不要传整个 `LOGO`，PSD/原图会超限）。
2. Settings → Pages → **Deploy from a branch** → `main` / `(root)` → Save。
3. 线上 `/` 是展示版，`/tool.html` 是使用版。
4. 联网打开 `tool.html` 时，导出的 `.md` 会自动写公开资产 URL；远程 AI 能取图。
5. 本仓库为了避开 `workflow` 授权，使用 branch 部署；以后要换 Actions，再把 Source 改成 GitHub Actions 并加 `pages.yml`。

GitHub Pages 是公开的；`tool.html` 只是没在展示版里链接，不是权限控制。真要限制，用 Cloudflare Access / Netlify 密码。

## 想改

- **文案/字段**：只改 CONTENT 区；同步 `tool.html` 与 `index.html`。
- **风格**：在 04/07 里选预设，不直接改 IP 变量。
- **改 IP**：必须由用户明确说“改 IP”并升版本号；改 `:root`、5 种版面、导航、免责、合同，改完把 `IP_VERSION` 升到新版本。
- 图片：替换 `assets/img/` 同名文件；版式搜索 `/* ===== BANDS ===== */`，5 种版面在 `data-lay` 的 CSS 里。
- 展示版一定不要加回导出按钮、`#out`、`buildBrief()`；它的定位就是“可填、不可导出”。
