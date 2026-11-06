import { useRef, useState } from 'react';

/* Works like useState, but ALSO keeps the newest value in a ref.

   Why? In React, after setState the variable still holds the OLD value until the next render.
   The chatbot adds a dish and immediately wants to show the updated cart, so it reads
   `ref.current`, which is always up to date.  Most components never need this: use plain useState. */
export function useSyncedState(initial) {
  const [value, setValue] = useState(initial);
  const ref = useRef(value);

  const set = next => {
    ref.current = typeof next === 'function' ? next(ref.current) : next;
    setValue(ref.current);
  };

  return [value, set, ref];
}
