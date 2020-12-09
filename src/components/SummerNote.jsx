import React from "react";
import PropTypes from "prop-types";
import rtf2html from "../lib/trf2html";
import ImportCode from "./ImportCode";

class InnerReactSummernote extends React.Component {

	constructor(props) {

		super(props);
		//console.log('forwardedRef', props.forwardedRef)
		this.editorbox = React.createRef();
		this.counter = 0; // counter for identitify for paste word content
		this.pasteResource = []
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
		this.pasteHTML = this.pasteHTML.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handlePaste = this.handlePaste.bind(this);
		InnerReactSummernote.focus = this.focus.bind(this);
		InnerReactSummernote.isEmpty = this.isEmpty.bind(this);
		InnerReactSummernote.reset = this.reset.bind(this);
		InnerReactSummernote.replace = this.replace.bind(this);
		InnerReactSummernote.disable = this.disable.bind(this);
		InnerReactSummernote.enable = this.enable.bind(this);
		InnerReactSummernote.toggleState = this.toggleState.bind(this);
		InnerReactSummernote.insertImage = this.insertImage.bind(this);
		InnerReactSummernote.insertNode = this.insertNode.bind(this);
		InnerReactSummernote.insertText = this.insertText.bind(this);
	}

	handleEditorRef = node => {
		if (!node) return;
		const options = this.props.options || {};
		const { codeview, destroy, value, innerRef } = this.props;
		options.callbacks = this.callbacks;
		// load lang pack
		//if (options.lang && options.lang != 'en') this.loadModule(`summernote/dist/lang/summernote-${options.lang}.js`)
		//if (options.lang) require(`summernote/lang/summernote-${options.lang}.js`)
		this.editor = $(node);

		this.editor.summernote(options);

		if (value) {
			this.replace(value);
			this.setState({ value });
		}
		if (codeview) {
			this.editor.summernote("codeview.activate");
		}
		if (destroy) {
			this.editor.summernote("destroy");
		}

		if (typeof innerRef === 'function') innerRef(this)
		else if (typeof innerRef === 'object') innerRef.current = this
	};

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
		const codeviewCommand = codeview
			? "codeview.activate"
			: "codeview.deactivate";
		if (
			typeof nextProps.value === "string" &&
			props.value !== nextProps.value
		) {
			this.replace(nextProps.value);
		}

