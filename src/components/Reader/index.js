const cn = require('classnames');
const { h, Component } = require('preact');
const Phone = require('../Phone');
const Richtext = require('../Richtext');
const styles = require('./styles.css');

class Reader extends Component {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll() {
    if (!this.hasRevealed && this.props.reveal) {
      this.props.reveal();
      this.hasRevealed = true;
    }
  }

  componentDidUpdate() {
    if (this.lastFocused !== this.props.focused) {
      this.hasRevealed = false;

      if (!this.props.reveal) {
        return;
      }

      setTimeout(() => {
        const focusedTextEl = this.base.querySelector(`.${styles.isFocused} .${styles.text}`);

        if (focusedTextEl && focusedTextEl.scrollHeight <= focusedTextEl.clientHeight + 20) {
          this.props.reveal();
        }
      }, 500);
    }

    this.lastFocused = this.props.focused;
  }

  render({ focused }) {
    return (
      <div className={styles.root} aria-hidden={focused ? 'false' : 'true'}>
        <div id="reader-stories" className={styles.stories} aria-live="assertive" aria-atomic="true">
          {this.lastFocused &&
            this.lastFocused !== focused && (
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
              <div className={styles.text} onScroll={this.handleScroll}>
                <Richtext html={focused.storyHTML} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

module.exports = Reader;
