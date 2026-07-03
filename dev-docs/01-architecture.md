# 01 — 核心架構

本文說明 react-summernote 如何把 jQuery-based 的 Summernote 0.8.18 橋接進 React,
以及全專案最複雜的貼上處理管線。所有行號以 v2.3.24 的原始碼為準。

## 套件出入口

[src/index.js](../src/index.js):

```js
import SummerNote from './components/SummerNote'   // default export(元件)
import './components/SummerNote.css'               // dropdown 高度限制等自訂樣式
import * as SummernotePlugin from './components/SummernotePlugin'
export { SummernotePlugin }
export default SummerNote
```

- TypeScript 型別:`package.json` 的 `types` 指向 [src/index.d.ts](../src/index.d.ts),
  再分別引用 `SummerNote.d.ts`(props / ref 型別)與 `SummernotePlugin.d.ts`(Summernote context 型別)。
- `SummerNote.ImportCode` 是掛在元件上的靜態函式([SummerNote.jsx:479](../src/components/SummerNote.jsx)),
  使用者呼叫 `SummerNote.ImportCode()` 一次載入 bootstrap、summernote 與所有 plugin。

## React ↔ jQuery 橋接原理

核心檔案:[src/components/SummerNote.jsx](../src/components/SummerNote.jsx)(~480 行)。

結構是 `React.forwardRef` 包一層 class component:

```js
const ReactSummernote = React.forwardRef((props, ref) =>
    <InnerReactSummernote innerRef={ref} {...props} />)   // SummerNote.jsx:478
```

因此使用者 `ref.current` 拿到的是 **InnerReactSummernote 實例**,可直接呼叫下方的 Ref API。

### 生命週期

| 階段 | 行為 |
|---|---|
| `render()`(445) | 只輸出容器:外層 `<div className id ref={editorbox}>`,內層 `<Tag ref={handleEditorRef}>`(`tag` prop 決定 div 或 textarea,後者給 redux-form 之類的表單庫用) |
| `handleEditorRef(node)`(50) | **唯一初始化點**,見下節 |
| `onInit()`(176) | Summernote 初始化完成的 callback:快取 `.note-editable` / `.note-editor` / `.note-placeholder` 三個 jQuery 物件到實例上;套用 `disabled`;呼叫 `props.onInit`(傳一包 v1 風格的 API 物件,舊 API 相容用) |
| `componentWillReceiveProps`(133) | 手動同步 props 變更(見下) |
| `shouldComponentUpdate()`(166) | **永遠 `false`**——初始化後 React 不再重繪,DOM 完全交給 Summernote |
| `componentWillUnmount`(170) | `summernote('destroy')` |

`componentWillReceiveProps` 同步的項目:
- `value`:是字串且與舊值不同 → `this.replace(value)`
- `baseFontStyle`:用 `JSON.stringify` 比較,變動 → `updateBaseFontStyle`
- `disabled`:布林且變動 → `toggleState`
- `codeview`:變動 → `codeview.activate` / `codeview.deactivate`
- `destroy`:truthy → `summernote('destroy')`

> 注意:`componentWillReceiveProps` 是 React 已棄用的 lifecycle,這是升級 React 17+ 的
> 主要障礙之一,詳見 [04-known-issues.md](04-known-issues.md)。

### handleEditorRef 初始化流程(50–118)

1. 合併 callbacks:`options.callbacks = { ...props.options.callbacks, ...this.callbacks }`
   (`callbacks` getter 見下節,**同名時內建的會蓋掉使用者的**)
2. 注入**預設 popover 設定**(64–98):image / link / table / air 四組,再與 `options.popover` 淺合併。
   預設值直接引用自家 plugin 的按鈕(`imageAttributes`、`captionIt`、`imageShapes`、`imageMap`、
   `jFontname`、`jBackcolor`、`jBorderColor`、`jAlign`、`jMerge`、`jAutoFit`、`jStyleCell`、
   `jTableInfo`、`jWidthHeightReset` 等)——**所以不呼叫 ImportCode 又沒自訂 popover 時,
   table/image popover 會出現失效按鈕**。
3. `this.editor = $(node)` → `this.editor.summernote(options)` 初始化
4. 有 `value` → `replace(value)`;有 `baseFontStyle` → `updateBaseFontStyle`;
   `codeview` → activate;`destroy` → destroy
5. 接上 `innerRef`(function ref 或 object ref 都支援)

### callbacks getter(429–443)

props 與 Summernote callback 的對照(注意大小寫轉換):

