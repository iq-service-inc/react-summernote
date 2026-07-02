# 04 — 已知問題與技術債

維護前先讀這份,避免踩坑或「順手修壞」。狀態以 v2.3.24(2026-06)為準。

## 上游依賴

- **Summernote 鎖在 0.8.18**(devDependencies + peerDependencies)。
  上游已有 0.9.x,但本套件的 4 個 patch plugin、預設 popover、諸多 plugin 都是針對
  0.8.18 內部結構寫的,升級是大工程,需逐一驗證 patch 是否已被上游修復、內部 API 是否變動。
- **本機 `D:\Node\summernote\summernote` 是上游 0.9.1 原始碼**(git 乾淨、追 origin/main,
  build 系統已改 Vite)。它**只是參考用**,react-summernote 依賴的是 npm 上的 summernote 0.8.18,
  與這份原始碼無建置關聯。研究上游行為或評估升級時拿它對照。
- 4 個 patch plugin 的移除條件見 [02-plugins.md](02-plugins.md#patch-plugins繞過上游-bug重點維護對象)。

## React 相容性(升級的主要障礙)

- peer dependency 是 **React ^16.8.6**。
- `SummerNote.jsx` 使用已棄用的 **`componentWillReceiveProps`**(React 16.9 起警告,
  17+ 需改名 `UNSAFE_componentWillReceiveProps`,長期應改寫)。
- `SummernotePlugin.jsx` 的 `createSummernoteButton` 使用 **`ReactDOM.render`**
  (React 18 已移除,需改 `createRoot`)。
- `SummerNote.jsx:37-47` 把方法綁到 class 靜態屬性(`InnerReactSummernote.focus` 等)
  是 v1 舊 API 遺留,多實例時只指向最後建立的實例。不要使用、不要模仿,也暫勿刪除
  (可能有舊宿主專案還在用)。
- `handleEditorRef` 內的 `this.setState({ value })`(SummerNote.jsx:104)沒有實質作用
  (state 從未初始化、`shouldComponentUpdate` 恆 false),屬無害殘留。

## 建置工具老化

- **webpack 4 + babel-loader 8 + 各式舊 loader**:只能在 Node 16 建置。
  CI 的 publish job 因此採「Node 16 build、Node 24 publish(`--ignore-scripts`)」兩段式,
  詳見 [03-build-release.md](03-build-release.md#github-workflows)。
- `postcss.config.js` 是空設定檔(PostCSS 實際設定寫在 webpack config 的 loader options 裡)。

## 依賴的怪點

- **`rtf.js`(peerDependencies,指向作者的 fork `git+https://github.com/LinZap/rtf.js.git`)
  在 `src/` 已無任何引用**——Word 貼上早改用內建的 `src/lib/trf2html.js`。
  它仍留在 peerDeps 與 webpack externals 中,屬遺留宣告;移除是 breaking change
  (宿主專案的安裝流程會變),留待版本規劃決定。
- `store`(store.js)靠 webpack `ProvidePlugin` 全域注入,只有 `summernoteDrafts` 與
  `at-mention` plugin 用到,但宿主專案照 README 都會安裝並設定 ProvidePlugin。
- `popper.js` 是 peer dependency,但 **不在 webpack.prod 的 externals**,
  所以實際上也被打包進 `dist/main.js`(經由 ImportCode 的 require)。

## 行為陷阱(改碼前必知)

- **`replace()` 不觸發 onChange、不進 undo 歷史**:直接 `noteEditable.html()`。
  這是刻意的(避免 value 同步造成 onChange 迴圈),別「修正」它。
- **Word 貼圖是順序對應**:`handleChange` 把 `img[src*="file://"]` 依 DOM 順序換成
  `pasteResource[i]`。若 Word 內容的圖片順序與 RTF 解析順序不一致會貼錯圖——目前無已知案例,
  但動貼上邏輯時要保住這個順序假設。
- **`baseFontStyle.color` 會改 `$.summernote.options.colorButton.foreColor` 全域預設**,
  同頁多編輯器會互相影響(單一編輯器情境下無感)。
- **`options.callbacks` 同名時內建 callback 蓋掉使用者的**(`handleEditorRef` 的 merge 順序),
  使用者要用 `onChange`/`onPaste` 等 props 而非 `options.callbacks`。
- **預設 popover 引用自家 plugin 按鈕**:不呼叫 `ImportCode()` 又沒覆寫 `options.popover`
  時,image/table popover 會出現無作用的按鈕。
- **IE 路徑**:`handlePaste` 對 MSIE/Trident 直接 return(交給預設行為);
  Excel/Firefox VML 分支都排除 IE。IE 已死,但這些判斷別急著刪——刪除屬行為變更,要走版本。
- `docs/`(web build)與 `plugin/`、`dist/`(build)都是建置輸出,會被清空,勿手改。

## 檔名 typo(保持原樣)

- `src/plugin/custom/summerntoe-patch-createLink.js`(summerntoe)——使用者 require 的
  對外路徑,改名是 breaking change,CHANGELOG 也一直沿用此名。
- `src/lib/trf2html.js`(trf)——內部檔案,匯出名是 `rtf2html`;改名無對外影響但無急迫性。

## 死碼(留待作者決定,勿順手刪)

- `formatting/summernote-video-attributes.js`:v2.2.20 起被 `summernote-video-attr-setter.js`
  取代,未被 ImportCode 載入,但仍會被打包進 `plugin/`(使用者可能直接 require)。
- `syntax/`(ext-highlight):README 已標棄用。
- `special_characters/summernote-ext-specialchars.js`:被 `custom/summernote-custom-specialchars.js` 取代。
- SummerNote.jsx 內大段註解掉的舊 code(componentDidMount、loadModule 等)。

## CHANGELOG 反映的 bug 熱點(歷史上最常修的地方)

1. **`misc/summernote-ext-table.js`**:dialog 關閉後游標位置、onChange 拿到舊資料、
   透明邊框、欄寬列高輸入框……(2.3.11–2.3.13、2.3.18 等)
2. **`custom/summernote-fontsize-input.js`**:游標定位、span 破碎/合併、數值判斷
   (2.3.14、2.3.15、2.3.17、2.3.22、2.3.23)
3. **多編輯器共存**:調色盤開錯(2.3.10 → patch-buttons)、全域 options 汙染
4. **貼上管線**:Word/Excel 各瀏覽器行為差異
5. **`walkPoint` 遍歷**(2.3.19 → patch-dom 的 null 修復)

改到這些區域時,把上述歷史 bug 當回歸測試清單,用 `npm start` 的 demo 逐項手動驗證。
