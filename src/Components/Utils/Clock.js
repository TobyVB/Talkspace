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

  function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 2) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 604800;
    if (interval > 1) {
      return Math.floor(interval) + " weeks ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }
  var aDay = 24 * 60 * 60 * 1000;
  console.log(timeSince(props.createdAt.toDate()));
  console.log(timeSince(new Date(Date.now() - aDay * 2)));

  return (
    <div className={`time`}>
      {/* <p>{`${hour}:${minute}${timeOfDay}, ${day} ${month} ${year}`}</p> */}
      <p>{timeSince(props.createdAt.toDate())}</p>
    </div>
  );
}
