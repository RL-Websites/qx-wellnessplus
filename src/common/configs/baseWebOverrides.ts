export const BaseWebDatePickerOverrides = {
  Popover: {
    props: {
      overrides: {
        Body: {
          style: {
            marginLeft: "20px",
            "z-index": "10",
          },
        },
      },
    },
  },
  MonthYearSelectButton: {
    style: {
      fontSize: "16px",
      lineHeight: 1.4,
      fontWeight: 700,
      height: "50px",
    },
  },
  MonthYearSelectIconContainer: {
    style: {
      marginLeft: "8px",
    },
  },
  MonthYearSelectPopover: {
    props: {
      overrides: {
        Body: {
          style: {
            "z-index": 10,
          },
        },
      },
    },
  },
  WeekdayHeader: {
    style: {
      fontSize: "14px",
      lineHeight: "26px",
      height: "44px",
      width: "50.29px",
    },
  },
  Day: {
    style: {
      fontSize: "14px",
      lineHeight: "26px",
      height: "44px",
      ":after": {
        height: "40px",
        width: "40px",
        left: "7.77px",
      },
      ":before": {
        top: "-3px",
      },
    },
  },
  InputLabel: {
    style: {
      fontSize: "14px",
      color: "var(--dml-color-foreground)",
      fontWeight: 500,
    },
  },
  Input: {
    props: {
      overrides: {
        Root: {
          style: {
            border: "1px",
          },
        },
        Input: {
          style: {
            fontSize: "var(--dml-text-input-fs)",
            height: "var(--dml-input-height)",
            backgroundColor: "var(--dml-color-natural-white)",
            borderRadius: "var(--dml-input-br)",
            boxShadow: "none",
          },
        },
      },
    },
  },
};
