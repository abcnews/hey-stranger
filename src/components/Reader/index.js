const cn = require('classnames');
const { h, Component } = require('preact');
const BackNav = require('../BackNav');
const Phone = require('../Phone');
const Richtext = require('../Richtext');
const styles = require('./styles.css');

class Reader extends Component {
  componentDidUpdate() {
    this.lastFocused = this.props.focused;
  }

  render({ focused, navigate }) {
    return (
      <div className={styles.root} aria-hidden={focused ? 'false' : 'true'}>
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
        {navigate && <BackNav isUnavailable={!focused} navigate={navigate} />}
      </div>
    );
  }
}

module.exports = Reader;
