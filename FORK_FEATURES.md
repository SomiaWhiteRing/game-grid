# 本 Fork 的特性

本 Fork 基于 GameGrid，重点增强网格布局、单项信息表达和 Windows 本地使用体验。原项目已有的游戏搜索、图片上传、标题编辑与图片导出能力保持不变。

## 与原项目相比的主要改动

| 特性 | 说明 |
| --- | --- |
| 可修改网格列数 | 可在页面中选择 3–8 列；行数、单元格尺寸和导出画布高度会随内容自动计算。 |
| 自定义单项描述 | 每个项目除标题和名称外，还可单独填写描述；描述会显示在画布中并随项目数据保存。 |
| Windows 桌面版 | 增加 Electron 封装和便携版 EXE 构建流程，可在本地双击运行，不要求用户另行安装 Node.js。 |

## 可修改网格列数

页面提供“列数”选择器，当前支持 3、4、5、6、7、8 列，默认仍为 6 列。

- 修改列数后会立即重新排版。
- 总行数根据项目数量和列数自动计算。
- 封面保持 3:4 比例。
- 导出图片会使用新的布局，不会只改变网页预览。
- 每种界面的语言分别保存自己的主标题和列数设置。

## 自定义单项描述

每个网格项目新增独立的描述字段，可用于补充简评、理由、平台或游玩状态等信息。

- 点击项目中的描述区域即可编辑。
- 描述与项目名称、封面和分类标题一起绘制到导出画布。
- 描述保存到浏览器的 IndexedDB，重新打开页面后仍可恢复。
- 清除某个项目时，其描述也会一并清除。
- 新增的界面文字已同步到项目现有的多语言资源中。

## Windows 本地 EXE

本 Fork 使用 Electron 启动内置的 Next.js standalone 服务，并在桌面窗口中加载应用。

### 构建便携版

建议使用 Node.js 18 或更高版本，并统一使用 npm：

```bash
npm install
npm run build:desktop
```

构建完成后，可执行文件位于：

```text
dist/GameGrid-0.1.0-portable.exe
```

`dist/` 已加入 `.gitignore`，生成的 EXE 不会进入 Git 提交；仓库只保存源代码和构建配置。

### API 配置

游戏搜索仍依赖 SteamGridDB 或 Bangumi 的 API 配置。可以在 EXE 同级目录创建 `.env.local`：

```dotenv
STEAMGRIDDB_API_KEY=your_steamgriddb_api_key
BANGUMI_ACCESS_TOKEN=your_bangumi_access_token
BANGUMI_USER_AGENT=your_user_agent
```

未配置 API 时，仍可使用本地图片上传、文本编辑、布局调整和图片导出。

## 数据兼容与保存

- 项目内容继续使用 IndexedDB 保存。
- 主标题和列数使用 `localStorage` 按语言保存。
- 旧版全局设置会自动迁移到当前语言对应的设置中。
- 默认列数保持 6 列，已有用户不修改设置时仍使用原有布局习惯。

## 当前限制

- 当前桌面产物为 Electron Portable EXE，文件体积较大。
- Portable 版本启动时需要释放运行文件，并等待内置 Next.js 服务就绪，因此冷启动可能较慢。
- EXE 目前只配置了 Windows 构建目标。
- API 密钥不会打包进程序，需要使用者自行配置 `.env.local`。

## 相关命令

```bash
# 启动网页开发环境
npm run dev

# 构建网页生产版本
npm run build

# 使用 Electron 启动本地版本（需要先具备可用构建）
npm run desktop

# 构建 Windows Portable EXE
npm run build:desktop
```

## 本 Fork 的改动范围

- 动态网格布局与画布尺寸计算。
- 单项描述的数据类型、编辑交互、持久化和画布渲染。
- 新增功能对应的多语言文本。
- Next.js standalone 输出配置。
- Electron 启动入口、资源准备脚本与 electron-builder 配置。
- Windows 本地构建及使用说明。

