import React from "react";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import "./sass/custom.scss";
const PopoverModal = ({
  popoverShow,
  handlePopoverClose,
  handleDeleteEvent,
  handleValidateEvent,
  event,
}) => {
  const getStartDate = (start) => {
    var dd = String(start.getDate()).padStart(2, "0");
    var mm = String(start.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = start.getFullYear();
    start = dd + "/" + mm + "/" + yyyy;
    return start;
  };

  const getStartTime = (date) => {
    var dt = moment(date, ["h:mm A"]).format("HH:mm");
    return dt;
  };
  if (event) {
    return (
      <Modal show={popoverShow} onHide={handlePopoverClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="showPopover">
            <span>COMPANY</span>
            <h5
              className="text-center"
              style={{
                backgroundColor: "#f7f7f7",
                fontSize: "16px",
                color: "#777",
                textAlign: "center",
                padding: "10px 20px",
                margin: "10px 0px",
              }}
            >
              {event.companyId.name}
            </h5>
            <span>BOOKING REASON</span>
            <h5
              className="text-center"
              style={{
                backgroundColor: "#f7f7f7",
                fontSize: "16px",
                color: "#777",
                textAlign: "center",
                padding: "10px 20px",
                margin: "10px 0px",
              }}
            >
              {event.title}
            </h5>

            <p>
              <span
                style={{
                  fontWeight: "normal",
                  textTransform: "uppercase",
                }}
              >
                Start Time:
              </span>
              <div
                style={{
                  backgroundColor: "#f7f7f7",
                  fontSize: "16px",
                  color: "#50c878",
                  textAlign: "center",
                  padding: "10px 20px",
                  margin: "10px 0px",
                }}
              >
                <span>{getStartDate(event.start)}</span> -{" "}
                {getStartTime(event.start)}
              </div>
              <br />
              <span
                style={{
                  textTransform: "uppercase",
                }}
              >
                End Time:
              </span>
              <div
                style={{
                  backgroundColor: "#f7f7f7",
                  fontSize: "16px",
                  color: "#ed2939",
                  textAlign: "center",
                  padding: "10px 20px",
                  margin: "10px 0px",
                }}
              >
                <span>{getStartDate(event.end)}</span> -{" "}
                {getStartTime(event.end)}
              </div>
            </p>

            <hr />
            <div className="popoverfooter">
              <div className="col-lg-2">
                {event.status !== "VALIDATED" ? (
                  <>
                    <button
                      className="btn text-success btn-light px-3 text-center"
                      onClick={handleValidateEvent}
                    >
                      <i class="fas fa-pencil"></i> <span>validate</span>
                    </button>
                  </>
                ) : null}
              </div>
              <div className="col-lg-3">
                <button
                  className="btn text-danger btn-light"
                  onClick={handleDeleteEvent}
                >
                  <i class="fas fa-trash"></i> <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  } else {
    return "";
  }
};
export default PopoverModal;
