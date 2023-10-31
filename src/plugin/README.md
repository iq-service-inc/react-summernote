# Summernote Plugins
## 打包 Plugins
打包 [src/plugin](/src/plugin) 檔案到 [plugin](/plugin) 目錄

```powershell
cd src\plugin
node .\bundle-plugins.js
```

## Contents
- [Summernote Plugins](#summernote-plugins)
  - [打包 Plugins](#打包-plugins)
  - [Contents](#contents)
  - [import plugins](#import-plugins)
  - [Example](#example)
  - [Button 功能](#button-功能)
  - [Plugin 簡介](#plugin-簡介)
    - [Custom](#custom)
      - [summernote-custom](#summernote-custom)
      - [summernote-custom-specialchars](#summernote-custom-specialchars)
      - [summernote-fontsize-input](#summernote-fontsize-input)
      - [summernote-toc](#summernote-toc)
    - [Formatting](#formatting)
      - [summernote-addclass](#summernote-addclass)
      - [summernote-case-converter](#summernote-case-converter)
      - [summernote-image-captionit](#summernote-image-captionit)
      - [summernote-image-shapes](#summernote-image-shapes)
      - [summernote-list-styles](#summernote-list-styles)
      - [summernote-pagebreak](#summernote-pagebreak)
      - [summernote-video-attributes](#summernote-video-attributes)
    - [Insert](#insert)
      - [summernote-at-mention](#summernote-at-mention)
      - [summernote-file](#summernote-file)
      - [summernote-element-template](#summernote-element-template)
      - [summernote-template](#summernote-template)
      - [summernote-templates](#summernote-templates)
    - [Misc](#misc)
      - [summernote-drafts](#summernote-drafts)
      - [summernote-ext-print](#summernote-ext-print)
      - [summernote-text-findnreplace](#summernote-text-findnreplace)
      - [summernote-ext-table](#summernote-ext-table)
    - [Special Characters \& Icons](#special-characters--icons)
      - [summernote-ext-specialchars](#summernote-ext-specialchars)
    - [Syntax  (棄用)](#syntax--棄用)
      - [~~summernote-ext-highlight~~](#summernote-ext-highlight)

## import plugins
```js
require('react-summernote/plugin/custom/summernote-custom')
require('react-summernote/plugin/custom/summernote-fontsize-input')
require('react-summernote/plugin/custom/summernote-toc')

require('react-summernote/plugin/formatting/summernote-addclass')
require('react-summernote/plugin/formatting/summernote-case-converter')
require('react-summernote/plugin/formatting/summernote-image-captionit')
require('react-summernote/plugin/formatting/summernote-image-shapes')
require('react-summernote/plugin/formatting/summernote-list-styles')
require('react-summernote/plugin/formatting/summernote-list-styles.css')
require('react-summernote/plugin/formatting/summernote-pagebreak')
require('react-summernote/plugin/formatting/summernote-video-attributes')

require('react-summernote/plugin/insert/summernote-at-mention')
require('react-summernote/plugin/insert/summernote-file')
require('react-summernote/plugin/insert/summernote-element-template')

require('react-summernote/plugin/misc/summernoteDrafts')  // see summernote-drafts to install store
require('react-summernote/plugin/misc/summernote-ext-print')
require('react-summernote/plugin/misc/summernote-text-findnreplace')
require('react-summernote/plugin/misc/summernote-ext-table')
require('react-summernote/plugin/misc/summernote-ext-table.css')

require('react-summernote/plugin/special_characters/summernote-ext-specialchars')

//require('react-summernote/plugin/syntax/summernote-ext-highlight')  // require run_prettify
//require('react-summernote/plugin/syntax/run_prettify')
```

## Example
```js
options = {{
  lang: `zh-TW`,
  toolbar: [
    [`icon`, [`emoji`, `specialChar`]],
    [`style`, [`style`, `addclass`]],
    [`font`, [`caseConverter`, `bold`, `underline`, `clear`]],
    [`fontname`, [`fontname`]],
    ['fontsize', ['fontsizeInput']],
    ['color', ['color']],
    [`para`, [`customUL`, `ol`, 'listStyles', `paragraph`]],
    [`table`, [`jTable`, `jMerge`, `jBackcolor`, `jBorderColor`, `jAlign`, `jAutoFit`, `jTableInfo`, `jWidthHeightReset`, `jAddDeleteRowCol`]],
    ["tableRow", ["jRowHeight"]],
    ["tableCol", ["jColWidth"]],
    [`insert`, [`link`, `picture`, 'videoAttributes', 'audio', 'file', 'template']],
    [`print`, [`pagebreak`, `print`]],
    ['misc', ['sDraftsLoad', 'sDraftsSave', 'findnreplace']],
    //['syntax', ['highlight']],
    ['toc', ['anchor', 'toc', 'editAnchor', 'markAnchor']],
    [`view`, [`fullscreen`, `codeview`]],
  ],
  popover: {
    image: [
      ['custom', ['captionIt', 'imageShapes']],
      ['float', ['floatLeft', 'floatRight']],
      ['remove', ['removeMedia']]
    ],
    table: [
      ['merge', ['jMerge']],
      ['style', ['jBackcolor', 'jBorderColor', 'jAlign', 'jAddDeleteRowCol']],
      ['info', ['jAutoFit', 'jTableInfo']],
      ['delete', ['jWidthHeightReset', 'deleteTable']],
    ]
  },
  tableClassName: 'jtable table-bordered',
  callbacks: {
    onFileUpload: (file) => {}, // 自行處理上傳的檔案
    onFileLinkInsert: (url) => {}, // 自行處理插入的網址
    onFileUploadError: () => {},  // 上傳的檔案不支援或插入的網址有誤
    onFileUploadDone: () => {},
    summernoteAtMention: {
      getSuggestions:  (value) => {
        const user = ['Amy', 'Ban', 'Curry'];
        return user.filter((name) => {
          return name.includes(value) && name !== value
        });
      },
    },
  },
  sDrafts: {
    storePrefix: 'sDrafts'
  },
  template: {
    list: {
      'sample text': $('<span><h1>sample</h1> text</span>'),
      'bussiness letter': $(ReactDOMServer.renderToString(<BussinessLetter Date={new Date().toLocaleString()}/>))
      // render at initial
    }
  },
  fontsizeInput: {
      max: 200,
      min: 5,
      sizes: ['8', '9', '10', '11', '12', '14', '16', '18', '26', '42', '74']
  },
}}
```

## Button 功能
-  [Custom](#custom)
   - summernote-custom
     - `customUL`: 插入項目清單 `ul` 並自動帶入 `padding-left: 40px;`
   - summernote-custom-specialchars
     - `customSpecialChar`: 插入特殊符號
   - summernote-fontsize-input
     - `fontsizeInput`: 更新字號
   - summernote-toc
     - `anchor`: 插入錨點
     - `toc`: 產生 TOC ，置於 toolbar
     - `markAnchor`: 顯示錨點

-  [Formatting](#formatting)
   - summernote-addclass
     - `addclass`: 套用 class 樣式
   - summernote-case-converter
     - `caseConverter`: 切換文字大小寫
   - summernote-image-captionit
     - `captionIt`: 插入圖片標題，`image popover`
   - summernote-image-shapes
     - `imageShapes`: 套用圖片樣式/外框，`image popover`
   - summernote-list-styles
     - `listStyles`: 變更項目符號
   - summernote-pagebreak
     - `pagebreak`: 插入分頁符號
   - summernote-video-attributes
     - `videoAttributes`: 插入影片，設定影片屬性

-  [Insert](#insert)
   - summernote-file
     - `file`: 上傳檔案或插入網址的檔案
   - summernote-element-template
     - `template`: 套用設定的 template

-  [Misc](#misc)
   - summernote-drafts
     - `sDraftsLoad`: 載入儲存的草稿
     - `sDraftsSave`: 儲存草稿到 local storage
   - summernote-ext-print
     - `print`: 列印編輯器的內容
   - summernote-text-findnreplace
     - `findnreplace`: 開啟搜尋與取代
   - summernote-ext-table
     - `jTable`: 新增適用於 table resizing 的表格，`toolbar` & `table popover`
     - `jMerge`: 框選後合併 cell，`toolbar` & `table popover`
     - `jBackcolor`: cell 的背景色，`toolbar` & `table popover`
     - `jBorderColor`: 整個表格 border 顏色，`toolbar` & `table popover`
     - `jAlign`: cell 的對齊方式，`toolbar` & `table popover`
     - `jAutoFit`: 自動調整 table 欄寬，`toolbar` & `table popover`
     - `jRowHeight`: 輸入框調整列高
     - `jColWidth`: 輸入框調整欄寬
     - `jTableInfo`: 調整整個 table 的 margin，`toolbar` & `table popover`
     - `jWidthHeightReset`: 重設 cell 寬高，`toolbar` & `table popover`

-  [Special Characters & Icons](#special-characters-icons)
   - summernote-ext-specialchars
     - `specialChar`: 插入特殊符號

-  ~~[Syntax](#syntax)~~  (棄用)
   - ~~summernote-ext-highlight~~
     - ~~`highlight`: 插入程式碼片段~~

## Plugin 簡介
### Custom

#### summernote-custom
- custom ul button, close toolbar colorplette, table popover language zh-TW
- `toolbar` button: `customUL`
- `customUL`: 插入項目清單 `ul` 並自動帶入 `padding-left: 40px;`

#### summernote-custom-specialchars
- 改寫自 [summernote-ext-specialchars](https://github.com/JustinEldracher/summernote-plugins/tree/master/summernote-ext-specialchars)
- Few tweaks to the official specialchars plugin, revising the view and making it more mobile-friendly
- 插入特殊符號
- `toolbar` button: `customSpecialChar`
 - `customSpecialChar`: 插入特殊符號

#### summernote-fontsize-input
- 以輸入框和下拉選單更新 fontsize
- `toolbar` button: `fontsizeInput`
  - `fontsizeInput`: 更新字號

    ```js
    // options
    fontsizeInput: {
        max: 200,   // input 最大值 (px)
        min: 5,     // input 最小值 (px)
        sizes: ['8', '9', '10', '11', '12', '14', '16', '18', '26', '42', '74'] // dropdown 選項 (px)
    }
    ```

#### summernote-toc
- 插入 anchor 快捷鍵 `ctrl` + `shift` + `a`
- `toolbar` button: `anchor`, `toc`, `editAnchor`, `markAnchor`
  - `anchor`: 插入錨點
  - `toc`: 產生 TOC ，置於 toolbar
  - `editAnchor`: 編輯錨點
  - `markAnchor`: 顯示錨點

    ```js
    // options
    toc: {
      selector: '#test_toc' // 使用 selector 指定 toc 的位置，預設放置在 toolbar
    },
    ```

- 自行製作 TOC
```js
$editor.find(`.${prefix}-toc-anchor`).each((i, d) => {
    let text = $(d).attr('data-anchortext'),
        id = $(d).attr('id')
    
    // 產生 TOC
    var anchor = $('<a>').attr('href', '#' + id)
    anchor.text(text)
    var li = $('<li>').append(anchor)
    $('#selector').append(li)
})
```

### Formatting

#### [summernote-addclass](https://github.com/creativeprogramming/summernote-addclass)
   - With this plugin you will get a configurable button so you'll be able to toggle custom CSS classes in summernote elements (like the default 'style' button, but you can define custom CSS classes, eg. your favourite UI framework styling classes)
   - 選取文字套用 class 樣式，預設可套用 bootstrap class 樣式，也可改用自訂的 class 樣式
   - `toolbar` button: `addclass`
     - `addclass`: 套用 class 樣式
   
    ```js
    // options
    addclass: {
      debug: false,
      // title: example text on list, value: className (multipule className accepted)
      // 使用自訂的 class
      classTags: [`test`, `classname`, {title:`Button`, value:`btn btn-success`}]
    },
    ```

#### [summernote-case-converter](https://github.com/piranga8/summernote-case-converter)
   - Adds a button to the Toolbar with a dropdown that allows case converting in any text in the editor.
   - 文字大小寫轉換
   - `toolbar` button: `caseConverter`
     - `caseConverter`: 切換文字大小寫

#### [summernote-image-captionit](https://github.com/DiemenDesign/summernote-image-captionit)
   - Allows adding figure and figcaption to images, with removal when selected twice.
   - 圖片標題
   - `image popover` button: `captionIt`
     - `captionIt`: 插入圖片標題

#### [summernote-image-shapes](https://github.com/DiemenDesign/summernote-image-shapes)
   - Adds option with dropdown to the Image Popover to add or remove Bootstrap Image Classes for styling the look and behaviour of images.
   - bootstrap 圖片樣式
   - `image popover` button: `imageShapes`
     - `imageShapes`: 套用圖片樣式/外框

#### [summernote-list-styles](https://github.com/tylerecouture/summernote-list-styles)
   - Adds a toolbar dropdown menu to change the number/bullet style of HTML lists.
   - 更多項目符號、編號樣式 (都使用 `ol` 表現)
   - 括弧類項目符號需要 css 才能顯示，參考 [summernote-list-styles.css](formatting/summernote-list-styles.css)
   - `toolbar` button: `listStyles`
     - `listStyles`: 變更項目符號

#### [summernote-pagebreak](https://github.com/DiemenDesign/summernote-pagebreak)
   - Visually add Page-Breaks to editor content.
   - 分頁符號自動套用再列印模式
   - `toolbar` button: `pagebreak`
     - `pagebreak`: 插入分頁符號

#### [summernote-video-attributes](https://github.com/DiemenDesign/summernote-video-attributes)
   - Adds a Toolbar Button for Allowing to edit Video Attributes before inserting into Editor.
   - 影片屬性
   - `toolbar` button: `videoAttributes`
     - `videoAttributes`: 插入影片，設定影片屬性

### Insert

#### [summernote-at-mention](https://github.com/team-loxo/summernote-at-mention)
   - Triggers a dropdown with autocomplete options whenever the `@` character is encountered in a new word.
   - `@`提示清單，設定 `callbacks` 處理列表

    ```js
    // options
    callbacks: {
      summernoteAtMention: {
        getSuggestions:  (value) => {
          const user = ['Amy', 'Ban', 'Curry']; // 推薦列表
          return user.filter((name) => {
            return name.includes(value) && name !== value
          });
        },
      },
    },
    ```


#### [summernote-file](https://github.com/nobsod-freelance/summernote-file)
   - Summernote plugin to insert files by URL or file upload
   - 插入圖檔、音檔、影片檔，提供 `callbacks`
   - `toolbar` button: `file`
     - `file`: 上傳檔案或插入網址的檔案

    ```js
    // options
    callbacks: {
      onFileUpload: (file) => {}, // 自行處理上傳的檔案
      onFileLinkInsert: (url) => {}, // 自行處理插入的網址
      onFileUploadError: () => {},  // 上傳的檔案不支援或插入的網址有誤
      onFileUploadDone: () => {}
    },
    ```


#### summernote-element-template
   - 插入 template ，改成用 jquery 從 React 初始化 template
   - `toolbar` button: `template`
     - `template`: 套用設定的 template
   
   ```js
    import ReactDOMServer from 'react-dom/server'
    render(
      <SummerNote options={{
      template: {
          list: {
            // 從 react 設定
            'sample text': $('<span><h1>sample</h1> text</span>'),
            'bussiness letter': $(ReactDOMServer.renderToString(<BussinessLetter Date={new Date().toLocaleString()}/>))  // render React element to html
          }
        }
      }}/>
    , document.getElementById('root'))
   ```

#### [summernote-template](https://github.com/Nanakii/summernote-plugins/tree/master/plugin/template)
   - Dropdown of pre-defined custom templates. You can add your own html templates and insert them in the editor in one click.
   - 整合到 summernote-element-template

#### [summernote-templates](https://github.com/DiemenDesign/summernote-templates)
   - Add Toolbar Buttons to add Page and Block Templates from html template files.
   - 整合到 summernote-element-template

### Misc

#### [summernote-drafts](https://github.com/MissAllSunday/summernoteDrafts)
   - Allows users to save and load drafts directly on the editor.
   - 使用 local storage 儲存草稿，需要 [store.js](https://github.com/marcuswestin/store.js/#installation)
   - `toolbar` button: `sDraftsLoad`, `sDraftsSave`
     - `sDraftsLoad`: 載入儲存的草稿
     - `sDraftsSave`: 儲存草稿到 local storage

   ```sh
    npm i store
   ```

   ```js
    // webpack
    plugins: [
      new webpack.ProvidePlugin({
        store: `store`
      })
    ],
   ```

   ```js
    // options
    sDrafts: {
      // 可自行設定草稿的 prefix ，用於判斷 local storage 中要顯示的草稿
      storePrefix: 'sDrafts'
    },
   ```

#### [summernote-ext-print](https://github.com/lqez/summernote-ext-print)
   - Add print button on toolbar. This allows summernote to print its own document, not whole page.
   - 列印編輯器內的內容，可搭配 summernote-pagebreak
   - `toolbar` button: `print`
     - `print`: 列印編輯器的內容

#### [summernote-text-findnreplace](https://github.com/DiemenDesign/summernote-text-findnreplace)
   - Adds an area to the Toolbar when plugin button is select to allow find and replace in the editor area.
   - 搜尋取代
   - `toolbar` button: `findnreplace`
     - `findnreplace`: 開啟搜尋與取代

#### [summernote-ext-table](https://github.com/ksy11/summernote-ext-table)
   - Adds table column/row resize, cell background-color change, cell merge, cell unmerge, border-color change, table margin change, table width/height reset.
   - table 功能
   - `toolbar` and `table popover` button: `jMerge`, `jBackcolor`, `jBorderColor`, `jAlign`, `jAddDeleteRowCol`, `jAutoFit`, `jRowHeight`, `jColWidth`, `jTableInfo`, `jWidthHeightReset`
     - `jTable`: 新增適用於 table resizing 的表格
     - `jMerge`: 框選後合併 cell
     - `jBackcolor`: cell 的背景色
     - `jBorderColor`: 整個表格 border 顏色
     - `jAlign`: cell 的對齊方式
     - `jAutoFit`: 自動調整 table 欄寬提供「自動調整成內容大小」、「自動調整成視窗大小」、「固定欄寬」三種模式
     - `jRowHeight`: 輸入框調整列高
     - `jColWidth`: 輸入框調整欄寬
     - `jTableInfo`: 調整整個 table 的 margin
     - `jWidthHeightReset`: 重設 cell 寬高

### Special Characters & Icons

#### [summernote-ext-specialchars](https://github.com/JustinEldracher/summernote-plugins/tree/master/summernote-ext-specialchars)
   - Few tweaks to the official specialchars plugin, revising the view and making it more mobile-friendly
   - 插入特殊符號
   - `toolbar` button: `specialChar`
     - `specialChar`: 插入特殊符號

### Syntax  (棄用)

#### ~~[summernote-ext-highlight](https://github.com/heyanlong/summernote-ext-highlight)~~
   - ~~Based on code-prettify the summernote code highlighting plugin~~
   - ~~code prettify，使用 [Google code-prettify](https://github.com/googlearchive/code-prettify)，`react-summernote/plugin/syntax/run_prettify`~~
   - ~~`toolbar` button: `highlight`~~
     - ~~`highlight`: 插入程式碼片段~~