| props | Summernote callback | 實際處理 |
|---|---|---|
| — | `onInit` | `this.onInit` |
| `onEnter` / `onFocus` / `onBlur` | 同名 | 直接透傳 |
| `onKeyUp` / `onKeyDown` | `onKeyup` / `onKeydown` | 直接透傳 |
| `onPaste` | `onPaste` | 先走 `this.handlePaste`,內部再呼叫 `props.onPaste` |
| `onChange` | `onChange` | 先走 `this.handleChange`,內部再呼叫 `props.onChange` |
| `onImageUpload` | `onImageUpload` | `this.onImageUpload` 包裝後呼叫 `props.onImageUpload(images, this.insertImage)` |
| — | `onChangeCodeview` | 也接到 `this.handleChange`(v2.2.0 加入,codeview 模式打字也會觸發 onChange) |

## Props 一覽

PropTypes 定義在 [SummerNote.jsx:456–474](../src/components/SummerNote.jsx),
完整型別在 [SummerNote.d.ts](../src/components/SummerNote.d.ts)。

| Prop | 型別 | 說明 |
|---|---|---|
| `value` | string | HTML 內容;初始化與後續變更都經由 `replace()` 寫入 |
| `options` | object | Summernote 設定原樣透傳(toolbar、lang、height、callbacks、popover…) |
| `tag` | string | 內層元素標籤,預設 `div` |
| `id` / `className` | string | 加在外層容器 div |
| `codeview` | bool | 切換 HTML 原始碼模式 |
| `disabled` | bool | 禁用編輯 |
| `destroy` | bool | truthy 時銷毀編輯器 |
| `baseFontStyle` | object | 預設文字樣式,支援 `font-family` / `font-size` / `color`(v2.3.21+;2.3.25 起以 inline style 寫入空段落隨內容保存,見下方機制節) |
| `onInit` | func | 初始化完成,參數是一包舊版 API 物件 |
| `onChange` | func | 內容變更,參數是 HTML 字串 |
| `onImageUpload` | func | `(files, insertImage) =>`;插入/貼上圖片檔案時觸發 |
| `onImagePasteFromWord` | func | 從 Word 貼上含圖內容時觸發,參數是 jQuery 圖片集合 |
| `onPaste` / `onEnter` / `onFocus` / `onBlur` / `onKeyUp` / `onKeyDown` | func | 事件透傳 |

## Ref API(實例方法)

全部在 constructor 綁定(23–47)。多數方法會先 `summernote('focus')` 再執行指令。

| 方法 | 說明 |
|---|---|
| `focus()` | 焦點移到編輯器 |
| `isEmpty()` | 內容是否為空 |
| `reset()` | 清空內容 |
| `replace(html)` | 替換全部內容(見下方注意事項) |
| `disable()` / `enable()` / `toggleState(disabled)` | 切換可編輯狀態 |
| `insertImage(url, filenameOrCallback)` | 插入圖片 |
| `insertNode(node)` | 插入 DOM 節點 |
| `insertText(text)` | 插入純文字 |
| `pasteHTML(html)` | 於游標處貼入 HTML |
| `createRange()` | 回傳 Summernote WrappedRange |

**`replace()` 的注意事項(225–238)**:它不是走 `summernote('code', html)`,而是直接
`noteEditable.html(content)` 並手動處理 placeholder 顯隱——所以**不會觸發 onChange、
不會進 undo 歷史**。這是刻意設計(避免 value prop 同步造成 onChange 迴圈)。

**遺留 API**:constructor 內把方法同時綁到 class 靜態屬性(37–47,如
`InnerReactSummernote.focus`),這是 v1 舊 API 相容,多實例時只指向最後建立的實例,
**不要使用也不要模仿**,一律走 ref。

## 貼上處理管線(全專案最複雜區域)

貼上動作觸發順序:`handlePaste`(paste 事件)→ Summernote 內建處理 → `handleChange`(change 事件)。

### handlePaste(350–427)

```
paste 事件
 ├─ IE(MSIE/Trident)→ 直接 return,交給瀏覽器預設行為
 ├─ clipboard 含 text/rtf(從 Word 複製)
 │   → rtf2html(rtf) 抽出所有圖片轉 base64
 │   → 存入 this.pasteResource[](陣列,順序=圖片出現順序)
 │   → this.isPasteFromWord = true
 ├─ 呼叫 props.onPaste(e)
 ├─ clipboard HTML 含 'office:excel' 且非 IE(從 Excel 複製)
 │   → e.preventDefault()
 │   → ExcelTable.getTable() 取出 <table>
 │   → ExcelTable.createStylesheet() 解析剪貼簿內嵌 CSS
 │   → ExcelTable.applyStyleInline() 把樣式全部改寫成 inline style
 │   → ExcelTable.removeImage() 移除 <img>(Excel 圖片不支援)
 │   → 若游標在表格內且 .jtable-block 顯示中:掛成隱藏的 .jtable-paste
 │     交給 ext-table plugin 處理(貼進既有表格);否則 range.pasteHTML()
 └─ Firefox 且 clipboard HTML 含 'RelyOnVML'(Word 舊格式)
     → e.preventDefault()
     → 手動取 <!--StartFragment--> 與 <!--EndFragment--> 之間的 HTML
     → 有選取範圍:刪除選取後 insertNode;無:pasteHTML()
```

