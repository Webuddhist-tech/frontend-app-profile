import React from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { FormattedDate, FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Hyperlink } from '@openedx/paragon';
import get from 'lodash.get';

import classNames from 'classnames';
import messages from './Certificates.messages';

const VerifiedBadgeIcon = (props) => (
  <svg
    width={13}
    height={13}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 2l2.6 1.9 3.2-.2.9 3.1 2.6 1.9-1.3 2.9 1.3 2.9-2.6 1.9-.9 3.1-3.2-.2L12 22l-2.6-1.9-3.2.2-.9-3.1L2.7 15.3 4 12.4 2.7 9.5l2.6-1.9.9-3.1 3.2.2z" />
    <polyline points="8.7 12.2 11 14.4 15.4 9.9" />
  </svg>
);

const CertificateCard = ({
  certificateType,
  courseDisplayName,
  courseOrganization,
  modifiedDate,
  downloadUrl,
  courseId,
  uuid,
}) => {
  const intl = useIntl();
  const isVerified = certificateType === 'verified';
  const { LOGO_URL } = getConfig();

  return (
    <article
      key={`${modifiedDate}-${courseId}`}
      className={classNames('certificate', { 'certificate-verified': isVerified })}
      style={isVerified && LOGO_URL ? { '--certificate-seal': `url(${LOGO_URL})` } : undefined}
    >
      <div>
        <p className={classNames('certificate-eyebrow', { 'certificate-eyebrow-verified': isVerified })}>
          {isVerified && <VerifiedBadgeIcon />}
          {intl.formatMessage(get(
            messages,
            `profile.certificates.types.${certificateType}`,
            messages['profile.certificates.types.unknown'],
          ))}
        </p>
        <p className="certificate-title">
          {courseDisplayName}
        </p>
      </div>
      <p className="certificate-meta">
        <FormattedMessage
          id="profile.certificate.organization.label"
          defaultMessage="From"
        />
        {' '}
        <strong>{courseOrganization}</strong>
        <br />
        <FormattedMessage
          id="profile.certificate.completion.date.label"
          defaultMessage="Completed on {date}"
          values={{
            date: <FormattedDate value={new Date(modifiedDate)} />,
          }}
        />
        {isVerified && (
          <>
            <br />
            <span className="certificate-meta-verified">
              {intl.formatMessage(messages['profile.certificate.verified.meta'])}
            </span>
          </>
        )}
      </p>
      <Hyperlink
        destination={downloadUrl}
        target="_blank"
        showLaunchIcon={false}
        className="btn btn-primary font-weight-normal px-4 py-10px"
      >
        {intl.formatMessage(messages['profile.certificates.view.certificate'])}
      </Hyperlink>
      <div className="certificate-id">
        <span>{intl.formatMessage(messages['profile.certificate.uuid.label'])}</span>
        <code>{uuid}</code>
      </div>
    </article>
  );
};

CertificateCard.propTypes = {
  certificateType: PropTypes.string,
  courseDisplayName: PropTypes.string,
  courseOrganization: PropTypes.string,
  modifiedDate: PropTypes.string,
  downloadUrl: PropTypes.string,
  courseId: PropTypes.string.isRequired,
  uuid: PropTypes.string,
};

CertificateCard.defaultProps = {
  certificateType: 'unknown',
  courseDisplayName: '',
  courseOrganization: '',
  modifiedDate: '',
  downloadUrl: '',
  uuid: '',
};

export default CertificateCard;
