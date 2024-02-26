import React, { Component } from "react";
import SummerNote2 from "./SummerNote";
import SummerNote from "./SummerNote";
import rtf2html from "../lib/trf2html";
// import required codes
// console.log(SummerNote)
SummerNote.ImportCode();

const htmldata =
	`<div class="vsc-controller vsc-nosource"></div>  <video width="640" height="360" controls="" autoplay loop muted preload='none'>
    <source src="https://www.youtube.com/embed/XObOgPK1yUg" type="video/youtube">
    Your browser does not support the video tag.
  </video>;`
// '<p style="vertical-align: top; margin: 0px 0px 1.5em; font-size: 14pt; line-height: 2em; color: rgb(51, 51, 51); font-family: 微軟正黑體, sans-serif; background-color: rgb(247, 247, 247);"><a href="https://ai.facebook.com/blog/open-sourcing-pyrobot-to-accelerate-ai-robotics-research" style="vertical-align: top; color: rgb(0, 0, 0); text-decoration-line: none; border-bottom: 1px dotted rgb(187, 187, 187); padding-bottom: 5px;">臉書與卡內基美隆大學合作，共同開發了機器人控制框架PyRobot</a>，希望讓研究人員能夠在幾小時內，在不需要具備硬體或是裝置驅動程式等相關細節知識，就能啟動並且使機器人開始運作。臉書提到，他們希望提供一個像深度學習開發框架PyTorch這樣的機器人框架，提供一定程度的抽象，以簡化系統建置工作，也讓共享函式庫和工具更為簡單。</p><p style="vertical-align: top; margin: 0px 0px 1.5em; font-size: 14pt; line-height: 2em; color: rgb(51, 51, 51); font-family: 微軟正黑體, sans-serif; background-color: rgb(247, 247, 247);">機器人研究領域有一個笑話，把機器人當作博士研究碖文，論文中的每一個機器人，都會為論文發表時間往後增加一年，臉書提到，要讓機器人揮動手臂，就可能要花上數天甚至一周的時間，來調整機器人軟體，而PyRobot的出現，就是要來解決這樣的研究困境。</p><p style="vertical-align: top; margin: 0px 0px 1.5em; font-size: 14pt; line-height: 2em; color: rgb(51, 51, 51); font-family: 微軟正黑體, sans-serif; background-color: rgb(247, 247, 247);">PyRobot是機器人作業系統ROS上的輕量級高階介面，提供了一組無關硬體的中介API，供開發人員控制各種的機器人，PyRobot抽象了低階控制器與程序之間溝通的細節，因此對於人工智慧研究人員來說，可以不再需要理解機器人的低階操作，能夠專注地建置高階人工智慧機器人應用程式。</p><p class="rtecenter" style="vertical-align: top; margin: 0px 0px 1.5em; text-align: center; font-size: 14pt; line-height: 2em; color: rgb(51, 51, 51); font-family: 微軟正黑體, sans-serif; background-color: rgb(247, 247, 247);"><img alt="" src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.2365-6/65208991_366432120743262_8971157212042887168_n.gif?_nc_cat=108&amp;_nc_eui2=AeGyV1lVHG2s1TboCa6qoybvi_exikgXF83atf7IgQtcg2ht2rzMSP5Z6vmBlM8ZJcnnfaZ_f_391EouH25dKf_Cm_hcjqrbTPgif4LGSlHNdg&amp;_nc_oc=AQktp8ytYjE29QHmTShUNGjHn7tNgP5lfP-V6p7ApWDkpidjto4pd_Ld9zTFk3vwjsc&amp;_nc_ht=scontent-tpe1-1.xx&amp;oh=649852a5e43ef82748a309c259957b33&amp;oe=5DBB8202" style="vertical-align: middle; max-width: 100%; height: auto; border: 0px; width: 600px;"></p><p style="vertical-align: top; margin: 0px 0px 1.5em; font-size: 14pt; line-height: 2em; color: rgb(51, 51, 51); font-family: 微軟正黑體, sans-serif; background-color: rgb(247, 247, 247);">研究人員可以使用PyRobot中，適用於各種機器人的通用功能，控制機器人關節的位置、速度或是力矩，還能使用複雜的功能，包括笛卡爾路徑規畫或是視覺SLAM等。PyRobot目前雖然僅支援LoCoBot和Sawyer機器人，但還會繼續增加支援各種不同的機器人。PyRobot雖然提供抽象的高階控制，但研究人員依然可以使用不同層級的元件，像是能夠繞過規畫器，直接設定關節速度和力矩等。</p><p style="vertical-align: top; margin: 0px 0px 1.5em; font-size: 14pt; line-height: 2em; color: rgb(51, 51, 51); font-family: 微軟正黑體, sans-serif; background-color: rgb(247, 247, 247);">臉書已經將PyRobot用在各種的機器人應用上，像是點到點的導航，或是推與抓的任務，也用在遠端操作以收集訓練機器人的資料。PyRobot中包含了一些現成的演算法實作，並提供可將自行開發的演算法，簡單地部署到機器人上的方法，臉書也提到，研究人員可以使用PyTorch訓練深度學習模型，並使用PyRobot在機器人上執行演算法。</p><p style="vertical-align: top; margin: 0px 0px 1.5em; font-size: 14pt; line-height: 2em; color: rgb(51, 51, 51); font-family: 微軟正黑體, sans-serif; background-color: rgb(247, 247, 247);">PyRobot可以讓研究社群更容易地使用機器人資料集、演算法實作以及模型，同時也能幫助他們訂定基準，得以互相比較成果，或是基於其他人的成果往前發展，臉書表示，像是在使用LoCoBot這類低成本的機器人平臺，PyRobot有助於降低進入門檻，並使研究成果能夠與其他人分享。臉書也順勢在PyRobot釋出的同時，公開了一項徵求提案活動，任何研究團隊都可以提交PyRobot搭配LoCoBot的研究提案，獲勝者可以贏得一份研究用LoCoBot工具包。</p>';

