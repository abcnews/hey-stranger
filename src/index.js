require('./polyfills');

const { h, render } = require('preact');
const { getProps, getSupplementaryCMID, reset } = require('./utils');

const rootEl = document.createElement('div');

rootEl.setAttribute('data-app-root', '');
document.body.insertBefore(rootEl, document.body.firstChild);

let appProps = {};

function load() {
  const App = require('./components/App');
  render(<App meta={appProps.meta} scene={appProps.scene} />, rootEl, rootEl.firstChild);
}

reset();
load();
window.dispatchEvent(new CustomEvent('unveil'));
getProps(getSupplementaryCMID()).then(props => {
  appProps = props;
  load();
});

if (module.hot) {
  module.hot.accept('./components/App', () => {
    try {
      load();
    } catch (err) {
      const ErrorBox = require('./components/ErrorBox');
      render(<ErrorBox error={err} />, root, root.firstChild);
    }
  });
}

if (process.env.NODE_ENV === 'development') {
  require('preact/devtools');
}
