const cn = require('classnames');
const { h } = require('preact');
const { withContext } = require('../AppContext');
const styles = require('./styles.css');

const HUDFilter = ({ isCurrentActor }) => <div className={cn(styles.root, { [styles.hasFocus]: isCurrentActor })} />;

HUDFilter.displayName = 'HUDFilter';

module.exports = withContext(HUDFilter);
