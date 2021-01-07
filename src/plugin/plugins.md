# Plugins

## import plugins
```js
require('react-summernote/src/plugin/custom/summernote-custom')
require('react-summernote/src/plugin/custom/summernote-toc')

require('react-summernote/src/plugin/emoji/summernote-ext-emoji-ajax')
require('react-summernote/src/plugin/emoji/summernote-ext-emoji-ajax.css')

require('react-summernote/src/plugin/formatting/summernote-add-text-tags.css')
require('react-summernote/src/plugin/formatting/summernote-add-text-tags')
require('react-summernote/src/plugin/formatting/summernote-addclass')
require('react-summernote/src/plugin/formatting/summernote-case-converter')
require('react-summernote/src/plugin/formatting/summernote-image-captionit')
require('react-summernote/src/plugin/formatting/summernote-image-shapes')
require('react-summernote/src/plugin/formatting/summernote-list-styles')
require('react-summernote/src/plugin/formatting/summernote-list-styles.css')
require('react-summernote/src/plugin/formatting/summernote-pagebreak')
require('react-summernote/src/plugin/formatting/summernote-video-attributes')

require('react-summernote/src/plugin/insert/summernote-at-mention')
require('react-summernote/src/plugin/insert/summernote-file')
require('react-summernote/src/plugin/insert/summernote-element-template')

require('react-summernote/src/plugin/misc/summernoteDrafts')
require('react-summernote/src/plugin/misc/summernote-ext-print')
require('react-summernote/src/plugin/misc/summernote-text-findnreplace')
require('react-summernote/src/plugin/misc/summernote-ext-table')
require('react-summernote/src/plugin/misc/summernote-ext-table.css')

require('react-summernote/src/plugin/special_characters/summernote-ext-specialchars')

require('react-summernote/src/plugin/syntax/run_prettify')
require('react-summernote/src/plugin/syntax/summernote-ext-highlight')
```

## Custom
  - summernote-custom
    - custom ul button, close toolbar colorplette, table popover language zh-TW
    - button: 'customUL'
  - summernote-toc
    - 插入 anchor 快捷鍵 ctrl + shift + a
    - button: 'anchor', 'toc'

