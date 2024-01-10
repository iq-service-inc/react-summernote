import React from 'react';
import * as ReactDOM from 'react-dom'
export const createSummernoteButton = (Component) => {
    return (context) => {
        let container = $('<div class="not-btn-group btn-group"></div>')
        ReactDOM.render(<Component context={context} />, container[0])
        return container
    }
}

export class SummernotePluginClass {
    constructor(context) {
        this.context = context;
    }
}

export const createSummernotePlugin = (name, PluginOptions, PluginLang, Plugin) => {
    $.extend($.summernote.options, {
        [name]: PluginOptions
    })

    $.extend(true, $.summernote.lang, PluginLang)

    if (Plugin) {
        $.extend($.summernote.plugins, {
            [name]: function (context) {
                return new Plugin(context)
            }
        })
    }
}
