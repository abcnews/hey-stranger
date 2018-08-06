const { h, Component } = require('preact');
const Button = require('../Button');
const styles = require('./styles.css');

const SHOULD_SUPPRESS_REF_KEY = 'AudioPlayer_shouldSuppressRef';

class AudioPlayer extends Component {
  constructor(props) {
    super(props);

    this.getAudioRef = this.getAudioRef.bind(this);
    this.toggle = this.toggle.bind(this);
    this.updatePlaybackState = this.updatePlaybackState.bind(this);

    this.state = {
      on: false
    };
  }

  getAudioRef(el) {
    this.audio = el;
  }

  toggle() {
    this.audio[this.audio.paused ? 'play' : 'pause']();
  }

  updatePlaybackState() {
    localStorage[`${this.audio.paused ? 'set' : 'remove'}Item`](SHOULD_SUPPRESS_REF_KEY, '1');
    this.setState({ on: !this.audio.paused });
  }

  componentDidMount() {
    if (this.props.onAudio && localStorage.getItem(SHOULD_SUPPRESS_REF_KEY) === null) {
      this.props.onAudio(this.audio);
    }
  }

  render({ audio, isUnavailable }, { on }) {
    return (
      audio && (
        <div className={styles.root} aria-hidden={isUnavailable ? 'true' : 'false'}>
          <audio
            id="soundtrack"
            ref={this.getAudioRef}
            src={audio.url}
            loop
            onPause={this.updatePlaybackState}
            onPlaying={this.updatePlaybackState}
          />
          <Button
            transparent
            className={styles.toggle}
            disabled={isUnavailable ? '' : null}
            aria-label={`Audio is ${on ? 'on' : 'off'}`}
            aria-pressed={on ? 'true' : 'false'}
            aria-controls="soundtrack"
            onClick={this.toggle}
          >
            {!on && (
              <svg className={styles.offIcon} width="17" height="16" viewBox="0 0 17 16">
                <path d="M9.778 5.833l1.333-1.389 2.222 2.315 2.223-2.315 1.333 1.39-2.222 2.314 2.222 2.315-1.333 1.389-2.223-2.315-2.222 2.315-1.333-1.389L12 8.148 9.778 5.833zM0 10.667V5.333h3.555L8 0v16l-4.445-5.333H0z" />
              </svg>
            )}
            {on && (
              <svg
                className={styles.onIcon}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path d="M9.852 4.04c1.546.666 2.627 2.189 2.627 3.96s-1.08 3.294-2.627 3.96V9.933a2.57 2.57 0 0 0 0-3.864V4.039zm0-3.812c3.484.867 6.13 4.105 6.13 7.772s-2.646 6.905-6.13 7.772v-1.844c2.51-.815 4.38-3.22 4.38-5.927 0-2.707-1.87-5.114-4.38-5.929V.228zM0 10.667V5.333h3.555L8 0v16l-4.445-5.333H0z" />
              </svg>
            )}
            {on && <span className={styles.onLabel}>Audio is on</span>}
          </Button>
        </div>
      )
    );
  }
}

module.exports = AudioPlayer;
