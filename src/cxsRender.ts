// @flow
import * as classnames from 'classnames';
import cxs from 'cxs/monolithic';
import * as Prefixer from 'inline-style-prefixer';
import { compact, flattenDeep, isEmpty } from 'lodash';
import * as React from 'react';

const prefixer = new Prefixer();

export const prefixStyles = (styles: object) => prefixer.prefix(styles);

export const transformProps = ({
  style,
  className,
  ...rest,
}: {
    style?: object | object[],
    className?: string,
    rest?: any,
  } = {}) => {
  if (!style) {
    return {
      className,
      ...rest,
    };
  }

  let combinedCss;
  if (Array.isArray(style)) {
    const compactCss = compact(style);
    if (isEmpty(compactCss)) {
      return {
        className,
        ...rest,
      };
    }
    combinedCss = Object.assign({}, ...flattenDeep(compactCss));
  } else {
    combinedCss = style || {};
  }

  const cx = classnames(cxs(prefixStyles(combinedCss)), className);

  return {
    ...rest,
    className: cx,
  };
};

global.cxsReact = (tag: any, originalProps: any, ...children: any[]) => {
  let props = originalProps;
  if (!originalProps || typeof tag !== 'string') {
    // props = originalProps;
  } else {
    props = transformProps(originalProps);
  }

  return React.createElement(tag, props, ...children);
};

global.cxsReactClone = (tag: any, originalProps: any, ...children: any[]) => {
  const props = transformProps(originalProps);
  return React.cloneElement(tag, props, ...children);
};
