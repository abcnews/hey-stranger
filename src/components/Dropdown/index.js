const { h, Component } = require('preact');
const styles = require('./styles.css');

class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;

    if (this.props.navigate) {
      this.props.navigate(value === '' ? null : this.props.actors[event.target.value]);
    }
  }

  render({ isUnavailable, actors, current }) {
    return (
      <nav className={styles.root}>
        <label id="dropdown-label" for="dropdown-select">
          Choose somebody:
        </label>
        <select
          id="dropdown-select"
          aria-controls="reader-stories"
          aria-describedby="dropdown-label"
          tabindex={isUnavailable ? -1 : 0}
          value={current ? actors.indexOf(current) : ''}
          onChange={this.handleChange}
        >
          {[<option value="">Nobody</option>].concat(
            actors.map((actor, index) => <option value={index}>{actor.name}</option>)
          )}
        </select>
      </nav>
    );
  }
}

module.exports = Dropdown;
