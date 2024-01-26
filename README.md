# [React SummerNote](https://www.npmjs.com/package/@iqs/react-summernote)

React SummerNote 是一個 React 版本的 WYSIWYG 的 rich text editor，基於 [SummerNote](https://github.com/summernote/summernote) 建構

* **Stable Version: `v2.3.2`**

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
require('bootstrap/js/dist/tab')
require('summernote/dist/summernote-bs4.css')
require('summernote/dist/summernote-bs4.min.js')
require('react-summernote/plugin/custom/summernote-patch-dom')
require('react-summernote/plugin/custom/summernote-patch-handle')
```

> `summernote-patch-dom`: 用於修復字體、字型等樣式無法正常套用到框選範圍內的所有節點。因官方尚未發布涵蓋 [Summernote PR#4472](https://github.com/summernote/summernote/pull/4472) 的版本，故在此使用 plugin 覆寫 `dom.walkPoint`, `dom.nextPointWithEmptyNode`
> 
> 目前 Summernote 版本 `0.8.18`，待官方發佈新版本後可移除此 plugin
> 
> 參考：[Summernote issue#4471](https://github.com/summernote/summernote/issues/4471)

> `summernote-patch-handle`: 用於修復圖片顯示框位置偏移。因官方尚未發布涵蓋 [Summernote PR#4283](https://github.com/summernote/summernote/pull/4283) 的版本，故在此使用 plugin 覆寫 `modules.handle.update`
> 
> 目前 Summernote 版本 `0.8.18`，待官方發佈新版本後可移除此 plugin


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

## 嵌入影片
以下是依據 [Summernote 0.8.18 videoDialog](https://github.com/summernote/summernote/blob/v0.8.18/src/js/base/module/VideoDialog.js#L49) 整理出已知的有效網址


### YouTube

- YouTube 網域 + 路徑 + id
    - `https://youtube.com/embed/Dm_BrGu1sHM`
- YouTube 網域 + 路徑 + id + 時戳
    - `https://www.youtube.com/watch?v=Dm_BrGu1sHM&t=300`
    - `https://m.youtube.com/v/Dm_BrGu1sHM?t=300`
- **網址附帶的其他參數需放在時戳之後**
    - `https://m.youtube.com/v/Dm_BrGu1sHM?t=300&si=YsiSA_iLcKJMtDVq`


| 網域                                                       | 路徑                                                         | id         | 時戳                                                   |
| ---------------------------------------------------------- | ------------------------------------------------------------ | ---------- | ------------------------------------------------------ |
| `youtube.com/`<br> `www.youtube.com/`<br> `m.youtube.com/` | `embed/`<br> `v/`<br> `watch?v=`<br> `watch?`(任意字元)`&v=` | (11個字元) | `?t=`(任意字元)<br> `&t=`(任意字元)<br> `t=`(任意字元) |



### Instagram

- Instagram 網域 + 路徑 + id
    - `https://www.instagram.com/p/Cy8sEXrv9xu`
- **網址附帶的其他參數需放在 id 之後**
    - `https://www.instagram.com/p/Cy8sEXrv9xu?igshid=MzRlODBiNWFlZA==`


| 網域                                     | 路徑 | id         |
| ---------------------------------------- | ---- | ---------- |
| `www.instagram.com/`<br>`instagram.com/` | `p/` | (任意字元) |

### 優酷

- 優酷網域 + 路徑 + `id_` + id + `.html`
    - `https://v.youku.com/v_show/id_XNTA3MzUyMTUyMA==.html`
- **網址附帶的其他參數需放在 `.html` 之後**
    - `https://v.youku.com/v_show/id_XNTA3MzUyMTUyMA==.html?spm=a2hja.14919748_WEBHOME_NEW.drawer15.d_zj1_4&s=efbfbd4a46efbfbd5975&scm=20140719.manual.19594.show_efbfbd4a46efbfbd5975`

| 網域           | 路徑      | 前綴  | id                              | 後綴    |
| -------------- | --------- | ----- | ------------------------------- | ------- |
| `v.youku.com/` | `v_show/` | `id_` | (至少一個任意字元)(零或數個`=`) | `.html` |

### DailyMotion

- DailyMotion網域 + 路徑 + id
    - `https://www.dailymotion.com/video/x8pi9hp`

| 網域                   | 路徑                 | id                                     | 參數                                                   |
| ---------------------- | -------------------- | -------------------------------------- | ------------------------------------------------------ |
| `www.dailymotion.com/` | `video/` <br> `hub/` | (至少一個非`_`的字元)(多個非`#`的字元) | (零組或一組 (`#video=`)(至少一個非 `_` 或 `&` 的字元)) |


## For contributor
### Setup Node
- `node`: v16.20.2
- `npm`: v8.19.4

以 nvm 安裝

```bash
nvm install v16.20.2
nvm use v16.20.2
```

### Install Dependencies
安裝依賴套件
- `npm ci` 依據 `package-lock.json` 安裝套件

```bash
npm ci
```


### NPM Scripts
npm 有準備以下指令，分別說明如下，如果您也想貢獻程式碼，可以參考使用：


* `npm run build`：用於打包整個套件，輸出到 `dist` 目錄下的一個 `main.js` 檔案，用於發布新的套件版本
* `npm run web`：以 `src/start.js` 為起始，打包出一個 demo 網站，輸出到 `docs`，並且使用 production 產品模式執行，用於發布成 Repo 的 Page 網站
* `npm run dev`：以 `src/start.js` 為起始，打包出一個 demo 網站，輸出到 `docs`，並且使用 dev 開發模式執行，用於發布成 Repo 的 Page 網站
* `npm run test`：啟動一個 `webpack-dev-server`，以 `src/test.js` 為起始，用於測試直接引用打包 (build) 後的 summernote ，觀察引用打包後的程式執行起來是否有問題
* `npm start`：開發人員主要模式，啟動一個 `webpack-dev-server`，以 `src/start.js` 為起始，用於測試原始程式執行起來是否有問題，並開發新功能


### Commit Message
可使用 vscode extension [Commit Message Editor](https://marketplace.visualstudio.com/items?itemName=adam-bender.commit-message-editor) 編輯 Commit Message

- 依據 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) ([中文版](https://www.conventionalcommits.org/zh-hant/v1.0.0/))
    - Type 必填，選對修改事項類型，不清楚選哪種可依據 [Angular CONTRIBUTING - Commit Message Format](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format)
    - Title 必填，概述修改事項 (Short description)
    - Scope 可選，目前未定義
    - Body 可選，可描寫變更的內容
    - Footer 可選，可寫 commit 簽署者資訊



### Code Structure
#### Summernote.jsx

[src/components/SummerNote.jsx](/src/components/SummerNote.jsx)

Summernote 連結器，與原生 Summernote 對接


#### App.jsx

[src/components/App.jsx](/src/components/App.jsx)

引入使用 Summernote Component，DEMO 呈現依賴此檔案設定

#### ImportCode.js

[src/components/ImportCode.js](/src/components/ImportCode.js)

ImportCode 會引入所有 Plugin，若有新增 Plugin 需要在此引入

```javascript=
module.exports = function () {
    // ...
    require('../plugin/custom/summernote-custom-style')
}
```


#### SummernotePlugin
@iqs/react-summernote: `v2.2.20` 開始

- [src/components/SummernotePlugin.jsx](/src/components/SummernotePlugin.jsx): 可在使用 React-Summernote 時匯入自定義的 Button 或 Plugin

- [src/components/SummernotePlugin.d.ts](/src/components/SummernotePlugin.d.ts): 設定 Summernote Types

```jsx
import SummerNote, { SummernotePlugin } from '@iqs/react-summernote'
```

Methods

- `SummernotePlugin.createSummernoteButton`
- `SummernotePlugin.createSummernotePlugin`

Types

- global `$.summernote`
- `SummernotePlugin.createSummernotePlugin`
- `SummernotePlugin.SummernotePluginClass`
- `SummernotePlugin.SummernotePluginFunction`
- `SummernotePlugin.createSummernoteButton`
- `SummernotePlugin.SummernoteContext`
- ...



#### Plugin
[src/plugin/](/src/plugin/)

Plugin 目錄架構由 [Awesome Summernote](https://github.com/summernote/awesome-summernote) 訂定，IQS 自己寫的都放在 [src/plugin/custom/](https://github.com/iq-service-inc/react-summernote/tree/master/src/plugin/custom)

檔案名稱以 `summernote-` 開頭，Plugin 名稱、按鈕名稱以 **小駝峰** 命名


有新增 Plugin 記得更新文件 [src/plugin/README.md](/src/plugin/README.md)


## For maintainer

### 上版 DEMO 網站流程
[iq-service-inc.github.io/react-summernote](https://iq-service-inc.github.io/react-summernote/)

1. **push** 到 **master** 分支

2. 觸發 Github Workflow **Deploy Master Branch to Github Pages**

3. 待 Workflow 完成即上版完成


### 發佈 npm 套件流程
[NPM - @iqs/react-summernote](https://www.npmjs.com/package/@iqs/react-summernote)

1. 修改 [README.md](README.md?plain=1#L5) 版本號

2. 修改 [package.json](package.json#L3) 版本號

3. 更新 [CHANGELOG.md](CHANGELOG.md)

4. **push** 到 **master** 分支

5. 發布 [Github Release](https://github.com/iq-service-inc/react-summernote/releases)
    - 選擇新 Tag
    - 標題為 Tag
    - 內容貼 CHANGELOG
    - 內容最後附上差異比對連結
        - e.g.
        ```markdown
        **Full Changelog**: https://github.com/iq-service-inc/react-summernote/compare/v2.2.19...v2.2.20
        ```

6. 觸發 Github Workflow **Publish Package to npmjs**

7. 待 Workflow 完成即發佈完成


## For repo admins

[.github/workflows/](https://github.com/iq-service-inc/react-summernote/tree/master/.github/workflows) 存放所有 Github Workflows

1. Deploy Master Branch to Github Pages: 自動部署 Pages

2. Publish Package to npmjs: 發佈 npm 套件

    > 若發布流程失敗，出現 `404 Not Found - PUT https://registry.npmjs.org/@iqs%2freact-summernote - Not found` 等訊息，可能是 Token 無效或過期

## License

The [MIT](LICENSE.md) License (MIT)  
Copyright (c) 2023 Zap