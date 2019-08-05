import React, { Component } from 'react'
import SummerNote from './SummerNote'

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
                    onChange={e=>console.log(e)} 
                    onInit={e=>console.log(e)}    
                />
            </div>
        )
    }
}

export default App;