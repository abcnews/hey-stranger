const cn = require('classnames');
const { h, Component } = require('preact');
const Arrow = require('../Arrow');
const Button = require('../Button');
const Phone = require('../Phone');
const Richtext = require('../Richtext');
const styles = require('./styles.css');

class Reader extends Component {
  constructor(props) {
    super(props);

    this.back = this.back.bind(this);
  }

  back() {
    if (this.props.navigate) {
      this.props.navigate(null);
    }
  }

  componentDidUpdate() {
    this.lastFocused = this.props.focused;
  }

  render({ focused }) {
    return (
      <div
        className={cn(styles.root, {
          [styles.hasFocused]: focused
        })}
      >
        <div className={styles.stories}>
          {this.lastFocused && (
            <div key={this.lastFocused} className={cn(styles.story, styles.wasFocused)}>
              <div className={cn(styles.phone, styles[`${this.lastFocused.phone.screen.hand}Hand`])}>
                <Phone {...this.lastFocused.phone} />
              </div>
              <div className={styles.richtext}>
                <Richtext html={this.lastFocused.html} />
              </div>
            </div>
          )}
          {focused && (
            <div key={focused} className={cn(styles.story, styles.isFocused)}>
              <div className={cn(styles.phone, styles[`${focused.phone.screen.hand}Hand`])}>
                <Phone {...focused.phone} />
              </div>
              <div className={styles.richtext}>
                <Richtext html={focused.html} />
              </div>
            </div>
          )}
        </div>
        <nav className={styles.nav}>
          <Button onClick={this.back}>
            <Arrow direction="left" />
            <span>Back</span>
          </Button>
        </nav>
      </div>
    );
  }
}

module.exports = Reader;
