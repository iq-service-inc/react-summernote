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
        'pasteCleanup': function (context) {
            let isPaste = false

            this.events = {
                'summernote.change': function () {
                    context.invoke('pasteCleanup.handleChange')
                },
                'summernote.paste': function () {
                    context.invoke('pasteCleanup.handlePaste')
                }
            }

            this.handlePaste = function (event) {
                isPaste = true
            }

            // 貼上
            this.handleChange = function (event) {
                if (isPaste) {
                    isPaste = false
                    const editable = context.layoutInfo.editable[0] // 取得可編輯區塊
                    const links = editable.querySelectorAll('a') // 直接找到所有 `<a>`

                    links.forEach($link => {
                        let originalHref = $link.getAttribute('href')
                        if (originalHref) {
                            try {
                                const currentUrl = window.location.origin + window.location.pathname
                                let decodedHref = decodeURIComponent(originalHref)
                                if (decodedHref.startsWith(currentUrl)) {
                                    const newHref = decodedHref.replace(currentUrl, '')
                                    $link.setAttribute('href', newHref)
                                }
                            } catch (e) {
                                console.error("URL 解析錯誤:", decodedHref)
                            }
                        }
                    })
                }
            }

        }
    })
}))
