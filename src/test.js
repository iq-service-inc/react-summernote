import React from 'react'
import { render } from 'react-dom'
import SummerNote from '../dist/main'

SummerNote.ImportCode()
import 'summernote/dist/lang/summernote-zh-TW'
import 'summernote/dist/lang/summernote-ko-KR'

render(
    <SummerNote value="Default value"
        options={{
            lang: 'zh-TW',
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
        onInit={e => console.log(e)}
    />
    , document.getElementById('root')
)