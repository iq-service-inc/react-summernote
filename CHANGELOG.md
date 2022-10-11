# Changelog
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