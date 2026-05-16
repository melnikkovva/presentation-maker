import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textShadow: {
      setTextShadow: (textShadow: string) => ReturnType;
      unsetTextShadow: () => ReturnType;
    };
  }
}

export const TextShadow = Extension.create({
  name: 'textShadow',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textShadow: {
            default: null,
            parseHTML: element => element.style.textShadow,
            renderHTML: attributes => {
              if (!attributes.textShadow) {
                return {};
              }

              return {
                style: `text-shadow: ${attributes.textShadow}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setTextShadow: (textShadow: string) => ({ chain }) => {
        return chain()
          .setMark('textStyle', { textShadow })
          .run();
      },
      unsetTextShadow: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { textShadow: null })
          .removeEmptyTextStyle()
          .run();
      },
    };
  },
});