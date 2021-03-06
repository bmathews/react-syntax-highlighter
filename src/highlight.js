import React from 'react';

const Text = ({ children }) => <span>{children}</span>;

function createStyleObject(classNames, style) {
  return classNames.reduce((styleObject, className) => {
    return {...styleObject, ...style[className]};
  }, {});
}

function createClassNameString(classNames) {
  return classNames.join(' ');
}

function createChildren(style, useInlineStyles) {
  let childrenCount = 0;
  return children => {
    childrenCount += 1;
    return children.map((child, i) => createElement({
      node: child,
      style,
      useInlineStyles,
      key:`code-segment-${childrenCount}-${i}`
    }));
  }
}

function createElement({ node, style, useInlineStyles, key }) {
  const { properties, type, tagName, value } = node;
  if (type === "text") {
    return <Text key={key}>{ value }</Text>;
  } else if (tagName) {
    const TagName = tagName;
    const childrenCreator = createChildren(style, useInlineStyles);
    const props = (
      useInlineStyles
      ?
      { style: createStyleObject(properties.className, style) }
      :
      { className: createClassNameString(properties.className) }
    );
    const children = childrenCreator(node.children);
    return <TagName key={key} {...props}>{children}</TagName>;
  }
}

export default function (lowlight, defaultStyle) {
 return function SyntaxHighlighter(props) {
    const {
      language,
      children,
      style = defaultStyle,
      customStyle = {},
      codeTagProps = {},
      useInlineStyles = true,
      ...rest
    } = props;
    const codeTree = lowlight.highlight(language, children);
    const defaultPreStyle = style.hljs || {backgroundColor: '#fff'};
    const preProps = (
      useInlineStyles
      ?
      Object.assign({}, rest, { style: Object.assign({}, defaultPreStyle, customStyle) })
      :
      Object.assign({}, rest, { className: 'hljs'})
    );

    return (
      <pre {...preProps}>
        <code {...codeTagProps}>
          {codeTree.value.map((node, i) => createElement({
            node,
            style,
            useInlineStyles,
            key: `code-segement${i}`
          }))}
        </code>
      </pre>
    );
  }
}
