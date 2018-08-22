const cn = require('classnames');
const { h, Component } = require('preact');
const Body = require('../Body');
const { withContext } = require('../AppContext');
const styles = require('./styles.css');

class Scene extends Component {
  constructor(props) {
    super(props);

    this.imageRefs = {};
    this.updateViewportDependentProps();

    this.state = {
      shouldAutoPan: true
    };

    this.firstInteraction = this.firstInteraction.bind(this);
    this.invalidateViewportDependentProps = this.invalidateViewportDependentProps.bind(this);
    this.invalidateVDPOnceOriented = this.invalidateVDPOnceOriented.bind(this);
    this.pickActor = this.pickActor.bind(this);
    this.saveImageRef = this.saveImageRef.bind(this);
    this.scrollBegin = this.scrollBegin.bind(this);
    this.scrollContinue = this.scrollContinue.bind(this);
    this.scrollFinish = this.scrollFinish.bind(this);
    this.scrollWheel = this.scrollWheel.bind(this);
  }

  clampScrollOffset(scrollOffset) {
    return Math.min(
      this.viewportDependentProps.scrollMax,
      Math.max(-this.viewportDependentProps.scrollMax, scrollOffset)
    );
  }

  firstInteraction() {
    this.hasMadeFirstInteraction = true;
    this.setState({ scrollOffset: this.measureScrollOffset(), shouldAutoPan: false });
  }

  invalidateViewportDependentProps() {
    this.updateViewportDependentProps();
    this.setState({ scrollOffset: null });
  }

  invalidateVDPOnceOriented() {
    const before = this.viewportDependentProps.viewportRatio;
    const after = measureViewport().ratio;

    if ((before >= 1 && after >= 1) || (before < 1 && after < 1)) {
      return window.requestAnimationFrame(this.invalidateVDPOnceOriented);
    }

    this.invalidateViewportDependentProps();
  }

  measureScrollOffset() {
    const transform = window.getComputedStyle(this.base).transform;

    return transform.indexOf('matrix') === 0 ? Math.round(transform.split(', ')[4]) : 0;
  }

  pickActor(event) {
    if (this.hasRecentlyScrolled) {
      return;
    }

    const sceneBox = this.base.getBoundingClientRect();
    const sceneScale = sceneBox.width / this.props.scene.width;
    const sceneX = (event.pageX - sceneBox.left) / sceneScale;
    const sceneY = (event.pageY - sceneBox.top) / sceneScale;

    const candidateActors = this.props.scene.actors
      .filter(
        actor =>
          sceneX >= actor.body.x &&
          sceneX <= actor.body.x + actor.body.width &&
          sceneY >= actor.body.y &&
          sceneY <= actor.body.y + actor.body.height
      )
      .sort((a, b) => b.body.y + b.body.height - (a.body.y + a.body.height));

    const canvas = document.createElement('canvas');

    canvas.width = this.props.scene.width;
    canvas.height = this.props.scene.height;

    const ctx = canvas.getContext('2d');

    const futureCurrent = candidateActors.find(actor => {
      ctx.clearRect(0, 0, this.props.scene.width, this.props.scene.height);
      ctx.drawImage(
        this.imageRefs[actor.body.image.url],
        actor.body.x,
        actor.body.y,
        actor.body.width,
        actor.body.height
      );

      return ctx.getImageData(sceneX, sceneY, 1, 1).data[3] >= 128;
    });

    if (!futureCurrent && !this.props.current) {
      return;
    }

    this.props.goTo(futureCurrent === this.props.current ? null : futureCurrent);
    this.setState({ scrollOffset: null });
  }

  saveImageRef(el) {
    this.imageRefs[el.src] = el;
  }

  scrollBegin(event) {
    if (!this.hasMadeFirstInteraction) {
      this.firstInteraction();
    }

    if (this.props.current || this.scrollPreviousX != null) {
      return;
    }

    this.scrollPreviousX = event.touches ? event.touches[0].clientX : event.clientX;
  }

  scrollContinue(event) {
    if (typeof event.scale !== 'undefined' && event.scale !== 1) {
      // Attempt to stop pinch-zoom
      return event.preventDefault();
    }

    if (this.scrollPreviousX == null) {
      return;
    }

    this.hasRecentlyScrolled = true;
    this.scrollCurrentX = event.touches ? event.touches[0].clientX : event.clientX;

    if (!this.props.hasExplored) {
      this.props.explore();
    }

    this.setState({
      scrollOffset: this.clampScrollOffset(
        (this.state.scrollOffset || this.measureScrollOffset()) - this.scrollPreviousX + this.scrollCurrentX
      )
    });

    this.scrollPreviousX = this.scrollCurrentX;
  }

  scrollFinish() {
    if (this.hasRecentlyScrolled) {
      setTimeout(() => (this.hasRecentlyScrolled = false), 250);
    }

    this.scrollPreviousX = null;
    this.scrollCurrentX = null;
  }

  scrollWheel(event) {
    if (!this.hasMadeFirstInteraction) {
      this.firstInteraction();
    }

    if (this.props.current || this.scrollPreviousX != null || !event.deltaX) {
      return;
    }

    this.props.explore();

    this.setState({
      scrollOffset: this.clampScrollOffset((this.state.scrollOffset || this.measureScrollOffset()) - event.deltaX)
    });
  }

