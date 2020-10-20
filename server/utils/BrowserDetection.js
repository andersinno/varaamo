import React from 'react';

/**
 * @description Check if user is using IE browser or old versions of Edge and if that's the case show browser unsupported messages
 *
 * @returns {JSX.Element}
 */
export default function BrowserDetection() {
  const scriptString = `

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');
    // 'Edge' is the user agent for old version of Edge
    // In new versions of Edge user agent is 'Edg'
    var edge = ua.indexOf('Edge');

    if (msie > 0 || trident > 0 || edge > 0) {

      var style = 'background-color: #ffec77; padding: .75rem 1.25rem; margin-bottom: 1rem;' +
      'border: 1px solid transparent; font-size: 16px; font-family: "Times"';

      var eng = 'Varaamo doesn’t support Internet Explorer or Edge Legacy browsers any more. Please use a ' +
      'newer browser such as <a href="https://www.google.com/chrome/"> Chrome</a>, ' +
      '<a href="https://www.mozilla.org/en-US/firefox/new/"> Firefox </a> or ' +
      '<a href="https://www.microsoft.com/en-us/windows/microsoft-edge"> Edge (Chromium)</a>.';

      var fin = 'Varaamo ei tue enää Internet Explorer tai Edge Legacy -selaimia. Käytä ' +
      'uudempaa selainta, kuten <a href="https://www.google.com/chrome/"> Chrome</a>, ' +
      '<a href="https://www.mozilla.org/en-US/firefox/new/"> Firefox </a> tai ' +
      '<a href="https://www.microsoft.com/en-us/windows/microsoft-edge"> Edge (Chromium)</a>.';

      var swe = 'Varaamo fungerar inte längre med Internet Explorer eller Edge Legacy. Så var vänligoch' +
      'använd en nyare browser som <a href="https://www.google.com/chrome/"> Chrome</a>,' +
      '<a href="https://www.mozilla.org/en-US/firefox/new/"> Firefox </a> eller' +
      '<a href="https://www.microsoft.com/en-us/windows/microsoft-edge"> Edge (Chromium)</a>.';

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