		if (
			typeof nextProps.disabled === "boolean" &&
			props.disabled !== nextProps.disabled
		) {
			this.toggleState(nextProps.disabled);
		}
		if (codeview !== props.codeview) {
			this.editor.summernote(codeviewCommand);
		}
		if (props.destroy) {
			this.editor.summernote("destroy");
		}
	}

	shouldComponentUpdate() {
		return false;
	}

	componentWillUnmount() {
		if (this.editor.summernote) {
			this.editor.summernote("destroy");
		}
	}

	onInit() {
		const { disabled, onInit } = this.props;

		const $container = this.editor.parent();
		this.noteEditable = $container.find(".note-editable");
		this.notePlaceholder = $container.find(".note-placeholder");

		if (typeof disabled === "boolean") {
			this.toggleState(disabled);
		}

		if (typeof onInit === "function") {
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
				insertText: this.insertText,
				pasteHTML: this.pasteHTML
			});
		}
	}

	onImageUpload(images) {
		const { onImageUpload } = this.props;
		if (typeof onImageUpload === "function") {
			onImageUpload(images, this.insertImage);
		}
	}

	focus() {
		//console.log(this.editor);
		this.editor.summernote("focus");
	}

	isEmpty() {
		return this.editor.summernote("isEmpty");
	}

	reset() {
		this.editor.summernote("reset");
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
		this.editor.summernote("disable");
	}

	enable() {
		this.editor.summernote("enable");
	}

	toggleState(disabled) {
		if (disabled) {
			this.disable();
		} else {
			this.enable();
		}
	}

	insertImage(url, filenameOrCallback) {
		//console.log(this.editor)
		this.editor.summernote("focus")
		this.editor.summernote("insertImage", url, filenameOrCallback);
	}

	insertNode(node) {
		this.editor.summernote("focus")
		this.editor.summernote("insertNode", node);
	}

	insertText(text) {
		this.editor.summernote("focus")
		this.editor.summernote("insertText", text)
	}

	pasteHTML(html) {
		this.editor.summernote("focus")
		this.editor.summernote("pasteHTML", html)
	}

	handleChange(txt) {

		const { onChange, onImagePasteFromWord } = this.props;
		const editorbox = $(this.editorbox.current)
		editorbox.find('span[style*="mso-ignore"]').remove()

		// convert <v:imagedata> to <img>
		editorbox.find('v\\:shape v\\:imagedata')
			.each((i, el) => {
				var newElem = $('<img></img>')
				$.each(el.attributes, (j, attr) => {
					newElem.attr(attr['name'], attr['value'])
				})
				newElem.attr('style', $(el).parent().attr('style'))
				$(el).replaceWith(newElem)
			})

		const $pastedImgs = editorbox.find('img[src*="file://"]')
			.not(".zap-img-uploading")
			.addClass('zap-img-uploading')
			.each((i, el) => {
				// console.log(el, 'src', this.pasteResource[i])
				$(el).attr('src', this.pasteResource[i])
			})

		if (typeof onImagePasteFromWord === "function" && this.isPasteFromWord) {
			this.isPasteFromWord = false
			onImagePasteFromWord($pastedImgs);
		}

		if (typeof onChange === "function") onChange(txt);
	}

	// if ctrl+v : fire this first
	handlePaste(e) {
		//console.log('handlePaste this.counter', this.counter)
		// if have media, it will fire upload image event ,so skip paste
		// const editorbox = $(this.editorbox.current)
		const { onPaste } = this.props;
		// const files = e.originalEvent.clipboardData.files;
		// only one pic, dont paste the photo
		// if (files.length) return e.preventDefault();
		const items = e.originalEvent.clipboardData.items;

		for (let i = 0; i < items.length; i++) {
			if (items[i].type.indexOf("html") > -1) {
				var html = items[i]
			}
			if (items[i].type.indexOf("rtf") > -1) {
				items[i].getAsString(rtf => {
					const doc = rtf2html(rtf), imgs = [];
					doc.forEach(function (el) { imgs.push(el) });
					this.pasteResource = imgs
					this.isPasteFromWord = true
				});
				break;
			}
		}

		if (typeof onPaste === "function") onPaste(e);

		var ua = navigator.userAgent
		// if browser is Firefox and doc rely on vml
		// prevent default paste event
		var ff = ua.indexOf('Firefox') > -1,
        	vml = e.originalEvent.clipboardData.getData('text/html').indexOf('RelyOnVML') > -1
		if (ff && vml){	
			html.getAsString(text => {
				var start = text.indexOf('<!--StartFragment-->') + '<!--StartFragment-->'.length
				var end = text.indexOf('<!--EndFragment-->')
				var str = text.substring(start, end)
	
				var selection = window.getSelection(),
					selected = (selection.rangeCount > 0) && selection.getRangeAt(0);

				if (selected.startOffset !== selected.endOffset) {	// replace selection
					var range = selected.cloneRange();
					selection.deleteFromDocument()	// delete selection content
					// paste data after cursor
					var newNode = document.createElement('p')
					newNode.innerHTML = str
					newNode.appendChild(range.extractContents());
					range.insertNode(newNode)
					selection.removeAllRanges();
				}
				else this.pasteHTML(str)
			});
			return e.preventDefault()
		}
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
		const { className, id, tag } = this.props;
		const Tag = tag || 'div'
		return (
			<div className={className} ref={this.editorbox} id={id}>
				<Tag ref={this.handleEditorRef}></Tag>
			</div>
		);
	}
}

InnerReactSummernote.propTypes = {
	tag: PropTypes.string, // will determing using div or textarea field for form components like redux-form
	//children: PropTypes.node, // instead of value, using children makes more sense for div and textarea blocks
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
	destroy: PropTypes.bool
}



const ReactSummernote = React.forwardRef((props, ref) => <InnerReactSummernote innerRef={ref} {...props} />)
ReactSummernote.ImportCode = ImportCode

export default ReactSummernote