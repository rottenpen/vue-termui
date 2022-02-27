import Yoga from 'yoga-layout-prebuilt'
import type { OutputTransformer } from './Output'
import { Styles } from './styles'
import { measureTextNode } from './text'

export class TuiNode {
  parentNode: DOMElement | null
  yogaNode?: Yoga.YogaNode
  internal_static?: boolean
  internal_transform?: OutputTransformer
  style: Styles = {}

  constructor(parentNode: DOMElement | null) {
    this.parentNode = parentNode
  }
}

export type DOMElementName = 'tui-text' | 'tui-virtual-text' | 'tui-root'
export type NodeName = DOMElementName | '#text' | '#comment'

export class DOMElement extends TuiNode {
  nodeName: DOMElementName
  childNodes: DOMNode[] = []
  staticNode?: DOMElement

  constructor(nodeName: DOMElementName, parentNode: DOMElement | null = null) {
    super(parentNode)
    this.nodeName = nodeName

    if (nodeName !== 'tui-virtual-text') {
      this.yogaNode = Yoga.Node.create()
      if (nodeName === 'tui-text') {
        this.yogaNode.setMeasureFunc(measureTextNode.bind(null, this))
      }
    }
  }
}

export class TextNode extends TuiNode {
  nodeName = '#text' as const
  nodeValue: string

  constructor(nodeValue: string, parentNode: DOMElement | null = null) {
    super(parentNode)
    this.nodeValue = nodeValue
  }
}

export class CommentNode extends TuiNode {
  nodeName = '#comment' as const
  nodeValue: string

  constructor(nodeValue: string, parentNode: DOMElement | null = null) {
    super(parentNode)
    this.nodeValue = nodeValue
  }
}

export type DOMNode<T = { nodeName: NodeName }> = T extends {
  nodeName: infer U
}
  ? U extends '#text'
    ? TextNode
    : U extends '#comment'
    ? CommentNode
    : DOMElement
  : never

// export function createDOMNode<N extends NodeName>(nodeName: N): DOMNode<N> {
//   return {
//     nodeName,
//     parentNode: null,
//     childNodes: [],
//   }
// }

export function getMaxWidth(yogaNode: Yoga.YogaNode) {
  return (
    yogaNode.getComputedWidth() -
    yogaNode.getComputedPadding(Yoga.EDGE_LEFT) -
    yogaNode.getComputedPadding(Yoga.EDGE_RIGHT) -
    yogaNode.getComputedBorder(Yoga.EDGE_LEFT) -
    yogaNode.getComputedBorder(Yoga.EDGE_RIGHT)
  )
}
