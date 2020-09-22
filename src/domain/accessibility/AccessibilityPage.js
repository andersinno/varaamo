import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';

import PageWrapper from '../../../app/pages/PageWrapper';
import injectT from '../../../app/i18n/injectT';
import constants from '../../../app/constants/AppConstants';

function AccessibilityPage({ t }) {
  const href = `${constants.FEEDBACK_URL}`;

  return (
    <PageWrapper className="about-page" title={t('AccessibilityPage.title')}>
      <div className="app-aboutPage">
        <h1>{t('AccessibilityPage.title')}</h1>
        <p>
          <FormattedHTMLMessage id="AccessibilityPage.statement" />
        </p>

        <h3>{t('AccessibilityPage.siteLegislationHeader')}</h3>
        <p>
          <FormattedHTMLMessage id="AccessibilityPage.siteLegislationContent" />
        </p>

        <h3>{t('AccessibilityPage.complianceSituationHeader')}</h3>
        <p>
          <FormattedHTMLMessage id="AccessibilityPage.complianceSituationContent" />
        </p>

        <h3>{t('AccessibilityPage.unreachableContentHeader')}</h3>
        <p>
          {t('AccessibilityPage.unreachableContent')}
        </p>

        <h3>{t('AccessibilityPage.authenticationServiceHeader')}</h3>
        <p>
          {t('AccessibilityPage.authenticationServiceContent')}
        </p>

        <h3>{t('AccessibilityPage.deficienciesAndCorrectionsHeader')}</h3>
        <p>
          <FormattedHTMLMessage id="AccessibilityPage.deficienciesAndCorrectionsContent" />
        </p>

        <h3>{t('AccessibilityPage.graphicElementsHeader')}</h3>
        <p>
          <FormattedHTMLMessage id="AccessibilityPage.graphicElementsContent" />
        </p>

        <h3>{t('AccessibilityPage.assessmentHeader')}</h3>
        <p>
          <FormattedHTMLMessage id="AccessibilityPage.assessmentContent" />
        </p>

        <h3>{t('AccessibilityPage.reachabilityStatementHeader')}</h3>
        <p>
          {t('AccessibilityPage.reachabilityStatementContent')}
        </p>

        <h3>{t('AccessibilityPage.FeedbackAndContactInformationHeader')}</h3>
        <p>
          <FormattedHTMLMessage id="AccessibilityPage.FeedbackAndContactInformationContent" values={{ href }} />
        </p>

        <h3>{t('AccessibilityPage.legalProtectionHeader')}</h3>
        <p>
          <FormattedHTMLMessage id="AccessibilityPage.legalProtectionContent" />
        </p>

        <h3>{t('AccessibilityPage.improvementHeader')}</h3>
        <p>
          <FormattedHTMLMessage id="AccessibilityPage.improvementContent" />
        </p>

        <br />
      </div>
    </PageWrapper>
  );
}

AccessibilityPage.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(AccessibilityPage);
