const { h } = require('preact');
const styles = require('./styles.css');

module.exports = ({ html }) => <div className={styles.root} dangerouslySetInnerHTML={{ __html: html }} />;

module.exports.displayName = 'Richtext';
