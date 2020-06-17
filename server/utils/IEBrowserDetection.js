import React from 'react';

/**
 * @description Check if user is using IE browser and if that's the case show browser unsupported messages
 *
 * @returns {boolean}
 */
export default function IEBrowserDetection() {
  const scriptString = `

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');

    if (msie > 0 || trident > 0) {

      var style = 'background-color: #ffec77; padding: .75rem 1.25rem; margin-bottom: 1rem;' +
      'border: 1px solid transparent; font-size: 16px; font-family: "Times"';

      var eng = 'Varaamo doesn’t support Internet Explorer any more. Please use a ' +
      'newer browser such as <a href="https://www.google.com/chrome/"> Chrome</a>, ' +
      '<a href="https://www.mozilla.org/en-US/firefox/new/"> Firefox </a> or ' +
      '<a href="https://www.microsoft.com/en-us/windows/microsoft-edge"> Edge</a>.';

      var fin = 'Varaamo ei tue enää Internet Explorer -selainta. Käytä jotain ' +
      'uudempaa selainta, kuten <a href="https://www.google.com/chrome/"> Chrome</a>, ' +
      '<a href="https://www.mozilla.org/en-US/firefox/new/"> Firefox </a> tai ' +
      '<a href="https://www.microsoft.com/en-us/windows/microsoft-edge"> Edge</a>.';

      var swe = 'Varaamo fungerar inte längre med Internet Explorer. Så var vänlig' +
      'och använd en nyare  browser som <a href="https://www.google.com/chrome/"> Chrome</a>,' +
      '<a href="https://www.mozilla.org/en-US/firefox/new/"> Firefox </a> eller' +
      '<a href="https://www.microsoft.com/en-us/windows/microsoft-edge"> Edge</a>.';

      var array = [fin, eng, swe];
      array.forEach(function (text, index) {
          var tag = document.createElement("p");
          tag.innerHTML = text;
          tag.setAttribute("style", style);
          document.getElementById("root").appendChild(tag);
      });
    }
  `;

  // eslint-disable-next-line react/react-in-jsx-scope
  return <script dangerouslySetInnerHTML={{ __html: scriptString }} />;
}
