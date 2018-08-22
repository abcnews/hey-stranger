const { h, Component } = require('preact');
const { withContext } = require('../AppContext');
const styles = require('./styles.css');

class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;

    this.props.goTo(value === '' ? null : this.props.scene.actors[event.target.value]);
  }

  render({ hasStarted, current, scene }) {
    const currentActorIndex = scene.actors.indexOf(current);

    return (
      <nav className={styles.root}>
        <label id="dropdown-label" for="dropdown-select">
          Choose somebody:
        </label>
        <select
          id="dropdown-select"
          aria-controls="reader-stories"
          aria-describedby="dropdown-label"
          tabindex={hasStarted ? 0 : -1}
          value={currentActorIndex === -1 ? '' : currentActorIndex}
          onChange={this.handleChange}
        >
          {[<option value="">Nobody</option>].concat(
            scene.actors.map((actor, index) => <option value={index}>{actor.name}</option>)
          )}
        </select>
      </nav>
    );
  }
}

module.exports = withContext(Dropdown);
