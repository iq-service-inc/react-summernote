import React from "react";

declare global {
    interface JQueryStatic {
        summernote: Summernote;
        summernote(command: string, ...args: any[]): JQuery;
        summernote(options?: SummernoteOptions): JQuery;
    }
}

export declare const createSummernotePlugin: (name: string, PluginOptions?: object, PluginLang?: PluginLang, Plugin?: SummernotePluginClass | SummernotePluginFunction) => void
export declare class SummernotePluginClass {
    constructor(context: SummernoteContext);
    context?: SummernoteContext;
    events?: object;
    initialize?(): void;
    destroy?(): void;
    shoudInitialize?(): boolean;
    [key: string]: any;
}
export type SummernotePluginFunction = (
    this: {
        events: object;
        initialize: () => void;
        destroy: () => void;
        shoudInitialize: () => boolean;
    },
    context: SummernoteContext
) => void;

export declare const createSummernoteButton: (Component: React.ReactNode) => (context: SummernoteContext) => JQuery


export interface SummernoteContext {
    $note: JQuery;
    memos: object;
    modules: object;
    layoutInfo: SummernoteLayoutInfo;
    options: SummernoteOptions;
    ui: SummernoteUI;
    invoke(namespace: string, ...args: any[]): any;
    createInvokeHandlerAndUpdateState(namespace: string, ...args: any[]): (event: MouseEvent) => void;
    createInvokeHandler(namespace: string, ...args: any[]): (event: MouseEvent) => void;
    memo(key: string, value: any): any | void;
    removeMemo(key: string): void;
    code(html?: string): string | void;
    isDisabled(): boolean;
    enable(): void;
    disable(): void;
    triggerEvent(namespace: string, ...args: any[]): void;
}
interface SummernoteLayoutInfo {
    note: JQuery;
    editor: JQuery;
    toolbar: JQuery;
    editingArea: JQuery;
    editable: JQuery;
    codable: JQuery;
    statusbar: JQuery;
}
interface SummernoteOptions {
    id: string;
    langInfo: object;
    editing: boolean;
    modules: object;
    buttons: object;
    lang: string;
    followingToolbar: boolean;
    toolbarPosition: string;
    otherStaticBar: string;
    codeviewKeepButton: boolean;
    toolbar: string[][];
    popatmouse: boolean;
    popover: {
        image: string[][];
        link: string[][];
        table: string[][];
        air: string[][];
    };
    airMode: boolean;
    overrideContextMenu: boolean;
    width: null | number | string;
    height: null | number | string;
    linkTargetBlank: boolean;
    useProtocol: boolean;
    defaultProtocol: string;
    focus: boolean;
    tabDisabled: boolean;
    tabSize: number;
    styleWithCSS: boolean;
    shortcuts: boolean;
    textareaAutoSync: boolean;
    tooltip: string;
    container: null | any;
    maxTextLength: number;
    blockquoteBreakingLevel: number;
    spellCheck: boolean;
    disableGrammar: boolean;
    placeholder: null;
    inheritPlaceholder: boolean;
    recordEveryKeystroke: boolean;
    historyLimit: number;
    showDomainOnlyForAutolink: boolean;
    hintMode: string;
    hintSelect: string;
    hintDirection: string;
    styleTags: string[];
    fontNames: string[];
    fontNamesIgnoreCheck: string[];
    addDefaultFonts: boolean;
    fontSizes: string[];
    fontSizeUnits: string[];
    colors: string[][];
    colorsName: string[][];
    colorButton: {
        foreColor: string;
        backColor: string;
    };
    lineHeights: string[];
    tableClassName: string;
    insertTableMaxSize: {
        col: number;
        row: number;
    };
    dialogsInBody: boolean;
    dialogsFade: boolean;
    maximumImageFileSize: null;
    callbacks: {
        onBeforeCommand: null | ((contents: string) => void);
        onBlur: null | ((e: Event) => void);
        onBlurCodeview: null | ((code: string, e: Event) => void);
        onChange: null | ((contents: string, $editable: JQuery) => void);
        onChangeCodeview: null | ((code: string, $editor: JQuery) => void);
        onDialogShown: null | (() => void);
        onEnter: null | ((e: Event) => void);
        onFocus: null | ((e: Event) => void);
        onImageLinkInsert: null | ((url: string) => void);
        onImageUpload: null | ((files: Blob[]) => void);
        onImageUploadError: null | ((err: any) => void);
        onInit: null | (() => void);
        onKeydown: null | ((e: KeyboardEvent) => void);
        onKeyup: null | ((e: KeyboardEvent) => void);
        onMousedown: null | ((e: MouseEvent) => void);
        onMouseup: null | ((e: MouseEvent) => void);
        onPaste: null | ((e: Event) => void);
        onScroll: null | ((e: Event) => void);
    };
    codemirror: {
        mode: string;
        htmlMode: boolean;
        lineNumbers: boolean;
    };
    codeviewFilter: boolean;
    codeviewFilterRegex: RegExp;
    codeviewIframeFilter: boolean;
    codeviewIframeWhitelistSrc: string[];
    keyMap: {
        pc: object;
        mac: object;
    };
    icons: object;
}
interface SummernoteRenderer {
    render($parent?: JQuery): JQuery;
    markup: string;
    children: JQuery;
    options: SummernoteRendererOptions;
    callback($node: JQuery, options: SummernoteRendererOptions): void
}
interface SummernoteRendererOptions {
    contents?: string;
    className?: string;
    data?: object;
    click?(event: JQuery.ClickEvent): void;
}
interface SummernoteDropDownOptions extends SummernoteRendererOptions {
    items?: any[] | string;
    template?(): any;
    title?: string;
    codeviewKeepButton?: boolean;
}
interface SummernoteDropDownCheckOptions extends SummernoteRendererOptions {
    items?: any[] | string;
    template?(): any;
    title?: string;
    codeviewKeepButton?: boolean;
    checkClassName?: string;
}
interface SummernoteDialogOptions extends SummernoteRendererOptions {
    fade?: boolean;
    title?: string;
    body?: string;
    footer?: string;
}
interface SummernotePopoverOptions extends SummernoteRendererOptions {
    direction?: 'top' | 'bottom' | 'left' | 'right';
    hideArrow?: boolean;
}
interface SummernoteCheckboxOptions extends SummernoteRendererOptions {
    id?: string;
    checked?: boolean;
    text?: string;
}
interface SummernoteButtonOptions extends SummernoteRendererOptions {
    tooltip?: string;
    container?: string | Element | false;
    codeviewButton?: boolean;
}
interface SummernotePaletteOptions extends SummernoteRendererOptions {
    colors?: string[];
    colorsName?: string[];
    eventName?: string;
    tooltip?: string;
    container?: string | Element | false;
}
interface SummernoteUI {
    airEditable(): SummernoteRenderer;
    airEditor(): SummernoteRenderer;
    button(options?: SummernoteButtonOptions): SummernoteRenderer;
    buttonGroup(): SummernoteRenderer;
    checkbox(options?: SummernoteCheckboxOptions): SummernoteRenderer;
    codable(): SummernoteRenderer;
    dialog(options?: SummernoteDialogOptions): SummernoteRenderer;
    dropdown(options?: SummernoteDropDownOptions): SummernoteRenderer;
    dropdownButtonContents(contents: string): string;
    dropdownCheck(options?: SummernoteDropDownCheckOptions): SummernoteRenderer;
    editable(): SummernoteRenderer;
    editingArea(): SummernoteRenderer;
    editor(): SummernoteRenderer;
    icon(iconClassName: string, tagName: string): string;
    options: object;
    palette(options?: SummernotePaletteOptions): SummernoteRenderer;
    popover(options?: SummernotePopoverOptions): SummernoteRenderer;
    statusbar(): SummernoteRenderer;
    toolbar(): SummernoteRenderer;
    toggleBtn($btn: JQuery, isEnable: boolean): void;
    toggleBtnActive($btn: JQuery, isActive: boolean): void;
    onDialogShown($dialog: JQuery, handler: (e: JQuery.Event) => void): void;
    onDialogHidden($dialog: JQuery, handler: (e: JQuery.Event) => void): void;
    showDialog($dialog: JQuery): void;
    hideDialog($dialog: JQuery): void;
    createLayout($note: JQuery): SummernoteLayoutInfo;
    removeLayout($note: JQuery, layoutInfo: SummernoteLayoutInfo): void;
}

