/**
 * Extracts the bearer token from the Authorization header
 * @param authHeader The Authorization header value
 * @returns The token if present, undefined otherwise
 */
export function extractBearerToken(authHeader: string | null): string | undefined {
  if (!authHeader) return undefined;
  const [type, token] = authHeader.split(' ');
  return type === 'Bearer' ? token : undefined;
}

/**
 * Extracts the refresh token from the cookie header or MSW cookie store
 * @param cookieHeader The Cookie header value
 * @returns The refresh token if present, undefined otherwise
 */
export function extractRefreshTokenFromCookie(cookieHeader: string | null): string | undefined {
  // First try to get from cookie header
  if (cookieHeader) {
    console.log('Processing cookies from header:', cookieHeader);
    const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
    const refreshTokenCookie = cookies.find((cookie) => cookie.startsWith('token='));
    if (refreshTokenCookie) {
      const token = refreshTokenCookie.split('=')[1];
      console.log('Found token in cookie header:', token);
      return token;
    }
  }

  // If not found in header, try MSW cookie store
  try {
    const mswCookieStore = localStorage.getItem('__msw-cookie-store__');
    if (mswCookieStore) {
      console.log('MSW cookie store raw:', mswCookieStore);
      const cookieStore = JSON.parse(mswCookieStore);

      // MSW cookie store is an array
      if (Array.isArray(cookieStore)) {
        // Get the most recent token cookie (last one in the array)
        const tokenCookies = cookieStore.filter((cookie) => cookie.key === 'token');
        if (tokenCookies.length > 0) {
          // Get the most recent cookie (last one)
          const latestCookie = tokenCookies[tokenCookies.length - 1];
          console.log('Found latest token in MSW cookie store:', latestCookie.value);

          // Clean up old cookies
          if (tokenCookies.length > 1) {
            console.log('Cleaning up old cookies');
            const newCookieStore = cookieStore.filter(
              (cookie) => cookie.key !== 'token' || cookie === latestCookie
            );
            localStorage.setItem('__msw-cookie-store__', JSON.stringify(newCookieStore));
          }

          return latestCookie.value;
        }
      }
    }
  } catch (error) {
    console.log('Error reading MSW cookie store:', error);
  }

  console.log('No refresh token found in cookies or MSW store');
  return undefined;
}
