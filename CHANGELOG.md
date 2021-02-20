# Changelog


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