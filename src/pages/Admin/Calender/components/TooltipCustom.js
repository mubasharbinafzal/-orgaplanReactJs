import React, { Component, useState, useRef } from "react";
import ReactDOM, { render } from "react-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Overlay, Tooltip, Button, Row, Col } from "react-bootstrap";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const localizer = momentLocalizer(moment);

export const IconStyle = {
  cursor: "pointer",
};

export const TooltipContent = ({ onClose, event }) => {
  return (
    <>
      <div style={{ textAlign: "left", "font-size": "11px" }}>
        <div>Company: {event.event.company.name}</div>
        <div>Delivery Area: {event.event.deliveryArea.name}</div>
        <div>Storage Area: {event.event.storageArea.name}</div>
      </div>
    </>
  );
};

export const EventToolTips = (event) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const closeTooltip = () => {
    setShowTooltip(false);
  };

  const openTooltip = () => {
    setShowTooltip(true);
  };
  const ref = useRef(null);

  const getTarget = () => {
    return ReactDOM.findDOMNode(ref.current);
  };

  return (
    <div ref={ref}>
      <span onMouseOver={openTooltip} onMouseOut={closeTooltip}>
        {event.title}
      </span>
      <Overlay
        rootClose
        target={getTarget}
        show={showTooltip}
        placement="top"
        onHide={closeTooltip}
        onClose={closeTooltip}
      >
        <Tooltip id="test">
          <TooltipContent event={event} onClose={closeTooltip} />
        </Tooltip>
      </Overlay>
    </div>
  );
};
