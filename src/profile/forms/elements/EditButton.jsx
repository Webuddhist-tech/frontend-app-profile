import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';
import messages from './EditButton.messages';

const EditIcon = (props) => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

const EditButton = ({ onClick, className = null, style = null }) => {
  const intl = useIntl();
  return (
    <Button
      variant="link"
      size="sm"
      className={className}
      onClick={onClick}
      style={style}
    >
      <EditIcon className="text-gray-700" />
      {intl.formatMessage(messages['profile.editbutton.edit'])}
    </Button>
  );
};

export default EditButton;

EditButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object, // eslint-disable-line
};
