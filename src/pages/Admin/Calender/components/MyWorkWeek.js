import PropTypes from "prop-types";
import React from "react";
import Week from "react-big-calendar/lib/Week";
import TimeGrid from "react-big-calendar/lib/TimeGrid";

function workWeekRange(date, options, custom_week_days) {
  if (custom_week_days === undefined) {
    return Week.range(date, options).filter(
      (d) => [0, 1].indexOf(d.getDay()) === -1
    );
  } else {
    return Week.range(date, options).filter(
      (d) => custom_week_days.indexOf(d.getDay()) === -1
    );
  }
}

class MyWorkWeek extends React.Component {
  render() {
    let { custom_week_days, date, ...props } = this.props;
    let range = workWeekRange(date, this.props, custom_week_days);
    return <TimeGrid {...props} range={range} eventOffset={15} />;
  }
}

MyWorkWeek.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
};

MyWorkWeek.defaultProps = TimeGrid.defaultProps;

MyWorkWeek.range = workWeekRange;

MyWorkWeek.navigate = Week.navigate;

MyWorkWeek.title = (date, { localizer }) => {
  let [start, ...rest] = workWeekRange(date, { localizer });
  return localizer.format({ start, end: rest.pop() }, "dayRangeHeaderFormat");
};
export default MyWorkWeek;
