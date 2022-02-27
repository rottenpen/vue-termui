import Yoga from 'yoga-layout-prebuilt'
import { DOMElement, DOMNode, getMaxWidth } from './dom'
import widestLine from 'widest-line'
import indentString from 'indent-string'
import { wrapText } from './text'
import { squashTextNodes } from './text'
// import renderBorder from './render-border'
import { Output, OutputTransformer } from './Output'

// If parent container is `<Box>`, text nodes will be treated as separate nodes in
// the tree and will have their own coordinates in the layout.
// To ensure text nodes are aligned correctly, take X and Y of the first text node
// and use it as offset for the rest of the nodes
// Only first node is taken into account, because other text nodes can't have margin or padding,
// so their coordinates will be relative to the first node anyway
const applyPaddingToText = (node: DOMNode, text: string): string => {
  if ('childNodes' in node && node.childNodes[0]?.yogaNode) {
    const yogaNode = node.childNodes[0]?.yogaNode
    const offsetX = yogaNode.getComputedLeft()
    const offsetY = yogaNode.getComputedTop()
    text = '\n'.repeat(offsetY) + indentString(text, offsetX)
  }

  return text
}

// After nodes are laid out, render each to output object, which later gets rendered to terminal
const renderNodeToOutput = (
  node: DOMNode,
  output: Output,
  options: {
    offsetX?: number
    offsetY?: number
    transformers?: OutputTransformer[]
    skipStaticElements: boolean
  }
) => {
  const {
    offsetX = 0,
    offsetY = 0,
    transformers = [],
    skipStaticElements,
  } = options

  if (skipStaticElements && node.internal_static) {
    return
  }

  const { yogaNode } = node

  if (yogaNode) {
    if (yogaNode.getDisplay() === Yoga.DISPLAY_NONE) {
      return
    }

    // Left and top positions in Yoga are relative to their parent node
    const x = offsetX + yogaNode.getComputedLeft()
    const y = offsetY + yogaNode.getComputedTop()

    // Transformers are functions that transform final text output of each component
    // See Output class for logic that applies transformers
    let newTransformers = transformers

    if (typeof node.internal_transform === 'function') {
      newTransformers = [node.internal_transform, ...transformers]
    }

    if (node.nodeName === '#text') {
      // TODO: remove this, only allow text inside Text or span component
      let text = node.nodeValue

      if (text.length > 0) {
        const currentWidth = widestLine(text)
        const maxWidth = getMaxWidth(yogaNode)

        if (currentWidth > maxWidth) {
          const textWrap = node.style.textWrap ?? 'wrap'
          text = wrapText(text, maxWidth, textWrap)
        }

        text = applyPaddingToText(node, text)
        // console.log('#text', { text, maxWidth })
        output.write(x, y, text, { transformers: newTransformers })
      }

      return
    } else if (node.nodeName === 'tui-text') {
      let text = squashTextNodes(node)

      if (text.length > 0) {
        const currentWidth = widestLine(text)
        const maxWidth = getMaxWidth(yogaNode)

        if (currentWidth > maxWidth) {
          const textWrap = node.style.textWrap ?? 'wrap'
          text = wrapText(text, maxWidth, textWrap)
        }

        text = applyPaddingToText(node, text)
        output.write(x, y, text, { transformers: newTransformers })
      }

      return
    } else if (node.nodeName === 'tui-root') {
      for (const childNode of node.childNodes) {
        renderNodeToOutput(childNode, output, {
          offsetX: x,
          offsetY: y,
          transformers: newTransformers,
          skipStaticElements,
        })
      }
    }

    // if (node.nodeName === 'tui-box') {
    // renderBorder(x, y, node, output)
    // }
  }
}

export default renderNodeToOutput
