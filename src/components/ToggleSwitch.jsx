import React, { forwardRef, useId } from 'react';
import PropTypes from 'prop-types';

const ToggleSwitch = forwardRef(
  (
    {
      name,
      label,
      checked,
      onChange,
      size = 'medium',
      disabled = false,
      error = null,
      className = '',
      containerClassName = '',
      required = false,
      labelPosition = 'right',
      ...rest
    },
    ref
  ) => {
    const uniqueId = useId();
    const inputId = `toggle-${name || uniqueId}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const isDisabled = disabled;

    const baseClass = 'toggle-switch';
    const sizeClass = `toggle-switch--size-${size}`;
    const stateClass = isDisabled ? 'toggle-switch--state-disabled' : '';
    const switchWrapperClassName = [baseClass, sizeClass, stateClass, className].filter(Boolean).join(' ');
    const formGroupClass = `form-group ${error ? 'form-group--error' : ''} ${isDisabled ? 'form-group--disabled' : ''} ${containerClassName}`.trim();

    return (
      <div className={formGroupClass}>
        <label className={switchWrapperClassName}>
          <input
            ref={ref}
            type="checkbox"
            className="toggle-switch__input"
            id={inputId}
            name={name}
            checked={checked}
            onChange={onChange}
            disabled={isDisabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={errorId}
            {...rest}
          />
          <span className="toggle-switch__slider" />
          {label && (
            <span className="toggle-switch__label">{label}</span>
          )}
        </label>
        {error && (
          <div id={errorId} className="form-error-message" role="alert">
            {error}
          </div>
        )}
      </div>
    );
  }
);

ToggleSwitch.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  required: PropTypes.bool,
  labelPosition: PropTypes.oneOf(['left', 'right']),
};

ToggleSwitch.defaultProps = {
  size: 'medium',
  disabled: false,
  error: null,
  className: '',
  containerClassName: '',
  required: false,
  labelPosition: 'right',
};

ToggleSwitch.displayName = 'ToggleSwitch';

export default ToggleSwitch;

