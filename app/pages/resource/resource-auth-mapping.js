import facebookIcon from '../../assets/icons/facebook.svg';
import googleIcon from '../../assets/icons/google.svg';
import mobileIcon from '../../assets/icons/mobile.svg';
import pikiIcon from '../../assets/icons/piki.png';
import suomiFiIcon from '../../assets/icons/suomiFi.svg';
import yleIcon from '../../assets/icons/yle.svg';

/*
Mapping of resource authentication level with the corresponding allowed login methods.
If this mapping is updated backend mapping needs updating too and vice version.
The order of loginMethodNames and loginMethodIcons should match since the title/alt for
icons is used from loginMethodNames.

Users logged in with higher level of authentication can reserve resources that needs the
same or lower level of authentication. E.g. User logged in with phone (mid strength
auth) can reserve resources that have  mid/weak/none as authentication level. PIKI is
an exception here. The resource that needs piki authentication can only be reserved
with PIKI login. Howerver, with PIKI login one can reserve resources with auth level
of piki/mid/weak/none.
*/
export const RESOURCE_AUTHENTICATION_GROUPING = {
  'strong': {
    loginMethodNames: ['Suomi.fi'],
    loginMethodIcons: [suomiFiIcon],
  },
  'PIKI': {
    loginMethodNames: ['PIKI-kirjastokortti'],
    loginMethodIcons: [pikiIcon],
  },
  'mid': {
    loginMethodNames: ['Suomi.fi', 'Phone', 'PIKI-kirjastokortti'],
    loginMethodIcons: [suomiFiIcon, mobileIcon, pikiIcon],
  },
  'weak': {
    loginMethodNames: [
      'Suomi.fi',
      'PIKI-kirjastokortti',
      'Phone',
      'Google',
      'Facebook',
      'Yle Tunnus',
    ],
    loginMethodIcons: [
      suomiFiIcon,
      pikiIcon,
      mobileIcon,
      googleIcon,
      facebookIcon,
      yleIcon,
    ],
  },
};
