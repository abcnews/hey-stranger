const { h } = require('preact');
const { createContext } = require('preact-context');

const FN = () => {};

const { Consumer, Provider } = createContext({
  current: null,
  hasExplored: false,
  hasRevealed: false,
  hasStarted: false,
  isCurrentAbout: false,
  isCurrentActor: false,
  isInteractive: false,
  meta: null,
  scene: null,
  goTo: FN,
  prev: FN,
  next: FN
});

const getDisplayName = Component => Component.displayName || Component.name || 'Component';

const withContext = Component => {
  const Wrapped = props => <Consumer>{context => <Component {...props} {...context} />}</Consumer>;

  Wrapped.displayName = `AppContext.Consumer(${getDisplayName(Component)})`;

  return Wrapped;
};

module.exports = { Consumer, Provider, withContext };