interface Summernote {
    dom: SummernoteDom;
    interface: 'bs4' | 'bs3' | 'lite';
    lang: PluginLang;
    lists: object;
    options: SummernoteOptions;
    plugins: object;
    range: SummernoteRange;
    ui: SummernoteUI;
    ui_template: object;
    version: string;
}

interface BoundaryPoint {
    node: Node;
    offset: number;
}
interface SummernoteDom {
    NBSP_CHAR: string;
    ZERO_WIDTH_NBSP_CHAR: string;
    blank: string;
    emptyPara: string;
    makePredByNodeName(nodeName: string): (node: Node) => boolean;
    isEditable(node: Node): boolean;
    isControlSizing(node: Node): boolean;
    isText(node: Node): boolean;
    isElement(node: Node): boolean;
    isVoid(node: Node): boolean;
    isPara(node: Node): boolean;
    isPurePara(node: Node): boolean;
    isHeading(node: Node): boolean;
    isInline(node: Node): boolean;
    isBlock(node: Node): boolean;
    isBodyInline(node: Node): boolean;
    isBody(node: Node): boolean;
    isParaInline(node: Node): boolean;
    isPre(node: Node): boolean;
    isList(node: Node): boolean;
    isTable(node: Node): boolean;
    isData(node: Node): boolean;
    isCell(node: Node): boolean;
    isBlockquote(node: Node): boolean;
    isBodyContainer(node: Node): boolean;
    isAnchor(node: Node): boolean;
    isDiv(node: Node): boolean;
    isLi(node: Node): boolean;
    isBR(node: Node): boolean;
    isSpan(node: Node): boolean;
    isB(node: Node): boolean;
    isU(node: Node): boolean;
    isS(node: Node): boolean;
    isI(node: Node): boolean;
    isImg(node: Node): boolean;
    isTextarea(node: Node): boolean;
    deepestChildIsEmpty(node: Node): boolean;
    isEmpty(node: Node): boolean;
    isEmptyAnchor(node: Node): boolean;
    isClosestSibling(node: Node): boolean;
    withClosestSiblings(node: Node, pred: (node: Node) => boolean): Node[];
    nodeLength(node: Node): number;
    isLeftEdgePoint(point: BoundaryPoint): boolean;
    isRightEdgePoint(point: BoundaryPoint): boolean;
    isEdgePoint(point: BoundaryPoint): boolean;
    isLeftEdgeOf(node: Node): boolean;
    isRightEdgeOf(node: Node): boolean;
    isLeftEdgePointOf(node: Node, ancestor: Node): boolean;
    isRightEdgePointOf(node: Node, ancestor: Node): boolean;
    prevPoint(point: BoundaryPoint, isSkipInnerOffset?: boolean): BoundaryPoint | null;
    nextPoint(point: BoundaryPoint, isSkipInnerOffset?: boolean): BoundaryPoint | null;
    nextPointWithEmptyNode(point: BoundaryPoint): BoundaryPoint | null;
    isSamePoint(pointA: BoundaryPoint, pointB: BoundaryPoint): boolean;
    isVisiblePoint(point: BoundaryPoint): boolean;
    prevPointUntil(point: BoundaryPoint, pred: (point: BoundaryPoint) => boolean): BoundaryPoint | null;
    nextPointUntil(point: BoundaryPoint, pred: (point: BoundaryPoint) => boolean): BoundaryPoint | null;
    isCharPoint(point: BoundaryPoint): boolean;
    isSpacePoint(point: BoundaryPoint): boolean;
    walkPoint(startPoint: BoundaryPoint, endPoint: BoundaryPoint, handler: (point: BoundaryPoint) => boolean, isSkipInnerOffset?: boolean): void;
    ancestor(node: Node, pred: (node: Node) => boolean): Node | null;
    singleChildAncestor(node: Node, pred: (node: Node) => boolean): Node | null;
    listAncestor(node: Node, pred: (node: Node) => boolean): Node[];
    lastAncestor(node: Node, pred: (node: Node) => boolean): Node;
    listNext(node: Node, pred: (node: Node) => boolean): Node[];
    listPrev(node: Node, pred: (node: Node) => boolean): Node[];
    listDescendant(node: Node, pred?: (node: Node) => boolean): Node[];
    commonAncestor(nodeA: Node, nodeB: Node): Node | null;
    wrap(node: Node, wrapperName: string): Node;
    insertAfter(node: Node, preceding: Node): Node;
    appendChildNodes(node: Node, aChild: NodeList): void;
    position(node: Node): number;
    hasChildren(node: Node): boolean;
    makeOffsetPath(ancestor: Node, node: Node): number[];
    fromOffsetPath(ancestor: Node, offsets: number[]): Node;
    splitTree(root: Node, point: BoundaryPoint, options?: { isSkipPaddingBlankHTML?: boolean, isNotSplitEdgePoint?: boolean }): Node | null;
    splitPoint(point: BoundaryPoint, isInline?: boolean): { rightNode: Node, container: Node };
    create(nodeName: string): Node;
    createText(text: string): Text;
    remove(node: Node, isRemoveChild?: boolean): void;
    removeWhile(node: Node, pred: (node: Node) => boolean): void;
    replace(node: Node, nodeName: string): Node;
    html($node: JQuery, isNewlineOnBlock?: boolean): string;
    value($node: JQuery, stripLinebreaks?: boolean): string;
    posFromPlaceholder(placeholder: Node): { left: number, top: number };
    attachEvents($node: JQuery, events: object): void;
    detachEvents($node: JQuery, events: object): void;
    isCustomStyleTag(node: Node): boolean;
}

