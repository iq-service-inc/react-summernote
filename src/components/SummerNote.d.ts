import React from 'react'

export type SummerNoteOptions = {
    lang?: 'en' | 'zh-TW'
    toolbar?: [string, string[]][]
    height?: number
    dialogsInBody?: boolean
    codeviewFilterRegex?: RegExp
    codeviewFilter?: boolean
    codeviewIframeFilter?: boolean
    fontNames?: string[]
}

export type SummerNoteRef = {
    focus: () => void
    isEmpty: () => boolean
    reset: () => void
    disable: () => void
    enable: () => void
    insertImage: (url: string, filenameOrCallback?: string|(($image: JQuery) => void)) => void
    insertNode: (node: HTMLElement) => void
    insertText: (text: string) => void
}

export interface SummerNoteProps {
    options?: SummerNoteOptions
    codeview?: boolean
    destroy?: boolean
    value?: string
    innerRef?: React.RefObject<HTMLElement>
    disabled?: boolean
    onImageUpload?: (file: File) => void
    onImagePasteFromWord?: (imgs: unknown) => void
    onChange?: (e: React.ChangeEvent<HTMLDivElement>) => void
    onPaste?: (e: any) => void
}

declare class SummerNote extends React.Component<SummerNoteProps> {
    ImportCode: () => void
}

export default SummerNote
