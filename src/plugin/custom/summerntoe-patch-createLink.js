(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory)
    } else if (typeof module === 'object' && module.exports) {
        // CommonJS
        module.exports = factory(require('jquery'))
    } else {
        // 瀏覽器環境
        factory(window.jQuery)
    }
}(function ($) {
    $.extend($.summernote.plugins, {
        'customCreateLink': function (context) {
            const self = this;
            var modules = context.modules;

            this.checkLinkUrl = function (linkUrl) {
                const MAILTO_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                const TEL_PATTERN = /^(\+?\d{1,3}[\s-]?)?(\d{1,4})[\s-]?(\d{1,4})[\s-]?(\d{1,4})$/;
                const URL_SCHEME_PATTERN = /^([A-Za-z][A-Za-z0-9+-.]*\:|#|\/)/;

                if (MAILTO_PATTERN.test(linkUrl)) {
                    return 'mailto://' + linkUrl;
                } else if (TEL_PATTERN.test(linkUrl)) {
                    return 'tel://' + linkUrl;
                } else if (!URL_SCHEME_PATTERN.test(linkUrl)) {
                    return 'http://' + linkUrl;
                }
                return linkUrl;
            };

            this.createCustomLink = function (linkInfo) {
                let rel = [];
                let linkUrl = linkInfo.url;
                const linkText = linkInfo.text;
                const isNewWindow = linkInfo.isNewWindow;
                const addNoReferrer = context.options.linkAddNoReferrer;
                const addNoOpener = context.options.linkAddNoOpener;
                let rng = linkInfo.range || context.invoke('editor.createRange');
                const additionalTextLength = linkText.length - rng.toString().length;
                if (additionalTextLength > 0 && context.invoke('editor.isLimited', additionalTextLength)) {
                    return;
                }
                const isTextChanged = rng.toString() !== linkText;

                if (typeof linkUrl === 'string') {
                    linkUrl = linkUrl.trim();
                }
                if (context.options.onCreateLink) {
                    linkUrl = context.options.onCreateLink(linkUrl);
                } else {
                    self.checkLinkUrl(linkUrl)
                }

                const $firstAnchor = rng.nodes(node => node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A')[0];

                let anchors = [];
                if (isTextChanged) {
                    rng = rng.deleteContents();
                    const anchor = rng.insertNode($('<A></A>').text(linkText)[0]);
                    anchors.push(anchor);
                } else if ($firstAnchor && $($firstAnchor).text() === rng.toString()) {
                    anchors.push($firstAnchor)
                } else {
                    anchors = modules.editor.style.styleNodes(rng, {
                        nodeName: 'A',
                        expandClosestSibling: true,
                        onlyPartialContains: true,
                    });
                }

                $.each(anchors, (idx, anchor) => {
                    $(anchor).attr('href', linkUrl);
                    if (isNewWindow) {
                        $(anchor).attr('target', '_blank');
                        if (addNoReferrer) {
                            rel.push('noreferrer');
                        }
                        if (addNoOpener) {
                            rel.push('noopener');
                        }
                        if (rel.length) {
                            $(anchor).attr('rel', rel.join(' '));
                        }
                    } else {
                        $(anchor).removeAttr('target');
                    }
                });

                context.invoke('editor.setLastRange', context.invoke('editor.createRangeFromList', anchors).select());
                const $editable = context.layoutInfo.editable;
                if ($editable && typeof $editable.html === "function") {
                    context.triggerEvent('change', $editable.html());
                }
            };

            modules.editor.createLink = this.createCustomLink.bind(modules.editor);

        }
    });
}));