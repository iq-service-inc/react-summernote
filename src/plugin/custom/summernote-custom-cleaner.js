(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function ($) {
    $.extend($.summernote.options, {
        customCleaner: {
            excludedClassName: 'jtable table-bordered summernote-comment-popover-anchor',
            removedTags: [],
            removedAttrs: [],
        }
    })
    $.extend($.summernote.plugins, {
        'customCleaner': function (context) {
            var self = this,
                ui = $.summernote.ui,
                range = $.summernote.range,
                dom = $.summernote.dom,
                lists = $.summernote.lists,
                $note = context.layoutInfo.note,
                $editor = context.layoutInfo.editor,
                $editable = context.layoutInfo.editable,
                $toolbar = context.layoutInfo.toolbar,
                $statusbar = context.layoutInfo.statusbar,
                modules = context.modules,
                options = context.options,
                lang = options.langInfo;

            const excludedClassName = options.customCleaner.excludedClassName || $.summernote.options.tableClassName
            const excluded = excludedClassName.split(/(?:\s+)/)
            const removedTags = (options.customCleaner.removedTags.length ? options.customCleaner.removedTags : ['acronym', 'b', 'bdo', 'big', 'cite', 'code', 'dfn', 'em', 'font', 'i', 'ins', 'kbd', 'nobr', 'q', 's', 'samp', 'small', 'strike', 'strong', 'sub', 'sup', 'tt', 'u', 'var']).join(',')
            const removedAttrs = (options.customCleaner.removedAttrs.length ? options.customCleaner.removedAttrs : ['align', 'background', 'bgcolor', 'border', 'bordercolor', 'color', 'height', 'width', 'sizes', 'style', 'valign']).join(' ')

            var cleanerIcon = [
                '<svg width="18" height="16" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">',
                '<path transform="rotate(-26.448 480.84 295.087)" fill="#000000" d="m404.25622,506.47077c-43.92637,-33.67075 -116.93104,-135.70607 -115.59248,-137.27228c21.80314,-22.21707 62.5994,-38.91934 58.10814,-45.36348c-7.71148,-6.48859 -48.47889,10.93038 -68.19383,28.41566c-5.60964,-4.3927 -26.72977,-25.74853 -36.22408,-49.56077c34.4883,-27.98737 161.23882,-93.78777 189.11361,-101.6691l121.31878,153.01109c-12.58664,21.16697 -106.30526,124.4473 -148.53014,152.43888zm310.85029,-379.76151l-28.60895,-35.52428c-6.79146,-8.52019 -19.13957,-10.00197 -27.65976,-3.21051l-124.2348,96.736l-45.2572,-56.95546c-6.29754,-7.90279 -18.64564,-6.42102 -22.96748,2.71658l-21.24176,61.14121l121.95712,152.3633l62.60793,-9.15567c9.87849,-2.09918 14.07684,-13.82988 7.77931,-21.73267l-49.8197,-61.98274l124.2348,-96.736c8.52019,-6.79146 9.87849,-19.13957 3.21051,-27.65976l-0.00002,0z"/>',
                '<path d="m198.87623,145.50765c36.70046,38.77963 70.67099,36.46849 106.21285,0c-36.23419,37.48904 -37.02882,69.09569 0,106.21285c-36.45615,-37.14347 -74.74878,-31.47351 -105.28565,-0.9272c31.10954,-30.51999 35.33596,-66.61508 -0.9272,-105.28564l0,0l0,-0.00001z" fill="#007fff" transform="rotate(-45 251.983 198.614)"/>',
                '<path d="m48.16457,259.22423c70.90686,74.92393 136.53939,70.45871 205.20781,0c-70.00603,72.43043 -71.54129,133.49586 0,205.20781c-70.43485,-71.76278 -144.41786,-60.80818 -203.4164,-1.7914c60.10497,-58.96594 68.27059,-128.70321 -1.7914,-203.41639l0,-0.00002l-0.00001,0z" fill="#007fff" transform="rotate(-45 150.768 361.828)"/>',
                '<path d="m23.09885,73.65846c43.50685,45.97163 83.77748,43.23187 125.91086,0c-42.95412,44.44167 -43.89611,81.91004 0,125.91086c-43.21723,-44.03202 -88.61153,-37.31052 -124.8117,-1.09916c36.87905,-36.18017 41.88929,-78.96937 -1.09916,-124.81169l0,-0.00001z" fill="#007fff" transform="rotate(-45 86.0543 136.614)"/>',
                '</svg>',
            ].join('')

            context.memo('button.customCleaner', function () {
                return ui.button({
                    contents: cleanerIcon,
                    tooltip: lang.customCleaner.removeStyle,
                    click: function (event) {
                        context.invoke('beforeCommand');
                        context.invoke('customCleaner.removeStyle')
                        context.invoke('afterCommand', true);
                    },
                }).render();
            });
            this.expandEdgePoint = function (rng) {
                // expand left point
                let sc = rng.sc,
                    so = rng.so
                while (sc && dom.isLeftEdgePoint(rng.getStartPoint())) {
                    if (dom.isEditable(sc.parentNode)) { break; }
                    so = Array.prototype.indexOf.call(sc.parentNode.childNodes, sc)
                    sc = sc.parentNode;
                }
                // prevent left point is on editable
                if (dom.isEditable(sc)) {
                    sc = sc.childNodes[so]
                    so = 0
                }

                // expand right point
                let ec = rng.ec,
                    eo = rng.eo
                while (ec && dom.isRightEdgePoint(rng.getEndPoint())) {
                    if (dom.isEditable(ec.parentNode)) { break; }
                    eo = Array.prototype.indexOf.call(ec.parentNode.childNodes, ec) + 1
                    ec = ec.parentNode;
                }
                // prevent right point is on editable
                if (dom.isEditable(ec)) {
                    ec = ec.childNodes[eo - 1]
                    eo = dom.nodeLength(ec)
                }

                return range.create(sc, so, ec, eo)
            }
            this.removeStyle = function () {
                document.execCommand('removeFormat', false)

                var rng = range.create()
                rng = this.expandEdgePoint(rng)

                var nodes = rng.nodes(dom.isElement, { fullyContains: true })
                nodes.forEach((node) => {
                    if ($editable.find(node).length) {
                        if (node.childElementCount) {
                            let nodeRng = range.createFromNode(node)
                            nodeRng.select()
                            $(node).find(removedTags).contents().unwrap()
                        }
                        $(node).removeAttr(removedAttrs)
                            .removeClass((_, className) => className.split(' ').filter(c => !excluded.includes(c)))
                    }
                })

                context.invoke('editor.setLastRange', rng.select())

            }
        }
    })
    $.extend(true, $.summernote.lang, {
        'zh-TW': {
            customCleaner: {
                removeStyle: '清除所有樣式',
            }
        },
        'en-US': {
            customCleaner: {
                removeStyle: 'Remove All Style'
            }
        },
    });
}));