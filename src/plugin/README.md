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
    - [Lang](#lang)
      - [summernote-zh-TW](#summernote-zh-tw)
    - [Custom](#custom)
      - [summernote-comment-popover](#summernote-comment-popover)
      - [summernote-custom-contextmenu](#summernote-custom-contextmenu)
      - [summernote-custom](#summernote-custom)
      - [summernote-custom-specialchars](#summernote-custom-specialchars)
      - [summernote-fontsize-input](#summernote-fontsize-input)
      - [summernote-imagemap](#summernote-imagemap)
      - [summernote-pasteHTML](#summernote-pastehtml)
      - [summernote-toc](#summernote-toc)
    - [Formatting](#formatting)
      - [summernote-addclass](#summernote-addclass)
      - [summernote-case-converter](#summernote-case-converter)
      - [summernote-image-attributes](#summernote-image-attributes)
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
require('react-summernote/plugin/lang/summernote-zh-TW')

require('react-summernote/plugin/custom/summernote-comment-popover')
require('react-summernote/plugin/custom/summernote-custom-contextmenu')
require('react-summernote/plugin/custom/summernote-custom-specialchars')
require('react-summernote/plugin/custom/summernote-custom')
require('react-summernote/plugin/custom/summernote-fontsize-input')
require('react-summernote/plugin/custom/summernote-imagemap')
require('react-summernote/plugin/custom/summernote-pastehtml')
require('react-summernote/plugin/custom/summernote-toc')
require('react-summernote/plugin/custom/summernote-view-classlist')

require('react-summernote/plugin/formatting/summernote-addclass')
require('react-summernote/plugin/formatting/summernote-case-converter')
require('react-summernote/plugin/formatting/summernote-image-attributes')
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
    [`table`, [`jTable`, `jInsertTableDialog`, `jMerge`, `jBackcolor`, `jBorderColor`, `jAlign`, `jAutoFit`, `jTableInfo`, `jWidthHeightReset`, `jAddDeleteRowCol`]],
    ["tableRow", ["jRowHeight"]],
    ["tableCol", ["jColWidth"]],
    [`insert`, [`link`, `picture`, 'imageMap', 'videoAttributes', 'audio', 'file', 'template']],
    [`print`, [`pagebreak`, `print`]],
    ['misc', ['sDraftsLoad', 'sDraftsSave', 'findnreplace']],
    //['syntax', ['highlight']],
    ['toc', ['anchor', 'toc', 'editAnchor', 'markAnchor']],
    [`view`, [`fullscreen`, `codeview`]],
  ],
  popover: {
    image: [
      ['custom', ['imageAttributes', 'captionIt', 'imageShapes', 'imageMap']],
      ['resize', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
      ['float', ['floatLeft', 'floatRight', 'floatNone']],
      ['remove', ['removeMedia']],
    ],
    link: [
      ['link', ['linkDialogShow', 'unlink']],
    ],
    table: [
      ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
      ['delete', ['deleteRow', 'deleteCol']],
      ['color', ['jBackcolor', 'jBorderColor' ]],
      ['style', ['jAlign', 'jMerge' ]],
      ['info', ['jAutoFit', 'jTableInfo']],
      ['delete', ['jWidthHeightReset', 'deleteTable']],
    ],
    air: [
      ['color', ['color']],
      ['font', ['bold', 'underline', 'clear']],
      ['para', ['ul', 'paragraph']],
      ['table', ['table']],
      ['insert', ['link', 'picture']],
      ['view', ['fullscreen', 'codeview']],
    ],
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
   - summernote-comment-popover
     - `editPopover`: 插入註解 popover
     - `removePopover`: 移除註解 popover
   - summernote-custom
     - `customUL`: 插入項目清單 `ul` 並自動帶入 `padding-left: 40px;`
   - summernote-custom-specialchars
     - `customSpecialChar`: 插入特殊符號
   - summernote-fontsize-input
     - `fontsizeInput`: 更新字號
   - summernote-imagemap
     - `imageMap`: 插入影像地圖，`toolbar` & `image popover`
   - summernote-pastehtml
     - `pasteHTML`: 插入 HTML
   - summernote-toc
     - `anchor`: 插入錨點
     - `toc`: 產生 TOC ，置於 toolbar
     - `markAnchor`: 顯示錨點

-  [Formatting](#formatting)
   - summernote-addclass
     - `addclass`: 套用 class 樣式
   - summernote-case-converter
     - `caseConverter`: 切換文字大小寫
   - summernote-image-attributes
     - `imageAttributes`: 編輯圖片屬性，`image popover`
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
     - `jInsertTableDialog`: 透過 dialog 新增適用於 table resizing 的表格，`toolbar` & `table popover`
     - `jAddDeleteRowCol`: 框選 新增/刪除 欄/列，`toolbar` & `table popover`
     - `jMerge`: 框選後合併/分割 cell，`toolbar` & `table popover`
     - `jBackcolor`: cell 的背景色，`toolbar` & `table popover`
     - `jBorderColor`: 整個表格 border 顏色，`toolbar` & `table popover`
     - `jAlign`: cell 的對齊方式，`toolbar` & `table popover`
     - `jAutoFit`: 自動調整 table 欄寬，`toolbar` & `table popover`
     - `jRowHeight`: 輸入框調整列高，`toolbar`
     - `jColWidth`: 輸入框調整欄寬，`toolbar`
     - `jTableInfo`: 調整整個 table 的 margin，`toolbar` & `table popover`
     - `jWidthHeightReset`: 重設 cell 寬高，`toolbar` & `table popover`
     - `jAddRowTop`: 在上方插入列
     - `jAddRowBottom`: 在下方插入列
     - `jAddColLeft`: 在左方插入欄
     - `jAddColRight`: 在右方插入欄
     - `jDeleteRow`: 刪除列
     - `jDeleteCol`: 刪除欄
     - `jCellMerge`: 合併儲存格
     - `jCellSplit`: 分割儲存格
     - `jFontname`: 框選更新表格內字體，`table popover`

-  [Special Characters & Icons](#special-characters-icons)
   - summernote-ext-specialchars
     - `specialChar`: 插入特殊符號

-  ~~[Syntax](#syntax)~~  (棄用)
   - ~~summernote-ext-highlight~~
     - ~~`highlight`: 插入程式碼片段~~

## Plugin 簡介
### Lang

#### [summernote-zh-TW](https://github.com/summernote/summernote/blob/c54e1dc220bdceff7a416fb42cad1b5812323afa/src/lang/summernote-zh-TW.js)
    - 更新 summernote 繁中翻譯

### Custom

#### summernote-comment-popover
- 框選文字段落加上註解 popover
- 若要在編輯器以外顯示需要設定
  - 初始化 popover
  - 定義 popover css
- `toolbar` button: `editPopover`, `removePopover`
  - `editPopover`: 插入註解 popover
  - `removePopover`: 移除註解 popover

    ```js
    // options
    commentPopover: {
        className: 'summernote-comment-popover',  // popover classname
        anchorClassName: 'summernote-comment-popover-anchor',   // popover anchor classname
        urlPattern: /https?:\/\/(?:[\w\u00a1-\uffff]+\.?)+(?::\d{2,5})?(?:\/[^\s]*)?/,  // test image url validity
        titleMaxLength: 100,  // title input maxlength
        contentMaxLength: 100,  // content input maxlength
        disabledImage: false,   // disable popover image
        disabledTitle: true,    // disable popover title
        disabledContent: false, // disable popover content
        displayDelay: 300,  // delay display popover
    }
    ```
    
    使用 className 初始化 popover

    ```js
    $(a.summernote-comment-popover-anchor[data-toggle="popover"]).popover()
    ```

    設定 className css

    ```css
    .summernote-comment-popover-anchor:not([href]){color: #8ac193;}
    .summernote-comment-popover-anchor:not([href]):hover{color: #8ac193; text-decoration: underline;}
    .summernote-comment-popover .popover-image {max-height: 500px; width: auto;}
    ```

#### summernote-custom-contextmenu
- 自定義右鍵功能列表
- 可將已定義的按鈕加入右鍵功能列表

    ```js
    // options
        customContextMenu: {
        className: 'summernote-custom-contextmenu',
        menuBtns: [
            // group
            [
                // button
                { key: 'cut', name: lang.customContextMenu.cut, },
            ],
            [
                {
                    // key: button key
                    // name: button text
                    // contents: if this button not in memo use contents to build new button
                    // toggle: this button only available on (Table, Anchor, List, Img)
                    // submenu: define submenu toggle on hover
                    key: 'jDeleteRowCol', name: lang.jTable.deleteCell,
                    contents: ui.icon(options.icons.rowRemove),
                    toggle: 'table',
                    submenu: [
                        { key: 'jDeleteRow', name: lang.table.delRow, },
                        { key: 'jDeleteCol', name: lang.table.delCol, },
                    ]
                },
            ]
        ],
        // open context menu callback function
        onContextMenuOpen: function (contextMenu) {
            // toggle button
        },
        // should initialize this plugin
        shouldInitialize: true,
    }
    ```

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

#### summernote-imagemap
- 編輯圖片影像地圖
- 依賴 bootstrap collapse
- `toolbar` and `image popover` button: `imageMap`
  - `imageMap`: 插入影像地圖

    ```js
    // options
    imageMap: {
        maxArea: 30,    // 區域數量上限
    }
    ```

#### summernote-pasteHTML
- 在游標位置插入 HTML
- `toolbar` button: `pasteHTML`
  - `pasteHTML`: 插入 HTML


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

#### [summernote-image-attributes](https://github.com/DiemenDesign/summernote-image-attributes)
   - This is a forked and extended version of "summernote-image-title", for those that want a little more control over editable attributes for Images.
   - 圖片屬性
   - `image popover` button: `imageAttributes`
     - `imageAttributes`: 編輯圖片屬性

    ```js
    // options
    imageAttributes: {
      autoInsertTitle: true     // Automatically insert image tile below the image
    }
    ```

#### [summernote-image-captionit](https://github.com/DiemenDesign/summernote-image-captionit)
   - Allows adding figure and figcaption to images, with removal when selected twice.
   - 圖片標題
   - `image popover` button: `captionIt`
     - `captionIt`: 插入圖片標題
     
    ```js
    // options
    captionIt: {
      captionInAnchor: false
    },
    ```

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
   - `toolbar` and `table popover` button: `jTable` `jMerge`, `jBackcolor`, `jBorderColor`, `jAlign`, `jAddDeleteRowCol`, `jAutoFit`, `jRowHeight`, `jColWidth`, `jTableInfo`, `jWidthHeightReset`, `jFontname`
     - `jTable`: 新增適用於 table resizing 的表格
     - `jInsertTableDialog`: 透過 dialog 新增適用於 table resizing 的表格
     - `jAddDeleteRowCol`: 框選 新增/刪除 欄/列
     - `jMerge`: 框選後合併/分割 cell
     - `jBackcolor`: cell 的背景色
     - `jBorderColor`: 整個表格 border 顏色
     - `jAlign`: cell 的對齊方式
     - `jAutoFit`: 自動調整 table 欄寬提供「自動調整成內容大小」、「自動調整成視窗大小」、「固定欄寬」三種模式
     - `jRowHeight`: 輸入框調整列高
     - `jColWidth`: 輸入框調整欄寬
     - `jTableInfo`: 調整整個 table 的 margin
     - `jWidthHeightReset`: 重設 cell 寬高
     - `jAddRowTop`: 在上方插入列
     - `jAddRowBottom`: 在下方插入列
     - `jAddColLeft`: 在左方插入欄
     - `jAddColRight`: 在右方插入欄
     - `jDeleteRow`: 刪除列
     - `jDeleteCol`: 刪除欄
     - `jCellMerge`: 合併儲存格
     - `jCellSplit`: 分割儲存格
     - `jFontname`: 框選更新表格內字體

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

