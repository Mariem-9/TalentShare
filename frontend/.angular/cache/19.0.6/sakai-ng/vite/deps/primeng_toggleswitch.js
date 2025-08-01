import {
  AutoFocus
} from "./chunk-4PVU4U3P.js";
import "./chunk-ARGAFGVT.js";
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
import "./chunk-PW4W4WIX.js";
import {
  NG_VALUE_ACCESSOR
} from "./chunk-KKZBZWVY.js";
import {
  CommonModule,
  NgClass,
  NgStyle,
  NgTemplateOutlet
} from "./chunk-DTN2HQ6V.js";
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Injectable,
  Input,
  NgModule,
  Output,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
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
  ɵɵconditional,
  ɵɵcontentQuery,
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
  ɵɵproperty,
  ɵɵpureFunction1,
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

// node_modules/primeng/fesm2022/primeng-toggleswitch.mjs
var _c0 = ["handle"];
var _c1 = ["input"];
var _c2 = (a0) => ({
  checked: a0
});
function ToggleSwitch_Conditional_5_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function ToggleSwitch_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, ToggleSwitch_Conditional_5_ng_container_0_Template, 1, 0, "ng-container", 4);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("ngTemplateOutlet", ctx_r1.handleTemplate || ctx_r1._handleTemplate)("ngTemplateOutletContext", ɵɵpureFunction1(2, _c2, ctx_r1.checked()));
  }
}
var theme = ({
  dt
}) => `
.p-toggleswitch {
    display: inline-block;
    width: ${dt("toggleswitch.width")};
    height: ${dt("toggleswitch.height")};
}

.p-toggleswitch-input {
    cursor: pointer;
    appearance: none;
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    z-index: 1;
    outline: 0 none;
    border-radius: ${dt("toggleswitch.border.radius")};
}

.p-toggleswitch-slider {
    display: inline-block;
    cursor: pointer;
    width: 100%;
    height: 100%;
    border-width: ${dt("toggleswitch.border.width")};
    border-style: solid;
    border-color: ${dt("toggleswitch.border.color")};
    background: ${dt("toggleswitch.background")};
    transition: background ${dt("toggleswitch.transition.duration")}, color ${dt("toggleswitch.transition.duration")}, border-color ${dt("toggleswitch.transition.duration")}, outline-color ${dt("toggleswitch.transition.duration")}, box-shadow ${dt("toggleswitch.transition.duration")};
    border-radius: ${dt("toggleswitch.border.radius")};
    outline-color: transparent;
    box-shadow: ${dt("toggleswitch.shadow")};
}

.p-toggleswitch-handle {
    position: absolute;
    top: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${dt("toggleswitch.handle.background")};
    color: ${dt("toggleswitch.handle.color")};
    width: ${dt("toggleswitch.handle.size")};
    height: ${dt("toggleswitch.handle.size")};
    inset-inline-start: ${dt("toggleswitch.gap")};
    margin-block-start: calc(-1 * calc(${dt("toggleswitch.handle.size")} / 2));
    border-radius: ${dt("toggleswitch.handle.border.radius")};
    transition: background ${dt("toggleswitch.transition.duration")}, color ${dt("toggleswitch.transition.duration")}, inset-inline-start ${dt("toggleswitch.slide.duration")}, box-shadow ${dt("toggleswitch.slide.duration")};
}

.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
    background: ${dt("toggleswitch.checked.background")};
    border-color: ${dt("toggleswitch.checked.border.color")};
}

.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
    background: ${dt("toggleswitch.handle.checked.background")};
    color: ${dt("toggleswitch.handle.checked.color")};
    inset-inline-start: calc(${dt("toggleswitch.width")} - calc(${dt("toggleswitch.handle.size")} + ${dt("toggleswitch.gap")}));
}

.p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-slider {
    background: ${dt("toggleswitch.hover.background")};
    border-color: ${dt("toggleswitch.hover.border.color")};
}

.p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-handle {
    background: ${dt("toggleswitch.handle.hover.background")};
    color: ${dt("toggleswitch.handle.hover.color")};
}

.p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-slider {
    background: ${dt("toggleswitch.checked.hover.background")};
    border-color: ${dt("toggleswitch.checked.hover.border.color")};
}

.p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-handle {
    background: ${dt("toggleswitch.handle.checked.hover.background")};
    color: ${dt("toggleswitch.handle.checked.hover.color")};
}

.p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:focus-visible) .p-toggleswitch-slider {
    box-shadow: ${dt("toggleswitch.focus.ring.shadow")};
    outline: ${dt("toggleswitch.focus.ring.width")} ${dt("toggleswitch.focus.ring.style")} ${dt("toggleswitch.focus.ring.color")};
    outline-offset: ${dt("toggleswitch.focus.ring.offset")};
}

.p-toggleswitch.p-invalid > .p-toggleswitch-slider {
    border-color: ${dt("toggleswitch.invalid.border.color")};
}

.p-toggleswitch.p-disabled {
    opacity: 1;
}

.p-toggleswitch.p-disabled .p-toggleswitch-slider {
    background: ${dt("toggleswitch.disabled.background")};
}

.p-toggleswitch.p-disabled .p-toggleswitch-handle {
    background: ${dt("toggleswitch.handle.disabled.background")};
}

/* For PrimeNG */

p-toggleSwitch.ng-invalid.ng-dirty > .p-toggleswitch > .p-toggleswitch-slider,
p-toggle-switch.ng-invalid.ng-dirty > .p-toggleswitch > .p-toggleswitch-slider,
p-toggleswitch.ng-invalid.ng-dirty > .p-toggleswitch > .p-toggleswitch-slider {
    border-color: ${dt("toggleswitch.invalid.border.color")};
}`;
var inlineStyles = {
  root: {
    position: "relative"
  }
};
var classes = {
  root: ({
    instance
  }) => ({
    "p-toggleswitch p-component": true,
    "p-toggleswitch-checked": instance.checked(),
    "p-disabled": instance.disabled,
    "p-invalid": instance.invalid
  }),
  input: "p-toggleswitch-input",
  slider: "p-toggleswitch-slider",
  handle: "p-toggleswitch-handle"
};
var ToggleSwitchStyle = class _ToggleSwitchStyle extends BaseStyle {
  name = "toggleswitch";
  theme = theme;
  classes = classes;
  inlineStyles = inlineStyles;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵToggleSwitchStyle_BaseFactory;
    return function ToggleSwitchStyle_Factory(__ngFactoryType__) {
      return (ɵToggleSwitchStyle_BaseFactory || (ɵToggleSwitchStyle_BaseFactory = ɵɵgetInheritedFactory(_ToggleSwitchStyle)))(__ngFactoryType__ || _ToggleSwitchStyle);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _ToggleSwitchStyle,
    factory: _ToggleSwitchStyle.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToggleSwitchStyle, [{
    type: Injectable
  }], null, null);
})();
var ToggleSwitchClasses;
(function(ToggleSwitchClasses2) {
  ToggleSwitchClasses2["root"] = "p-toggleswitch";
  ToggleSwitchClasses2["input"] = "p-toggleswitch-input";
  ToggleSwitchClasses2["slider"] = "p-toggleswitch-slider";
})(ToggleSwitchClasses || (ToggleSwitchClasses = {}));
var TOGGLESWITCH_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ToggleSwitch),
  multi: true
};
var ToggleSwitch = class _ToggleSwitch extends BaseComponent {
  /**
   * Inline style of the component.
   * @group Props
   */
  style;
  /**
   * Style class of the component.
   * @group Props
   */
  styleClass;
  /**
   * Index of the element in tabbing order.
   * @group Props
   */
  tabindex;
  /**
   * Identifier of the input element.
   * @group Props
   */
  inputId;
  /**
   * Name of the input element.
   * @group Props
   */
  name;
  /**
   * When present, it specifies that the element should be disabled.
   * @group Props
   */
  disabled;
  /**
   * When present, it specifies that the component cannot be edited.
   * @group Props
   */
  readonly;
  /**
   * Value in checked state.
   * @group Props
   */
  trueValue = true;
  /**
   * Value in unchecked state.
   * @group Props
   */
  falseValue = false;
  /**
   * Used to define a string that autocomplete attribute the current element.
   * @group Props
   */
  ariaLabel;
  /**
   * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
   * @group Props
   */
  ariaLabelledBy;
  /**
   * When present, it specifies that the component should automatically get focus on load.
   * @group Props
   */
  autofocus;
  /**
   * Callback to invoke when the on value change.
   * @param {ToggleSwitchChangeEvent} event - Custom change event.
   * @group Emits
   */
  onChange = new EventEmitter();
  input;
  /**
   * Callback to invoke when the on value change.
   * @type {TemplateRef<ToggleSwitchHandleTemplateContext>} context - Context of the template
   * @example
   * ```html
   * <ng-template #handle let-checked="checked"> </ng-template>
   * ```
   * @see {@link ToggleSwitchHandleTemplateContext}
   * @group Templates
   */
  handleTemplate;
  _handleTemplate;
  modelValue = false;
  focused = false;
  onModelChange = () => {
  };
  onModelTouched = () => {
  };
  _componentStyle = inject(ToggleSwitchStyle);
  templates;
  ngAfterContentInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case "handle":
          this._handleTemplate = item.template;
          break;
        default:
          this._handleTemplate = item.template;
          break;
      }
    });
  }
  onClick(event) {
    if (!this.disabled && !this.readonly) {
      this.modelValue = this.checked() ? this.falseValue : this.trueValue;
      this.onModelChange(this.modelValue);
      this.onChange.emit({
        originalEvent: event,
        checked: this.modelValue
      });
      this.input.nativeElement.focus();
    }
  }
  onFocus() {
    this.focused = true;
  }
  onBlur() {
    this.focused = false;
    this.onModelTouched();
  }
  writeValue(value) {
    this.modelValue = value;
    this.cd.markForCheck();
  }
  registerOnChange(fn) {
    this.onModelChange = fn;
  }
  registerOnTouched(fn) {
    this.onModelTouched = fn;
  }
  setDisabledState(val) {
    this.disabled = val;
    this.cd.markForCheck();
  }
  checked() {
    return this.modelValue === this.trueValue;
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵToggleSwitch_BaseFactory;
    return function ToggleSwitch_Factory(__ngFactoryType__) {
      return (ɵToggleSwitch_BaseFactory || (ɵToggleSwitch_BaseFactory = ɵɵgetInheritedFactory(_ToggleSwitch)))(__ngFactoryType__ || _ToggleSwitch);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _ToggleSwitch,
    selectors: [["p-toggleswitch"], ["p-toggleSwitch"], ["p-toggle-switch"]],
    contentQueries: function ToggleSwitch_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, _c0, 4);
        ɵɵcontentQuery(dirIndex, PrimeTemplate, 4);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.handleTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.templates = _t);
      }
    },
    viewQuery: function ToggleSwitch_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c1, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.input = _t.first);
      }
    },
    inputs: {
      style: "style",
      styleClass: "styleClass",
      tabindex: [2, "tabindex", "tabindex", numberAttribute],
      inputId: "inputId",
      name: "name",
      disabled: [2, "disabled", "disabled", booleanAttribute],
      readonly: [2, "readonly", "readonly", booleanAttribute],
      trueValue: "trueValue",
      falseValue: "falseValue",
      ariaLabel: "ariaLabel",
      ariaLabelledBy: "ariaLabelledBy",
      autofocus: [2, "autofocus", "autofocus", booleanAttribute]
    },
    outputs: {
      onChange: "onChange"
    },
    features: [ɵɵProvidersFeature([TOGGLESWITCH_VALUE_ACCESSOR, ToggleSwitchStyle]), ɵɵInputTransformsFeature, ɵɵInheritDefinitionFeature],
    decls: 6,
    vars: 23,
    consts: [["input", ""], [3, "click", "ngClass", "ngStyle"], ["type", "checkbox", "role", "switch", 3, "focus", "blur", "ngClass", "checked", "disabled", "pAutoFocus"], [3, "ngClass"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"]],
    template: function ToggleSwitch_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = ɵɵgetCurrentView();
        ɵɵelementStart(0, "div", 1);
        ɵɵlistener("click", function ToggleSwitch_Template_div_click_0_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onClick($event));
        });
        ɵɵelementStart(1, "input", 2, 0);
        ɵɵlistener("focus", function ToggleSwitch_Template_input_focus_1_listener() {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onFocus());
        })("blur", function ToggleSwitch_Template_input_blur_1_listener() {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onBlur());
        });
        ɵɵelementEnd();
        ɵɵelementStart(3, "span", 3)(4, "div", 3);
        ɵɵtemplate(5, ToggleSwitch_Conditional_5_Template, 1, 4, "ng-container");
        ɵɵelementEnd()()();
      }
      if (rf & 2) {
        ɵɵstyleMap(ctx.sx("root"));
        ɵɵclassMap(ctx.styleClass);
        ɵɵproperty("ngClass", ctx.cx("root"))("ngStyle", ctx.style);
        ɵɵattribute("data-pc-name", "toggleswitch")("data-pc-section", "root");
        ɵɵadvance();
        ɵɵproperty("ngClass", ctx.cx("input"))("checked", ctx.checked())("disabled", ctx.disabled)("pAutoFocus", ctx.autofocus);
        ɵɵattribute("id", ctx.inputId)("aria-checked", ctx.checked())("aria-labelledby", ctx.ariaLabelledBy)("aria-label", ctx.ariaLabel)("name", ctx.name)("tabindex", ctx.tabindex)("data-pc-section", "hiddenInput");
        ɵɵadvance(2);
        ɵɵproperty("ngClass", ctx.cx("slider"));
        ɵɵattribute("data-pc-section", "slider");
        ɵɵadvance();
        ɵɵproperty("ngClass", ctx.cx("handle"));
        ɵɵadvance();
        ɵɵconditional(ctx.handleTemplate || ctx._handleTemplate ? 5 : -1);
      }
    },
    dependencies: [CommonModule, NgClass, NgTemplateOutlet, NgStyle, AutoFocus, SharedModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToggleSwitch, [{
    type: Component,
    args: [{
      selector: "p-toggleswitch, p-toggleSwitch, p-toggle-switch",
      standalone: true,
      imports: [CommonModule, AutoFocus, SharedModule],
      template: `
        <div [ngClass]="cx('root')" [style]="sx('root')" [ngStyle]="style" [class]="styleClass" (click)="onClick($event)" [attr.data-pc-name]="'toggleswitch'" [attr.data-pc-section]="'root'">
            <input
                #input
                [attr.id]="inputId"
                type="checkbox"
                role="switch"
                [ngClass]="cx('input')"
                [checked]="checked()"
                [disabled]="disabled"
                [attr.aria-checked]="checked()"
                [attr.aria-labelledby]="ariaLabelledBy"
                [attr.aria-label]="ariaLabel"
                [attr.name]="name"
                [attr.tabindex]="tabindex"
                (focus)="onFocus()"
                (blur)="onBlur()"
                [attr.data-pc-section]="'hiddenInput'"
                [pAutoFocus]="autofocus"
            />
            <span [ngClass]="cx('slider')" [attr.data-pc-section]="'slider'">
                <div [ngClass]="cx('handle')">
                    @if (handleTemplate || _handleTemplate) {
                        <ng-container *ngTemplateOutlet="handleTemplate || _handleTemplate; context: { checked: checked() }" />
                    }
                </div>
            </span>
        </div>
    `,
      providers: [TOGGLESWITCH_VALUE_ACCESSOR, ToggleSwitchStyle],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None
    }]
  }], null, {
    style: [{
      type: Input
    }],
    styleClass: [{
      type: Input
    }],
    tabindex: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    inputId: [{
      type: Input
    }],
    name: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    readonly: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    trueValue: [{
      type: Input
    }],
    falseValue: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input
    }],
    ariaLabelledBy: [{
      type: Input
    }],
    autofocus: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    onChange: [{
      type: Output
    }],
    input: [{
      type: ViewChild,
      args: ["input"]
    }],
    handleTemplate: [{
      type: ContentChild,
      args: ["handle", {
        descendants: false
      }]
    }],
    templates: [{
      type: ContentChildren,
      args: [PrimeTemplate]
    }]
  });
})();
var ToggleSwitchModule = class _ToggleSwitchModule {
  static ɵfac = function ToggleSwitchModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToggleSwitchModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _ToggleSwitchModule,
    imports: [ToggleSwitch, SharedModule],
    exports: [ToggleSwitch, SharedModule]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [ToggleSwitch, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToggleSwitchModule, [{
    type: NgModule,
    args: [{
      imports: [ToggleSwitch, SharedModule],
      exports: [ToggleSwitch, SharedModule]
    }]
  }], null, null);
})();
export {
  TOGGLESWITCH_VALUE_ACCESSOR,
  ToggleSwitch,
  ToggleSwitchClasses,
  ToggleSwitchModule,
  ToggleSwitchStyle
};
//# sourceMappingURL=primeng_toggleswitch.js.map
