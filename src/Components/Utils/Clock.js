import { useState } from "react";

export default function Clock(props) {
  // let day;
  let year;
  let month;
  let day;
  let hour;
  let minute;

  let timeOfDay;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (props.createdAt) {
    // day = props.createdAt.toDate().toDateString();
    // timeOfDay = props.createdAt.toDate().toLocaleTimeString();

    day = props.createdAt.toDate().getDate();
    month = months[props.createdAt.toDate().getMonth()];
    year = props.createdAt.toDate().getFullYear();
    hour = props.createdAt.toDate().getHours();
    minute = props.createdAt.toDate().getMinutes();
    if (hour < 12) {
      timeOfDay = "AM";
    } else {
      timeOfDay = "PM";
    }
    if (hour > 12) {
      hour -= 12;
    }
    if (hour === 0) {
      hour = 12;
    }
    if (minute < 10 && minute !== 0) {
      minute = "0" + minute;
    }
    if (minute === 0) {
      minute = "00";
    }
  }

  return (
    <div style={{ fontSize: ".85rem" }} className={`time`}>
      <p>{`${hour}:${minute}${timeOfDay}, ${day} ${month} ${year}`}</p>
    </div>
  );
}
