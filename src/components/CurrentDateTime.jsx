import React, { useState, useEffect } from "react";

const CurrentDateTime = () => {
  var [date, setDate] = useState(new Date());

  useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  return (
    <div>
      <p style={{ fontSize: "20px" }}>
        {date.toLocaleDateString("fi-FI")} {date.toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" })}
      </p>
    </div>
  );
};

export default CurrentDateTime;