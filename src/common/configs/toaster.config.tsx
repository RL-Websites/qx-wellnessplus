import { notifications } from "@mantine/notifications";
import IconCross from "../components/iconComponents/IconCross";
import IconTick from "../components/iconComponents/IconTick";

class DmlToast {
  constructor() {}

  show(props) {
    notifications.show({
      message: "",
      ...props,
    });
  }
  success(props) {
    this.show({
      autoClose: true,
      withCloseButton: true,
      color: "green.5",
      icon: <IconTick />,
      classNames: {
        root: "border-l-[11px] border-green-middle h-[92px] shadow-custom-2 rounded-xl",
        title: "heading-xxs",
        description: "text-fs-sm",
        closeButton: "text-foreground",
      },
      ...props,
    });
  }

  error(props) {
    this.show({
      autoClose: true,
      withCloseButton: true,
      color: "danger",
      icon: <IconCross />,
      classNames: {
        root: "border-l-[11px] border-danger h-[92px] shadow-custom-2 rounded-xl",
        title: "heading-xxs",
        description: "text-fs-sm",
        closeButton: "text-foreground",
      },
      ...props,
    });
  }

  warning(props) {
    this.show({
      autoClose: true,
      withCloseButton: true,
      color: "warning",
      icon: <IconCross />,
      classNames: {
        root: "border-l-[11px] border-danger h-[92px] shadow-custom-2 rounded-xl",
        title: "heading-xxs",
        description: "text-fs-sm",
        closeButton: "text-foreground",
      },
      ...props,
    });
  }
}

const dmlToast = new DmlToast();

export default dmlToast;
