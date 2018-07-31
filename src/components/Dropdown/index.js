const { h, Component } = require('preact');
const styles = require('./styles.css');

class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.pickActor = this.pickActor.bind(this);
  }

  pickActor(event) {
    const value = event.target.value;

    if (this.props.navigate) {
      this.props.navigate(value === '' ? null : this.props.actors[event.target.value]);
    }
  }

  render({ isUnavailable, actors, current }) {
    return (
      <nav className={styles.root}>
        <label for="dropdown">Choose somebody:</label>
        <select
          name="dropdown"
          tabindex={isUnavailable ? -1 : 0}
          value={current ? actors.indexOf(current) : ''}
          onChange={this.pickActor}
        >
          {[<option value="">—</option>].concat(
            actors.map((actor, index) => <option value={index}>{actor.name}</option>)
          )}
        </select>
      </nav>
    );
  }
}

module.exports = Dropdown;
