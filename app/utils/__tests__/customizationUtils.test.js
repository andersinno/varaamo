import settings from '../../../config/settings';
import { getCurrentCustomization } from '../customizationUtils';

describe('Utils: customizationUtils', () => {
  describe('getCurrentCustomization', () => {
    describe('when window.location.host does not match any customization', () => {
      test('returns DEFAULT_CUSTOMIZATION', () => {
        expect(getCurrentCustomization()).toBe(settings.DEFAULT_CUSTOMIZATION);
      });
    });
  });
});
