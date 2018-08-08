const { h, Component } = require('preact');
const smartquotes = require('./smartquotes');
const styles = require('./styles.css');

class Richtext extends Component {
  componentDidMount() {
    smartquotes(this.base);
  }

  componentDidUpdate() {
    smartquotes(this.base);
  }

  render({ html }) {
    return <div className={styles.root} dangerouslySetInnerHTML={{ __html: html }} />;
  }
}

module.exports = Richtext;
