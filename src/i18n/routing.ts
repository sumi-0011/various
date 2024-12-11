import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  localePrefix: 'as-needed',
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