  updateViewportDependentProps(nextScene) {
    const { width, height } = nextScene || this.props.scene;
    const viewport = measureViewport();
    const ratioDiff = width / height - viewport.ratio;
    const scaledWidth = ratioDiff > 0 ? (viewport.height / height) * width : viewport.width;
    const scaledHeight = ratioDiff > 0 ? viewport.height : (viewport.width / width) * height;
    const scrollMax = Math.max(0, Math.round((scaledWidth - viewport.width) / 2));
    const [autoPanClassName, autoPanStyles] = createAutoPan(scrollMax);

    this.viewportDependentProps = {
      viewportRatio: viewport.ratio,
      scaledWidth,
      scaledHeight,
      scrollMax,
      autoPanClassName,
      autoPanStyles
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.invalidateViewportDependentProps);
    window.addEventListener('orientationchange', this.invalidateVDPOnceOriented);
  }

  componentWillReceiveProps({ scene }) {
    if (this.props.scene.width !== scene.width || this.props.scene.height !== scene.height) {
      this.updateViewportDependentProps(scene);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.current !== this.props.current ||
      nextProps.scene === this.props.scene ||
      nextState.scrollOffset !== this.state.scrollOffset
    );
  }

  componentDidUpdate() {
    this.formerCurrent = this.props.isCurrentActor ? this.props.current : null;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.invalidateViewportDependentProps);
    window.removeEventListener('orientationchange', this.invalidateVDPOnceOriented);
  }

  render({ current, isCurrentActor, isInteractive, scene }, { scrollOffset, shouldAutoPan }) {
    const { width, height, image, video, actors } = scene;
    const { scaledWidth, scaledHeight, autoPanClassName, autoPanStyles } = this.viewportDependentProps;
    const actorsBackToFront = actors.slice().sort((a, b) => a.body.y + a.body.height - (b.body.y + b.body.height));
    const hasLargeViewport = window.matchMedia('(min-width: 64rem) and (min-height: 48rem)').matches;
    const isZoomingOut = !isCurrentActor && this.formerCurrent != null;
    const originXPct = isCurrentActor ? ((current.body.x + current.body.focus.x) / width) * 100 : 50;
    const originYPct = isCurrentActor ? ((current.body.y + current.body.focus.y) / height) * 100 : 50;
    const scale = isCurrentActor ? current.body.focus.scale / 100 : 1;
    const translateX = isCurrentActor
      ? `${50 - originXPct}%`
      : scrollOffset != null
        ? `${scrollOffset}px`
        : isZoomingOut
          ? `${this.clampScrollOffset(
              ((this.formerCurrent.body.x + this.formerCurrent.body.focus.x - width / 2) / -width) * scaledWidth
            )}px`
          : 0;
    const translateY = isCurrentActor ? `${66 - originYPct}%` : 0;
    const transform = `${scale !== 1 ? `scale(${scale}) ` : ''}translate3d(${translateX}, ${translateY}, 0)`;
    const transitionDelay = scrollOffset ? '0s' : '';
    const transitionDuration = scrollOffset ? '0s' : '';

    return (
      <div
        className={cn(styles.root, {
          [autoPanClassName]: shouldAutoPan && isInteractive && !isCurrentActor,
          [styles.hasFocused]: isCurrentActor
        })}
        aria-hidden={!isInteractive || isCurrentActor ? 'true' : 'false'}
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          transform,
          transitionDelay,
          transitionDuration
        }}
        onMouseDown={isInteractive ? this.scrollBegin : null}
        onTouchStart={isInteractive ? this.scrollBegin : null}
        onMouseMoveCapture={isInteractive ? this.scrollContinue : null}
        onTouchMoveCapture={isInteractive ? this.scrollContinue : null}
        onMouseUp={isInteractive ? this.scrollFinish : null}
        onTouchEnd={isInteractive ? this.scrollFinish : null}
        onMouseLeave={isInteractive ? this.scrollFinish : null}
        onTouchCancel={isInteractive ? this.scrollFinish : null}
        onWheel={isInteractive ? this.scrollWheel : null}
        onClick={isInteractive ? this.pickActor : null}
      >
        {shouldAutoPan && isInteractive && !isCurrentActor && <style>{autoPanStyles}</style>}
        <div className={styles.base}>
          {image && <img src={image.url} alt={image.description} />}
          {hasLargeViewport &&
            video && (
              <video
                src={video.url}
                poster={image ? image.url : null}
                alt={image ? image.description : null}
                autoplay
                loop
                muted
                playsinline
                webkit-playsinline
              />
            )}
        </div>
        <div className={styles.bodies}>
          {actorsBackToFront.map((actor, index) => (
            <Body
              xPct={actor.body.x / width}
              yPct={actor.body.y / height}
              widthPct={actor.body.width / width}
              depthIndex={index}
              src={actor.body.image.url}
              alt={actor.body.image.description || actor.name}
              isInFocus={!isCurrentActor || current === actor}
              onImage={this.saveImageRef}
            />
          ))}
        </div>
      </div>
    );
  }
}

const createAutoPan = (scrollMax = 0) => {
  if (scrollMax < 100) {
    // Don't allow autoPan when there's less than 100px to travel
    // (otherwise you sometimes get a shaky/bouncy effect)
    return [null, null];
  }

  const className = `${styles.root}_autoPan__scrollMax${scrollMax}`;
  const animationName = `${className}__animation`;

  const style = `
@keyframes ${animationName} {
  0%, 100% {
    transform: translate3d(0, 0, 0);
  }
  25% {
    transform: translate3d(${scrollMax}px, 0, 0);
  }
  75% {
    transform: translate3d(${-scrollMax}px, 0, 0);
  }
}

.${className} {
  animation: ${animationName} ${Math.round(scrollMax / 5)}s linear 0s infinite alternate both;
}
  `;

  return [className, style];
};

const measureViewport = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  return {
    width,
    height,
    ratio: width / height
  };
};

module.exports = withContext(Scene);
