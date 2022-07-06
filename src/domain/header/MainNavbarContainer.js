import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { clearSearchResults } from '../../../app/actions/searchActions';
import { isAdminSelector, isLoggedInSelector } from '../../../app/state/selectors/authSelectors';
import changeLocale from '../../../app/i18n/changeLocale';
import MainNavbar from './MainNavbar';

export const selector = createStructuredSelector({
  isAdmin: isAdminSelector,
  isLoggedIn: isLoggedInSelector,
  respaAdminUrl: () => {
    return process.env.NODE_ENV === 'production'
      ? 'https://respa.tampere.fi/ra/'
      : 'https://dev-respa.tampere.fi/ra/';
  },
});

const actions = {
  changeLocale,
  clearSearchResults,
};

export default connect(selector, actions)(MainNavbar);
