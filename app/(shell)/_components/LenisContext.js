'use client';
import { createContext, useContext } from 'react';

const LenisRefContext = createContext(null);

function useLenisRef() {
  return useContext(LenisRefContext);
}

export { LenisRefContext, useLenisRef };
