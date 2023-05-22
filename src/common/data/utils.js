import get from 'lodash/get';
import values from 'lodash/values';
import pickBy from 'lodash/pickBy';
import camelCase from 'lodash/camelCase';

import constants from '../../../app/constants/AppConstants';

export const getLocalizedFieldValue = (field, locale, fallback = false) => {
  const localeValue = get(field, locale, null);

  if (localeValue) {
    return localeValue;
  }

  if (fallback) {
    return values(field).find(fallbackValue => !!fallbackValue);
  }

  if (locale !== constants.DEFAULT_LOCALE) {
    return getLocalizedFieldValue(field, constants.DEFAULT_LOCALE, false);
  }

  return localeValue;
};

/**
 * Trim empty values from data object
 *
 * @param {Object} data
 * @returns {Object} Trimmed empty values object
 */

export const parseData = (data) => {
  return pickBy(data, value => value || value === 0);
};

export const toCamelCase = (obj) => {
  if (!obj) return {};

  const camelCasedObj = {};

  Object.keys(obj).forEach((key) => {
    const camelCasedKey = camelCase(key);
    camelCasedObj[camelCasedKey] = obj[key];
  });

  return camelCasedObj;
};
