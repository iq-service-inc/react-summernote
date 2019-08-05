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


## Install 

#### 必要依賴安裝

```
npm install --save bootstrap popper.js summernote jquery
```

#### 安裝 React SummerNote

```
npm install --save http://192.168.1.136/SideProject/react-summernote.git
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

## `options`

設置 `options` props，即可設置客製化功能與 UI 顯示

### [summernote deep-dive](https://summernote.org/deep-dive/)

更詳細的設定方式，可以參閱上面的官方說明



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