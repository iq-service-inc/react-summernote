import React, { Component } from 'react'
import SummerNote from './SummerNote'
import rtf2html from '../lib/trf2html'

// import required codes
SummerNote.ImportCode()

//import IconButton from './ToolBar/IconButton'
class App extends Component {
    render() {
        return (
            <div className='demo'>
                <h1>React SummerNote</h1>
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
                    onChange={onChange}
                    onImageUpload={onImageUpload}
                    //onPaste={onPaste}
                    onInit={e => console.log('--------- onInit --------', e)}
                />
            </div>
        )
    }
}

function onChange(e) {
    //$('span[style*="mso-ignore"]').remove()
    //let img = $('img[src*="file://"]').attr('loading',true);
    //console.log('change',e)
}

function onImageUpload(file, cb, e) {
    console.log('--------- onImageUpload --------', file, cb, e)
    let image = file[0]

        SummerNote.insertImage('https://i.imgur.com/JOOEENx.png', ($image) => {
            $image.css("width", Math.floor($image.width() / 2));
            $image.attr("title", image.name);
        })

}

function onPaste(e) {
    //console.log('--------- onPaste --------', e)

    let items = e.originalEvent.clipboardData.items;
    let files = e.originalEvent.clipboardData.files;

    for (let i = 0; i < files.length; i++) {
        return e.preventDefault()
    }

    //console.log('---------- items -------------', items)
    //console.log('---------- files -------------', files)

    for (let i = 0; i < items.length; i++) {
        //console.log('---------- item -------------', items[i])
        if (items[i].type.indexOf('rtf') > -1) {
            items[i].getAsString(function (rtf) {
                const doc = rtf2html(rtf)
                //const meta = doc.metadata();
                //console.log(doc)
                doc.render().then(function (htmlElements) {
                    var imgs = []
                    //console.log('meta', meta);
                    //console.log('htmlElements', htmlElements);
                    htmlElements.forEach($html => {
                        $html.find('img[src*="data:image"]').each((i, el) => { imgs.push(el) })
                        //$('#test').append($html)
                    })
                    //console.log(imgs)
                    setTimeout(()=>{
                        //console.log(imgs)
                        $('img[loading]').each((i, el) => {
                            if (imgs[i])
                                el.src = imgs[i].src
                        })
                    },0)
                }).catch(error => console.error(error))
            })
        }
    }
    //for (let i = 0; i < files.length; i++) {
    //    console.log('---------- file -------------', files[i])
    //}



    // retrieveImageFromClipboardAsBlob(e.originalEvent, blob => {
    //     console.log('---------- blob -------------', blob)
    // })

    //catchPaste(e, this, data => console.log('---------- clipData -------------', data))
}

export default App;