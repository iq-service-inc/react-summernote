# 02 — Plugin 系統

Plugin 全部在 [src/plugin/](../src/plugin/)。**每個 plugin 的使用方式與選項已詳載於
[src/plugin/README.md](../src/plugin/README.md)(800+ 行,含範例),本文不重複**,
只記錄維護視角需要的資訊:結構、慣例、patch 的存在原因與移除條件、新增流程。

## 目錄結構

目錄分類由 [Awesome Summernote](https://github.com/summernote/awesome-summernote) 訂定;
IQS 自製的放 `custom/`。

```
src/plugin/
├── README.md                  # plugin 使用文件(新增 plugin 必須更新)
├── bundle-plugins.js          # prebuild 打包腳本(見 03-build-release.md)
├── custom/        (18 個 js)  # 自製 plugin 與上游 patch
├── formatting/    (9 個 js)   # 文字/圖片/影片格式
├── insert/        (3 個 js)   # 內容插入
├── misc/          (4 個 js + font/)  # 表格、列印、尋找取代、草稿
├── lang/                      # summernote-zh-TW.js(自家繁中語言包)
├── emoji/                     # ext-emoji-ajax(未預設載入)
├── special_characters/        # ext-specialchars(被 custom 版取代,未預設載入)
└── syntax/                    # ext-highlight(棄用,未預設載入)
```

哪些有被 `ImportCode.js` 預設載入,見 [01-architecture.md](01-architecture.md#importcode-載入順序)。

## 註冊慣例

所有 plugin 都是 UMD wrapper(AMD / CommonJS / browser globals)包住:

```js
(function (factory) { /* UMD 樣板 */ }(function ($) {
    $.extend($.summernote.plugins, {
        'pluginName': function (context) {
            // context.layoutInfo:$note/$editor/$editable/$toolbar 等 jQuery 物件
            // context.options:合併後設定(含 langInfo)
            // context.modules:editor 內部模組
            // context.invoke('editor.xxx', ...):呼叫編輯器指令
            // context.memo('button.xxx', fn):註冊 toolbar 按鈕
        }
    })
}))
```

命名規範(README「For contributor」段落也有載明):
- 檔名以 `summernote-` 開頭——**這同時是 `bundle-plugins.js` 的打包條件**
  (regex `summernote(.)*\.js`,不符合的 js 檔不會被 babel 轉譯,只會被當靜態檔複製)
- plugin 名、按鈕名用**小駝峰**(如 `customCleaner`、`jTable`)
- 語言字串放 `context.options.langInfo`,預設附繁中(zh-TW)

## Patch plugins(繞過上游 bug,重點維護對象)

四個 patch 用「覆寫上游函式」的方式修 Summernote 0.8.18 的 bug,而不是 fork 上游。
每個檔頭註解都有上游來源連結。**移除條件:上游發佈涵蓋該修復的新版本,且本套件升級到該版**。

| 檔案 | 覆寫對象 | 修什麼 | 上游來源 |
|---|---|---|---|
| [summernote-patch-dom.js](../src/plugin/custom/summernote-patch-dom.js) | `dom.walkPoint`、`dom.nextPointWithEmptyNode` | 字體/字型樣式無法套用到框選範圍全部節點(Ctrl+A 改樣式會漏) | [issue #4471](https://github.com/summernote/summernote/issues/4471)、[PR #4472](https://github.com/summernote/summernote/pull/4472)、[PR #4667](https://github.com/summernote/summernote/pull/4667) |
| [summernote-patch-handle.js](../src/plugin/custom/summernote-patch-handle.js) | `modules.handle.update` | 圖片選取控制框位置偏移,改用 `getBoundingClientRect()` 計算 | [issue #4242](https://github.com/summernote/summernote/issues/4242)、[PR #4283](https://github.com/summernote/summernote/pull/4283) |
| [summernote-patch-buttons.js](../src/plugin/custom/summernote-patch-buttons.js) | `buttons.colorPalette` | 同頁多編輯器時開錯調色盤(色盤缺唯一 id) | [PR #3910](https://github.com/summernote/summernote/pull/3910) |
| [summerntoe-patch-createLink.js](../src/plugin/custom/summerntoe-patch-createLink.js)(⚠️ 檔名 typo,勿改) | 連結建立流程(plugin 名 `customCreateLink`) | 建立/編輯連結未正確觸發 onChange;自動判斷 scheme(email→`mailto://`、電話→`tel://`、無 scheme→`http://`);v2.3.16+ 支援編輯既有連結的屬性調整 | 自製,非上游 patch |

> 檢查上游進度:上游 repo 在 https://github.com/summernote/summernote ,本機
> `D:\Node\summernote\summernote` 有一份 0.9.1 原始碼可參考(見 [04-known-issues.md](04-known-issues.md))。

## 各 plugin 維護須知

僅列「維護時需要知道、README 沒寫清楚」的部分;功能說明請看
[src/plugin/README.md](../src/plugin/README.md)。

### custom/

| Plugin | 按鈕名 | 維護須知 |
|---|---|---|
| summernote-custom.js | `customUL` | 也負責:選色後自動關閉色盤、表格 popover 中文化 |
| summernote-custom-font.js | `customFont` | **customStyle 與 ext-table(v2.3.0+)的相依對象**;支援顯示名與 CSS 值分離的字體清單;`baseFontStyle` 依賴它的 `updateCurrentStyle` 指令 |
| summernote-custom-style.js | `customStyle` | 使用者自訂樣式預設集(上限 5 組),存 localStorage(key 預設 `summernote-stylelist`),可用 `onGetList`/`onSave` 接後端 |
| summernote-custom-cleaner.js | `customCleaner` | 清除樣式但預設排除 `jtable table-bordered summernote-comment-popover-anchor` class(保護表格與註解錨點) |
| summernote-fontsize-input.js | `fontsizeInput` | **CHANGELOG 出現頻率第二高的 plugin**(游標定位、span 合併、數值判斷都修過);會合併相鄰同樣式 span;`baseFontStyle` 依賴它的 `updateFontsizeInput` 指令 |
| summernote-copy-formatting.js | `copyFormatting` | 複製格式刷,依元素類型(TABLE/LIST/PUREPARA/SPAN/A)分別記錄結構;ESC 取消 |
| summernote-comment-popover.js | `editPopover` / `removePopover` | 產生的錨點需要**宿主專案自行初始化** hover popover(`$('.summernote-comment-popover-anchor[data-toggle="popover"]').hoverPopover()`) |
| summernote-custom-contextmenu.js | (右鍵選單) | 可設定按鈕群組/子選單;表格操作按鈕只在游標於表格內時顯示 |
| summernote-custom-paste.js | (事件驅動) | 貼上時把同網域絕對網址轉相對路徑;掛在 `summernote.paste`/`summernote.change` 事件 |
| summernote-imagemap.js | `imageMap` | 圖片熱區編輯;v2.3.8 修過 dialog 未銷毀的 memory leak |
| summernote-toc.js | `anchor`/`toc`/`editAnchor`/`markAnchor` | 錨點+目錄;錨點 class `note-toc-anchor`;快捷鍵 Ctrl+Shift+A |
| summernote-pastehtml.js | `pasteHTML` | 於游標插入原始 HTML |
| summernote-custom-specialchars.js | `customSpecialChar` | fork 自官方 ext-specialchars,改善行動裝置支援 |
| summernote-view-classlist.js | (除錯工具) | 點元素顯示其 class,除錯樣式用 |

### formatting/

- `summernote-image-attributes`(`imageAttributes`)、`summernote-image-captionit`(`captionIt`)、
  `summernote-image-shapes`(`imageShapes`):**都被 SummerNote.jsx 的預設 image popover 引用**,
  改名/移除會連動。
- `summernote-video-attr-setter`(`videoAttrSetter`):v2.2.20 起**取代**同目錄的
  `summernote-video-attributes.js`(舊檔保留但未載入,屬既有死碼,留待作者決定移除)。
- 其餘:`addclass`、`case-converter`、`list-styles`(+css)、`pagebreak`(搭配 ext-print)。

### insert/

- `summernote-at-mention`:`@` 自動完成,callback `summernoteAtMention.getSuggestions`;用到全域 `store`
- `summernote-file`(`file`):檔案上傳/URL 插入,callbacks `onFileUpload`/`onFileLinkInsert` 等
- `summernote-element-template`(`template`):插入預定義 HTML 模板;
  可用 `ReactDOMServer.renderToString()` 把 React 元件轉 HTML 當模板

### misc/

- **summernote-ext-table.js(+css、font/ 圖示字型)**:全專案最大 plugin(2000+ 行),
  也是 **CHANGELOG 出現頻率最高**的修 bug 熱點(dialog 游標還原、onChange 舊資料、
  透明邊框等都修過)。按鈕:`jTable`、`jInsertTableDialog`、`jAddDeleteRowCol`、`jMerge`、
  `jBackcolor`、`jBorderColor`、`jAlign`、`jAutoFit`、`jRowHeight`、`jColWidth`、
  `jTableInfo`、`jWidthHeightReset`、`jFontname`、`jStyleCell`。
  v2.3.0 起依賴 `customFont`。Excel 貼上進既有表格的 `.jtable-paste` 機制與
  SummerNote.jsx 的 handlePaste 連動(見 [01-architecture.md](01-architecture.md#貼上處理管線全專案最複雜區域))。
- `summernote-ext-print`(`print`):列印編輯器內容,常搭配 `pagebreak`
- `summernote-text-findnreplace`(`findnreplace`):尋找取代
- `summernoteDrafts.js`(`sDraftsLoad`/`sDraftsSave`):草稿存 localStorage,
  依賴全域 `store`(store.js,由 webpack ProvidePlugin 提供);未被 ImportCode 預設載入

## 新增 Plugin Checklist

1. 檔案放對分類:`src/plugin/<custom|formatting|insert|misc>/summernote-<名稱>.js`,
   **檔名一定以 `summernote-` 開頭**(否則 bundle-plugins.js 不會打包)
2. 用 UMD wrapper + `$.extend($.summernote.plugins, ...)` 註冊;plugin 名/按鈕名小駝峰
3. 語言字串支援 `langInfo`,附 zh-TW
4. 要預設載入的話,在 [src/components/ImportCode.js](../src/components/ImportCode.js) 加 require
   (注意順序:patch 類要早,相依 plugin 要在被依賴者之後)
5. 更新 [src/plugin/README.md](../src/plugin/README.md)(使用方式、選項、範例)
6. 在 [src/components/App.jsx](../src/components/App.jsx) 的 toolbar 加按鈕,`npm start` 手動驗證
7. 若有 CSS/字型等靜態檔,放同目錄即可(bundle-plugins.js 會原樣複製)
8. 更新 [CHANGELOG.md](../CHANGELOG.md),commit 走 Conventional Commits
