# Changelog

## [2.3.1](https://github.com/iq-service-inc/react-summernote/compare/v2.3.0...v2.3.1) (2024-01-24)

### fix

* 修復在 Summernote 外層套用 form 點擊部分按鈕會提交 ([3a6bf5f](https://github.com/iq-service-inc/react-summernote/commit/3a6bf5f32d9ee5c9b855e79b9503d6c7b632d7ad))

## [2.3.0](https://github.com/iq-service-inc/react-summernote/compare/v2.2.20...v2.3.0) (2024-01-22)

### BREAKING CHANGES

* 自訂樣式字體按鈕、表格字體按鈕依賴 custom-fontname plugin

在使用 summernote-custom-style, summernote-ext-table 之前須先引入 custom-fontname

### feat

* 更新 summernote-custom-style, summernote-ext-table 字體按鈕改用使用 customFont
* 新增 summernote-custom-font ([#3](https://github.com/iq-service-inc/react-summernote/issues/3))

### fix

* 修復 summernote-copy-formatting 無法套用樣式到外層已有樣式的局部文字
* 修復 summernote-copy-formatting 錯誤複製 data-* 屬性, 錯誤複製圖片影像地圖

# Changelog

## `2.2.20`
### feat
* 新增 SummernotePlugin 及 Types
* 新增 summernote-copy-formatting
* 新增 summernote-custom-style
* 新增 summernote-custom-cleaner
* 新增 summernote-ext-table jStyleCell 編輯單一儲存格樣式
* 新增 summernote-ext-table jFontname 框選更新表格內字體
* 更新 summernote-image-attributes 自動插入圖片標題
* 更新 summernote-image-attributes 設定圖片尺寸
* 更新 summernote-comment-popover 內容參數設定
* 新增 summernote-imagemap
* 新增 summernote-custom-contextmenu
* 更新 summernote-ext-table jAddDeleteRowCol 插入刪除欄列支援框選

### fix
* 修復 summernote-ext-table 插入欄 有多個表格計算 colspan 出錯
* 新增 summernote-patch-handle 修復圖片顯示框位置偏移
* 新增 summernote-patch-dom 修復字體、字型等樣式無法套用到所有節點
* 修復 summernote-ext-table jRowHeight, jColWidth 當前寬高計算錯誤
* 修復 summernote-fontsize-input 未阻擋輸入超出最大/最小值
* 修復 summernote-ext-table 點擊右鍵框選範圍會重置
* 修復 summernote-ext-table 刪除欄或列後自動更新儲存格寬高出現錯誤訊息

### perf
* 更新 summernote-ext-table jStyleCell 對話框輸入框加上 placeholder 提示文字
* 更新 summernote-ext-table destroy 移除 $styleCellDialog
* 更新 summernote-image-attributes 圖片標題以 id 對應
* 更新 summernote-image-attributes 圖片尺寸切換單位顯示
* 更新 summernote-pastehtml pasteHTML 按鈕 icon
* 更新 summernote-custom-specialchars customSpecialChar 按鈕 icon

### docs
* 更新 README 原生 summernote 嵌入影片的有效網址
* 更新 import plugins 範例缺漏


## `2.2.19`
### feat
* 更新 zh-TW 翻譯
* 新增 summernote-pastehtml，可在游標位置插入 HTML
* 新增 summernote-comment-popover，為文字段落加上註解 popover
* 更新 summernote-image-captionit 可設定標題在圖片連結裡
* 新增 summernote-image-attributes，編輯圖片標題、說明、連結等屬性
* 新增 summernote-ext-table jRowHeight, jColWidth，可調整 rowHeight, colWidth 功能
* 新增 summernote-ext-table jAutoFit，自動調整 table 欄寬
* 更新 summernote-list-styles，新增更多項目符號
* 新增 summernote-custom-specialchar，改寫自 summernote-ext-specialchars 可插入特殊符號

### fix
* 修復 summernote-ext-table popover 顯示

### perf
* 更新 summernote-fontsize-input 輸入框外觀

### build
* 更新 bundle-plugin 自動取得 plugin 資料夾

### ci
* 新增 deploy-pages 流程


## `2.2.18`

* 新增 `summernote-fontsize-input`

## `2.2.17`

* 移除 `summernoteDrafts`

## `2.2.16`

* 新增 click 編輯器中的元素，可以查看 class 的 plug-in `summernote-view-classlist`

## `2.2.15`

* 修正 colgroup 計算錯誤的問題

## `2.2.14`
* 修正 透過 popover 增加或減少 column 時沒有同步修改 colgroup 的問題
* 修正 jMerge 由右向左 或 由下向上選取表格合併，會使表格突出並破壞結構的問題

## `2.2.10`
* 修復 jTable plugin 在處理多層表格時的跑版問題
* 增加 TypeScript 類型定義檔

## `2.2.9`
* 移除 Emoji Plugin

## `2.2.8`
* 修復 v2.2.6 版本更新導致 jTable plugin 無法使用的問題
* `README.md`中新增 plugin 無法正確載入時的解決方法

## `2.2.6`
* 更新 dependency
  * jquery: 3.6.1
  * bootstrap: 4.6.2
  * popper.js: 1.16.1

## `2.2.5`
* 修復 table plugin
    * 從HTML原始碼貼上表格，第一次拖動調整表格寬高時，可以正常拉動

* 修復 套用樣式碰到空白 HTML 元素時，在空白元素以後的其他東西都不會被套用樣式

## `2.2.4`
* 部分修復 table plugin
    * 表格內部的文字可以被選取
    * 表格內部被選取的文字可以修改大小與字體\*
    * 表格外和表格內同時選取的文字可以同時修改大小與字體\*

> \*: 在Firefox與IE底下，若同時選取超過一格，則只有最先被選取的格子的樣式會被修改

* 優化 toc plugin
    * 移除錨點時會一併移除目錄的對應項目
    * 修復 移除錨點時未清除新增的 attribute 

## `2.2.3`
* 功能無更新，只是重新 build 一版

## `2.2.2`
* 功能無更新，只是重新 build 一版

## `2.2.1`
* 更新 summernote 版本 0.8.16 → 0.8.18

## `2.2.0`
* 新增 onChangeCodeView 令原始碼模式修改時也會觸發 onChange 事件

## `2.1.2`
* 刪除 syntax plugin
* 修正引用錯誤問題

## `2.0.10`
* 修復 ie 不支援 Element.remove() 語法

## `2.0.9`
* 新增 打包過的 [plugin](/plugin)
* ImportCode 改使用 [plugin](/plugin) 路徑
* 修復文件連結網址

## `2.0.8`
* 修復 檢視錨點無法正常顯示
* 修復 編輯錨點側欄未同步延伸
* 修復 destroy 時未清除新增的 element

## `2.0.7`
* 修復 錨點文字無法帶到 html
* 錨點可使用中文當 id
* 修復 錨點側欄編輯無法調整高度
* 修復 plugin 部分事件未觸發 onchange


## `2.0.6`
* 修復 table popover dropdown
* 修復 popover 指定單一類型導致其他類型的 popover 無效
* 新增 table popover 中文翻譯
* 新增 [awesome summernote plugins](/src/plugin)
* 新增 custom plugin
* 新增 toc plugin
* plugin 支援中文
* react summernote 支援傳遞 callbacks


## `2.0.5`

* [自動隱藏 table buttons](http://10.9.173.136/snippets/63#%E8%87%AA%E5%8B%95%E9%9A%B1%E8%97%8F-plugin-buttons)
* 貼上 table 後自動補上 colgroup (修復 [cell resize](http://10.9.173.136/snippets/63#cell-resize) 調整寬度異常)
* table [自製選取工具複製編輯器上的表格](http://10.9.173.136/snippets/63#%E8%87%AA%E8%A3%BD%E9%81%B8%E5%8F%96%E5%B7%A5%E5%85%B7%E8%A4%87%E8%A3%BD%E7%B7%A8%E8%BC%AF%E5%99%A8%E4%B8%8A%E7%9A%84%E8%A1%A8%E6%A0%BC)


## `2.0.4`



* 新增 summernote-ext-table plugin
    * 調整 table cell 樣式
    * 貼上表格合併內容
    * 調色盤選擇顏色後關閉
    * [snippets 連結](http://10.9.173.136/snippets/63#%E8%AA%BF%E6%95%B4-table-cell-%E6%A8%A3%E5%BC%8F)


## `2.0.3`

* 新增貼上 Excel 表格
    * 參考: [ckeditor pastetools L516~559](https://github.com/ckeditor/ckeditor4/blob/09e59fe73582d6377615b4e3c84fee64b80979c9/plugins/pastetools/filter/common.js#L516)
    * 解法: http://10.9.173.136/snippets/63#%E8%A7%A3%E6%B3%95

![image](http://10.9.173.136/SideProject/react-summernote/uploads/15b4fd54c717472af32242d16ffc244a/image.png)


## `2.0.2`

* 修正 回傳的 pastedImgs node name 錯誤

## `2.0.1`

* 修正 listpicture 的起始點判斷
* 圖片來源處理 改用 forEach
* 修復 使用圖片項目符號 造成圖片來源錯誤
* 修復 使用 vml 造成圖片無法顯示  (IE, firefox 目前尚未解決)


## `2.0.0`

* 使用 React 新版 ref `forwardedRef` 使 summernote 內部核心元件可以被外部存取
   * 詳情請參閱 [Control Editor](http://10.9.173.136/SideProject/react-summernote#control-editor) 章節