//import IconButton from './ToolBar/IconButton'
class App extends Component {

	constructor(props) {
		super(props)
		this.editor1 = React.createRef();
		this.editor2 = React.createRef();
		// console.log( 'constructor this.editor1 ',this.editor1 )
		// console.log( 'constructor this.editor2 ',this.editor2 )
	}

	convertFileToBase64(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => resolve(reader.result)
			reader.onerror = () => reject(console.log('FileReader Error: ', error))
		})

	}

	onImageUpload1 = (f, cb, e) => {
		//console.log("--------- onImageUpload --------", file, cb, e);

		console.log(this.editor1)

		let file = f
		if (file.length) {
			file = f[0]
		}
		this.convertFileToBase64(file).then(src => {
			const $image = $('<img>').attr('src', src).wrap('div')
			this.editor1.current.insertNode($image[0])
		})
	}

	onImageUpload2 = (file, cb, e) => {
		//console.log("--------- onImageUpload --------", file, cb, e);
		let image = file[0];
		console.log(this.editor2)
		this.editor2.current.insertImage("https://i.imgur.com/JOOEENx.png", $image => {
			$image.css("width", Math.floor($image.width() / 2));
			$image.attr("title", image.name);
		});
	}

	render() {
		return (
			<div className="demo">
				<div className="rb" style={{ textAlign: 'right', height: '60px' }}><a href="https://github.com/iq-service-inc/react-summernote"><img loading="lazy" width="149" height="149" src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149" className="attachment-full size-full" alt="Fork me on GitHub" data-recalc-dims="1" /></a></div>
				<h1>React SummerNote App</h1>
				<SummerNote
					id='editor1'
					destroy={false}
					value={htmldata}
					options={{
						lang: "zh-TW",
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
							["anchor", ["anchor", "toc", "markAnchor", "editAnchor"]],
							["comment", ["editPopover", "removePopover"]],
							["view", ["fullscreen", "codeview", "help"]],
						],
						canViewClasslist: true,
						tableClassName: 'jtable table-bordered',
						customFont: {
							fontNames: [
								'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Helvetica', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana',
								{ name: '新細明體', value: '新細明體, serif' },
								{ name: '微軟正黑體', value: '微軟正黑體, sans-serif' },
								{ name: '標楷體', value: '標楷體, DFKai-SB, BiauKaiTC' }
							]
						},
					}}
					onChange={onChange}
					onImageUpload={this.onImageUpload1}
					onImagePasteFromWord={onImagePasteFromWord}
					//onPaste={onPaste}
					onInit={e => console.log(`Using jquery version ${$().jquery}`)}
					ref={this.editor1}
				/>
				<SummerNote2 id='editor2' onImageUpload={this.onImageUpload2} ref={this.editor2} options={{
					toolbar: [
						["style", ["style", "customStyle", "copyFormatting"]],
						["font", ["bold", "underline", "clear", "customCleaner"]],
						["fontname", ["fontname"]],
						["fontsize", ["fontsizeInput"]],
						['color', ['color']],
						["para", ["ul", "ol", "listStyles", "paragraph"]],
						["table", ["jTable", "jMerge", "jBackcolor", "jBorderColor", "jAlign", "jTableInfo", "jWidthHeightReset"]],
						["tableRow", ["jRowHeight"]],
						["tableCol", ["jColWidth"]],
						["insert", ["pasteHTML", "link", "unlink", "picture", "imageMap", "video", "customSpecialChar"]],
						["view", ["fullscreen", "codeview"]],
						["comment", ["editPopover", "removePopover"]],
						["view", ["fullscreen", "codeview", "help"]],
					],
					tableClassName: 'jtable table-bordered'
				}} />

			</div>
		);
	}
}

function onImagePasteFromWord($imgs) {
	console.log("onImagePasteFromWord", $imgs);
}

function onChange(e) {
	//$('span[style*="mso-ignore"]').remove()
	//let img = $('img[src*="file://"]').attr('loading',true);
	console.log("change");
}


function onPaste(e) {
	//console.log('--------- onPaste --------', e)

	let items = e.originalEvent.clipboardData.items;
	let files = e.originalEvent.clipboardData.files;

	for (let i = 0; i < files.length; i++) {
		return e.preventDefault();
	}

	//console.log('---------- items -------------', items)
	//console.log('---------- files -------------', files)

	for (let i = 0; i < items.length; i++) {
		//console.log('---------- item -------------', items[i])
		if (items[i].type.indexOf("rtf") > -1) {
			items[i].getAsString(function (rtf) {
				const doc = rtf2html(rtf);
				//const meta = doc.metadata();
				//console.log(doc)
				doc
					.render()
					.then(function (htmlElements) {
						var imgs = [];
						//console.log('meta', meta);
						//console.log('htmlElements', htmlElements);
						htmlElements.forEach($html => {
							$html.find('img[src*="data:image"]').each((i, el) => {
								imgs.push(el);
							});
							//$('#test').append($html)
						});
						//console.log(imgs)
						setTimeout(() => {
							//console.log(imgs)
							$("img[loading]").each((i, el) => {
								if (imgs[i]) el.src = imgs[i].src;
							});
						}, 0);
					})
					.catch(error => console.error(error));
			});
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
