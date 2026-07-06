import React from "react";
import PropTypes from "prop-types";
import rtf2html from "../lib/trf2html";
import ExcelTable from "../lib/ExcelTable";
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
        this.noteEditor = null;
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
		this.createRange = this.createRange.bind(this);
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
		InnerReactSummernote.pasteHTML = this.pasteHTML.bind(this);
	}

	handleEditorRef = node => {
		if (!node) return;
		const options = this.props.options || {};
		const { codeview, destroy, value, innerRef, baseFontStyle } = this.props;
		options.callbacks = {
			...this.props.options.callbacks,
			...this.callbacks
		};
		// load lang pack
		//if (options.lang && options.lang != 'en') this.loadModule(`summernote/dist/lang/summernote-${options.lang}.js`)
		//if (options.lang) require(`summernote/lang/summernote-${options.lang}.js`)
		this.editor = $(node);

		// default popover
		var initPopover = {
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
              ['fontname', ['jFontname']],
			  ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
			  ['delete', ['deleteRow', 'deleteCol']],
            //   ['columrow', ['jAddDeleteRowCol']],
              ['color', ['jBackcolor', 'jBorderColor' ]],
              ['style', ['jAlign', 'jMerge' ]],
              ['info', ['jAutoFit', 'jStyleCell', 'jTableInfo']],
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
		}


		options.popover = {
			...initPopover,
			...options.popover
		}
		
		this.editor.summernote(options);

		if (value) {
			this.replace(value);
			this.setState({ value });
		}
        if (baseFontStyle) {
            this.updateBaseFontStyle(baseFontStyle)
        }
		if (codeview) {
			this.editor.summernote("codeview.activate");
		}
		if (destroy) {
			this.editor.summernote("destroy");
		}

		if (typeof innerRef === 'function') innerRef(this)
		else if (typeof innerRef === 'object' && !!innerRef) innerRef.current = this
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

        // 如果 baseFontStyle 有變動，更新預設字體樣式
        if (nextProps.baseFontStyle && 
            JSON.stringify(props.baseFontStyle) !== JSON.stringify(nextProps.baseFontStyle)) {
            this.updateBaseFontStyle(nextProps.baseFontStyle)
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
        this.noteEditor = $container.find(".note-editor");
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
			// replace 不觸發 summernote change,清空時需在此補回帶樣式空段落
			if (contentLength === 0 && this.hasActiveBaseFontStyle()) {
				this.applyBaseFontStyleToEmptyPara(this.props.baseFontStyle);
			}
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

	createRange() {
		this.editor.summernote("focus")
		var range = this.editor.summernote("createRange")
		return range
	}
    
    // baseFontStyle 是否有有效設定(未提供或三屬性皆空時,相關邏輯一律不執行)
    isActiveBaseFontStyle(baseFontStyle) {
        return !!baseFontStyle && !!(baseFontStyle['font-family'] || baseFontStyle['font-size'] || baseFontStyle['color']);
    }

    hasActiveBaseFontStyle() {
        return this.isActiveBaseFontStyle(this.props.baseFontStyle);
    }

    // 組出受管理的三個樣式屬性(值為 '' 時 jQuery.css 會移除該屬性)
    buildBaseFontStyleCss(baseFontStyle) {
        return {
            'font-size': baseFontStyle['font-size'] || '',
            'font-family': baseFontStyle['font-family'] || '',
            'color': baseFontStyle['color'] || ''
        };
    }

    // 焦點在編輯器內才回復游標,避免 API 呼叫造成的變更搶走焦點
    // 重設 selection 同時清除 WebKit 的 typing style——Chrome 全選刪除後會記住
    // 刪除前的 inline 樣式(如選字套用的 font-family),下次輸入時原樣復活
    // 並壓掉空段落上的預設樣式,必須在內容變空當下重設 selection 使其失效
    restoreCaretToPara($para) {
        const editable = this.noteEditable[0];
        if (editable === document.activeElement || $.contains(editable, document.activeElement)) {
            const rng = $.summernote.range.create($para[0], 0, $para[0], 0);
            rng.select();
            this.editor.summernote('editor.setLastRange', rng);
        }
    }

    // 編輯器視覺為空時,維護帶 inline style 的空段落,使預設樣式隨 HTML 內容保存
    // 回傳 $para(有套用)或 null(編輯器有內容,不碰)
    applyBaseFontStyleToEmptyPara(baseFontStyle) {
        if (!this.noteEditable || !this.noteEditable.length) return null;
        const dom = $.summernote.dom;
        const editable = this.noteEditable[0];
        const css = this.buildBaseFontStyleCss(baseFontStyle);

        const child = editable.childNodes.length === 1 ? editable.firstChild : null;

        // 單一空 <p>(<p><br></p> 或已帶樣式者)→ 就地覆寫三個屬性
        // 僅限 <p>:H1-H6/PRE 等是使用者套用的區塊樣式,重新蓋章會壓掉標籤原生樣式;
        // DIV 交給下方重建,正規化為 <p>(Chrome 刪除內容常以 DIV 當段落)
        if (child && child.nodeName === 'P' && dom.isEmpty(child)) {
            const $para = $(child).css(css);
            // 三屬性皆清除時移除空的 style 屬性,維持與上游 <p><br></p> 一致
            if (!$para.attr('style')) $para.removeAttr('style');
            this.restoreCaretToPara($para);
            return $para;
        }
        // 需整個重建帶樣式空段落的兩種「視覺為空」:
        // (a) 完全空(如 Ctrl+A 刪除後)
        // (b) 單一深層為空的 <p>/<div> 殘殼——Chrome 解散清單、刪除帶樣式內容時
        //     會留下 <div><br></div> 或 <div><font><span><br></span></font></div>
        //     (清單殼 <ul><li><br></li></ul> 仍有可見 bullet,非視覺為空,不在此列)
        const isDeepEmptyShell = child && /^(P|DIV)$/.test(child.nodeName) &&
            dom.deepestChildIsEmpty(child);
        if ((dom.isEmpty(editable) || isDeepEmptyShell) && this.isActiveBaseFontStyle(baseFontStyle)) {
            const $para = $(dom.emptyPara).css(css);
            this.noteEditable.empty().append($para);
            this.restoreCaretToPara($para);
            return $para;
        }
        return null;
    }

    // 更新 toolbar 顯示:字體/字號從帶樣式的空段落讀取(容器已無樣式),顏色按鈕更新預設值
    syncBaseFontStyleToolbar(baseFontStyle, $para) {
        // 更新 toolbar 字體大小和字體名稱的顯示樣式
        if ($para && baseFontStyle['font-size']) this.editor.summernote('fontsizeInput.updateFontsizeInput', $para);
        if ($para && baseFontStyle['font-family']) this.editor.summernote('customFont.updateCurrentStyle', false, $para);

        // 更新 toolbar 字體顏色的顯示樣式
        if (baseFontStyle['color']) {
            // 更新預設值
            this.editor.constructor.summernote.options.colorButton.foreColor = baseFontStyle.color;

            let $foreButton = this.noteEditor.find('.note-color-fore');
            // 更新 data-foreColor 屬性 直接點選顏色按鈕會使用這個值
            let $currentColorButton = $foreButton.find('.note-current-color-button');
            $currentColorButton.attr('data-foreColor', baseFontStyle.color);

            // 更新顯示顏色
            let $recentColor = $currentColorButton.find('.note-recent-color');
            $recentColor.css('color', baseFontStyle.color);

            // 更新隱藏的顏色選擇器的值
            let $input = $foreButton.find('input[type=color]');
            $input.attr('value', baseFontStyle.color);
        }
    }

    // 每實例 hook,僅 baseFontStyle 啟用時安裝:
    // (a) 修正 Editor.isEmpty——上游以 dom.emptyPara === $editable.html() 字串判空,
    //     帶 style 屬性的空段落會被誤判非空(placeholder 不顯示、isEmpty API 錯誤)
    // (b) 攔截 context.reset——reset 會重建 modules(isEmpty 覆寫丟失)且結束時
    //     editable 為無樣式空段落又不觸發 change,需事後重掛與補樣式
    // (c) 攔截 Editor.onFormatBlock——execCommand('FormatBlock') 會把 style 屬性
    //     原封搬到新標籤,inline 字體屬性壓掉 H1-H6/PRE/BLOCKQUOTE 的原生樣式;
    //     套非 P 標籤時剝除三個受管理屬性,切回 Normal(P)時補回 baseFontStyle
    installBaseFontStyleHooks(baseFontStyle) {
        if (!this.isActiveBaseFontStyle(baseFontStyle)) return;
        const context = this.editor.data('summernote');
        if (!context || !context.modules || !context.modules.editor) return;
        const self = this;
        const dom = $.summernote.dom;

        const editorModule = context.modules.editor;
        if (!editorModule.isEmpty._baseFontStylePatched) {
            const origIsEmpty = editorModule.isEmpty.bind(editorModule);
            const patchedIsEmpty = function () {
                if (origIsEmpty()) return true;
                const editable = editorModule.$editable[0];
                return editable.childNodes.length === 1 &&
                    dom.isPara(editable.firstChild) && dom.isEmpty(editable.firstChild);
            };
            patchedIsEmpty._baseFontStylePatched = true;
            editorModule.isEmpty = patchedIsEmpty;
        }

        if (!editorModule.onFormatBlock._baseFontStylePatched) {
            const origOnFormatBlock = editorModule.onFormatBlock.bind(editorModule);
            const patchedOnFormatBlock = function (tagName, $target) {
                origOnFormatBlock(tagName, $target);
                const style = self.props.baseFontStyle;
                if (!self.isActiveBaseFontStyle(style)) return;
                const upper = String(tagName).toUpperCase();
                const rng = editorModule.createRange();
                if (!rng) return;
                const blocks = rng.nodes(function (n) { return n && n.nodeName === upper; }, { includeAncestor: true });
                $(blocks).each(function () {
                    const $block = $(this);
                    if (upper === 'P') {
                        // Normal 的視覺 = 預設樣式;未自帶任何受管理屬性才補,
                        // 避免蓋掉既有內容自己的段落樣式
                        if (!this.style.fontSize && !this.style.fontFamily && !this.style.color) {
                            $block.css(self.buildBaseFontStyleCss(style));
                        }
                    } else {
                        $block.css({ 'font-size': '', 'font-family': '', 'color': '' });
                        if (!$block.attr('style')) $block.removeAttr('style');
                    }
                });
            };
            patchedOnFormatBlock._baseFontStylePatched = true;
            editorModule.onFormatBlock = patchedOnFormatBlock;
        }

        // invoke('reset') 會先查 context 實例屬性,包在實例上即可攔截所有 reset 呼叫
        if (!context._baseFontStyleResetWrapped) {
            const origReset = context.reset.bind(context);
            context.reset = function () {
                origReset();
                self.updateBaseFontStyle(self.props.baseFontStyle || {});
            };
            context._baseFontStyleResetWrapped = true;
        }
    }

    // 更新預設字體樣式,於初始化、baseFontStyle props 變動與內容變空時呼叫
    updateBaseFontStyle(baseFontStyle) {
        this.installBaseFontStyleHooks(baseFontStyle);
        const $para = this.applyBaseFontStyleToEmptyPara(baseFontStyle);
        this.syncBaseFontStyleToolbar(baseFontStyle, $para);
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

		// 內容變空時(打字刪光、undo/redo、empty()、codeview 關閉等)重套 baseFontStyle
		// codeview 開啟期間 editable 尚未同步,不可在此維護也不可重算 txt
		if (this.hasActiveBaseFontStyle() && !this.editor.summernote('codeview.isActivated')) {
			this.installBaseFontStyleHooks(this.props.baseFontStyle)
			const $styledPara = this.applyBaseFontStyleToEmptyPara(this.props.baseFontStyle)
			if ($styledPara) txt = this.noteEditable.html()
		}

		if (typeof onChange === "function") onChange(txt);
	}

	// if ctrl+v : fire this first
	handlePaste(e) {
		//console.log('handlePaste this.counter', this.counter)
		// if have media, it will fire upload image event ,so skip paste
		// const editorbox = $(this.editorbox.current)
		const { onPaste } = this.props;
		if (/MSIE|Trident/i.test(navigator.userAgent)) return
		// const files = e.originalEvent.clipboardData.files;
		// only one pic, dont paste the photo
		// if (files.length) return e.preventDefault();
		const items = e.originalEvent.clipboardData.items;

		for (let i = 0; i < items.length; i++) {
			if (items[i].type.indexOf("rtf") > -1) {
				const rtf = e.originalEvent.clipboardData.getData('text/rtf')
				const doc = rtf2html(rtf), imgs = [];
				doc.forEach(function (el) { imgs.push(el) });
				this.pasteResource = imgs
				this.isPasteFromWord = true
				break;
			}
		}

		if (typeof onPaste === "function") onPaste(e);

		var ua = navigator.userAgent,
			clipboardHTML = e.originalEvent.clipboardData.getData('text/html')
		// if browser is not msie and paste excel table
		// remove images, add style inline
		var excel = clipboardHTML.indexOf('office:excel') > -1,
			msie = /MSIE|Trident/i.test(ua)
		if(excel && !msie) {
			e.preventDefault()
			var table = ExcelTable.getTable(clipboardHTML),
				style = ExcelTable.createStylesheet(clipboardHTML)
				
			ExcelTable.applyStyleInline(table, style)
			ExcelTable.removeImage(table)

			var range = this.createRange(),
				target = range.sc	// range start container
			if (!target.tagName) target = target.parentNode

			var $block = $(target).closest('.note-editing-area').find('.jtable-block')

			if(!!target.closest('table') && !!$block && $block.css('display') == 'block'){
				table.className = 'jtable-paste'
				target.closest('table').appendChild(table)
				table.style.display = 'none'
			}
			else range.pasteHTML(table.outerHTML)
		}

		// if browser is Firefox and doc rely on vml
		// prevent default paste event
		var ff = ua.indexOf('Firefox') > -1,
        	vml = clipboardHTML.indexOf('RelyOnVML') > -1
		if (ff && vml){	
			e.preventDefault()
			var start = clipboardHTML.indexOf('<!--StartFragment-->') + '<!--StartFragment-->'.length,
				end = clipboardHTML.indexOf('<!--EndFragment-->'),
				str = clipboardHTML.substring(start, end)

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
			onImageUpload: this.onImageUpload,
			onChangeCodeview: this.handleChange,
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
	baseFontStyle: PropTypes.object,
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