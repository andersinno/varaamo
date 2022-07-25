import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { clearSearchResults } from '../../../app/actions/searchActions';
import { isAdminSelector, isLoggedInSelector } from '../../../app/state/selectors/authSelectors';
import changeLocale from '../../../app/i18n/changeLocale';
import constants from '../../../app/constants/AppConstants';
import MainNavbar from './MainNavbar';

export const selector = createStructuredSelector({
  isAdmin: isAdminSelector,
  isLoggedIn: isLoggedInSelector,
  respaAdminUrl: () => {
    return constants.SHOW_TEST_SITE_MESSAGE
      ? 'https://respa.tampere.fi/ra/'
      : 'https://dev-respa.tampere.fi/ra/';
  },
});

const actions = {
  changeLocale,
  clearSearchResults,
};

export default connect(selector, actions)(MainNavbar);
