export default {
    getTable: function (text) {
        // get table content
        var table = document.createElement('table'),
            start = text.indexOf('<!--StartFragment-->') + '<!--StartFragment-->'.length,
            end = text.indexOf('<!--EndFragment-->'),
            str = text.substring(start, end)
        table.innerHTML = str

        return table
    },

    createStylesheet: function (text) {
        // create isolated stylesheet
        var begin = text.indexOf('<!--table'),
            end = text.indexOf('-->', begin + '<!--table'.length),
            content = text.substring(begin + '<!--table'.length, end),
            style = document.createElement('style'),
            iframe = document.createElement('iframe')
        style.innerHTML = content
        iframe.style.display = 'none'
        document.body.appendChild(iframe)
        iframe.contentDocument.documentElement.appendChild(style)
        document.body.removeChild(iframe)

        return style
    },

    applyStyleInline: function (table, style) {
        // put css to inline
        var rules = style.sheet.rules || style.sheet.cssRules
        if (rules.length) {
            for (let i = 0; i < rules.length; i++) {
                // To detect if the rule contains styles and is not an at-rule, it's enough to check rule's type.
                if (rules[i].type === window.CSSRule.STYLE_RULE) {
                    $(table).find(rules[i].selectorText).each((index, el) => {
                        el.style = el.style.cssText + rules[i].style.cssText
                    })
                }
            }
        }
    },

    removeImage: function (table) {
        // remove excel img tag
        var imgs = table.getElementsByTagName('img')
        for (let index = 0; index < imgs.length; index++) {
            const el = imgs[index]
            el.remove()
        }
    }
}