import googleIcon from '../../assets/icons/google.svg';
import pikiIcon from '../../assets/icons/piki.png';
import suomiFiIcon from '../../assets/icons/suomiFi.svg';

/*
Mapping of resource authentication level with the corresponding allowed login methods.
If this mapping is updated backend mapping needs updating too and vice version.
The order of loginMethodNames and loginMethodIcons should match since the title/alt for
icons is used from loginMethodNames.

Users logged in with higher level of authentication can reserve resources that needs the
same or lower level of authentication. E.g. User logged in with Suomi.fi (strong strength
auth) can reserve resources that have strong/mid/weak/none as authentication level. PIKI is
an exception here. The resource that needs piki authentication can only be reserved
with PIKI login. However, with PIKI login one can reserve resources with auth level
of piki/mid/weak/none.
*/
export const RESOURCE_AUTHENTICATION_GROUPING = {
  'strong': {
    loginMethodNames: ['Suomi.fi'],
    loginMethodIcons: [suomiFiIcon],
    canReserveWith: ['suomifi', 'tampere_adfs', 'tampereazuread'],
  },
  'PIKI': {
    loginMethodNames: ['PIKI-kirjastokortti'],
    loginMethodIcons: [pikiIcon],
    canReserveWith: ['axiell_aurora', 'tampere_adfs', 'tampereazuread'],
  },
  'mid': {
    loginMethodNames: ['Suomi.fi', 'PIKI-kirjastokortti'],
    loginMethodIcons: [suomiFiIcon, pikiIcon],
    canReserveWith: [
      'suomifi',
      'axiell_aurora',
      'tampere_adfs',
      'tampereazuread',
    ],
  },
  'weak': {
    loginMethodNames: [
      'Suomi.fi',
      'PIKI-kirjastokortti',
      'Google',
    ],
    loginMethodIcons: [
      suomiFiIcon,
      pikiIcon,
      googleIcon,
    ],
    canReserveWith: [
      'suomifi',
      'axiell_aurora',
      'google',
      'tampere_adfs',
      'tampereazuread',
    ],
  },
};

export const LOGIN_METHODS_NAMES = {
  'suomifi': 'Suomifi',
  'axiell_aurora': 'PIKI',
  'tampere_adfs': 'Tampere Adfs',
  'google': 'Google',
  'tampereazuread': 'Azure AD',
};
