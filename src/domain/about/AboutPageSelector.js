import { createStructuredSelector } from 'reselect';

import { currentLanguageSelector } from '../../../app/state/selectors/translationSelectors';

const aboutPageSelector = createStructuredSelector({
  currentLanguage: currentLanguageSelector,
});

export default aboutPageSelector;
