# [React SummerNote](https://www.npmjs.com/package/@iqs/react-summernote)

React SummerNote 是一個 React 版本的 WYSIWYG 的 rich text editor，基於 [SummerNote](https://github.com/summernote/summernote) 建構

* **Stable Version: `v2.2.16`**

* 版本修改紀錄：[Changelog](CHANGELOG.md)

# [Online Demo](https://iq-service-inc.github.io/react-summernote/)

上面連結是一個 React SummerNote 的基本展示

![Demo](https://i.imgur.com/JOOEENx.png)

## Package Dependencies

React SummerNote 依賴以下套件

#### 必要套件

* `react`: ^16.8.6
* `react-dom`: ^16.8.6
* `prop-types`: ^15.7.2

#### 第三方套件 

* `bootstrap`: ^4.6.2
* `popper.js`: ^1.16.1
* `summernote`: ^0.8.18
* `jquery`: ^3.6.1
* `store`: ^2.0.12


## Install 

#### 必要依賴安裝

```
npm i bootstrap popper.js summernote jquery store --save
```

#### 安裝 React SummerNote

```
npm i @iqs/react-summernote --save 
```

#### 設定 Webpack

使 jQuery, store 可以在 Component 中被存取，而不需額外 import

```js
{
    ...,
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            store: "store",
        })
    ] 
}
```

## Super simple to use

```jsx
import React from 'react'
import { render } from 'react-dom'
import SummerNote from 'react-summernote'

// 自動載入必要套件
SummerNote.ImportCode()

render(
    <SummerNote value="Default value"
        options={{
            lang: 'en',
            height: 350,
            dialogsInBody: true,
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['para', ['ul', 'ol', 'paragraph']],
                // plugin
                ["table", ["jTable", "jMerge", "jBackcolor", "jBorderColor", "jAlign", "jTableInfo", "jWidthHeightReset"]],
                ['insert', ['link', 'picture', 'video']],
                ['view', ['fullscreen', 'codeview']],
                //["anchor",["anchor", "toc", "markAnchor", "editAnchor"]]
            ]
        }}
        onChange={e => console.log(e)}
    />
    , document.getElementById('root')
)
```

## `options.toolbar`

* Insert
    * `picture`: open image dialog
    * `link`: open link dialog
    * `video`: open video dialog
    * `table`: insert a table
    * `hr`: insert a horizontal rule
* Font Style
    * `fontname`: set font family
    * `fontsize`: set font size
    * `color`: set foreground and background color
    * `forecolor`: set foreground color
    * `backcolor`: set background color
    * `bold`: toggle font weight
    * `italic`: toggle italic
    * `underline`: toggle underline
    * `strikethrough`: toggle strikethrough
    * `superscript`: toggle superscript
    * `subscript`: toggle subscript
    * `clear`: clear font style
* Paragraph style
    * `style`: format selected block
    * `ol`: toggle ordered list
    * `ul`: toggle unordered list
    * `paragraph`: dropdown for paragraph align
    * `height`: set line height
* Misc
    * `fullscreen`: toggle fullscreen editing mode
    * `codeview`: toggle wysiwyg and html editing mode
    * `undo`: undo
    * `redo`: redo
    * `help`: open help dialog
* Table ([Plugin](#plugin))
    * `jTable`: 表格欄位長寬縮放
    * `jMerge`: 框選後合併 cell
    * `jBackcolor`: cell 的背景色
    * `jBorderColor`: 整個表格 border 顏色
    * `jAlign`: cell 的對齊方式
    * `jTableInfo`: 調整整個 table 的 margin
    * `jWidthHeightReset`: 重設 cell 寬高

## `options`

設置 `options` props，即可設置客製化功能與 UI 顯示

### [summernote deep-dive](https://summernote.org/deep-dive/)

更詳細的設定方式，可以參閱上面的官方說明

## Control Editor

下面簡單示範如何使用新版 API 控制編輯器 (version > `v2.0.0`)

```jsx
import React, { Component } from 'react'
import SummerNote from './SummerNote'

class App extends Component {

    constructor(props) {
        super(props)
        this.editor = React.createRef()
    }

    componentDidMount(){
        const editor = this.editor.current
        editor.focus()                      // 焦點設置在 editor 上
        editor.isEmpty()                    // 編輯器內容是否為空
        editor.reset()                      // 清除編輯器所有內容
        editor.disable()                    // 使編輯器禁止輸入
        editor.enable()                     // 使編輯器可以輸入
        editor.insertImage()                // 插入圖片 (詳情可參考下一個段落)
        editor.insertNode(/* html node */)  // 插入 HTML 節點    
        editor.insertText('')               // 插入純文字 
    }
    render() {
        return (<SummerNote ref={this.editor}/>)
    }
}
```

## Upload Image

自訂上傳圖片的方法，複製圖片(剪貼簿中)貼上編輯器時，就會觸發該方法

```jsx
import React, { Component } from 'react'
import SummerNote from './SummerNote'

class App extends Component {

    constructor(props) {
        super(props)
        this.editor = React.createRef();
    }
    
    onImageUpload = file => {
        let image = file[0]
        this.editor.current.insertImage('https://i.imgur.com/JOOEENx.png', ($image) => {
            $image.css("width", Math.floor($image.width() / 2));
            $image.attr("title", image.name);
        })
    }

    render() {
        return (<SummerNote onImageUpload={this.onImageUpload} ref={this.editor}/>)
    }
}
```

![1](https://support6.iqs-t.com/img/react-summernote-1.gif)

## Paste from Office Word

貼上 Word 內容時，SummerNote 會解析剪貼簿中的 rtf 內容，解析後會自動將 `<img>` 部分轉換成 base64 格式的圖片資源，這些 `<img>` 都會被加上 class `.zap-img-uploading`，可以在使用 jQuery 進行後續處理

```jsx
import React, { Component } from 'react'
import SummerNote from './SummerNote'

function onImagePasteFromWord($imgs) {
    // $imgs collect imgs from this pasting action
    $imgs.removeClass('zap-img-uploading')
}

class App extends Component {
    render() {
        return (<SummerNote onImagePasteFromWord={onChange} />)
    }
}
```

![Wordpaste](https://support6.iqs-t.com/img/react-summernote-2.gif)


## Paste from Office Excel

貼上 Excel 內容時，SummerNote 會解析剪貼簿中的 HTML 內容，解析後會自動將樣式附加進去，但目前不支援包含 Excel 中的圖片，需額外逐一手動複製貼上

![Excel](https://support6.iqs-t.com/img/react-summernote-3.jpg)

## 自行 import 必要依賴

如果專案也有使用 Bootstrap 等套件，不希望重複引用，可以自行引入必要依賴

```js
// 自動載入必要套件
//SummerNote.ImportCode()

// 以下為必要依賴，可以自行在您的專案中引入 (須注意順序)
require('bootstrap/dist/css/bootstrap.min.css')
require('bootstrap/js/dist/modal')
require('bootstrap/js/dist/dropdown')
require('bootstrap/js/dist/tooltip')
require('summernote/dist/summernote-bs4.css')
require('summernote/dist/summernote-bs4.min.js')

```

## Plugin

從 `2.0.4` 的版本開始，引入了 table plugin，可針對 table 元素進行更多操作

```js
require('react-summernote/plugin/summernote-ext-table')
require('react-summernote/plugin/summernote-ext-table.css')
```

### 其他 Plugin

若要自行引入 plugin 可參考 [Plugin 介紹](src/plugin/README.md)

### 如果 Plugin 無法載入

請嘗試引用 `src/plugin` 裡面的 plugin

以 table plugin 為例
```js
require('@iqs/react-summernote/src/plugin/misc/summernote-ext-table')
require('@iqs/react-summernote/src/plugin/misc/summernote-ext-table.css')
```

## XSS 白名單

summernote 包含一個原始碼的 xss 過濾機制，規則如下：

```js
/<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml)[^>]*?>/gi
```

在 `options` 中修改內建白名單，即可客製化保留部分 tag 不被過濾

```jsx
<SummerNote value="Default value"
    options={{
        height: 350,
        toolbar: [
            ['view', ['fullscreen', 'codeview']],
        ],
        // 白名單
        codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml)[^>]*?>/gi, 
        // 白名單
        codeviewFilter: true, // 是否開啟白名單過濾
        codeviewIframeFilter: false // 是否開啟 iframe src 網址過濾
    }}
/>
, document.getElementById('root')
```

更多詳細設定可以參閱[官方文件](https://summernote.org/deep-dive/#xss-protection-for-codeview)

## For contributor

npm 有準備以下指令，分別說明如下，如果您也想貢獻程式碼，可以參考使用：


* `npm run build`：用於打包整個套件，輸出到 `dist` 目錄下的一個 `main.js` 檔案，用於發布新的套件版本
* `npm run web`：以 `src/start.js` 為起始，打包出一個 demo 網站，輸出到 `docs`，並且使用 production 產品模式執行，用於發布成 Repo 的 Page 網站
* `npm run dev`：以 `src/start.js` 為起始，打包出一個 demo 網站，輸出到 `docs`，並且使用 dev 開發模式執行，用於發布成 Repo 的 Page 網站
* `npm run test`：啟動一個 `webpack-dev-server`，以 `src/test.js` 為起始，用於測試直接引用打包 (build) 後的 summernote ，觀察引用打包後的程式執行起來是否有問題
* `npm start`：開發人員主要模式，啟動一個 `webpack-dev-server`，以 `src/start.js` 為起始，用於測試原始程式執行起來是否有問題，並開發新功能

## For repo admins

本 repo 現已與 GitHub Actions 連動，因此未來要發布新版時，只需要把新版本 push 上來之後發布一個 Release，GitHub Actions 就會自動將套件發布至 npm registry

## License

The [MIT](LICENSE.md) License (MIT)  
Copyright (c) 2023 Zap