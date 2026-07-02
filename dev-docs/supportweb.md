# SupportWeb 使用 react-summernote 現況與升級須知

本文記錄 **SupportWeb**(IQ-Support 6 前端)對 `@iqs/react-summernote` 的實際使用面。
兩個用途:(1) react-summernote 維護者評估修改影響時的契約清單;
(2) 可獨立交給 SupportWeb 維護工程師,作為升級套件版本時的參考。
調查基準:SupportWeb @ 2026-07、react-summernote v2.3.24。

## 依賴狀態

- `@iqs/react-summernote": "^2.3.19"`,**實際安裝 2.3.19**——尚未吃到
  2.3.21 的 `baseFontStyle`、2.3.22/2.3.23 的 fontsize-input 修復、2.3.24 的 baseFontStyle 修正。
  升級 SupportWeb 依賴版本時,這幾版的變更要一併驗證。
- **2.3.25 起 baseFontStyle 語意變更**:預設樣式以 inline style 寫入空段落
  (`<p style="..."><br></p>`)並隨 HTML 內容保存,不再套容器 CSS。
  SupportWeb 目前**沒有使用** baseFontStyle prop,升級不受影響;
  若日後要用,請注意「空編輯器的 value 是帶樣式空段落」與
  「動態更新不改寫既有內容」兩點(詳見套件 README 的 baseFontStyle 節)。
- 技術棧:React 16.9、**webpack 5**(注意:與 react-summernote 自身的 webpack 4 不同,
  但消費的是打包後的 `dist/main.js` 與 `src/plugin/` 原始碼,無建置相容問題)、
  bootstrap 4.3、jquery 3.6.1、summernote 0.8.18、store;
  `ProvidePlugin`(`$`/`jQuery`/`store`)照 README 設定齊全。
- 有 Cypress,但 `BaseEditorX.cy.jsx` 只有 smoke render 測試,實質驗證仍靠手動。

## 封裝結構:單一入口 BaseEditorX

SupportWeb 只有兩個檔案直接碰 react-summernote:

1. `src/index.jsx`(app 入口):直接 import `summernote-bs4.min.js` 與
   **`@iqs/react-summernote/src/plugin/misc/summernote-ext-table`(src 原始碼路徑,
   不是打包後的 `plugin/` 路徑)**——所以 `src/plugin/misc/summernote-ext-table.js`
   的原始碼會被 SupportWeb 直接執行,改它時無法靠「打包時才會出錯」把關。
2. `src/components/Base/BaseEditorX.jsx`(約 410 行):唯一的編輯器封裝,
   constructor 內呼叫 `SummerNote.ImportCode()`。
   外面再包一層 `src/containers/Editor/EditorX.jsx`(redux connect,注入
   `upload_file` action 與 `locale`)。

> 載入順序備註:index.jsx 已載入 summernote 與 ext-table,BaseEditorX 的 ImportCode()
> 會再各載一次(不同 module path,webpack 各自執行)。目前靠重複註冊自癒,
> **變更 ImportCode 的 require 順序時要在 SupportWeb 實測**。

**EditorX 在 25+ 個元件中使用**,遍及:FAQ 編輯與管理、公告(AnnEdit)、論壇(Forum)、
客服案件(Hdcase:新增、回覆、簽名檔、回覆範本)、問卷(EditSurvey/EditQues)、
建議(EditSuggest)、行事曆(Teamweb/Header)、便條(Note)、網站元件(WebsiteComponent)、
訊息(EditMsg)——**編輯器是整個產品的核心輸入元件,回歸影響面極大**。

## SupportWeb 實際使用的 API 面(相容性契約)

### Props

`value`、`options`、`onChange`、`onImageUpload`、`onImagePasteFromWord`、`className`、ref。

### Ref 方法(改簽名前先看這裡)

- `insertNode`:**使用最多**(上傳進度容器、影音元素、連結、強制 re-render 用的空 span)
- `focus`、`insertText`、`pasteHTML`:Hdcase 回覆/範本頁大量使用
  (有 try/catch + 重試的防禦寫法,且先 typeof 檢查方法存在)
- `disable` / `enable`:Forum、FAQ 上傳中鎖定編輯器

### Options

`lang`(en-US / zh-TW)、`height: 360`、`dialogsInBody: true`、
`codeviewFilter: true` + 自訂 `codeviewFilterRegex`(比套件預設白名單鬆:
允許 `title`、`link`)、`customFont.fontNames`(含標楷體/新細明體/微軟正黑體)、
`canViewClasslist: false`。