### handleChange(316–347)

1. 移除 `span[style*="mso-ignore"]`(Word 的雜訊標記)
2. 把 `<v:shape><v:imagedata>`(VML)轉成一般 `<img>`,並複製屬性與父層 style
3. 找出 `img[src*="file://"]`(Word 貼上時圖片指向本機路徑)且尚未處理者:
   - 加上 class **`.zap-img-uploading`**(對外約定的 class,使用者靠它做後續處理)
   - `src` **依序**換成 `this.pasteResource[i]` 的 base64
   - ⚠️ 這是「順序對應」的假設:file:// 圖片的 DOM 順序必須與 RTF 中圖片順序一致
4. 若 `isPasteFromWord`,呼叫 `props.onImagePasteFromWord($pastedImgs)` 並清旗標
5. 呼叫 `props.onChange(txt)`

### 相關工具庫

- [src/lib/trf2html.js](../src/lib/trf2html.js)(檔名 typo,匯出名是 `rtf2html`):
  用 regex 解析 RTF 的 `{\pict ...}` 區塊,判斷 png/jpeg,hex 字串 → bytes → base64 data URI,
  回傳 base64 陣列。
- [src/lib/ExcelTable.js](../src/lib/ExcelTable.js):`getTable` / `createStylesheet` /
  `applyStyleInline` / `removeImage` 四個靜態工具。

## baseFontStyle 機制(2.3.25 重寫為空段落 inline style)

> 歷史:v2.3.21 的原始實作把樣式套在 `.note-editable` 容器 CSS 上,導致儲存的 HTML
> 沒有記錄預設樣式(編輯器外顯示不一致)。2.3.25 起改為下述機制。

**不變式**:`baseFontStyle` 有效(至少一個屬性)且編輯器「視覺為空」時,空段落必為
`<p style="font-family:…;font-size:…;color:…"><br></p>`。打字內容繼承段落樣式、
Enter 分段時 Summernote 的 `splitNode` 用 `cloneNode(false)` 複製屬性——樣式自然延續、
隨 HTML 值忠實保存。

相關方法(SummerNote.jsx,全部 gate 在 `isActiveBaseFontStyle()`,
**未提供 prop 時零路徑執行、零 hook 安裝**):

- `applyBaseFontStyleToEmptyPara(s)`:視覺為空偵測(純 DOM,不用字串比對)——
  (1) editable 完全空(Ctrl+A 刪除後)→ 重建帶樣式 emptyPara、必要時回復游標;
  (2) 單一空段落子節點(DIV 除外)→ 就地覆寫三屬性(全清時移除空 style 屬性);
  (3) 單一「深層為空」的 `<p>`/`<div>` 殘殼(`dom.deepestChildIsEmpty`)→ 整個重建為
      帶樣式 `<p>`——Chrome 刪除清單/帶樣式內容後會留下 `<div><br></div>` 或
      `<div><font…><span…><br></span></font></div>`(font/span 是 Chrome 原生的
      樣式保留機制把 inline style 轉成 legacy 標籤),在此正規化;
  (4) 有內容 → 不碰(init 有 value 也不碰)

  **邊界**:清單全選刪除後殘留的 `<ul><li><br></li></ul>` 是上游/Chrome 原生行為
  (無 baseFontStyle 亦同),畫面仍有可見 bullet、上游判空也視為非空,
  **刻意不正規化**——改寫會破壞「建立空清單準備輸入」的操作。再刪一次 bullet
  才會進入上述 (3) 的殘殼路徑被收斂為帶樣式 `<p>`。
- `syncBaseFontStyleToolbar(s, $para)`:字體/字號 target 傳帶樣式的 `$para`
  (容器已無樣式,`styleFromNode` 讀 computed style);前景色按鈕區塊照舊
  (⚠️ 仍改寫 `$.summernote.options.colorButton.foreColor` 全域設定,既有 quirk,
  會影響同頁其他編輯器)
