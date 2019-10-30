import React, { Component } from 'react'
import PropTypes from 'prop-types'
import rtf2html from '../lib/trf2html'
import ImportCode from './ImportCode'

//const randomUid = () => Math.floor(Math.random() * 100000);

class ReactSummernote extends Component {
    constructor(props) {
        super(props);
        this.counter = 0; // counter for identitify for paste word content
        //this.uid = `react-summernote-${randomUid()}`;
        this.editor = {};
        this.noteEditable = null;
        this.notePlaceholder = null;
        this.onInit = this.onInit.bind(this);
        this.onImageUpload = this.onImageUpload.bind(this);
        this.focus = this.focus.bind(this);
        this.isEmpty = this.isEmpty.bind(this);
        this.reset = this.reset.bind(this);
        this.replace = this.replace.bind(this);
        this.disable = this.disable.bind(this);
        this.enable = this.enable.bind(this);
        this.toggleState = this.toggleState.bind(this);
        this.insertImage = this.insertImage.bind(this);
        this.insertNode = this.insertNode.bind(this);
        this.insertText = this.insertText.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePaste = this.handlePaste.bind(this);
        ReactSummernote.focus = this.focus.bind(this);
        ReactSummernote.isEmpty = this.isEmpty.bind(this);
        ReactSummernote.reset = this.reset.bind(this);
        ReactSummernote.replace = this.replace.bind(this);
        ReactSummernote.disable = this.disable.bind(this);
        ReactSummernote.enable = this.enable.bind(this);
        ReactSummernote.toggleState = this.toggleState.bind(this);
        ReactSummernote.insertImage = this.insertImage.bind(this);
        ReactSummernote.insertNode = this.insertNode.bind(this);
        ReactSummernote.insertText = this.insertText.bind(this);
    }

    //loadModule = path => require(path)

    handleEditorRef = node => {
        if (!node) return;
        const options = this.props.options || {};
        const { codeview, destroy, value } = this.props;
        options.callbacks = this.callbacks;
        // load lang pack
        //if (options.lang && options.lang != 'en') this.loadModule(`summernote/dist/lang/summernote-${options.lang}.js`)
        //if (options.lang) require(`summernote/lang/summernote-${options.lang}.js`)
        this.editor = $(node);
        this.editor.summernote(options);
        if (value) {
            this.replace(value);
            this.setState({ value })
        }
        if (codeview) {
            this.editor.summernote('codeview.activate');
        }
        if (destroy) {
            this.editor.summernote('destroy')
        }
    }

    //componentDidMount() {
    // const options = this.props.options || {};
    // const codeview = this.props.codeview;
    // // const codeviewCommand = codeview ? 'codeview.activate' : 'codeview.deactivate';
    // options.callbacks = this.callbacks;

    // this.editor = $(`#${this.uid}`);
    // this.editor.summernote(options);
    // if (codeview) {
    //     this.editor.summernote('codeview.activate');
    // }
    //}

