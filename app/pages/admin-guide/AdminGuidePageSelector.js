import { createStructuredSelector } from 'reselect';

import { currentLanguageSelector } from '../../state/selectors/translationSelectors';

const adminGuidePageSelector = createStructuredSelector({
  currentLanguage: currentLanguageSelector,
});

export default adminGuidePageSelector;
