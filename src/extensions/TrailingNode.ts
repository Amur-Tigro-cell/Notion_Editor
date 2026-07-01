import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

/**
 * Ensures the document always ends with an empty paragraph,
 * preventing the cursor from getting stuck inside a code block
 * or heading at the end of the document.
 */
export const TrailingNode = Extension.create({
  name: 'trailingNode',

  addProseMirrorPlugins() {
    const plugin = new PluginKey('trailingNode')

    return [
      new Plugin({
        key: plugin,
        appendTransaction: (_, __, state) => {
          const { doc, tr, schema } = state
          const shouldInsert =
            doc.lastChild?.type !== schema.nodes.paragraph ||
            doc.lastChild?.content.size !== 0

          if (shouldInsert) {
            const paragraph = schema.nodes.paragraph.create()
            return tr.insert(doc.content.size, paragraph)
          }
          return null
        },
      }),
    ]
  },
})