### Toolbar 用到的自家 plugin 按鈕(不可改名的清單)

`copyFormatting`、`customStyle`、`customCleaner`、`customFont`、`fontsizeInput`、
`listStyles`、`jTable`、`jMerge`、`jBackcolor`、`jBorderColor`、`jAlign`、`jTableInfo`、
`jWidthHeightReset`、`jRowHeight`、`jColWidth`、`pasteHTML`、`imageMap`、`customSpecialChar`、
`anchor` / `markAnchor` / `editAnchor`(FAQ 頁 `canToc` 時加入)。

### DOM / CSS class 契約(SupportWeb 直接用 querySelector 抓的)

改到下列 class 名或 DOM 結構,SupportWeb 會直接壞(BaseEditorX 程式註解自承這很脆弱):

| Selector | SupportWeb 用途 |
|---|---|
| `.note-btn-group.btn-group.note-insert` | componentDidMount 把自製「上傳檔案取得連結」按鈕 appendChild 進 toolbar |
| `.note-editing-area` | 自訂右鍵選單的命中區域判斷 |
| `.note-popover.popover.in.note-image-popover.bottom` | 圖片 popover 開啟時隱藏右鍵選單 |
| `.note-editable.card-block` | WebsiteComponent 直接讀編輯器內容 |
| `.zap-img-uploading` | 上傳中圖片標記:BaseEditorX 靠它替換 src、移除進度框(**對外行為契約,見 01-architecture 貼上管線**) |
| `.zap-editorx-progress` | FAQ 存檔前檢查是否還有圖片上傳中 |

### 上傳流程(與 `.zap-img-uploading` 契約綁定)

- 插入圖片:轉 base64 → 包進度容器 insertNode → 後端上傳完成 → 把 `src` 換成伺服器 URL、
  移除 `.zap-img-uploading` 與進度框。
- Word 貼上:`onImagePasteFromWord($imgs)` 逐張取 base64 上傳後替換——
  **依賴 handleChange 已把 `file://` 圖換成 base64 且加上 class 的行為**。

## 調查中發現的下游問題(修改決策的參考,非本 repo 待辦)

1. **BaseEditorX 的 `options.callbacks.onPaste` 從未執行**:它設了「貼上時剝除 `<style>`」
   的 callback,但 react-summernote 的 `handleEditorRef` 合併時內建 callbacks 優先
   (04-known-issues 記載的陷阱),被內建 `handlePaste` 覆蓋。等效清理由 BaseEditorX
   自己的 `handleChange`(`stripStyleTag`)補上,所以功能沒壞,但那段 callback 是死碼。
   若未來改掉 merge 順序(讓使用者 callbacks 優先),SupportWeb 這段死碼會突然復活,
   行為會變——**改 merge 順序前要先驗 SupportWeb**。
2. **`tableClassName='jtable table-bordered'` 放錯位置**:BaseEditorX 把它當 JSX prop
   傳給 SummerNote,但 ext-table 讀的是 `options.tableClassName`(demo App.jsx 也是放
   options),此 prop 實際無效——SupportWeb 新插入的表格可能沒有 `jtable table-bordered`
   class(連帶影響 customCleaner 的預設排除清單)。屬 SupportWeb 端修正。

## 修改 react-summernote 前的影響評估 checklist

- 改了 CSS class 名或 toolbar/popover DOM 結構?→ 對照上方 DOM 契約表
- 改了 `ImportCode.js` 的 require 順序?→ SupportWeb 有雙重載入,要實測
- 改了 ref API 簽名或行為?→ Hdcase/FAQ/Forum 的呼叫點
- 改了 `.zap-img-uploading` / `pasteResource` 行為?→ 上傳與 Word 貼圖全流程
- 改了 `options.callbacks` merge 順序?→ 上方問題 1
- 改了 ext-table(`src/plugin/misc/summernote-ext-table.js`)?→ SupportWeb 直接執行
  這份原始碼,語法要維持在其 babel 設定可處理的範圍(實務上維持現有 ES5 風格)
- 發新版後 → 在 SupportWeb 升級並 `npm start` 走過:FAQ 編輯、Hdcase 回覆(插入範本
  文字/HTML)、公告、論壇、圖片上傳、Word/Excel 貼上
