import React from "react";
import moment from "moment";
import "./sass/custom.scss";
import { Modal, Alert } from "react-bootstrap";

const PopoverModal = ({
  popoverShow,
  handlePopoverClose,
  handleDeleteEvent,
  handleDeleteDelivery,
  event,
  setEvent,
  setEditDelivery,
  handleValidateMeans,
  setAlertBoxTime,
  alertBoxTime,
  handleValidateDelivery,
  onEditDelivery,
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
  function Alertbox(props) {
    return (
      <Alert
        show={alertBoxTime}
        variant="danger"
        onClose={() => setAlertBoxTime(!alertBoxTime)}
      >
        {props.message}&nbsp;&nbsp;&nbsp;
        {event.objectName === "Deliveries" ? (
          <>
            <div
              onClick={() => {
                handleDeleteDelivery("no");
              }}
              className="alert-link"
            >
              NO
            </div>
            <div
              onClick={() => {
                handleDeleteDelivery("yes");
              }}
              className="alert-link"
            >
              YES
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() => {
                handleDeleteEvent("no");
              }}
              className="alert-link"
            >
              NO
            </div>{" "}
            &nbsp;&nbsp;
            <div
              onClick={() => {
                handleDeleteEvent("yes");
              }}
              className="alert-link"
            >
              YES
            </div>
          </>
        )}
      </Alert>
    );
  }
  // console.log("event", event);
  if (event) {
    return (
      <Modal show={popoverShow} onHide={handlePopoverClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alertbox message="Are you sure to Delete" />
          <div className="showPopover">
            <div style={{ textAlign: "right" }}>
              <button
                className="btn btn-light"
                onClick={() => {
                  setEditDelivery(true);
                  onEditDelivery(event);
                }}
              >
                <i class="fas fa-trash"></i> <span>Edit</span>
              </button>
            </div>
            {event.objectName === "Deliveries" ? (
              <>
                {event.status === "MODIFIED" ? (
                  <>
                    <span>Modified By</span>

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
                      {"Name: " +
                        event.user.firstName +
                        " " +
                        event.user.lastName +
                        " Role: " +
                        event.user.adminType}
                    </h5>
                  </>
                ) : (
                  <></>
                )}

                <span>Company1</span>
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
                  {event.company.name}
                </h5>

                <span>Means</span>
                <h5
                  style={{
                    backgroundColor: "#f7f7f7",
                    fontSize: "16px",
                    color: "#777",
                    padding: "10px 20px",
                    margin: "10px 0px",
                  }}
                >
                  <table style={{ width: "100%" }}>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Reason</th>
                    </tr>
                    {event.liftingMeans.map((key, index) => {
                      return (
                        <tr>
                          <td>{key.name}</td>
                          <td>{key.meanType}</td>
                          <td>{key.alerts ? key.alerts.reason : null}</td>
                        </tr>
                      );
                    })}
                    {event.routingMeans.map((key, index) => {
                      return (
                        <tr>
                          <td>{key.name}</td>
                          <td>{key.meanType}</td>
                          <td>{key.alerts ? key.alerts.reason : null}</td>
                        </tr>
                      );
                    })}
                  </table>
                </h5>
                <span>Material</span>
                <h5
                  style={{
                    backgroundColor: "#f7f7f7",
                    fontSize: "16px",
                    color: "#777",
                    padding: "10px 20px",
                    margin: "10px 0px",
                  }}
                >
                  <table style={{ width: "100%" }}>
                    {event.materials.map((key, index) => {
                      return (
                        <tr>
                          <td> {key} </td>
                        </tr>
                      );
                    })}
                  </table>
                </h5>
                {event.deliveryArea !== null ? (
                  <>
                    <span>Delivery area</span>
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
                      {" Name:  " + event.deliveryArea.name} <br />{" "}
                      {event.deliveryArea.alert
                        ? " Reason:  " + event.deliveryArea.alert.reason
                        : null}
                    </h5>
                  </>
                ) : (
                  <></>
                )}

                {event.storageArea !== null ? (
                  <>
                    <span>Storage area</span>
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
                      {" Name:  " + event.storageArea.name} <br />
                      {event.storageArea.alert
                        ? event.storageArea.alert.map((item, index) => {
                            return `Reason ${index + 1}   :   ${item.reason} `;
                          })
                        : null}
                    </h5>
                  </>
                ) : (
                  <></>
                )}
                <span>Booking Reason</span>
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

                <span
                  style={{
                    fontWeight: "normal",
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
                <span style={{}}>End Time:</span>
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
                {event.status === "PENDING" ? (
                  <>
                    <hr />
                    <div className="popoverfooter">
                      <div className="col-lg-2">
                        <button
                          className="btn text-primary btn-light px-3 text-center"
                          onClick={handleValidateDelivery}
                        >
                          <i class="fas fa-pencil"></i> <span>validate</span>
                        </button>
                      </div>
                      <div className="col-lg-4">
                        <button
                          className="btn text-success btn-light"
                          onClick={() => onEditDelivery(event)}
                        >
                          <i class="fas fa-trash"></i> <span>More Info</span>
                        </button>
                      </div>
                      <div className="col-lg-3">
                        <button
                          className="btn text-danger btn-light"
                          onClick={handleDeleteDelivery}
                        >
                          <i class="fas fa-trash"></i> <span>Refuse</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                <span>Company</span>
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
                  {event.companyName}
                </h5>
                <span>Mean</span>
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
                  {event.meanName}
                </h5>
                <span>Booking Reason</span>
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

                <span
                  style={{
                    fontWeight: "normal",
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
                <span style={{}}>End Time:</span>
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

                {event.status !== "VALIDATED" ? (
                  <>
                    <div style={{ textAlign: "right" }}>
                      <button
                        className="btn btn-light"
                        onClick={() => onEditDelivery(event)}
                      >
                        <i class="fas fa-trash"></i> <span>Edit</span>
                      </button>
                    </div>
                    <hr />
                    <div className="popoverfooter">
                      <div className="col-lg-2">
                        <button
                          className="btn text-primary btn-light px-3 text-center"
                          onClick={handleValidateMeans}
                        >
                          <i class="fas fa-pencil"></i> <span>validate</span>
                        </button>
                      </div>
                      <div className="col-lg-3">
                        <button
                          className="btn text-danger btn-light"
                          onClick={handleDeleteEvent}
                        >
                          <i class="fas fa-trash"></i> <span>Refuse</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <> </>
                )}
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    );
  } else {
    return "";
  }
};
export default PopoverModal;
