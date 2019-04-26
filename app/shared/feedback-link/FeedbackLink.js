import constants from 'constants/AppConstants';

import PropTypes from 'prop-types';
import React from 'react';

import { getCurrentCustomization } from 'utils/customizationUtils';

function FeedbackLink({ children }) {
  const refUrl = window.location.href;
  const href = `${constants.FEEDBACK_URL}&ref=${refUrl}`;

  switch (getCurrentCustomization()) {
    case 'ESPOO': {
      return <a className="feedback-link" href={href}>{children}</a>;
    }

    default: {
      return <a className="feedback-link" href={href}>{children}</a>;
    }
  }
}

FeedbackLink.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FeedbackLink;
