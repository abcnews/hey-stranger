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
        <div id="reader-stories" className={styles.stories} aria-live="assertive" aria-atomic="true">
          {this.lastFocused && (
            <div key={this.lastFocused} className={cn(styles.story, styles.wasFocused)} aria-hidden="true">
              <div className={cn(styles.hand, styles[`${this.lastFocused.phone.screen.hand}Hand`])}>
                <Phone name={this.lastFocused.name} {...this.lastFocused.phone} />
              </div>
              <div className={styles.text}>
                <Richtext html={this.lastFocused.storyHTML} />
              </div>
            </div>
          )}
          {focused && (
            <div key={focused} className={cn(styles.story, styles.isFocused)} role="dialog">
              <div className={cn(styles.hand, styles[`${focused.phone.screen.hand}Hand`])}>
                <Phone name={focused.name} {...focused.phone} />
              </div>
              <div className={styles.text}>
                <Richtext html={focused.storyHTML} />
              </div>
            </div>
          )}
        </div>
        <nav className={styles.nav}>
          <Button tabindex={focused ? 0 : -1} onClick={this.back}>
            <Arrow direction="left" />
            <span>Back</span>
          </Button>
        </nav>
      </div>
    );
  }
}

module.exports = Reader;