- `installBaseFontStyleHooks(s)`(冪等):
  - 覆寫 `context.modules.editor.isEmpty`——上游用 `dom.emptyPara === $editable.html()`
    字串判空(dist L6245),帶 style 屬性的空段落會誤判非空(placeholder 不顯示、
    isEmpty API 錯誤);覆寫加上「單一空 `<p>` 子節點」判斷
  - 攔截 `context.reset`(instance-level wrapper,`invoke` 先查實例屬性)——
    reset 會重建 modules(isEmpty 覆寫丟失)且結束於無樣式空段落又不觸發 change,
    wrapper 在 origReset 後重跑 `updateBaseFontStyle`
  - 攔截 `Editor.onFormatBlock`——`execCommand('FormatBlock')` 會把 style 屬性
    原封搬到新標籤,inline 字體屬性會壓掉 H1-H6/PRE/BLOCKQUOTE 的原生樣式
    (Style 下拉「套用不起作用」);orig 執行後以 `rng.nodes` 找目標標籤:
    套非 P 標籤 → 剝除三個受管理屬性(其他屬性如 class 保留);
    切回 Normal(P)→ 該段未自帶任何受管理屬性時補回 baseFontStyle
    (Normal 的視覺 = 預設樣式,但不蓋既有內容自己的段落樣式)。
    對應地,`applyBaseFontStyleToEmptyPara` 的就地覆寫僅限 `<p>`,
    避免 handleChange 把樣式重新蓋回空的 H1/PRE

**強制點**(五處):init(handleEditorRef)、handleChange(涵蓋打字刪光、undo/redo、
`empty()`/`code()`、codeview 關閉;**codeview 開啟期間跳過**,editable 未同步)、
`replace()` 空內容路徑(replace 不觸發 change)、reset wrapper、
componentWillReceiveProps(baseFontStyle 變更;只影響空編輯器,既有內容不動)。

handleChange 內若有補樣式動作,會以 `noteEditable.html()` 重算傳給 onChange 的值,
確保下游存到含樣式的 HTML。

## SummernotePlugin API

[src/components/SummernotePlugin.jsx](../src/components/SummernotePlugin.jsx)(v2.2.20+),
讓使用者用 React 元件寫 Summernote 按鈕/plugin:

- `createSummernoteButton(Component)`:回傳 `(context) => jQuery容器`,
  內部用 `ReactDOM.render(<Component context={context}/>)` 渲染進 jQuery div
  (⚠️ `ReactDOM.render` 在 React 18 已移除)
- `createSummernotePlugin(name, PluginOptions, PluginLang, Plugin)`:
  分別註冊到 `$.summernote.options[name]`、`$.summernote.lang`(deep merge)、
  `$.summernote.plugins[name]`
- `SummernotePluginClass`:plugin class 基底(建構子存 `this.context`)
- 型別定義 [SummernotePlugin.d.ts](../src/components/SummernotePlugin.d.ts) 是理解
  Summernote `context` 物件的最佳參考:`layoutInfo`(各區域 jQuery 物件)、`modules`、
  `options`、`invoke()`、`memo()`、`WrappedRange` 等

## ImportCode 載入順序

[src/components/ImportCode.js](../src/components/ImportCode.js),順序有意義(patch 要在
plugin 使用前生效):

1. bootstrap CSS + JS 模組(modal / dropdown / tooltip / tab / popover / collapse)、popper.js
2. `summernote/dist/summernote-bs4.css` + `summernote-bs4.js`
3. 語言包 `plugin/lang/summernote-zh-TW`(自家版本,非官方 dist)
4. 三個 patch:`patch-buttons`、`patch-dom`、`patch-handle`
5. custom 系列(custom、contextmenu、custom-font、specialchars、custom-style、
   fontsize-input、imagemap、comment-popover、copy-formatting、custom-cleaner、
   pastehtml、toc、view-classlist)
6. formatting 系列(addclass、case-converter、image-attributes、image-captionit、
   image-shapes、list-styles + css、pagebreak、video-attr-setter)
7. insert 系列(at-mention、file、element-template)
8. misc 系列(ext-print、text-findnreplace、ext-table + css)
9. 最後:`custom-paste`、`summerntoe-patch-createLink`

**未被載入**(使用者要用需自行 require):emoji、`summernoteDrafts`、
`special_characters/summernote-ext-specialchars`(被 custom 版取代)、syntax(棄用)、
`formatting/summernote-video-attributes`(被 video-attr-setter 取代)。

## Demo 與開發入口

- [src/start.js](../src/start.js) → 渲染 [src/components/App.jsx](../src/components/App.jsx):
  demo 網站主體,兩個編輯器實例(不同圖片上傳策略)+ baseFontStyle 動態調整示範。
  **新功能記得在 App.jsx 的 toolbar 加上按鈕以便手動驗證與展示。**
- [src/test.js](../src/test.js):`npm run test` 的入口,引用「打包後」的產物驗證發佈品質
- [www/index.html](../www/index.html):HtmlWebpackPlugin 的模板(只有一個 `#root`)
