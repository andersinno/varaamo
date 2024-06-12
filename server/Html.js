/* eslint-disable react/no-danger */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
import isPlainObject from 'lodash/isPlainObject';
import pick from 'lodash/pick';

import BrowserDetection from './utils/BrowserDetection';
import settings, { ENV_NAMESPACE } from '../config/settings';

const CLIENT_ENV = [
  'API_URL',
  'SHOW_TEST_SITE_MESSAGE',
  'TRACKING',
  'CUSTOM_MUNICIPALITY_OPTIONS',
  'DEFAULT_CUSTOMIZATION',
  'DEFAULT_LOCALE',
  'TIME_ZONE',
  'FIREBASE',
];

class Html extends Component {
  getInitialStateHtml(initialState) {
    return `window.INITIAL_STATE = ${serialize(initialState)};`;
  }

  renderGtagCode(gtagId) {
    if (!gtagId) {
      return null;
    }

    const scriptString = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', '${gtagId}');
    `;
    const scriptSrc = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`;
    return (
      <div>
        <script async src={scriptSrc} />
        <script dangerouslySetInnerHTML={{ __html: scriptString }} />
      </div>
    );
  }

  renderMatomo() {
    if (!settings.MATOMO_CONTAINER_ID) {
      return null;
    }
    const scriptString = `
     var _mtm = window._mtm = window._mtm || [];
    _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src='https://matomo.tampere.fi/js/container_${settings.MATOMO_CONTAINER_ID}.js'; s.parentNode.insertBefore(g,s);
    `;
    return (
      <>
        <script dangerouslySetInnerHTML={{ __html: scriptString }} />
      </>
    );
  }

  renderStylesLink(appCssSrc, isProduction) {
    if (!isProduction) {
      return null;
    }

    return <link href={appCssSrc} rel="stylesheet" />;
  }

  render() {
    const {
      appCssSrc,
      appScriptSrc,
      initialState,
      isProduction,
      gtagId,
    } = this.props;
    const initialStateHtml = this.getInitialStateHtml(initialState);

    return (
      <html lang="fi">
        <head>
          <meta charSet="utf-8" />
          <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <link
            href="https://overpass-30e2.kxcdn.com/overpass.css"
            rel="stylesheet"
          />
          {this.renderStylesLink(appCssSrc, isProduction)}
          <title>Varaamo</title>
        </head>
        <body>
          <div id="root" />
          <script
            dangerouslySetInnerHTML={{
              __html: stringifyStateIntoWindow(ENV_NAMESPACE, pick(settings, CLIENT_ENV)),
            }}
          />
          {BrowserDetection()}
          <script dangerouslySetInnerHTML={{ __html: initialStateHtml }} />
          {/* eslint-disable-next-line max-len */}
          <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en-gb,Intl.~locale.fi,Intl.~locale.sv" />
          <script src={appScriptSrc} />
          {this.renderGtagCode(gtagId)}
          {this.renderMatomo()}
        </body>
      </html>
    );
  }
}

Html.propTypes = {
  appCssSrc: PropTypes.string.isRequired,
  appScriptSrc: PropTypes.string.isRequired,
  initialState: PropTypes.object.isRequired,
  isProduction: PropTypes.bool.isRequired,
  gtagId: PropTypes.string,
};

export default Html;

function getLine(path, value) {
  return `window.${path.join('.')} = ${JSON.stringify(value)};\n`;
}

function getLines(path = [], stateObject) {
  return Object.entries(stateObject).reduce((acc, [key, value]) => {
    if (value !== null && isPlainObject(value)) {
      return [
        ...acc,
        getLine([...path, key], {}),
        ...getLines([...path, key], value),
      ];
    }

    return [...acc, getLine([...path, key], value)];
  }, []);
}

function stringifyStateIntoWindow(key, stateObject) {
  let template = '';

  template += getLine([key], {});
  template += getLines([key], stateObject).join('');

  return template;
}
