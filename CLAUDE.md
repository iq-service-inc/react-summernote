# CLAUDE.md — react-summernote 專案指南

`@iqs/react-summernote`:將 jQuery-based [Summernote](https://summernote.org) 0.8.18 WYSIWYG 編輯器封裝為 React 元件的 npm 套件。
目前版本 v2.3.24,作者 zap(LinZap),由 iq-service-inc 維護。

**深入文件在 [dev-docs/](dev-docs/)**:
- [01-architecture.md](dev-docs/01-architecture.md) — 核心架構、React↔jQuery 橋接、貼上處理管線
- [02-plugins.md](dev-docs/02-plugins.md) — Plugin 系統、patch 對應上游 issue、新增 plugin checklist
- [03-build-release.md](dev-docs/03-build-release.md) — 建置設定、CI、DEMO 上版與 npm 發佈 SOP
- [04-known-issues.md](dev-docs/04-known-issues.md) — 已知問題、技術債、行為陷阱
- [supportweb.md](dev-docs/supportweb.md) — 下游主要使用者 SupportWeb 的實際使用面與影響評估 checklist(可獨立提供給 SupportWeb 工程師)

使用者文件在 [README.md](README.md),plugin 使用說明在 [src/plugin/README.md](src/plugin/README.md)。

## 開發環境

- Node **v16.20.2** / npm 8.19.4(用 nvm 切換;webpack 4 在新版 Node 會建置失敗)
- 安裝依賴:`npm ci`(依 package-lock.json)

## npm scripts

| 指令 | 用途 |
|---|---|
| `npm start` / `npm run dev` | **主要開發模式**,dev server(port 888),入口 `src/start.js`(demo App) |
| `npm run build` | 打包套件 → `dist/main.js`(UMD)+ `plugin/`(prebuild 產生),發佈前執行 |
| `npm run web` | 打包 demo 網站 → `docs/`(GitHub Pages 用) |
| `npm run test` | dev server 測試「打包後」的套件(入口 `src/test.js`),非單元測試 |

## 架構一分鐘版

- `src/components/SummerNote.jsx` 是唯一核心元件:React 只負責 render 一個容器 `<div>`,
  之後由 `handleEditorRef` 呼叫 `$(node).summernote(options)` 初始化,
  `shouldComponentUpdate()` 永遠回傳 `false`——**DOM 完全交給 jQuery/Summernote 管理**,
  props 變更靠 `componentWillReceiveProps` 手動同步。
- 40+ 個 jQuery plugin 在 `src/plugin/`,由 `src/components/ImportCode.js` 統一載入
  (使用者呼叫 `SummerNote.ImportCode()` 觸發)。
- 最複雜、最容易出 bug 的區域:**貼上處理管線**(Word RTF / Excel / Firefox VML 三條特殊路徑),
  詳見 [01-architecture.md](dev-docs/01-architecture.md)。

## 開發鐵則

1. **新增 plugin 三件事**:在 `ImportCode.js` 登記 require、更新 `src/plugin/README.md`、
   檔名必須以 `summernote-` 開頭(prebuild 的 `bundle-plugins.js` 只打包符合 `summernote*.js` 的檔案)。
2. **勿手動修改 `docs/` 與 `plugin/`(套件根目錄)**——兩者都是建置輸出,會被 CleanWebpackPlugin 清空重建。
3. **既有檔名的 typo 不要改**:`src/plugin/custom/summerntoe-patch-createLink.js`(summerntoe)、
   `src/lib/trf2html.js`(trf)。前者是使用者會 require 的對外路徑,改名是 breaking change。
4. **4 個 patch plugin 是繞過上游 Summernote 0.8.18 的 bug**,各自檔頭註解有對應的上游 issue/PR;
   若上游發佈涵蓋修復的新版本,才可移除(見 [02-plugins.md](dev-docs/02-plugins.md))。
5. Commit message 遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hant/v1.0.0/)。
6. 修改元件行為後,用 `npm start` 開 demo 手動驗證(本專案沒有自動化測試)。
7. **主要下游是 SupportWeb**(`D:\Support6\SupportWeb`,25+ 處使用):改 CSS class、
   toolbar/popover DOM、ref API、ImportCode 順序前,先對照
   [supportweb.md](dev-docs/supportweb.md) 的契約清單評估影響。

## 發佈 SOP(摘要,詳見 [03-build-release.md](dev-docs/03-build-release.md))

1. 版號改兩處:`README.md`(Stable Version)與 `package.json`
2. 更新 `CHANGELOG.md`(格式參考既有條目,附 commit 連結)
3. push 到 `master` → 自動觸發 GitHub Pages 部署(DEMO 上版)
4. 發 GitHub Release(新 tag `vX.Y.Z`,內容貼 CHANGELOG + Full Changelog 比對連結)
   → 自動觸發 npm 發佈(OIDC trusted publishing,免 token)
