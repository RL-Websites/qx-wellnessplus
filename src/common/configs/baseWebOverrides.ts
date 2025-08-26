export const BaseWebDatePickerOverrides = {
  Popover: {
    props: {
      overrides: {
        Body: {
          style: {
            marginLeft: "20px",
            "z-index": "10",
            "@media screen and (max-width: 768px)": {
              left: "-10px",
            },
          },
        },
      },
    },
  },
  CalendarContainer: {
    style: {
      "@media screen and (max-width: 768px)": {
        width: "300px",
        maxWidth: "300px",
        boxSizing: "border-box",
      },
    },
  },
  CalendarHeader: {
    style: {
      "@media screen and (max-width: 768px)": {
        margin: "0 auto",
        width: "300px",
      },
    },
  },

  MonthYearSelectButton: {
    style: {
      fontSize: "16px",
      lineHeight: 1.4,
      fontWeight: 700,
      height: "50px",
      "@media screen and (max-width: 768px)": {
        fontSize: "14px",
        height: "40px",
      },
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
            "@media screen and (max-width: 768px)": {
              width: "100vw",
              borderRadius: 0,
            },
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
      "@media screen and (max-width: 768px)": {
        fontSize: "12px",
        width: "40px",
        height: "35px",
      },
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
      "@media screen and (max-width: 768px)": {
        fontSize: "12px",
        lineHeight: "18px",
        height: "32px",
        width: "32px",
        ":after": {
          height: "30px",
          width: "30px",
          left: "2px",
        },
      },
    },
  },
  InputLabel: {
    style: {
      fontSize: "14px",
      color: "var(--dml-color-foreground)",
      fontWeight: 500,
      "@media screen and (max-width: 768px)": {
        fontSize: "12px",
      },
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
