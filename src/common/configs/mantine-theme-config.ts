import {
  ActionIcon,
  AppShell,
  Burger,
  Button,
  Checkbox,
  Input,
  Menu,
  Modal,
  MultiSelect,
  Notification,
  Pagination,
  PinInput,
  ScrollArea,
  Select,
  Switch,
  Table,
  TagsInput,
  Tooltip,
  VariantColorsResolver,
  createTheme,
  defaultVariantColorsResolver,
  parseThemeColor,
} from "@mantine/core";

const variantColorResolver: VariantColorsResolver = (input) => {
  const defaultResolvedColors = defaultVariantColorsResolver(input);

  const parsedColor = parseThemeColor({
    color: input.color || input.theme.primaryColor,
    theme: input.theme,
  });

  // Add new variants support
  // if (input.variant === "light") {
  //   return {
  //     background: "var(--dml-color-grey-low)",
  //     hover: "var(--dml-color-grey-low)",
  //     color: "var(--dml-color-secondary)",
  //     border: "none",
  //   };
  // }

  if (parsedColor.isThemeColor && parsedColor.color === input.theme.primaryColor && input.variant === "light") {
    return {
      ...defaultResolvedColors,
      // hoverColor: "var(--dml-color-primary-light)",
      background: "var(--dml-color-primary-light)",
    };
  }
  return defaultResolvedColors;
};

