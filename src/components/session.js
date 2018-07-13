import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getSingleSession } from "../actions";
import { createEnd } from "../actions";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import EndListItem from "./end-list-item";
import SessionDetails from "./session-details";

export class Session extends React.Component {
  /*
  componentDidMount() {
    console.log("SESSION Component mounted");
    this.props.dispatch(
      getSingleSession(parseInt(this.props.match.params.sessionId, 10))
    );
    console.log(this.props.session);
  }
*/
  render() {
    console.log("SESSION PROPS");
    console.log(this.props);
    if (!this.props.session) {
      return (
        <main>
          <section>
            <p>No Such Session</p>
          </section>
        </main>
      );
    }

    const endList = this.props.session.ends.map(end => (
      <EndListItem
        sessionId={this.props.session.id}
        endId={end.id}
        end={end}
        key={end.id}
      />
    ));

    const simpleLineChart = (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={this.props.session.chart}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );

    return (
      <main role="main">
        <header role="banner">
          <h1>Training session</h1>
          <p>Started on {this.props.session.startDate}</p>
        </header>
        <SessionDetails session={this.props.session} />
        <section>{simpleLineChart}</section>
        {endList}
        <section>
          <button
            type="button"
            onClick={() =>
              this.props.dispatch(
                createEnd(this.props.session.id, this.props.history)
              )
            }
          >
            + New End
          </button>
        </section>
      </main>
    );
  }
}
/*
const mapStateToProps = (state, props) => ({
  sessions: state.archeryTrackerReducer.session,
  ends: state.archeryTrackerReducer.ends
});*/

const mapStateToProps = (state, props) => {
  console.log(props.match.params.sessionId);
  return {
    session: state.archeryTrackerReducer.sessions.find(
      session => session.id === parseInt(props.match.params.sessionId, 10)
    )
  };
};
export default connect(mapStateToProps)(Session);