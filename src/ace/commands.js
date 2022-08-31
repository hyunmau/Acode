import fsOperation from "../fileSystem/fsOperation";
import keyBindings from "../lib/keyBindings";
import helpers from "../utils/helpers";

export default async function Commands() {
  const { clipboard } = cordova.plugins;
  const {
    commandKeyBinding,
    commands: defaultCommands,
  } = ace.require("ace/commands/default_commands");
  let keyboardShortcuts = keyBindings;

  try {
    const bindingsFile = fsOperation(KEYBINDING_FILE);
    if (await bindingsFile.exists()) {
      const bindings = await bindingsFile.readFile('json');
      keyboardShortcuts = bindings;
    } else {
      helpers.resetKeyBindings();
    }
  } catch (error) {
    console.error(error);
    helpers.resetKeyBindings();
  }

  let commands = [
    {
      name: 'findFile',
      description: 'Find file in workspace',
      exec() {
        acode.exec('find-file');
      },
    },
    {
      name: 'closeCurrentTab',
      description: 'Close current tab',
      exec() {
        acode.exec('close-current-tab');
      },
    },
    {
      name: 'closeAllTabs',
      description: 'Close all tabs',
      exec() {
        acode.exec('close-all-tabs');
      },
    },
    {
      name: 'newFile',
      description: 'Create new file',
      exec() {
        acode.exec('new-file');
      },
      readOnly: true,
    },
    {
      name: 'openFile',
      description: 'Open a file',
      exec() {
        acode.exec('open-file');
      },
      readOnly: true,
    },
    {
      name: 'openFolder',
      description: 'Open a folder',
      exec() {
        acode.exec('open-folder');
      },
      readOnly: true,
    },
    {
      name: 'saveFile',
      description: 'Save current file',
      exec() {
        acode.exec('save');
      },
      readOnly: true,
    },
    {
      name: 'saveFileAs',
      description: 'Save as current file',
      exec() {
        acode.exec('save-as');
      },
      readOnly: true,
    },
    {
      name: 'nextFile',
      description: 'Open next file tab',
      exec() {
        acode.exec('next-file');
      },
    },
    {
      name: 'prevFile',
      description: 'Open previous file tab',
      exec() {
        acode.exec('prev-file');
      },
    },
    {
      name: 'showSettingsMenu',
      description: 'Show settings menu',
      exec() {
        acode.exec('open', 'settings');
      },
      readOnly: true,
    },
    {
      name: 'renameFile',
      description: 'Rename active file',
      exec() {
        acode.exec('rename');
      },
      readOnly: true,
    },
    {
      name: 'run',
      description: 'Preview HTML and MarkDown',
      exec() {
        acode.exec('run');
      },
      readOnly: true,
    },
    {
      name: 'toggleFullscreen',
      description: 'Toggle full screen mode',
      exec() {
        acode.exec('toggle-fullscreen');
      },
    },
    {
      name: 'toggleSidebar',
      description: 'Toggle sidebar',
      exec() {
        acode.exec('toggle-sidebar');
      },
    },
    {
      name: 'toggleMenu',
      description: 'Toggle main menu',
      exec() {
        acode.exec('toggle-menu');
      },
    },
    {
      name: 'toggleEditMenu',
      description: 'Toggle edit menu',
      exec() {
        acode.exec('toggle-editmenu');
      },
    },
    {
      name: 'selectall',
      description: 'Select all',
      exec(editor) {
        editor.selectAll();
      },
      readOnly: true,
    },
    {
      name: 'gotoline',
      description: 'Go to line...',
      exec() {
        acode.exec('goto');
      },
      readOnly: true,
    },
    {
      name: 'find',
      description: 'Find',
      exec() {
        acode.exec('find');
      },
      readOnly: true,
    },
    {
      name: 'copy',
      description: 'Copy',
      exec(editor) {
        let copyText = editor.getCopyText();
        clipboard.copy(copyText);
        toast(strings['copied to clipboard']);
      },
      readOnly: true,
    },
    {
      name: 'cut',
      description: 'Cut',
      exec(editor) {
        let cutLine =
          editor.$copyWithEmptySelection && editor.selection.isEmpty();
        let range = cutLine
          ? editor.selection.getLineRange()
          : editor.selection.getRange();
        editor._emit('cut', range);
        if (!range.isEmpty()) {
          let copyText = editor.session.getTextRange(range);
          clipboard.copy(copyText);
          toast(strings['copied to clipboard']);
          editor.session.remove(range);
        }
        editor.clearSelection();
      },
      scrollIntoView: 'cursor',
      multiSelectAction: 'forEach',
    },
    {
      name: 'paste',
      description: 'Paste',
      exec() {
        clipboard.paste((text) => {
          editorManager.editor.$handlePaste(text);
        });
      },
      scrollIntoView: 'cursor',
    },
    {
      name: 'replace',
      description: 'Replace',
      exec() {
        acode.exec('replace');
      },
    },
    {
      name: 'openCommandPallete',
      description: 'Open command pallete',
      exec() {
        acode.exec('command-pallete');
      },
      readOnly: true,
    },
    {
      name: 'modeSelect',
      description: 'Change language mode...',
      exec() {
        acode.exec('syntax');
      },
      readOnly: true,
    },
  ];

  commands.forEach((command) => {
    defineKeyBinding(command);
  });

  defaultCommands.forEach((command) => {
    if ('bindKey' in command) {
      delete command.bindKey;
    }
    defineKeyBinding(command);
    const exists = commands.find((c) => c.name === command.name);
    if (exists) return;
    commands.push(command);
  });

  return commands;

  function defineKeyBinding(command) {
    Object.defineProperty(command, 'bindKey', {
      configurable: true,
      get() {
        const key = keyboardShortcuts[this.name]?.key;
        if (key && commandKeyBinding) {
          const keys = key.split('|');
          keys.forEach((k) => {
            if (k in commandKeyBinding) {
              delete commandKeyBinding[k];
            }
          });
        }
        return {
          win: key,
        }
      },
    });
    return command;
  }
}