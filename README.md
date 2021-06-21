# React SummerNote

React SummerNote 是一個 React 版本的 WYSIWYG 的 rich text editor，基於 [SummerNote](https://github.com/summernote/summernote) 建構

* **Latest Version: `v2.0.9`**
* **Stable Version: `v2.0.5`**
* 版本修改紀錄：[Changelog](http://10.190.173.136/SideProject/react-summernote/blob/master/CHANGELOG.md)

## [Online Demo](http://10.9.173.130:5566/)

上面連結是一個 React SummerNote 的基本展示

![Demo](https://i.imgur.com/JOOEENx.png)

## Package Dependencies

React SummerNote 依賴以下套件

#### 必要套件

* `react`: ^16.8.6
* `react-dom`: ^16.8.6
* `prop-types`: ^15.7.2

#### 第三方套件 

* `bootstrap`: ^4.3.1
* `popper.js`: ^1.15.0
* `summernote`: ^0.8.12
* `jquery`: ^3.4.1
* `store`: ^2.0.12


## Install 

#### 必要依賴安裝

```
npm install --save bootstrap popper.js summernote jquery store
```

#### 安裝 React SummerNote

```
npm install --save git+http://10.190.173.136/SideProject/react-summernote.git
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

![dd](http://10.190.173.136/uploads/-/system/personal_snippet/48/15d74641999a62e3979ef99d900cd546/dd.gif)

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

![Wordpaste](http://10.190.173.136/uploads/-/system/personal_snippet/48/e2b3193ab8a4d6d66879140931e52666/wordpaste.gif)


## Paste from Office Excel

貼上 Excel 內容時，SummerNote 會解析剪貼簿中的 HTML 內容，解析後會自動將樣式附加進去，但目前不支援包含 Excel 中的圖片，需額外逐一手動複製貼上

![Excel](http://10.190.173.136/uploads/-/system/personal_snippet/40/58992bbadcc7e42f7095129be4845b0a/messageImage_1607666354357.jpg)

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

若要自行引入 plugin 可參考 [Plugin 介紹](/src/plugin)


## License

The MIT License (MIT)  
Copyright (c) 2020 Zap