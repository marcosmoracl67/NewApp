import PropTypes from 'prop-types';

const ProgressBar = ({ percent }) => {
  const clamped = Math.max(0, Math.min(percent, 100));

  return (
    <div className="form-progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={clamped}>
      <div className="form-progress-bar__fill" style={{ width: `${clamped}%` }} />
    </div>
  );
};

ProgressBar.propTypes = {
  percent: PropTypes.number.isRequired,
};

export default ProgressBar;