export const theme = createTheme({
  /** Your theme override here */
  autoContrast: true,
  luminanceThreshold: 0.4,
  fontFamily: "UberMoveText, sans-serif",
  colors: {
    background: [
      "color-mix(in srgb, var(--dml-color-background), #FFF 60%)", //0
      "color-mix(in srgb, var(--dml-color-background), #FFF 50%)", //1
      "color-mix(in srgb, var(--dml-color-background), #FFF 40%)", //2
      "color-mix(in srgb, var(--dml-color-background), #FFF 30%)", //3
      "color-mix(in srgb, var(--dml-color-background), #FFF 20%)", //4
      "color-mix(in srgb, var(--dml-color-background), #FFF 10%)", //5
      "var(--dml-color-background)", // 6 Base color
      "color-mix(in srgb, var(--dml-color-background), #000 15%)", // 7
      "color-mix(in srgb, var(--dml-color-background), #000 25%)", // 8
      "color-mix(in srgb, var(--dml-color-background), #000 35%)", // 9
    ],
    foreground: [
      "color-mix(in srgb, var(--dml-color-foreground), #FFF 60%)", //0
      "color-mix(in srgb, var(--dml-color-foreground), #FFF 50%)", //1
      "color-mix(in srgb, var(--dml-color-foreground), #FFF 40%)", //2
      "color-mix(in srgb, var(--dml-color-foreground), #FFF 30%)", //3
      "color-mix(in srgb, var(--dml-color-foreground), #FFF 20%)", //4
      "color-mix(in srgb, var(--dml-color-foreground), #FFF 10%)", //5
      "var(--dml-color-foreground)", // 6 Base color
      "color-mix(in srgb, var(--dml-color-foreground), #000 15%)", // 7
      "color-mix(in srgb, var(--dml-color-foreground), #000 25%)", // 8
      "color-mix(in srgb, var(--dml-color-foreground), #000 35%)", // 9
    ],
    primary: [
      "var(--dml-color-primary-light)", //0
      "color-mix(in srgb, var(--dml-color-primary), #FFF 50%)", //1
      "color-mix(in srgb, var(--dml-color-primary), #FFF 40%)", //2
      "color-mix(in srgb, var(--dml-color-primary), #FFF 30%)", //3
      "color-mix(in srgb, var(--dml-color-primary), #FFF 20%)", //4
      "color-mix(in srgb, var(--dml-color-primary), #FFF 10%)", //5
      "var(--dml-color-primary)", //6 base color
      "color-mix(in srgb, var(--dml-color-primary), #000 15%)", //7
      "color-mix(in srgb, var(--dml-color-primary), #000 25%)", //8
      "color-mix(in srgb, var(--dml-color-primary), #000 35%)", //9
    ],
    secondary: [
      "color-mix(in srgb, var(--dml-color-secondary), #FFF 60%)", //0
      "color-mix(in srgb, var(--dml-color-secondary), #FFF 50%)", //1
      "color-mix(in srgb, var(--dml-color-secondary), #FFF 40%)", //2
      "color-mix(in srgb, var(--dml-color-secondary), #FFF 30%)", //3
      "color-mix(in srgb, var(--dml-color-secondary), #FFF 20%)", //4
      "color-mix(in srgb, var(--dml-color-secondary), #000 10%)", //5
      "var(--dml-color-secondary)", //6 base color
      "color-mix(in srgb, var(--dml-color-secondary), #000 15%)", //7
      "color-mix(in srgb, var(--dml-color-secondary), #000 25%)", //8
      "color-mix(in srgb, var(--dml-color-secondary), #000 35%)", //9
    ],

    danger: [
      "var(--dml-color-danger-light)", //0
      "color-mix(in srgb, var(--dml-color-danger), #FFF 50%)", //1
      "color-mix(in srgb, var(--dml-color-danger), #FFF 40%)", //2
      "color-mix(in srgb, var(--dml-color-danger), #FFF 30%)", //3
      "color-mix(in srgb, var(--dml-color-danger), #FFF 20%)", //4
      "color-mix(in srgb, var(--dml-color-danger), #FFF 10%)", //5
      "var(--dml-color-danger)", //6 base color
      "color-mix(in srgb, var(--dml-color-danger), #000 15%)", //7
      "color-mix(in srgb, var(--dml-color-danger), #000 25%)", //8
      "color-mix(in srgb, var(--dml-color-danger), #000 35%)", //9
    ],

    grey: [
      "color-mix(in srgb, var(--dml-color-grey), #FFF 60%)", //0
      "color-mix(in srgb, var(--dml-color-grey), #FFF 50%)", //1
      "color-mix(in srgb, var(--dml-color-grey), #FFF 40%)", //2
      "var(--dml-color-grey-low)", //3
      "var(--dml-color-grey-btn)", //4
      "var(--dml-color-grey-medium)", //5
      "var(--dml-color-grey)", //6 base color
      "color-mix(in srgb, var(--dml-color-grey), #000 15%)", //7
      "color-mix(in srgb, var(--dml-color-grey), #000 25%)", //8
      "color-mix(in srgb, var(--dml-color-grey), #000 35%)", //9
    ],

    green: [
      "color-mix(in srgb, var(--dml-color-green), #FFF 60%)", //0
      "color-mix(in srgb, var(--dml-color-green), #FFF 50%)", //1
      "var(--dml-color-green-medium)", //2
      "var(--dml-color-green-low)", //3
      "var(--dml-color-green-btn)", //4
      "var(--dml-color-green-middle)", //5
      "var(--dml-color-green)", //6 base color
      "color-mix(in srgb, var(--dml-color-green), #000 15%)", //7
      "color-mix(in srgb, var(--dml-color-green), #000 25%)", //8
      "color-mix(in srgb, var(--dml-color-green), #000 35%)", //9
    ],
  },
  primaryColor: "primary",
  components: {
    AppShell: AppShell.extend({
      classNames: {
        // main: "dml-appShell-main-custom-style",
      },
    }),
    Tooltip: Tooltip.extend({
      defaultProps: {
        withArrow: true,
        arrowSize: 8,
        transitionProps: { transition: "pop", duration: 300 },
      },
      classNames: {
        tooltip: "tooltip-sm",
      },
    }),
    Modal: Modal.extend({
      defaultProps: {
        transitionProps: { transition: "fade-down", duration: 500 },
      },
      vars: (_, props) => {
        if (props.size == "md" || props.size == "" || props.size == undefined) {
          return {
            root: {
              "--modal-size": "var(--dml-modal-width-md)",
            },
          };
        }

        return { root: {} };
      },
    }),
    ModalRoot: Modal.Root.extend({
      defaultProps: {
        transitionProps: { transition: "fade-down", duration: 500 },
      },
    }),
    ModalContent: Modal.Content.extend({
      defaultProps: {
        radius: 12,
      },
    }),
    AppShellFooter: AppShell.Footer.extend({
      classNames: {
        footer: "dml-footer",
      },
    }),
    Burger: Burger.extend({
      classNames: {
        burger: "w-4",
      },
    }),
    InputWrapper: Input.Wrapper.extend({
      defaultProps: {
        inputWrapperOrder: ["label", "error", "input", "description"],
      },
    }),
    Input: Input.extend({
      defaultProps: {
        variant: "filled",
        size: "lg",
      },
      classNames: {
        wrapper: "mt-0",
        input: "dml-control",
      },
    }),
    Select: Select.extend({
      classNames: {
        wrapper: "bg-grey-btn rounded-md",
      },
    }),
    TagsInput: TagsInput.extend({
      styles: {
        input: {
          paddingBlock: "13px",
          paddingInline: "12px",
        },
        inputField: {
          flex: "auto",
          width: "100%",
          order: -1,
        },
        pill: {
          height: "auto",
          minHeight: "30px",
          borderRadius: "8px",
          fontSize: "var(--dml-para-fs-sm)",
          background: "var(--dml-color-natural-white)",
          border: "1px solid var(--dml-color-grey-medium)",
        },
      },
    }),
    MultiSelect: MultiSelect.extend({
      styles: {
        input: {
          paddingBlock: "13px",
          paddingInline: "12px",
        },
        inputField: {
          flex: "auto",
          width: "100%",
          order: -1,
        },
        pill: {
          height: "auto",
          minHeight: "30px",
          borderRadius: "8px",
          fontSize: "var(--dml-para-fs-sm)",
          background: "var(--dml-color-natural-white)",
          border: "1px solid var(--dml-color-grey-medium)",
        },
      },
    }),
    Button: Button.extend({
      defaultProps: {
        variant: "filled",
        size: "md",
        radius: "md",
        color: "primary",
        classNames: {
          root: "font-medium",
        },
      },
      vars: (_, props) => {
        if (props.size == "lg") {
          return {
            root: {
              "--button-height": "var(--dml-btn-lg-height)",
            },
          };
        } else if (props.size == "md" || props.size == "") {
          return {
            root: {
              "--button-height": "var(--dml-btn-md-height)",
            },
          };
        } else if (props.size == "sm") {
          return {
            root: {
              "--button-height": "var(--dml-btn-sm-height)",
              "--button-padding-x": "var(--dml-btn-pad-x-sm)",
            },
            label: {
              "--button-text": "var(--dml-para-fs-sm)",
              "--font-weight": "var(--dml-fw-medium)",
            },
          };
        } else if (props.size == "sm-2") {
          return {
            root: {
              "--button-height": "var(--dml-btn-sm-2-height)",
              "--button-padding-x": "var(--dml-btn-pad-x-sm-2)",
            },
            label: {
              "--button-text": "var(--dml-para-fs-sm)",
              "--font-weight": "var(--dml-fw-medium)",
            },
          };
        } else if (props.size == "esm") {
          return {
            root: {
              "--button-height": "var(--dml-btn-esm-height)",
              "--button-padding-x": "var(--dml-btn-pad-x-esm)",
            },
            label: {
              "--button-text": "var(--dml-para-fs-sm)",
            },
          };
        } else if (props.size == "xs") {
          return {
            root: {
              "--button-height": "var(--dml-btn-xs-height)",
              "--button-fz": "var(--dml-para-fs-sm)",
            },
          };
        } else if (props.size == "xxs") {
          return {
            root: {
              "--button-height": "var(--dml-btn-xxs-height)",
              "--button-fz": "var(--dml-para-fs-xs)",
              "--button-padding-x": "var(--dml-btn-pad-x-xxs)",
              "--button-radius": "var(--dml-border-radius)",
            },
          };
        }
        return { root: {} };
      },
    }),
    Table: Table.extend({
      vars: (_, props) => {
        if (props.verticalSpacing == "md") {
          return {
            table: {
              "--table-vertical-spacing": "var(--dml-table-vr-spacing-md)",
            },
          };
        }
        return { table: {} };
      },
    }),
    Pagination: Pagination.extend({
      vars: () => {
        return {
          root: {
            "--pagination-control-fz": "16px",
            "--pagination-control-size": "48px",
            "--pagination-control-radius": "8px",
          },
        };
      },
    }),
    ActionIcon: ActionIcon.extend({
      vars: (_, props) => {
        if (props.size == "lg") {
          return {
            root: {
              "--ai-size": "var(--dml-action-icon-size-md)",
            },
          };
        }
        return { root: {} };
      },
    }),
    Checkbox: Checkbox.extend({
      defaultProps: {
        color: "primary",
      },
    }),
    PinInput: PinInput.extend({
      classNames: {
        pinInput: "dml-control-pinInput",
        input: "dml-control-pinInput-inputHeight",
      },
    }),
    Switch: Switch.extend({
      styles: {
        root: {
          background: "white",
          borderRadius: "8px",
          paddingInline: "12.25px",
          paddingBlock: "9px",
          boxShadow: "var(--dml-box-shadow)",
        },
        label: {
          fontSize: "17px",
          color: "var(--dml-color-foreground)",
        },
        track: {
          height: "30px",
          width: "50px",
        },
        body: {
          alignItems: "Center",
        },
        thumb: {
          height: "15px",
          width: "15px",
        },
        trackLabel: {
          // marginInlineEnd: "20px",
        },
      },
    }),
    Menu: Menu.extend({
      styles: {
        dropdown: {
          padding: "0px",
          borderRadius: "8px",
        },
        item: {
          padding: "8px 16px",
          color: "var(--dml-color-foreground)",
        },
        itemLabel: {
          lineHeight: "20px",
        },
      },
      classNames: {
        dropdown: "dml-menu-dropdown",
        item: "dml-Menu-item-custom",
      },
    }),
    ScrollArea: ScrollArea.extend({
      defaultProps: {
        scrollbarSize: 6,
      },
    }),
  },
  // notification: Notification.extend({
  //   defaultProps: {
  //     icon: '<i className="checkmark-circle"></i>',
  //   },
  // }),
  variantColorResolver: variantColorResolver,
  cursorType: "pointer",

  other: {
    Notification: Notification.extend({
      defaultProps: {
        icon: '<i className="checkmark-circle"></i>',
      },
      classNames: {
        body: "bg-red",
      },
    }),
  },
});
