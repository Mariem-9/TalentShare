import {
  BaseComponent
} from "./chunk-CZMB2PYF.js";
import {
  BaseStyle
} from "./chunk-5SJYZSHW.js";
import {
  PrimeTemplate,
  SharedModule
} from "./chunk-ARCGZE2X.js";
import {
  addClass,
  getHeight,
  getOuterHeight,
  getOuterWidth,
  getWidth,
  hasClass,
  isRTL,
  removeClass
} from "./chunk-PW4W4WIX.js";
import {
  CommonModule,
  NgClass,
  NgForOf,
  NgIf,
  NgStyle,
  NgTemplateOutlet,
  isPlatformBrowser
} from "./chunk-DTN2HQ6V.js";
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Injectable,
  Input,
  NgModule,
  Output,
  ViewChild,
  ViewEncapsulation,
  computed,
  contentChild,
  forwardRef,
  inject,
  numberAttribute,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵInputTransformsFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵcontentQuery,
  ɵɵcontentQuerySignal,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵqueryAdvance,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵviewQuery
} from "./chunk-DLLQ2QWL.js";
import "./chunk-OLYLR3PL.js";
import "./chunk-XZINNT2E.js";
import "./chunk-I4GRS3VG.js";
import "./chunk-3OV72XIM.js";

// node_modules/primeng/fesm2022/primeng-splitter.mjs
var _c0 = ["*"];
var _c1 = ["panel"];
var _c2 = ["container"];
var _c3 = (a0) => ({
  display: "flex",
  "flex-wrap": "nowrap",
  "flex-direction": a0
});
function Splitter_ng_template_2_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function Splitter_ng_template_2_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 6);
    ɵɵlistener("mousedown", function Splitter_ng_template_2_div_2_Template_div_mousedown_0_listener($event) {
      ɵɵrestoreView(_r1);
      const i_r2 = ɵɵnextContext().index;
      const ctx_r2 = ɵɵnextContext();
      return ɵɵresetView(ctx_r2.onGutterMouseDown($event, i_r2));
    })("touchstart", function Splitter_ng_template_2_div_2_Template_div_touchstart_0_listener($event) {
      ɵɵrestoreView(_r1);
      const i_r2 = ɵɵnextContext().index;
      const ctx_r2 = ɵɵnextContext();
      return ɵɵresetView(ctx_r2.onGutterTouchStart($event, i_r2));
    })("touchmove", function Splitter_ng_template_2_div_2_Template_div_touchmove_0_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r2 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r2.onGutterTouchMove($event));
    })("touchend", function Splitter_ng_template_2_div_2_Template_div_touchend_0_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r2 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r2.onGutterTouchEnd($event));
    });
    ɵɵelementStart(1, "div", 7);
    ɵɵlistener("keyup", function Splitter_ng_template_2_div_2_Template_div_keyup_1_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r2 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r2.onGutterKeyUp($event));
    })("keydown", function Splitter_ng_template_2_div_2_Template_div_keydown_1_listener($event) {
      ɵɵrestoreView(_r1);
      const i_r2 = ɵɵnextContext().index;
      const ctx_r2 = ɵɵnextContext();
      return ɵɵresetView(ctx_r2.onGutterKeyDown($event, i_r2));
    });
    ɵɵelementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = ɵɵnextContext(2);
    ɵɵattribute("data-p-gutter-resizing", false)("data-pc-section", "gutter");
    ɵɵadvance();
    ɵɵproperty("ngStyle", ctx_r2.gutterStyle());
    ɵɵattribute("aria-orientation", ctx_r2.layout)("aria-valuenow", ctx_r2.prevSize)("data-pc-section", "gutterhandle");
  }
}
function Splitter_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 3);
    ɵɵtemplate(1, Splitter_ng_template_2_ng_container_1_Template, 1, 0, "ng-container", 4);
    ɵɵelementEnd();
    ɵɵtemplate(2, Splitter_ng_template_2_div_2_Template, 2, 6, "div", 5);
  }
  if (rf & 2) {
    const panel_r4 = ctx.$implicit;
    const i_r2 = ctx.index;
    const ctx_r2 = ɵɵnextContext();
    ɵɵclassMap(ctx_r2.panelStyleClass);
    ɵɵproperty("ngClass", ctx_r2.panelContainerClass())("ngStyle", ctx_r2.panelStyle);
    ɵɵattribute("data-pc-name", "splitter")("data-pc-section", "root");
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", panel_r4);
    ɵɵadvance();
    ɵɵproperty("ngIf", i_r2 !== ctx_r2.panels.length - 1);
  }
}
var theme = ({
  dt
}) => `
.p-splitter {
    display: flex;
    flex-wrap: nowrap;
    border: 1px solid ${dt("splitter.border.color")};
    background: ${dt("splitter.background")};
    border-radius: ${dt("border.radius.md")};
    color: ${dt("splitter.color")};
}

.p-splitter-vertical {
    flex-direction: column;
}

.p-splitter-gutter {
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    background: ${dt("splitter.gutter.background")};
}

.p-splitter-gutter-handle {
    border-radius: ${dt("splitter.handle.border.radius")};
    background: ${dt("splitter.handle.background")};
    transition: outline-color ${dt("splitter.transition.duration")}, box-shadow ${dt("splitter.transition.duration")};
    outline-color: transparent;
}

.p-splitter-gutter-handle:focus-visible {
    box-shadow: ${dt("splitter.handle.focus.ring.shadow")};
    outline: ${dt("splitter.handle.focus.ring.width")} ${dt("splitter.handle.focus.ring.style")} ${dt("splitter.handle.focus.ring.color")};
    outline-offset: ${dt("splitter.handle.focus.ring.offset")};
}

.p-splitter-horizontal.p-splitter-resizing {
    cursor: col-resize;
    user-select: none;
}

.p-splitter-vertical.p-splitter-resizing {
    cursor: row-resize;
    user-select: none;
}

.p-splitter-horizontal > .p-splitter-gutter > .p-splitter-gutter-handle {
    height: ${dt("splitter.handle.size")};
    width: 100%;
}

.p-splitter-vertical > .p-splitter-gutter > .p-splitter-gutter-handle {
    width: ${dt("splitter.handle.size")};
    height: 100%;
}

.p-splitter-horizontal > .p-splitter-gutter {
    cursor: col-resize;
}

.p-splitter-vertical > .p-splitter-gutter {
    cursor: row-resize;
}

.p-splitterpanel {
    flex-grow: 1;
    overflow: hidden;
}

.p-splitterpanel-nested {
    display: flex;
    flex-grow: 1;
    justify-content: center;
}

.p-splitterpanel .p-splitter {
    flex-grow: 1;
    border: 0 none;
}
`;
var classes = {
  root: ({
    props
  }) => ["p-splitter p-component", "p-splitter-" + props.layout],
  gutter: "p-splitter-gutter",
  gutterHandle: "p-splitter-gutter-handle"
};
var SplitterStyle = class _SplitterStyle extends BaseStyle {
  name = "splitter";
  theme = theme;
  classes = classes;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSplitterStyle_BaseFactory;
    return function SplitterStyle_Factory(__ngFactoryType__) {
      return (ɵSplitterStyle_BaseFactory || (ɵSplitterStyle_BaseFactory = ɵɵgetInheritedFactory(_SplitterStyle)))(__ngFactoryType__ || _SplitterStyle);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _SplitterStyle,
    factory: _SplitterStyle.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SplitterStyle, [{
    type: Injectable
  }], null, null);
})();
var SplitterClasses;
(function(SplitterClasses2) {
  SplitterClasses2["root"] = "p-splitter";
  SplitterClasses2["gutter"] = "p-splitter-gutter";
  SplitterClasses2["gutterHandle"] = "p-splitter-gutter-handle";
})(SplitterClasses || (SplitterClasses = {}));
var SplitterPanel = class _SplitterPanel extends BaseComponent {
  splitter = contentChild(forwardRef(() => Splitter));
  nestedState = computed(() => this.splitter());
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSplitterPanel_BaseFactory;
    return function SplitterPanel_Factory(__ngFactoryType__) {
      return (ɵSplitterPanel_BaseFactory || (ɵSplitterPanel_BaseFactory = ɵɵgetInheritedFactory(_SplitterPanel)))(__ngFactoryType__ || _SplitterPanel);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _SplitterPanel,
    selectors: [["p-splitter-panel"]],
    contentQueries: function SplitterPanel_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuerySignal(dirIndex, ctx.splitter, Splitter, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance();
      }
    },
    hostAttrs: [1, "p-splitterpanel"],
    features: [ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function SplitterPanel_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    dependencies: [CommonModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SplitterPanel, [{
    type: Component,
    args: [{
      selector: "p-splitter-panel",
      standalone: true,
      imports: [CommonModule],
      template: `<ng-content></ng-content>`,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        class: "p-splitterpanel"
      }
    }]
  }], null, null);
})();
var Splitter = class _Splitter extends BaseComponent {
  /**
   * Style class of the component.
   * @group Props
   */
  styleClass;
  /**
   * Style class of the panel.
   * @group Props
   */
  panelStyleClass;
  /**
   * Inline style of the component.
   * @group Props
   */
  style;
  /**
   * Inline style of the panel.
   * @group Props
   */
  panelStyle;
  /**
   * Defines where a stateful splitter keeps its state, valid values are 'session' for sessionStorage and 'local' for localStorage.
   * @group Props
   */
  stateStorage = "session";
  /**
   * Storage identifier of a stateful Splitter.
   * @group Props
   */
  stateKey = null;
  /**
   * Orientation of the panels. Valid values are 'horizontal' and 'vertical'.
   * @group Props
   */
  layout = "horizontal";
  /**
   * Size of the divider in pixels.
   * @group Props
   */
  gutterSize = 4;
  /**
   * Step factor to increment/decrement the size of the panels while pressing the arrow keys.
   * @group Props
   */
  step = 5;
  /**
   * Minimum size of the elements relative to 100%.
   * @group Props
   */
  minSizes = [];
  /**
   * Size of the elements relative to 100%.
   * @group Props
   */
  get panelSizes() {
    return this._panelSizes;
  }
  set panelSizes(val) {
    this._panelSizes = val;
    if (this.el && this.el.nativeElement && this.panels.length > 0) {
      let children = [...this.el.nativeElement.children[0].children].filter((child) => hasClass(child, "p-splitterpanel"));
      let _panelSizes = [];
      this.panels.map((panel, i) => {
        let panelInitialSize = this.panelSizes.length - 1 >= i ? this.panelSizes[i] : null;
        let panelSize = panelInitialSize || 100 / this.panels.length;
        _panelSizes[i] = panelSize;
        children[i].style.flexBasis = "calc(" + panelSize + "% - " + (this.panels.length - 1) * this.gutterSize + "px)";
      });
    }
  }
  /**
   * Callback to invoke when resize ends.
   * @param {SplitterResizeEndEvent} event - Custom panel resize end event
   * @group Emits
   */
  onResizeEnd = new EventEmitter();
  /**
   * Callback to invoke when resize starts.
   * @param {SplitterResizeStartEvent} event - Custom panel resize start event
   * @group Emits
   */
  onResizeStart = new EventEmitter();
  containerViewChild;
  templates;
  panelChildren;
  nested = false;
  panels = [];
  dragging = false;
  mouseMoveListener;
  mouseUpListener;
  touchMoveListener;
  touchEndListener;
  size;
  gutterElement;
  startPos;
  prevPanelElement;
  nextPanelElement;
  nextPanelSize;
  prevPanelSize;
  _panelSizes = [];
  prevPanelIndex;
  timer;
  prevSize;
  _componentStyle = inject(SplitterStyle);
  ngOnInit() {
    super.ngOnInit();
    this.nested = this.isNested();
  }
  ngAfterContentInit() {
    if (this.templates && this.templates.toArray().length > 0) {
      this.templates.forEach((item) => {
        switch (item.getType()) {
          case "panel":
            this.panels.push(item.template);
            break;
          default:
            this.panels.push(item.template);
            break;
        }
      });
    }
    if (this.panelChildren && this.panelChildren.toArray().length > 0) {
      this.panelChildren.forEach((item) => {
        this.panels.push(item);
      });
    }
  }
  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (isPlatformBrowser(this.platformId)) {
      if (this.panels && this.panels.length) {
        let initialized = false;
        if (this.isStateful()) {
          initialized = this.restoreState();
        }
        if (!initialized) {
          let children = [...this.el.nativeElement.children[0].children].filter((child) => hasClass(child, "p-splitterpanel"));
          let _panelSizes = [];
          this.panels.map((panel, i) => {
            let panelInitialSize = this.panelSizes.length - 1 >= i ? this.panelSizes[i] : null;
            let panelSize = panelInitialSize || 100 / this.panels.length;
            _panelSizes[i] = panelSize;
            children[i].style.flexBasis = "calc(" + panelSize + "% - " + (this.panels.length - 1) * this.gutterSize + "px)";
          });
          this._panelSizes = _panelSizes;
          this.prevSize = parseFloat(_panelSizes[0]).toFixed(4);
        }
      }
    }
  }
  resizeStart(event, index, isKeyDown) {
    this.gutterElement = event.currentTarget || event.target.parentElement;
    this.size = this.horizontal() ? getWidth(this.containerViewChild.nativeElement) : getHeight(this.containerViewChild.nativeElement);
    if (!isKeyDown) {
      this.dragging = true;
      this.startPos = this.horizontal() ? event instanceof MouseEvent ? event.pageX : event.changedTouches[0].pageX : event instanceof MouseEvent ? event.pageY : event.changedTouches[0].pageY;
    }
    this.prevPanelElement = this.gutterElement.previousElementSibling;
    this.nextPanelElement = this.gutterElement.nextElementSibling;
    if (isKeyDown) {
      this.prevPanelSize = this.horizontal() ? getOuterWidth(this.prevPanelElement, true) : getOuterHeight(this.prevPanelElement, true);
      this.nextPanelSize = this.horizontal() ? getOuterWidth(this.nextPanelElement, true) : getOuterHeight(this.nextPanelElement, true);
    } else {
      this.prevPanelSize = 100 * (this.horizontal() ? getOuterWidth(this.prevPanelElement, true) : getOuterHeight(this.prevPanelElement, true)) / this.size;
      this.nextPanelSize = 100 * (this.horizontal() ? getOuterWidth(this.nextPanelElement, true) : getOuterHeight(this.nextPanelElement, true)) / this.size;
    }
    this.prevPanelIndex = index;
    addClass(this.gutterElement, "p-splitter-gutter-resizing");
    this.gutterElement.setAttribute("data-p-gutter-resizing", "true");
    addClass(this.containerViewChild.nativeElement, "p-splitter-resizing");
    this.containerViewChild.nativeElement.setAttribute("data-p-resizing", "true");
    this.onResizeStart.emit({
      originalEvent: event,
      sizes: this._panelSizes
    });
  }
  onResize(event, step, isKeyDown) {
    let newPos, newPrevPanelSize, newNextPanelSize;
    if (isKeyDown) {
      if (this.horizontal()) {
        newPrevPanelSize = 100 * (this.prevPanelSize + step) / this.size;
        newNextPanelSize = 100 * (this.nextPanelSize - step) / this.size;
      } else {
        newPrevPanelSize = 100 * (this.prevPanelSize - step) / this.size;
        newNextPanelSize = 100 * (this.nextPanelSize + step) / this.size;
      }
    } else {
      if (this.horizontal()) {
        if (isRTL(this.el.nativeElement)) {
          newPos = (this.startPos - event.pageX) * 100 / this.size;
        } else {
          newPos = (event.pageX - this.startPos) * 100 / this.size;
        }
      } else {
        newPos = (event.pageY - this.startPos) * 100 / this.size;
      }
      newPrevPanelSize = this.prevPanelSize + newPos;
      newNextPanelSize = this.nextPanelSize - newPos;
    }
    this.prevSize = parseFloat(newPrevPanelSize).toFixed(4);
    if (this.validateResize(newPrevPanelSize, newNextPanelSize)) {
      this.prevPanelElement.style.flexBasis = "calc(" + newPrevPanelSize + "% - " + (this.panels.length - 1) * this.gutterSize + "px)";
      this.nextPanelElement.style.flexBasis = "calc(" + newNextPanelSize + "% - " + (this.panels.length - 1) * this.gutterSize + "px)";
      this._panelSizes[this.prevPanelIndex] = newPrevPanelSize;
      this._panelSizes[this.prevPanelIndex + 1] = newNextPanelSize;
    }
  }
  resizeEnd(event) {
    if (this.isStateful()) {
      this.saveState();
    }
    this.onResizeEnd.emit({
      originalEvent: event,
      sizes: this._panelSizes
    });
    removeClass(this.gutterElement, "p-splitter-gutter-resizing");
    removeClass(this.containerViewChild.nativeElement, "p-splitter-resizing");
    this.clear();
  }
  onGutterMouseDown(event, index) {
    this.resizeStart(event, index);
    this.bindMouseListeners();
  }
  onGutterTouchStart(event, index) {
    if (event.cancelable) {
      this.resizeStart(event, index);
      this.bindTouchListeners();
      event.preventDefault();
    }
  }
  onGutterTouchMove(event) {
    this.onResize(event);
    event.preventDefault();
  }
  onGutterTouchEnd(event) {
    this.resizeEnd(event);
    this.unbindTouchListeners();
    if (event.cancelable) event.preventDefault();
  }
  repeat(event, index, step) {
    this.resizeStart(event, index, true);
    this.onResize(event, step, true);
  }
  setTimer(event, index, step) {
    this.clearTimer();
    this.timer = setTimeout(() => {
      this.repeat(event, index, step);
    }, 40);
  }
  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  onGutterKeyUp(event) {
    this.clearTimer();
    this.resizeEnd(event);
  }
  onGutterKeyDown(event, index) {
    switch (event.code) {
      case "ArrowLeft": {
        if (this.layout === "horizontal") {
          this.setTimer(event, index, this.step * -1);
        }
        event.preventDefault();
        break;
      }
      case "ArrowRight": {
        if (this.layout === "horizontal") {
          this.setTimer(event, index, this.step);
        }
        event.preventDefault();
        break;
      }
      case "ArrowDown": {
        if (this.layout === "vertical") {
          this.setTimer(event, index, this.step * -1);
        }
        event.preventDefault();
        break;
      }
      case "ArrowUp": {
        if (this.layout === "vertical") {
          this.setTimer(event, index, this.step);
        }
        event.preventDefault();
        break;
      }
      default:
        break;
    }
  }
  validateResize(newPrevPanelSize, newNextPanelSize) {
    if (this.minSizes.length >= 1 && this.minSizes[0] && this.minSizes[0] > newPrevPanelSize) {
      return false;
    }
    if (this.minSizes.length > 1 && this.minSizes[1] && this.minSizes[1] > newNextPanelSize) {
      return false;
    }
    return true;
  }
  bindMouseListeners() {
    if (!this.mouseMoveListener) {
      this.mouseMoveListener = this.renderer.listen(this.document, "mousemove", (event) => {
        this.onResize(event);
      });
    }
    if (!this.mouseUpListener) {
      this.mouseUpListener = this.renderer.listen(this.document, "mouseup", (event) => {
        this.resizeEnd(event);
        this.unbindMouseListeners();
      });
    }
  }
  bindTouchListeners() {
    if (!this.touchMoveListener) {
      this.touchMoveListener = this.renderer.listen(this.document, "touchmove", (event) => {
        this.onResize(event.changedTouches[0]);
      });
    }
    if (!this.touchEndListener) {
      this.touchEndListener = this.renderer.listen(this.document, "touchend", (event) => {
        this.resizeEnd(event);
        this.unbindTouchListeners();
      });
    }
  }
  unbindMouseListeners() {
    if (this.mouseMoveListener) {
      this.mouseMoveListener();
      this.mouseMoveListener = null;
    }
    if (this.mouseUpListener) {
      this.mouseUpListener();
      this.mouseUpListener = null;
    }
  }
  unbindTouchListeners() {
    if (this.touchMoveListener) {
      this.touchMoveListener();
      this.touchMoveListener = null;
    }
    if (this.touchEndListener) {
      this.touchEndListener();
      this.touchEndListener = null;
    }
  }
  clear() {
    this.dragging = false;
    this.size = null;
    this.startPos = null;
    this.prevPanelElement = null;
    this.nextPanelElement = null;
    this.prevPanelSize = null;
    this.nextPanelSize = null;
    this.gutterElement = null;
    this.prevPanelIndex = null;
  }
  isNested() {
    if (this.el.nativeElement) {
      let parent = this.el.nativeElement.parentElement;
      while (parent && !hasClass(parent, "p-splitter")) {
        parent = parent.parentElement;
      }
      return parent !== null;
    } else {
      return false;
    }
  }
  isStateful() {
    return this.stateKey != null;
  }
  getStorage() {
    if (isPlatformBrowser(this.platformId)) {
      switch (this.stateStorage) {
        case "local":
          return this.document.defaultView.localStorage;
        case "session":
          return this.document.defaultView.sessionStorage;
        default:
          throw new Error(this.stateStorage + ' is not a valid value for the state storage, supported values are "local" and "session".');
      }
    } else {
      throw new Error("Storage is not a available by default on the server.");
    }
  }
  saveState() {
    this.getStorage().setItem(this.stateKey, JSON.stringify(this._panelSizes));
  }
  restoreState() {
    const storage = this.getStorage();
    const stateString = storage.getItem(this.stateKey);
    if (stateString) {
      this._panelSizes = JSON.parse(stateString);
      let children = [...this.containerViewChild.nativeElement.children].filter((child) => hasClass(child, "p-splitterpanel"));
      children.forEach((child, i) => {
        child.style.flexBasis = "calc(" + this._panelSizes[i] + "% - " + (this.panels.length - 1) * this.gutterSize + "px)";
      });
      return true;
    }
    return false;
  }
  containerClass() {
    return {
      "p-splitter p-component": true,
      "p-splitter-horizontal": this.layout === "horizontal",
      "p-splitter-vertical": this.layout === "vertical"
    };
  }
  panelContainerClass() {
    return {
      "p-splitterpanel": true,
      "p-splitterpanel-nested": true
    };
  }
  gutterStyle() {
    if (this.horizontal()) return {
      width: this.gutterSize + "px"
    };
    else return {
      height: this.gutterSize + "px"
    };
  }
  horizontal() {
    return this.layout === "horizontal";
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵSplitter_BaseFactory;
    return function Splitter_Factory(__ngFactoryType__) {
      return (ɵSplitter_BaseFactory || (ɵSplitter_BaseFactory = ɵɵgetInheritedFactory(_Splitter)))(__ngFactoryType__ || _Splitter);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _Splitter,
    selectors: [["p-splitter"]],
    contentQueries: function Splitter_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, PrimeTemplate, 4);
        ɵɵcontentQuery(dirIndex, _c1, 4);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.templates = _t);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.panelChildren = _t);
      }
    },
    viewQuery: function Splitter_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c2, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.containerViewChild = _t.first);
      }
    },
    hostVars: 2,
    hostBindings: function Splitter_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("p-splitterpanel-nested", ctx.nested);
      }
    },
    inputs: {
      styleClass: "styleClass",
      panelStyleClass: "panelStyleClass",
      style: "style",
      panelStyle: "panelStyle",
      stateStorage: "stateStorage",
      stateKey: "stateKey",
      layout: "layout",
      gutterSize: [2, "gutterSize", "gutterSize", numberAttribute],
      step: [2, "step", "step", numberAttribute],
      minSizes: "minSizes",
      panelSizes: "panelSizes"
    },
    outputs: {
      onResizeEnd: "onResizeEnd",
      onResizeStart: "onResizeStart"
    },
    features: [ɵɵProvidersFeature([SplitterStyle]), ɵɵInputTransformsFeature, ɵɵInheritDefinitionFeature],
    decls: 3,
    vars: 12,
    consts: [["container", ""], [3, "ngClass", "ngStyle"], ["ngFor", "", 3, "ngForOf"], ["tabindex", "-1", 3, "ngClass", "ngStyle"], [4, "ngTemplateOutlet"], ["class", "p-splitter-gutter", "role", "separator", "tabindex", "-1", 3, "mousedown", "touchstart", "touchmove", "touchend", 4, "ngIf"], ["role", "separator", "tabindex", "-1", 1, "p-splitter-gutter", 3, "mousedown", "touchstart", "touchmove", "touchend"], ["tabindex", "0", 1, "p-splitter-gutter-handle", 3, "keyup", "keydown", "ngStyle"]],
    template: function Splitter_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelementStart(0, "div", 1, 0);
        ɵɵtemplate(2, Splitter_ng_template_2_Template, 3, 8, "ng-template", 2);
        ɵɵelementEnd();
      }
      if (rf & 2) {
        ɵɵstyleMap(ɵɵpureFunction1(10, _c3, ctx.layout === "vertical" ? "column" : ""));
        ɵɵclassMap(ctx.styleClass);
        ɵɵproperty("ngClass", ctx.containerClass())("ngStyle", ctx.style);
        ɵɵattribute("data-pc-name", "splitter")("data-p-gutter-resizing", false)("data-pc-section", "root");
        ɵɵadvance(2);
        ɵɵproperty("ngForOf", ctx.panels);
      }
    },
    dependencies: [CommonModule, NgClass, NgForOf, NgIf, NgTemplateOutlet, NgStyle, SharedModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Splitter, [{
    type: Component,
    args: [{
      selector: "p-splitter",
      standalone: true,
      imports: [CommonModule, SharedModule],
      template: `
        <div
            #container
            [ngClass]="containerClass()"
            [class]="styleClass"
            [ngStyle]="style"
            [style]="{ display: 'flex', 'flex-wrap': 'nowrap', 'flex-direction': layout === 'vertical' ? 'column' : '' }"
            [attr.data-pc-name]="'splitter'"
            [attr.data-p-gutter-resizing]="false"
            [attr.data-pc-section]="'root'"
        >
            <ng-template ngFor let-panel [ngForOf]="panels" let-i="index">
                <div [ngClass]="panelContainerClass()" [class]="panelStyleClass" [ngStyle]="panelStyle" tabindex="-1" [attr.data-pc-name]="'splitter'" [attr.data-pc-section]="'root'">
                    <ng-container *ngTemplateOutlet="panel"></ng-container>
                </div>
                <div
                    *ngIf="i !== panels.length - 1"
                    class="p-splitter-gutter"
                    role="separator"
                    tabindex="-1"
                    (mousedown)="onGutterMouseDown($event, i)"
                    (touchstart)="onGutterTouchStart($event, i)"
                    (touchmove)="onGutterTouchMove($event)"
                    (touchend)="onGutterTouchEnd($event)"
                    [attr.data-p-gutter-resizing]="false"
                    [attr.data-pc-section]="'gutter'"
                >
                    <div
                        class="p-splitter-gutter-handle"
                        tabindex="0"
                        [ngStyle]="gutterStyle()"
                        [attr.aria-orientation]="layout"
                        [attr.aria-valuenow]="prevSize"
                        [attr.data-pc-section]="'gutterhandle'"
                        (keyup)="onGutterKeyUp($event)"
                        (keydown)="onGutterKeyDown($event, i)"
                    ></div>
                </div>
            </ng-template>
        </div>
    `,
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "[class.p-splitterpanel-nested]": "nested"
      },
      providers: [SplitterStyle]
    }]
  }], null, {
    styleClass: [{
      type: Input
    }],
    panelStyleClass: [{
      type: Input
    }],
    style: [{
      type: Input
    }],
    panelStyle: [{
      type: Input
    }],
    stateStorage: [{
      type: Input
    }],
    stateKey: [{
      type: Input
    }],
    layout: [{
      type: Input
    }],
    gutterSize: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    step: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    minSizes: [{
      type: Input
    }],
    panelSizes: [{
      type: Input
    }],
    onResizeEnd: [{
      type: Output
    }],
    onResizeStart: [{
      type: Output
    }],
    containerViewChild: [{
      type: ViewChild,
      args: ["container", {
        static: false
      }]
    }],
    templates: [{
      type: ContentChildren,
      args: [PrimeTemplate]
    }],
    panelChildren: [{
      type: ContentChildren,
      args: ["panel", {
        descendants: false
      }]
    }]
  });
})();
var SplitterModule = class _SplitterModule {
  static ɵfac = function SplitterModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SplitterModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _SplitterModule,
    imports: [Splitter, SplitterPanel, SharedModule],
    exports: [Splitter, SplitterPanel, SharedModule]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [Splitter, SplitterPanel, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SplitterModule, [{
    type: NgModule,
    args: [{
      imports: [Splitter, SplitterPanel, SharedModule],
      exports: [Splitter, SplitterPanel, SharedModule]
    }]
  }], null, null);
})();
export {
  Splitter,
  SplitterClasses,
  SplitterModule,
  SplitterPanel,
  SplitterStyle
};
//# sourceMappingURL=primeng_splitter.js.map
