'use client';

import React, { useEffect, useState, useCallback } from 'react';

export const useDisableScroll = (on: boolean) => {
  useEffect(() => {
    // TODO: Bootstrap, need to change when bootstrap is deleted.
    if (on) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');
  }, [on]);
};

export const useBodyScrollLock = () => {
  let scrollPosition = 0;

  const lockScroll = useCallback(() => {
    // for IOS safari
    scrollPosition = window.pageYOffset;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
  }, []);

  const openScroll = useCallback(() => {
    // for IOS safari
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    window.scrollTo(0, scrollPosition);
  }, []);

  return { lockScroll, openScroll };
};
