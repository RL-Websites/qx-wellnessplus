import dayjs from "dayjs";
// import localizedFormat from "dayjs/plugin/localizedFormat";

export const get12HourTimeString = (time) => {
  // dayjs.extend(localizedFormat);

  const hour = Number(time?.split(":")?.[0]);
  const minute = Number(time?.split(":")?.[1]);

  const currentDate = dayjs().set("hour", hour).set("minute", minute);

  return currentDate.format("hh:mm A");
};

export const getTimeFromDateString = (dateString: Date | string | null | undefined) => {
  return dayjs(dateString).format("hh:mm A");
};

export const convertSecondsToDHMS = (timeString: string): string => {
  const totalSeconds = Math.floor(parseFloat(timeString));

  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}: ${minutes}: ${seconds}`;
};