    componentWillReceiveProps(nextProps) {
        const { props } = this;
        const codeview = nextProps.codeview;
        const codeviewCommand = codeview ? 'codeview.activate' : 'codeview.deactivate';
        if (typeof nextProps.value === 'string' && props.value !== nextProps.value) {
            this.replace(nextProps.value);
        }

        if (typeof nextProps.disabled === 'boolean' && props.disabled !== nextProps.disabled) {
            this.toggleState(nextProps.disabled);
        }
        if (codeview !== props.codeview) {
            this.editor.summernote(codeviewCommand);
        }
        if (props.destroy) {
            this.editor.summernote('destroy')
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillUnmount() {
        if (this.editor.summernote) {
            this.editor.summernote('destroy');
        }
    }

    onInit() {
        const { disabled, onInit } = this.props;

        const $container = this.editor.parent();
        this.noteEditable = $container.find('.note-editable');
        this.notePlaceholder = $container.find('.note-placeholder');

        if (typeof disabled === 'boolean') {
            this.toggleState(disabled);
        }

        if (typeof onInit === 'function') {
            onInit({
                summernote: this.editor.summernote.bind(this.editor),
                focus: this.focus,
                isEmpty: this.isEmpty,
                reset: this.reset,
                replace: this.replace,
                disable: this.disable,
                enable: this.enable,
                insertImage: this.insertImage,
                insertNode: this.insertNode,
                insertText: this.insertText
            });
        }
    }

    onImageUpload(images) {
        console.log('images', images)
        var url = []

    
        if(images[0] !== null) {
            console.log('有近來')
            var reader = new FileReader();
            reader.onload = function(event) {
                console.log('我是url',event.target.result); // data url! 
                url.push(event.target.result)
            };
            reader.readAsDataURL(images[0])
        }

        
        // document.getElementById('pasteArea').onpaste = function (event) {
        //     // use event.originalEvent.clipboard for newer chrome versions
        //     var items = (event.clipboardData  || event.originalEvent.clipboardData).items;
        //     console.log(JSON.stringify(items)); // will give you the mime types
        //     // find pasted image among pasted items
        //     var blob = null;
        //     for (var i = 0; i < items.length; i++) {
        //       if (items[i].type.indexOf("image") === 0) {
        //         blob = items[i].getAsFile();
        //       }
        //     }
        //     // load image if there is a pasted image
        //     if (blob !== null) {
        //       var reader = new FileReader();
        //       console.log('reader', reader)
        //       reader.onload = function(event) {
        //         console.log('url',event.target.result); // data url!
        //         document.getElementById("pastedImage").src = event.target.result;
        //       };
        //       reader.readAsDataURL(blob);
        //     }
        // }


        const { onImageUpload } = this.props;
        if (typeof onImageUpload === 'function') {
            onImageUpload(images, this.insertImage);
        }
    }

    focus() {
        //console.log(this.editor);
        this.editor.summernote('focus');
    }

    isEmpty() {
        return this.editor.summernote('isEmpty');
    }

    reset() {
        this.editor.summernote('reset');
    }

    replace(content) {
        const { noteEditable, notePlaceholder } = this;
        const prevContent = noteEditable.html();
        const contentLength = content.length;

        if (prevContent !== content) {
            if (this.isEmpty() && contentLength > 0) {
                notePlaceholder.hide();
            } else if (contentLength === 0) {
                notePlaceholder.show();
            }
            noteEditable.html(content);
        }
    }

    disable() {
        this.editor.summernote('disable');
    }

    enable() {
        this.editor.summernote('enable');
    }

    toggleState(disabled) {
        if (disabled) {
            this.disable();
        } else {
            this.enable();
        }
    }

    insertImage(url, filenameOrCallback) {
        this.editor.summernote('insertImage', url, filenameOrCallback);
    }

    insertNode(node) {
        this.editor.summernote('insertNode', node);
    }

    insertText(text) {
        this.editor.summernote('insertText', text);
    }

    handleChange(txt) {
        $('span[style*="mso-ignore"]').remove()
        const { onChange } = this.props;
        const $pastedImgs = $('img[src*="file://"]')
            .not('.zap-img-uploading')
            .addClass('zap-img-uploading')
            .addClass(`zap-img-uploading-${this.counter}`)

        if ($pastedImgs.length) this.counter = this.counter + 1
        if (typeof onChange === 'function') onChange(txt)
    }

    handlePaste(e) {
        // if have media, it will fire upload image event ,so skip paste
        const { onPaste, onImagePasteFromWord } = this.props;
        const files = e.originalEvent.clipboardData.files;
        // only one pic, dont paste the photo
        if (files.length) return e.preventDefault()

        const items = e.originalEvent.clipboardData.items;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('rtf') > -1) {
                items[i].getAsString((rtf) => {
                    const doc = rtf2html(rtf)
                    console.log('doc',doc)
                    var imgs = []
                    doc.forEach(function (el) {
                        imgs.push(el)
                    })
                    // console.log('imgs',imgs[0])
                    
                    setTimeout(() => {
                        const $pasteImgs = $(`.zap-img-uploading-${this.counter - 1}`).each((i, el) => { if (imgs[i]) el.src = imgs[i] })
                        console.log('$pasteImgs', $pasteImgs)
                        if (typeof onImagePasteFromWord === 'function') onImagePasteFromWord($pasteImgs)
                    }, 0)
                })
                break;
            }
        }
        if (typeof onPaste === 'function') onPaste(e)
    }

    
    


    get callbacks() {
        const props = this.props;
        return {
            onInit: this.onInit,
            onEnter: props.onEnter,
            onFocus: props.onFocus,
            onBlur: props.onBlur,
            onKeyup: props.onKeyUp,
            onKeydown: props.onKeyDown,
            onPaste: this.handlePaste,
            onChange: this.handleChange,
            onImageUpload: this.onImageUpload
        };
    }

    render() {
        const { tag: Tag, children, className, name } = this.props;
        return (
            
            <div className={className}>
                <Tag ref={this.handleEditorRef} >{children}</Tag>
                <textarea id="pasteArea" placeholder="Paste Image Here"></textarea>
                <img id="pastedImage"></img>
            </div>
            
        );
    }
}

ReactSummernote.propTypes = {
    tag: PropTypes.string, // will determing using div or textarea field for form components like redux-form
    children: PropTypes.node, // instead of value, using children makes more sense for div and textarea blocks
    codeview: PropTypes.bool,
    className: PropTypes.string,
    options: PropTypes.object,
    disabled: PropTypes.bool,
    onInit: PropTypes.func,
    onEnter: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyUp: PropTypes.func,
    onKeyDown: PropTypes.func,
    onPaste: PropTypes.func,
    onChange: PropTypes.func,
    onImageUpload: PropTypes.func,
    onImagePasteFromWord: PropTypes.func,
    destroy: PropTypes.bool,
};

ReactSummernote.defaultProps = {
    tag: 'div',
};

ReactSummernote.prototype.ImportCode = ImportCode
ReactSummernote.ImportCode = ImportCode

export default ReactSummernote;