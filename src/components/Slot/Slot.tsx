/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React from 'react';

type AnyProps = Record<string, any>;

type SlotProps = React.HTMLAttributes<HTMLElement>;

function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged = { ...childProps };

  Object.keys(slotProps).forEach((prop) => {
    if (prop === 'className') {
      // className 병합
      const slotClass = slotProps[prop];
      const childClass = childProps[prop];
      merged.className = [slotClass, childClass].filter(Boolean).join(' ');
    } else if (prop === 'style') {
      // style 객체 병합
      merged.style = { ...slotProps[prop], ...childProps[prop] };
    } else if (prop.startsWith('on') && typeof slotProps[prop] === 'function') {
      // 이벤트 핸들러 합성
      const existingHandler = childProps[prop];
      if (existingHandler) {
        merged[prop] = (...args: unknown[]) => {
          existingHandler(...args);
          slotProps[prop](...args);
        };
      } else {
        merged[prop] = slotProps[prop];
      }
    } else {
      // 기타 props 덮어쓰기
      merged[prop] = slotProps[prop];
    }
  });

  return merged;
}

// Ref 합성 함수
function composeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref != null) {
        // eslint-disable-next-line no-param-reassign
        (ref as React.MutableRefObject<T>).current = node;
      }
    });
  };
}

const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;

  if (!children) {
    return null;
  }

  // 문자열이나 숫자인 경우 span으로 감싸기
  if (
    typeof children === 'string' ||
    typeof children === 'number' ||
    (Array.isArray(children) && children.length === 0)
  ) {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <span {...slotProps} ref={forwardedRef as React.Ref<HTMLSpanElement>}>
        {children}
      </span>
    );
  }

  // 단일 자식 엘리먼트 확인
  const childElement = React.Children.only(children) as React.ReactElement;
  // 자식 엘리먼트의 props와 slot props 병합
  const mergedProps = mergeProps(slotProps, childElement.props as AnyProps);
  // ref 합성
  const composedRef = composeRefs(forwardedRef, (childElement as any).ref);

  return React.cloneElement(childElement, {
    ...mergedProps,
    ref: composedRef,
  } as React.HTMLAttributes<HTMLElement>);
});

Slot.displayName = 'Slot';

export default Slot;
