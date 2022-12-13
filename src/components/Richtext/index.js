const { h } = require('preact');
const styles = require('./styles.css').default;

const Richtext = ({ html }) => <div className={styles.root} dangerouslySetInnerHTML={{ __html: html }} />;

Richtext.displayName = 'Richtext';

module.exports = Richtext;
