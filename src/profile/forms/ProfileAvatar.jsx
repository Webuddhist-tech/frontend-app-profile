import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown,
  IconButton,
  Icon,
  Tooltip,
  OverlayTrigger,
} from '@openedx/paragon';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';

import { ReactComponent as DefaultAvatar } from '../assets/avatar.svg';
import messages from './ProfileAvatar.messages';

const CameraIcon = (props) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M4 7h3l2-2.5h6L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
    <circle cx="12" cy="13" r="3.6" />
  </svg>
);

const UploadIcon = (props) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 15V3" />
    <path d="M7 8l5-5 5 5" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </svg>
);

const SwapIcon = (props) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 16h5v5" />
  </svg>
);

const TrashIcon = (props) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M4 7h16" />
    <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

const ProfileAvatar = ({
  src,
  isDefault,
  onSave,
  onDelete,
  savePhotoState,
  isEditable,
}) => {
  const intl = useIntl();
  const fileInput = useRef(null);
  const form = useRef(null);

  const onClickUpload = () => {
    fileInput.current.click();
  };

  const onClickDelete = () => {
    onDelete();
  };

  const onSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    onSave(new FormData(form.current));
    form.current.reset();
  };

  const onChangeInput = () => {
    onSubmit();
  };

  const renderPending = () => (
    <div
      className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center rounded-circle bg-black bg-opacity-65"
    >
      <div className="spinner-border text-primary" role="status" />
    </div>
  );

  const renderEditButton = () => {
    if (!isEditable) {
      return null;
    }

    return (
      <div className="profile-avatar-button">
        <Dropdown>
          <OverlayTrigger
            key="top"
            placement="top"
            overlay={(
              <Tooltip variant="light" id="tooltip-top">
                {!isDefault ? (
                  <p className="h5 font-weight-normal m-0 p-0">
                    {intl.formatMessage(messages['profile.profileavatar.tooltip.edit'])}
                  </p>
                ) : (
                  <p className="h5 font-weight-normal m-0 p-0">
                    {intl.formatMessage(messages['profile.profileavatar.tooltip.upload'])}
                  </p>
                )}
              </Tooltip>
              )}
          >
            <Dropdown.Toggle
              invertColors
              isActive
              id="dropdown-toggle-with-iconbutton"
              as={IconButton}
              src={CameraIcon}
              iconAs={Icon}
              variant="primary"
              className="shadow-sm"
            />
          </OverlayTrigger>
          <Dropdown.Menu>
            <Dropdown.Item type="button" onClick={onClickUpload}>
              {isDefault ? <UploadIcon /> : <SwapIcon />}
              {isDefault ? (
                <FormattedMessage
                  id="profile.profileavatar.upload-button"
                  defaultMessage="Upload photo"
                  description="Upload photo button"
                />
              ) : (
                intl.formatMessage(messages['profile.profileavatar.change-button'])
              )}
            </Dropdown.Item>
            {!isDefault && (
              <Dropdown.Item type="button" onClick={onClickDelete}>
                <TrashIcon />
                <FormattedMessage
                  id="profile.profileavatar.remove.button"
                  defaultMessage="Remove photo"
                  description="Remove photo button"
                />
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const renderAvatar = () => (
    isDefault ? (
      <DefaultAvatar className="text-muted" role="img" aria-hidden focusable="false" viewBox="0 0 24 24" />
    ) : (
      <img
        data-hj-suppress
        className="w-100 h-100 d-block rounded-circle overflow-hidden object-fit-cover"
        alt={intl.formatMessage(messages['profile.image.alt.attribute'])}
        src={src}
      />
    )
  );

  return (
    <div className="profile-avatar-wrap position-relative">
      <div className="profile-avatar rounded-circle bg-light">
        {savePhotoState === 'pending' && renderPending()}
        {renderAvatar()}
      </div>
      {renderEditButton()}
      <form
        ref={form}
        onSubmit={onSubmit}
        encType="multipart/form-data"
      >
        <input
          className="d-none form-control-file"
          ref={fileInput}
          type="file"
          name="file"
          id="photo-file"
          onChange={onChangeInput}
          accept=".jpg, .jpeg, .png"
        />
      </form>
    </div>
  );
};

ProfileAvatar.propTypes = {
  src: PropTypes.string,
  isDefault: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  savePhotoState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  isEditable: PropTypes.bool,
};

ProfileAvatar.defaultProps = {
  src: null,
  isDefault: true,
  savePhotoState: null,
  isEditable: false,
};

export default ProfileAvatar;
