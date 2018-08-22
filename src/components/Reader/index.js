const cn = require('classnames');
const { h, Component } = require('preact');
const { withContext } = require('../AppContext');
const Phone = require('../Phone');
const Richtext = require('../Richtext');
const styles = require('./styles.css');

class Reader extends Component {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll() {
    if (!this.hasRevealed) {
      this.hasRevealed = true;
      this.props.reveal();
    }
  }

  componentDidUpdate() {
    const formerCurrent = this.formerCurrent;

    this.formerCurrent = this.props.isCurrentActor ? this.props.current : null;

    if (formerCurrent !== this.formerCurrent) {
      this.hasRevealed = false;

      setTimeout(() => {
        const focusedTextEl = this.base.querySelector(`.${styles.isFocused} .${styles.text}`);

        if (focusedTextEl && focusedTextEl.scrollHeight <= focusedTextEl.clientHeight + 20) {
          this.props.reveal();
        }
      }, 500);
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.current !== this.props.current;
  }

  render({ current, isCurrentActor }) {
    return (
      <div className={styles.root} aria-hidden={isCurrentActor ? 'false' : 'true'}>
        <div id="reader-stories" className={styles.stories} aria-live="assertive" aria-atomic="true">
          {this.formerCurrent &&
            this.formerCurrent !== current && (
              <div key={this.formerCurrent} className={cn(styles.story, styles.wasFocused)} aria-hidden="true">
                <div className={cn(styles.hand, styles[`${this.formerCurrent.phone.screen.hand}Hand`])}>
                  <Phone name={this.formerCurrent.name} {...this.formerCurrent.phone} />
                </div>
                <div className={styles.text}>
                  <Richtext html={this.formerCurrent.storyHTML} />
                </div>
              </div>
            )}
          {isCurrentActor && (
            <div key={current} className={cn(styles.story, styles.isFocused)} role="dialog">
              <div className={cn(styles.hand, styles[`${current.phone.screen.hand}Hand`])}>
                <Phone name={current.name} {...current.phone} />
              </div>
              <div className={styles.text} onScroll={this.handleScroll}>
                <Richtext html={current.storyHTML} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

module.exports = withContext(Reader);
