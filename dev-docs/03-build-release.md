# 03 — 建置與發佈

## 開發環境

- Node **v16.20.2** / npm **8.19.4**(README 指定;webpack 4 + 舊 loaders 在新版 Node 會失敗)
  ```bash
  nvm install v16.20.2 && nvm use v16.20.2
  npm ci   # 依 package-lock.json 安裝,不要用 npm install 以免動到 lockfile
  ```
- 本專案**沒有自動化測試**;`npm run test` 是開 dev server 人工驗證打包產物,驗證一律手動。

## npm scripts 與 webpack 設定對照

| script | config | entry | 輸出 | 用途 |
|---|---|---|---|---|
| `npm run build` | [webpack.prod.js](../webpack.prod.js) | `src/index.js` | `dist/main.js` + `dist/main.css` | 發佈用套件本體 |
| (prebuild 自動跑) | [src/plugin/bundle-plugins.js](../src/plugin/bundle-plugins.js) | 各 plugin | 套件根目錄 `plugin/` | 發佈用 plugin 檔 |
| `npm run web` | [webpack.web.js](../webpack.web.js) | `@babel/polyfill` + `src/start.js` | `docs/` | GitHub Pages demo 網站 |
| `npm start` / `npm run dev` | [webpack.dev.js](../webpack.dev.js) | `src/start.js` | dev server(**port 888**) | 日常開發 |
| `npm run test` | [webpack.test.js](../webpack.test.js) | `src/test.js` | dev server(port 888) | 驗證打包後產物 |

共用設定 [webpack.common.js](../webpack.common.js):
- babel-loader(jsx/js)、stylus、css、file-loader(圖片/字型)
- `ProvidePlugin`:`$`、`jQuery`、`store` 全域注入(**所以原始碼直接用 `$` 不需 import**;
  宿主專案也要照 README 設定同樣的 ProvidePlugin)
- alias:`react-summernote` → 專案根目錄(demo 內 `require('react-summernote/plugin/...')`
  實際上是引用本地檔案)

### webpack.prod.js 重點

- 輸出 UMD library(name `summernote`)
- **externals**:`react`、`react-dom`、`prop-types`、`jquery`、`rtf.js`,
  以及 regex `/bootstrap/`、`/summernote/`——peer dependencies 不打包進 `dist/main.js`。
  注意 `popper.js` **不在** externals,會被打包進去。
- CSS 由 MiniCssExtractPlugin 抽成 `dist/main.css`(使用者要另外 import)
- CleanWebpackPlugin 每次清空 `dist/`

### prebuild:bundle-plugins.js

`npm run build` 前自動執行(`prebuild` script,`cd src/plugin && node bundle-plugins.js`):

1. 掃描 `src/plugin/` 下所有子目錄
2. 檔名符合 `summernote(.)*\.js` 的 → 用 webpack + babel 逐檔轉譯,
   輸出到**套件根目錄 `plugin/`**(保留子目錄結構;externals 排除 jquery)
3. 其他檔案(css、字型、README…)→ 原樣複製
4. CleanWebpackPlugin 每次清空 `plugin/`

`plugin/` 與 `dist/` 都不進 git,發佈時由 CI 產生。使用者文件裡
`require('react-summernote/plugin/...')` 指的就是這個轉譯後目錄;
`require('@iqs/react-summernote/src/plugin/...')` 則是未轉譯原始碼(README 提供的備援路徑)。

## 發佈到 npm 的內容物

[.npmignore](../.npmignore) 排除:`.github`、`docs`、`www`、`.babelrc`、`postcss*`、
`webpack*`、`react-summernote.png`、`src/start.js`、`src/test.js`、`src/index.css`、`src/img/**/*`。

實際會發佈:`dist/`(main.js/main.css)、`plugin/`(prebuild 產物)、`src/`(其餘原始碼
與 `.d.ts` 型別)、`package.json`、`README.md`、`CHANGELOG.md`、`LICENSE.md`。
`package.json`:`main: dist/main.js`、`types: src/index.d.ts`。

## GitHub Workflows

在 [.github/workflows/](../.github/workflows/):

### deploy-pages.yaml — Deploy Master Branch to Github Pages

- 觸發:push 到 `master`(或手動 workflow_dispatch)
- Node 16.x → `npm ci` → `npm run web` → Jekyll build → 部署 `docs/` 到
  [iq-service-inc.github.io/react-summernote](https://iq-service-inc.github.io/react-summernote/)

### publish-npm.yaml — Publish Package to npmjs

- 觸發:GitHub Release **published**
- 兩段式 Node 版本(重要):
  1. **Node 16.x** 執行 `npm ci` + `npm run build`(webpack 4 只能在舊 Node 跑)
  2. 切到 **Node 24.x** 執行 `npm publish --provenance --access public --ignore-scripts`
     - OIDC trusted publishing,**不需要 npm token**
     - `--ignore-scripts`:避免 publish 階段在 Node 24 重跑 `prepublishOnly`(webpack build)而報錯
     - `--provenance`:產生來源證明

## 發佈 SOP(完整版)

1. 確認 `master` 上要發佈的變更已完成,`npm start` 手動驗過
2. 版號改**兩處**:[README.md](../README.md) 的 `Stable Version` 與 [package.json](../package.json) 的 `version`
3. 更新 [CHANGELOG.md](../CHANGELOG.md):新版塊放最上面,格式照舊
   (`## [X.Y.Z](compare 連結)(日期)` + `### feat` / `### fix` 分類 + commit 連結)
4. push 到 `master` → 自動觸發 Pages 部署(DEMO 上版),等 workflow 綠燈
5. 到 GitHub 發 [Release](https://github.com/iq-service-inc/react-summernote/releases):
   - 建新 tag `vX.Y.Z`,標題同 tag
   - 內容貼 CHANGELOG 該版內容,最後附
     `**Full Changelog**: https://github.com/iq-service-inc/react-summernote/compare/v舊...v新`
6. Release 發佈 → 自動觸發 npm publish workflow,等綠燈後到
   [npmjs.com/@iqs/react-summernote](https://www.npmjs.com/package/@iqs/react-summernote) 確認新版

### 疑難排解

- publish 出現 `404 Not Found - PUT https://registry.npmjs.org/@iqs%2freact-summernote`:
  OIDC 信任設定或 npm 權限問題(舊時代則是 token 過期),到 npm 套件設定檢查 trusted publisher
- 本機 build 失敗、報 webpack/loader 錯誤:先確認 Node 版本是 16.x
- Pages 部署後 demo 壞掉:`npm run web` 在本機重現,檢查 `docs/` 產物