interface RangePoints {
    sc: Node;
    so: number;
    ec: Node;
    eo: number;
}
interface Bookmark {
    s: {
        path: number[];
        offset: number;
    },
    e: {
        path: number[];
        offset: number;
    }
}
interface WrappedRange {
    sc: Node;
    so: number;
    ec: Node;
    eo: number;
    isOnEditable: boolean;
    isOnList: boolean;
    isOnAnchor: boolean;
    isOnCell: boolean;
    isOnData: boolean;
    nativeRange(): Range;
    getPoints(): RangePoints;
    getStartPoint(): BoundaryPoint;
    getEndPoint(): BoundaryPoint;
    select(): this;
    scrollIntoView(container: Node): this;
    normalize(): WrappedRange;
    nodes(pred?: (node: Node) => boolean, options?: { includeAncestor?: boolean, fullyContains?: boolean }): Node[];
    commonAncestor(): Node | null;
    expand(pred?: (node: Node) => boolean): WrappedRange;
    collapse(isCollaspeToStart?: boolean): WrappedRange;
    splitText(): WrappedRange;
    deleteContents(): WrappedRange;
    makeIsOn(pred: (node: Node) => boolean): () => boolean;
    isLeftEdgeOf(pred: (node: Node) => boolean): boolean;
    isCollapsed(): boolean;
    wrapBodyInlineWithPara(): WrappedRange;
    insertNode(node: Node): Node;
    pasteHTML(markup: string): NodeList;
    toString(): string;
    getWordRange(findAfter?: boolean): WrappedRange;
    getWordsRange(findAfter?: boolean): WrappedRange;
    getWordsMatchRange(regex: RegExp): WrappedRange | null;
    bookmark(editable: Node): Bookmark;
    paraBookmark(paras: Node[]): Bookmark;
    getClientRects(): DOMRectList;
}
interface SummernoteRange {
    create(sc?: Node, so?: number, ec?: Node, eo?: number): WrappedRange;
    createFromBodyElement(bodyElement: Node, isCollapseToStart: boolean): WrappedRange;
    createFromBookmark(editable: Node, bookmark: Bookmark): WrappedRange;
    createFromNode(node: Node): WrappedRange;
    createFromNodeAfter(node: Node): WrappedRange;
    createFromNodeBefore(node: Node): WrappedRange;
    createFromParaBookmark(bookmark: Bookmark, paras: Node[]): WrappedRange;
    createFromSelection(): WrappedRange;
}

interface PluginLang {
    'az-AZ': object;
    'bg-BG': object;
    'ca-ES': object;
    'cs-CZ': object;
    'da-DK': object;
    'de-DE': object;
    'el-GR': object;
    'en-US': object;
    'es-ES': object;
    'es-EU': object;
    'fa-IR': object;
    'fi-FI': object;
    'fr-FR': object;
    'gl-ES': object;
    'he-IL': object;
    'hr-HR': object;
    'hu-HU': object;
    'id-ID': object;
    'it-IT': object;
    'ja-JP': object;
    'ko-KR': object;
    'lt-LT': object;
    'lt-LV': object;
    'mn-MN': object;
    'nb-NO': object;
    'nl-NL': object;
    'pl-PL': object;
    'pt-BR': object;
    'pt-PT': object;
    'ro-RO': object;
    'ru-RU': object;
    'sk-SK': object;
    'sl-SI': object;
    'sr-RS': object;
    'sv-SE': object;
    'ta-IN': object;
    'th-TH': object;
    'tr-TR': object;
    'uk-UA': object;
    'uz-UZ': object;
    'vi-VN': object;
    'zh-CN': object;
    'zh-TW': object;
}