## Emojis
 - ~~[summernote-emoji-ext](https://github.com/nilobarp/summernote-ext-emoji)~~
   - Emoji plugin for summernote
   - 需要圖檔
 - ~~[summernote-emoji](https://github.com/JustinEldracher/summernote-plugins/tree/master/summernote-emoji)~~
   - Dropdown list of my favorite emojiOne images, embedded as base64 strings for easy portability
   - base64 img 數量較少
 - ~~[summernote-emoji](https://github.com/trinhtam/summernote-emoji) (?)~~
   - Summernote emoji plugin pro
   - import config.js 有問題
 - ~~[summernote-emojione-plugin](https://github.com/bmironov/summernote-emojione-plugin)~~
   - Full list of EmojiOne icons as buttons in modal window divided under multiple tabs (based on specialchar plugin v0.6.16)
   - 無法支援現在使用的 summernote 版本
 - [summernote-ext-emoji-ajax](https://github.com/tylerecouture/summernote-ext-emoji-ajax/)
   - Uses the github emoji api and loads them via ajax.
   - 從 [github api](https://api.github.com/emojis) 取得 emoji
   - button: 'emoji'


## Formatting
 - [summernote-add-text-tags](https://github.com/tylerecouture/summernote-add-text-tags)
   - Adds additional text-level semantic elements that are already provided with styling by Bootstrap 3 and 4, such as `<kbd>` and `<code>` etc.
   - bootstrap 文字樣式
   - button: 'add-text-tags'
 - [summernote-addclass](https://github.com/creativeprogramming/summernote-addclass)
   - With this plugin you will get a configurable button so you'll be able to toggle custom CSS classes in summernote elements (like the default 'style' button, but you can define custom CSS classes, eg. your favourite UI framework styling classes)
   - 選取文字套用自訂 class 樣式
   - button: 'addclass'
   
    ```js
     addclass: {
        debug: false,
        // title: example text on list, value: className (multipule className accepted)
        classTags: ["test", "classname", {title:"Button", value:"btn btn-success"}]
    },
    ```
 - [summernote-case-converter](https://github.com/piranga8/summernote-case-converter)
   - Adds a button to the Toolbar with a dropdown that allows case converting in any text in the editor.
   - 文字大小寫轉換
   - button: 'caseConverter'
 - ~~[summernote-classes](https://github.com/DiemenDesign/summernote-classes)~~
   - Adds functionality to display selected element with options to toggle classes as set in options.
   - 切換文字、圖片的 class，需要修改顯示，和 summernote-addclass 功能相似
 - ~~[summernote-cleaner](https://github.com/DiemenDesign/summernote-cleaner)(!)~~
   - Adds a Button to toolbar that when used cleans the MS Word Crud from the editor text.
   - 清除指定 tag，複寫 paste event，有衝突需要再整合
 - ~~[summernote-image-attributes](https://github.com/DiemenDesign/summernote-image-attributes)~~
   - This is a forked and extended version of "summernote-image-title", for those that want a little more control over editable attributes for Images.
   - bootstrap tabbed panes 無法使用
 - [summernote-image-captionit](https://github.com/DiemenDesign/summernote-image-captionit)
   - Allows adding figure and figcaption to images, with removal when selected twice.
   - 圖片下標
   - button: 'captionIt'
 - [summernote-image-shapes](https://github.com/DiemenDesign/summernote-image-shapes)
   - Adds option with dropdown to the Image Popover to add or remove Bootstrap Image Classes for styling the look and behaviour of images.
   - 圖片外框
   - button: 'imageShapes'
 - ~~[summernote-image-title](https://github.com/asiffermann/summernote-image-title)~~
   - Adds a button to the image popover to edit title and alt attributes.
 - [summernote-list-styles](https://github.com/tylerecouture/summernote-list-styles)
   - Adds a toolbar dropdown menu to change the number/bullet style of HTML lists.
   - 更多項目符號、編號樣式
   - button: 'listStyles'
 - [summernote-pagebreak](https://github.com/DiemenDesign/summernote-pagebreak)
   - Visually add Page-Breaks to editor content.
   - 分頁符號自動套用再列印模式
   - button: 'pagebreak'
 - ~~[summernote-paper-size](https://github.com/DiemenDesign/summernote-paper-size)~~
   - Add dropdown button to toolbar to allow changing editable area to reflect paper sizes.
   - 背景紙張樣式，僅供檢視用
 - ~~[summernote-rtl-plugin](https://github.com/virtser/summernote-rtl-plugin)~~
   - Summernote RTL plugin. This extensions allows to add two new buttons to Summernote editor toolbar. Those buttons let user change text direction to either LTR (left to right) or RTL (right to left).
   - 文字方向 rtl/ltr，text selection 有 bug 需要修改
 - ~~[summernote-table-headers](https://github.com/tylerecouture/summernote-table-headers)~~
   - Adds a button to the table popover allowing the user to toggle the first row as a table header. 
   - 與 summernote-ext-table 不相容，summernote-ext-table 需要再修改支援 th
 - ~~[summernote-table-styles](https://github.com/tylerecouture/summernote-table-styles)~~
   - Adds a button to the table popover allowing the user to apply Bootstrap table styles. 
   - 部分樣式會被 summernote-ext-table 覆蓋
 - ~~[summernote-text-manipulator](https://github.com/DiemenDesign/summernote-text-manipulator)~~
   - Adds a Dropdown to the Toolbar to perform different actions to selected text. 
   - 功能和 summernote-case-converter 類似，output status, text selection 有 bug
 - [summernote-video-attributes](https://github.com/DiemenDesign/summernote-video-attributes)
   - Adds a Toolbar Button for Allowing to edit Video Attributes before inserting into Editor.
   - 影片屬性
   - button: 'videoAttributes'
## Insert
 - [summernote-at-mention](https://github.com/team-loxo/summernote-at-mention)
   - Triggers a dropdown with autocomplete options whenever the `@` character is encountered in a new word.
   - @person，要寫 callbacks
 - ~~[summernote-audio](https://github.com/taalendigitaal/summernote-audio)~~
   - Summernote plugin to insert audio by URL or file upload
   - 插入音訊檔，summernote-file 包含此功能
 - ~~[summernote-bricks](https://github.com/eissasoubhi/summernote-bricks)(?)~~
   - A summernote module to add user-friendly components to the WYSIWYG editor.
   - 使用 npm 安裝，引入 plugin 時抓不到 jquery
 - [summernote-file](https://github.com/nobsod-freelance/summernote-file)
   - Summernote plugin to insert files by URL or file upload
   - 插入圖檔、音檔、影片檔
 - ~~[summernote-gallery](https://github.com/eissasoubhi/summernote-gallery)~~
   - A simple bootstrap image-gallery modal to add images with the real path to the server instead of using base64 encoding.
   - 範例圖片 src url
 - ~~[summernote-ext-elfinder](https://github.com/semplon/summernote-ext-elfinder)~~
   - Summernote Plugin for elFinder File Manager
   - [Connector Instructions Wiki on elFinder's Repository](https://github.com/Studio-42/elFinder/wiki/Integration-with-Multiple-Summernote-%28fixed-functions%29)
   - 檔案管理
 - ~~[summernote-list-of-links](https://github.com/lespoupeesrusses/summernote-list-of-links)~~
   - A plugin for the Summernote WYSIWYG editor, that lets you choose from an external list of links, provided as json.
   - 設定可使用的連結
 - ~~[summernote-loremipsum](https://github.com/DiemenDesign/summernote-loremipsum)~~
   - Add Toolbar button with Dropdown to insert random Lorem Ipsum Paragraph or Sentence, handy for placeholder text.
   - 測試排版文字
 - ~~[summernote-map-plugin](https://github.com/maiyaporn/summernote-map-plugin)~~
   - Plugin for adding map to Summernote. It allows users to search for places with autocomplete (Google Places API) and add an embed map of the selected place to editor.
   - 嵌入地圖
 - ~~[summernote-nugget](https://github.com/pHAlkaline/summernote-plugins/tree/master/plugins/nugget)~~
   - Pre-defined custom code nuggets. You can add your own nuggets and insert them in the editor in one click.
   - ?
 - [summernote-template](https://github.com/Nanakii/summernote-plugins/tree/master/plugin/template)
   - Dropdown of pre-defined custom templates. You can add your own html templates and insert them in the editor in one click.
   - 改成用 jquery 從 React 傳遞 templates，整合到 summernote-element-template
   - button: 'template'
   
   ```js
    import ReactDOMServer from 'react-dom/server'
    render(
      <SummerNote options={{
      template: {
          list: {
            'sample form': $('<span><h1>input</h1><input value="" /></span>'),
            'bussiness letter': $(ReactDOMServer.renderToString(<BussinessLetter/>))  // render React element to html
          }
        }
      }}/>
    , document.getElementById('root'))
   ```
 - [summernote-templates](https://github.com/DiemenDesign/summernote-templates)
   - Add Toolbar Buttons to add Page and Block Templates from html template files.
   - 整合到 summernote-element-template
 - ~~[uploadcare-summernote](https://github.com/uploadcare/uploadcare-summernote)~~
   - Uploadcare plugin for Summernote. It will allow your users to upload files and images from local device, social networks, cloud storages without any backend code that is usually required to handle uploads.
   - 使用[Uploadcare](https://uploadcare.com/)，從 local 或其他平台(FB, Google Drive, ...)上傳檔案

## Misc
 - ~~[summernote-br](https://github.com/covistefan/summernote-br)~~
   - Adds the option to create soft linebreaks by pressing SHIFT+RETURN at the same time
 - [summernote-drafts](https://github.com/MissAllSunday/summernoteDrafts)
   - Allows users to save and load drafts directly on the editor.
   - 可儲存草稿，需要 [store.js](https://github.com/marcuswestin/store.js/#installation)
   - button: 'sDraftsLoad'
 - [summernote-ext-print](https://github.com/lqez/summernote-ext-print)
   - Add print button on toolbar. This allows summernote to print its own document, not whole page.
   - 列印編輯器內的內容
   - button: 'print'
 - ~~[summernote-floats-bs](https://github.com/MarcosBL/summernote-floats-bs)~~
   - Replace (or extend) image popover buttons (using float: attributes) with a new set of buttons that inject proper Bootstrap classes (pull-right / pull-left / none).
   - 圖片 bootstrap class
 - ~~[summernote-save-button](https://github.com/DiemenDesign/summernote-save-button)~~
   - Adds a Save Button when Summenote is used within a form
   - form
 - ~~[summernote-seo](https://github.com/DiemenDesign/summernote-seo)~~
   - Adds a drop down with Selector for Extracting Keywords or Copying Highlighted Text to Description or Caption Elements.
   - 選取範圍顯示在指定的 node
 - [summernote-text-findnreplace](https://github.com/DiemenDesign/summernote-text-findnreplace)
   - Adds an area to the Toolbar when plugin button is select to allow find and replace in the editor area.
   - 搜尋取代
   - button: 'findnreplace'
 - [summernote-ext-table](https://github.com/ksy11/summernote-ext-table)
   - Adds table column/row resize, cell background-color change, cell merge, cell unmerge, border-color change, table margin change, table width/height reset.
   - table 功能
   - button: 'jMerge', 'jBackcolor', 'jBorderColor', 'jAlign', 'jAddDeleteRowCol', 'jTableInfo', 'jWidthHeightReset', 'deleteTable', 
## Special Characters & Icons
 - [summernote-ext-specialchars](https://github.com/JustinEldracher/summernote-plugins/tree/master/summernote-ext-specialchars)
   - Few tweaks to the official specialchars plugin, revising the view and making it more mobile-friendly
   - 插入特殊符號
   - button: 'specialChar'
 - ~~[summernote-fontawesome](https://github.com/JustinEldracher/summernote-plugins/tree/master/summernote-fontawesome)~~
   - Modification of specialchars, inserts Font Awesome symbols instead.  View all the icons or search for them by name.
   - 插入 fontawesome icon ，列表 icon 過時

## Syntax
 - ~~[summernote-a11y](https://github.com/DiemenDesign/summernote-a11y)~~
   - Accessibility Checker that uses CSS to check Elements inside the Summernote Editing Area.
   - 檢查 inline style
 - ~~[summernote-ace-plugin](https://github.com/wubin1989/summernote-ace-plugin)~~
   - Based on Ace(https://ace.c9.io/#nav=about) the summernote code highlighting plugin
   - code 樣式，需引入 [Ace](https://ace.c9.io/#nav=embedding)，從 https://cdn.jsdelivr.net/npm/ace-builds@1.4.12/src-noconflict/~~
 - ~~[summernote-ext-codewrapper](https://github.com/semplon/summernote-ext-codewrapper)~~
   - This will wrap code inside `pre` tag by selecting them. see video for demo.
   - `pre` tag，樣式會移除
 - [summernote-ext-highlight](https://github.com/heyanlong/summernote-ext-highlight)
   - Based on code-prettify the summernote code highlighting plugin
   - code prettify，使用 [Google code-prettify](https://github.com/googlearchive/code-prettify)
   - button: 'highlight'

