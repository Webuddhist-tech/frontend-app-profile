import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { connect } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';

import CertificateCard from './CertificateCard';
import { certificatesSelector } from './data/selectors';

const renderAccent = (chunks) => <span className="pf-accent">{chunks}</span>;

const Certificates = ({ certificates }) => (
  <div>
    <p className="pf-h2">
      <FormattedMessage
        id="profile.your.certificates"
        defaultMessage="Your <accent>certificates</accent>"
        description="heading for the certificates section"
        values={{ accent: renderAccent }}
      />
    </p>
    <p className="pf-lead">
      <FormattedMessage
        id="profile.certificates.description"
        defaultMessage="Your learner records information is only visible to you. Only your username and profile image are visible to others on {siteName}."
        description="description of the certificates section"
        values={{
          siteName: getConfig().SITE_NAME,
        }}
      />
    </p>
    {certificates?.length > 0 ? (
      <div className="pf-cert-grid">
        {certificates.map(certificate => (
          <CertificateCard
            key={certificate.courseId}
            certificateType={certificate.certificateType}
            courseDisplayName={certificate.courseDisplayName}
            courseOrganization={certificate.courseOrganization}
            modifiedDate={certificate.modifiedDate}
            downloadUrl={certificate.downloadUrl}
            courseId={certificate.courseId}
            uuid={certificate.uuid}
          />
        ))}
      </div>
    ) : (
      <div className="pf-certs-empty">
        <FormattedMessage
          id="profile.no.certificates"
          defaultMessage="You don't have any certificates yet."
          description="displays when user has no course completion certificates"
        />
      </div>
    )}
  </div>
);

Certificates.propTypes = {
  certificates: PropTypes.arrayOf(PropTypes.shape({
    certificateType: PropTypes.string,
    courseDisplayName: PropTypes.string,
    courseOrganization: PropTypes.string,
    modifiedDate: PropTypes.string,
    downloadUrl: PropTypes.string,
    courseId: PropTypes.string.isRequired,
    uuid: PropTypes.string,
  })),
};

Certificates.defaultProps = {
  certificates: [],
};

export default connect(
  certificatesSelector,
  {},
)(Certificates);
