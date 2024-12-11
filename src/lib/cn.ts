import clsx, { ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-d1',
        'text-d2',
        'text-d3',
        'text-d4',
        'text-h1',
        'text-h2',
        'text-h3',
        'text-h4',
        'text-h5',
        'text-b1',
        'text-b2',
        'text-b3',
        'text-b4',
        'text-c1',
        'text-c2',
        'text-c3',
        'text-c4',
      ],
    },
  },
});

/** Merge classes with tailwind-merge with clsx full feature */
function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

export default cn;
