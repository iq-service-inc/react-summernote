# React SummerNote

React SummerNote 是一個 React 版本的 WYSIWYG 的 rich text editor，基於 [SummerNote](https://github.com/summernote/summernote) 建構

## [Online Demo](http://192.168.1.130:5566/)

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
* `rtf.js`：git+https://github.com/LinZap/rtf.js.git


## Install 

#### 必要依賴安裝

```
npm install --save bootstrap popper.js summernote jquery https://github.com/LinZap/rtf.js.git
```

#### 安裝 React SummerNote

```
npm install --save git+http://192.168.1.136/SideProject/react-summernote.git
```

#### 設定 Webpack

使 jQuery 可以在 Component 中被存取，而不需額外 import

```js
{
    ...,
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
			jQuery: "jquery",
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
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video']],
                ['view', ['fullscreen', 'codeview']]
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

## `options`

設置 `options` props，即可設置客製化功能與 UI 顯示

### [summernote deep-dive](https://summernote.org/deep-dive/)

更詳細的設定方式，可以參閱上面的官方說明


## Upload Image

自訂上傳圖片的方法，複製圖片(剪貼簿中)貼上編輯器時，就會觸發該方法

```jsx
import React, { Component } from 'react'
import SummerNote from './SummerNote'

function onImageUpload(file) {
    let image = file[0]
    SummerNote.insertImage('https://i.imgur.com/JOOEENx.png', ($image) => {
        $image.css("width", Math.floor($image.width() / 2));
        $image.attr("title", image.name);
    })
}

class App extends Component {
    render() {
        return (<SummerNote onImageUpload={onImageUpload}/>)
    }
}
```

![dd](http://chatbot.iqs-t.com/img/dd.gif)

## Paste from Microsoft Word

貼上 Word 內容時，SummerNote 會解析剪貼簿中的 rtf 內容 (使用 [rtf.js](https://github.com/LinZap/rtf.js))，解析後會自動將 `<img>` 部分轉換成 base64 格式的圖片資源，這些 `<img>` 都會被加上 class `.zap-img-uploading`，可以在使用 jQuery 進行後續處理

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

![Wordpaste](http://chatbot.iqs-t.com/img/wordpaste.gif)

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

## License

The MIT License (MIT)  
Copyright (c) 2019 Zap