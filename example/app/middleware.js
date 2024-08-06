import { NextResponse } from 'next/server';
import { router } from 'next/router';

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/static')) {
    return NextResponse.rewrite(`${router.basePath}${request.url}`);
  }
}
