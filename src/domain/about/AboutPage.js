import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';

import AboutPartners from './AboutPartners';
import PageWrapper from '../../../app/pages/PageWrapper';
import FeedbackLink from '../../../app/shared/feedback-link/FeedbackLink';
import injectT from '../../../app/i18n/injectT';
import { getCurrentCustomization } from '../../../app/utils/customizationUtils';

function AboutPage({ t }) {
  const city = getCurrentCustomization() ? getCurrentCustomization().toLowerCase() : 'default';
  // TODO: Remove me along with getCurrentCustomization stuff.

  return (
    <PageWrapper className="about-page" title={t('AboutPage.title')}>
      <div className="app-aboutPage">
        <h1>{t(`AboutPageContent.${city}Header`)}</h1>
        <p><FormattedHTMLMessage id="AboutPageContent.tampereText" /></p>
        <p>
          <FeedbackLink>{t('AboutPageContent.feedbackLink')}</FeedbackLink>
        </p>

        <h3>{t('AboutPageContent.customerRegisterHeader')}</h3>
        <p>
          {t('AboutPageContent.customerRegisterParagraph')}
          <a href="https://app.helmet-kirjasto.fi/varaamo/rekisteriseloste.php">
            {t('AboutPageContent.customerRegisterLink')}
          </a>
        </p>
        <br />
      </div>
    </PageWrapper>
  );
}

AboutPage.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(AboutPage);
