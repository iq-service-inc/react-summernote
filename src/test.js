import React from 'react'
import { render } from 'react-dom'
import SummerNote from '../dist/main'
import '../dist/main.css'

SummerNote.ImportCode()

render(
    <SummerNote value="Default value"
        options={{
            lang: 'zh-TW',
            height: 350,
            dialogsInBody: true,
            toolbar: [
                ["style", ["style", "customStyle", "copyFormatting"]],
                ["font", ["bold", "italic", "underline", "strikethrough", "superscript", "subscript", "clear", "customCleaner"]],
                ["fontname", ["fontname", "customFont"]],
                ["fontsize", ["fontsizeInput"]],
                ['color', ['forecolor', 'backcolor']],
                ["para", ["ul", "ol", "listStyles", "paragraph"]],
                ["table", ["jTable"]],
                ["tableRow", ["jRowHeight"]],
                ["tableCol", ["jColWidth"]],
                ["insert", ["pasteHTML", "link", "unlink", "picture", "imageMap", "video", "customSpecialChar"]],
                ["anchor",["anchor", "toc", "markAnchor", "editAnchor"]],
                ["comment", ["editPopover", "removePopover"]],
                ["view", ["fullscreen", "codeview", "help"]],
            ]
        }}
        onChange={e => console.log(e)}
        onInit={e => console.log(e)}
    />
    , document.getElementById('root')
)