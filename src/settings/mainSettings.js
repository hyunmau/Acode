import About from '../pages/about/about';
import editorSettings from './editorSettings';
import constants from '../lib/constants';
import backupRestore from './backupRestore';
import themeSetting from '../pages/themeSetting/themeSetting';
import otherSettings from './appSettings';
import defaultFormatter from './defaultFormatter';
import rateBox from '../components/dialogboxes/rateBox';
import Donate from '../pages/donate/donate';
import plugins from '../pages/plugins/plugins';
import settingsPage from '../components/settingPage';
import dialogs from '../components/dialogs';
import previewSettings from './previewSettings';

export default function settingsMain() {
  const title = strings.settings.capitalize();

  const items = [
    {
      key: 'about',
      text: strings.about,
      icon: 'acode',
      index: 0,
    },
    {
      key: 'donate',
      text: strings.support,
      icon: 'favorite',
      iconColor: 'orangered',
      sake: true,
      index: 1,
    },
    {
      key: 'editor-settings',
      text: strings['editor settings'],
      icon: 'text_format',
      index: 3,
    },
    {
      key: 'app-settings',
      text: strings['app settings'],
      icon: 'tune',
      index: 2,
    },
    {
      key: 'formatter',
      text: strings.formatter,
      icon: 'stars',
    },
    {
      key: 'theme',
      text: strings.theme,
      icon: 'color_lenspalette',
    },
    {
      key: 'backup-restore',
      text: strings.backup.capitalize() + '/' + strings.restore.capitalize(),
      icon: 'cached',
    },
    {
      key: 'rateapp',
      text: strings['rate acode'],
      icon: 'googleplay'
    },
    {
      key: 'plugins',
      text: strings['plugins'],
      icon: 'extension',
    },
    {
      key: 'reset',
      text: strings['restore default settings'],
      icon: 'historyrestore',
      index: 5,
    },
    {
      key: 'preview',
      text: strings['preview settings'],
      icon: 'play_arrow',
      index: 4,
    }
  ];

  if (IS_FREE_VERSION) {
    items.push({
      key: 'removeads',
      text: strings['remove ads'],
      icon: 'cancel',
      link: constants.PAID_VERSION,
    });
  }

  async function callback(key) {
    switch (key) {
      case 'editor-settings':
        editorSettings();
        break;

      case 'theme':
        themeSetting();
        break;

      case 'about':
        About();
        break;

      case 'app-settings':
        otherSettings();
        break;

      case 'backup-restore':
        backupRestore();
        break;

      case 'donate':
        Donate();
        break;

      case 'rateapp':
        rateBox();
        break;

      case 'plugins':
        plugins();
        break;

      case 'formatter':
        defaultFormatter();
        break;

      case 'preview':
        previewSettings();
        break;

      case 'reset':
        const confirmation = await dialogs.confirm(strings.warning, strings['restore default settings']);
        if (confirmation) {
          await appSettings.reset();
          location.reload();
        }
        break;

      default:
        break;
    }
  }

  settingsPage(title, items, callback);
}