import React from "react";
import reactCSS from "reactcss";
import { SketchPicker } from "react-color";

class ColorPicker extends React.Component {
  state = {
    displayColorPicker: false,
    bgColor: "",
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  render() {
    const styles = reactCSS({
      default: {
        color: {
          width: "30%",
          height: "35px",
          padding: "5px",
          borderRadius: "2px",
          background: `${this.props.color}`,
        },
        swatch: {
          background: "#fff",
          borderRadius: "1px",
          border: "1px solid rgb(133, 133, 133)",
          padding: "5px",
          cursor: "pointer",
          width: "100%",
          height: "45px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
        popover: {
          position: "absolute",
          zIndex: "2",
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
        },
      },
    });

    const { color } = this.props;

    return (
      <div style={{ width: "100%" }}>
        <div
          onClick={!this.props.disableAlpha && this.handleClick}
          disabled={this.props.disabled}
          style={{
            ...styles.swatch,
            cursor: this.props.disabled ? "not-allowed" : "default",
          }}
        >
          <div style={{ padding: "5px", color: "rgb(139, 137, 137)" }}>
            Color
          </div>
          <div style={styles.color} />
        </div>
        {this.state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            <SketchPicker color={color} onChange={this.props.handleChange} />
          </div>
        ) : null}
      </div>
    );
  }
}

export default ColorPicker;
