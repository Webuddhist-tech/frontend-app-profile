import React, {
  useEffect, useState, useContext, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import {
  Alert, Hyperlink, OverlayTrigger, Tooltip,
} from '@openedx/paragon';
import { InfoOutline } from '@openedx/paragon/icons';
import classNames from 'classnames';

import {
  fetchProfile,
  saveProfile,
  saveProfilePhoto,
  deleteProfilePhoto,
  openForm,
  closeForm,
  updateDraft,
} from './data/actions';

import ProfileAvatar from './forms/ProfileAvatar';
import Name from './forms/Name';
import Country from './forms/Country';
import PreferredLanguage from './forms/PreferredLanguage';
import Education from './forms/Education';
import SocialLinks from './forms/SocialLinks';
import Bio from './forms/Bio';
import DateJoined from './DateJoined';
import UserCertificateSummary from './UserCertificateSummary';
import PageLoading from './PageLoading';
import Certificates from './Certificates';

import { profilePageSelector } from './data/selectors';
import messages from './ProfilePage.messages';
import withParams from '../utils/hoc';
import { useIsOnMobileScreen } from './data/hooks';

import AdditionalProfileFieldsSlot from '../plugin-slots/AdditionalProfileFieldsSlot';

ensureConfig(['CREDENTIALS_BASE_URL', 'LMS_BASE_URL', 'ACCOUNT_SETTINGS_URL'], 'ProfilePage');

const renderAccent = (chunks) => <span className="pf-accent">{chunks}</span>;

const ProfilePage = ({ params }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const context = useContext(AppContext);
  const {
    dateJoined,
    courseCertificates,
    name,
    visibilityName,
    profileImage,
    savePhotoState,
    isLoadingProfile,
    photoUploadError,
    country,
    visibilityCountry,
    levelOfEducation,
    visibilityLevelOfEducation,
    socialLinks,
    draftSocialLinksByPlatform,
    visibilitySocialLinks,
    languageProficiencies,
    visibilityLanguageProficiencies,
    bio,
    visibilityBio,
    saveState,
    username,
  } = useSelector(profilePageSelector);

  const navigate = useNavigate();
  const [viewMyRecordsUrl, setViewMyRecordsUrl] = useState(null);
  const isMobileView = useIsOnMobileScreen();

  useEffect(() => {
    const { CREDENTIALS_BASE_URL } = context.config;
    if (CREDENTIALS_BASE_URL) {
      setViewMyRecordsUrl(`${CREDENTIALS_BASE_URL}/records`);
    }

    dispatch(fetchProfile(params.username));
    sendTrackingLogEvent('edx.profile.viewed', {
      username: params.username,
    });
  }, [dispatch, params.username, context.config]);

  useEffect(() => {
    if (!username && saveState === 'error' && navigate) {
      navigate('/notfound');
    }
  }, [username, saveState, navigate]);

  const authenticatedUserName = context.authenticatedUser.username;

  const handleSaveProfilePhoto = useCallback((formData) => {
    dispatch(saveProfilePhoto(authenticatedUserName, formData));
  }, [dispatch, authenticatedUserName]);

  const handleDeleteProfilePhoto = useCallback(() => {
    dispatch(deleteProfilePhoto(authenticatedUserName));
  }, [dispatch, authenticatedUserName]);

  const handleClose = useCallback((formId) => {
    dispatch(closeForm(formId));
  }, [dispatch]);

  const handleOpen = useCallback((formId) => {
    dispatch(openForm(formId));
  }, [dispatch]);

  const handleSubmit = useCallback((formId) => {
    dispatch(saveProfile(formId, authenticatedUserName));
  }, [dispatch, authenticatedUserName]);

  const handleChange = useCallback((fieldName, value) => {
    dispatch(updateDraft(fieldName, value));
  }, [dispatch]);

  const isAuthenticatedUserProfile = () => params.username === authenticatedUserName;

  const isBlockVisible = (blockInfo) => isAuthenticatedUserProfile()
      || (!isAuthenticatedUserProfile() && Boolean(blockInfo));

  const renderViewMyRecordsButton = () => {
    if (!(viewMyRecordsUrl && isAuthenticatedUserProfile())) {
      return null;
    }

    return (
      <Hyperlink
        className={classNames(
          'btn btn-brand bg-brand-500 font-weight-normal px-4 py-10px text-nowrap',
          { 'w-100': isMobileView },
        )}
        target="_blank"
        showLaunchIcon={false}
        destination={viewMyRecordsUrl}
      >
        {intl.formatMessage(messages['profile.viewMyRecords'])}
      </Hyperlink>
    );
  };

  const renderPhotoUploadErrorMessage = () => (
    photoUploadError && (
      <div className="row">
        <div className="col-md-4 col-lg-3">
          <Alert variant="danger" dismissible={false} show>
            {photoUploadError.userMessage}
          </Alert>
        </div>
      </div>
    )
  );

  const commonFormProps = {
    openHandler: handleOpen,
    closeHandler: handleClose,
    submitHandler: handleSubmit,
    changeHandler: handleChange,
  };

  return (
    <div className="profile-page">
      {isLoadingProfile ? (
        <PageLoading srMessage={intl.formatMessage(messages['profile.loading'])} />
      ) : (
        <>
          <div className="pf-band">
            <div className="pf-banner-wrap">
              <div
                className="pf-banner"
                style={context.config.LOGO_WHITE_URL ? {
                  '--pf-banner-logo': `url(${context.config.LOGO_WHITE_URL})`,
                } : undefined}
              />
            </div>
            <div className="pf-id">
              <ProfileAvatar
                src={profileImage.src}
                isDefault={profileImage.isDefault}
                onSave={handleSaveProfilePhoto}
                onDelete={handleDeleteProfilePhoto}
                savePhotoState={savePhotoState}
                isEditable={isAuthenticatedUserProfile()}
              />
              <h1 data-hj-suppress className="pf-user">
                {params.username}
              </h1>
              {isBlockVisible(name) && (
                <p data-hj-suppress className="pf-name">
                  {name}
                </p>
              )}
              <div className="pf-facts">
                <DateJoined date={dateJoined} />
                <UserCertificateSummary count={courseCertificates?.length || 0} />
              </div>
              <div className="pf-records">
                {renderViewMyRecordsButton()}
              </div>
            </div>
          </div>
          {renderPhotoUploadErrorMessage()}
          <div className="pf-page">
            <p className="pf-h2">
              {isMobileView ? (
                <FormattedMessage
                  id="profile.profile.information"
                  defaultMessage="Profile"
                  description="heading for the editable profile section in mobile view"
                />
              )
                : (
                  <FormattedMessage
                    id="profile.profile.information"
                    defaultMessage="Profile <accent>information</accent>"
                    description="heading for the editable profile section"
                    values={{ accent: renderAccent }}
                  />
                )}
            </p>
            <div className="pf-grid">
              <div className="pf-col">
                <div className="pf-field">
                  <div className="row m-0 pb-1.5 align-items-center">
                    <p data-hj-suppress className="h5 font-weight-bold m-0">
                      {intl.formatMessage(messages['profile.username'])}
                    </p>
                    <OverlayTrigger
                      key="top"
                      placement="top"
                      overlay={(
                        <Tooltip variant="light" id="tooltip-top">
                          <p className="h5 font-weight-normal m-0 p-0">
                            {intl.formatMessage(messages['profile.username.tooltip'])}
                          </p>
                        </Tooltip>
                        )}
                    >
                      <InfoOutline className="m-0 info-icon" />
                    </OverlayTrigger>
                  </div>
                  <h4 className="edit-section-header text-gray-700">
                    {params.username}
                  </h4>
                </div>
                {isBlockVisible(name) && (
                <Name
                  name={name}
                  accountSettingsUrl={context.config.ACCOUNT_SETTINGS_URL}
                  visibilityName={visibilityName}
                  formId="name"
                  {...commonFormProps}
                />
                )}
                {isBlockVisible(country) && (
                <Country
                  country={country}
                  visibilityCountry={visibilityCountry}
                  formId="country"
                  {...commonFormProps}
                />
                )}
                {isBlockVisible((languageProficiencies || []).length) && (
                <PreferredLanguage
                  languageProficiencies={languageProficiencies || []}
                  visibilityLanguageProficiencies={visibilityLanguageProficiencies}
                  formId="languageProficiencies"
                  {...commonFormProps}
                />
                )}
                {isBlockVisible(levelOfEducation) && (
                <Education
                  levelOfEducation={levelOfEducation}
                  visibilityLevelOfEducation={visibilityLevelOfEducation}
                  formId="levelOfEducation"
                  {...commonFormProps}
                />
                )}

                <AdditionalProfileFieldsSlot />
              </div>
              <div className="pf-col">
                {isBlockVisible(bio) && (
                <Bio
                  bio={bio}
                  visibilityBio={visibilityBio}
                  formId="bio"
                  {...commonFormProps}
                />
                )}

                {isBlockVisible((socialLinks || []).some((link) => link?.socialLink !== null)) && (
                <SocialLinks
                  socialLinks={socialLinks || []}
                  draftSocialLinksByPlatform={draftSocialLinksByPlatform || {}}
                  visibilitySocialLinks={visibilitySocialLinks}
                  formId="socialLinks"
                  {...commonFormProps}
                />
                )}
              </div>
            </div>
          </div>
          <div className="pf-certs">
            {isBlockVisible((courseCertificates || []).length) && (
            <Certificates
              certificates={courseCertificates || []}
              formId="certificates"
            />
            )}
          </div>
        </>
      )}
    </div>
  );
};

ProfilePage.propTypes = {
  params: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
  requiresParentalConsent: PropTypes.bool,
  dateJoined: PropTypes.string,
  username: PropTypes.string,
  bio: PropTypes.string,
  visibilityBio: PropTypes.string,
  courseCertificates: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),
  country: PropTypes.string,
  visibilityCountry: PropTypes.string,
  levelOfEducation: PropTypes.string,
  visibilityLevelOfEducation: PropTypes.string,
  languageProficiencies: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
  })),
  visibilityLanguageProficiencies: PropTypes.string,
  name: PropTypes.string,
  visibilityName: PropTypes.string,
  socialLinks: PropTypes.arrayOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  draftSocialLinksByPlatform: PropTypes.objectOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  visibilitySocialLinks: PropTypes.string,
  profileImage: PropTypes.shape({
    src: PropTypes.string,
    isDefault: PropTypes.bool,
  }),
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  savePhotoState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  isLoadingProfile: PropTypes.bool,
  photoUploadError: PropTypes.objectOf(PropTypes.string),
};

ProfilePage.defaultProps = {
  saveState: null,
  username: '',
  savePhotoState: null,
  photoUploadError: {},
  profileImage: {},
  name: null,
  levelOfEducation: null,
  country: null,
  socialLinks: [],
  draftSocialLinksByPlatform: {},
  bio: null,
  languageProficiencies: [],
  courseCertificates: [],
  requiresParentalConsent: null,
  dateJoined: null,
  visibilityName: null,
  visibilityCountry: null,
  visibilityLevelOfEducation: null,
  visibilitySocialLinks: null,
  visibilityLanguageProficiencies: null,
  visibilityBio: null,
  isLoadingProfile: false,
};

export default withParams(ProfilePage);
