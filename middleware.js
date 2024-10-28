import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getToken } from 'next-auth/jwt';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'your_jwt_secret_key';

// async function verifyToken(token) {
//   try {
//     return payload;
//   } catch (error) {
//     console.error("Token verification failed:", error.message);
//     return null;
//   }
// }


export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/api/users/tasks'];

  // If the request matches a protected route
  if (protectedRoutes.includes(pathname)) {
    // Initialize a response instance to modify cookies
    const res = NextResponse.next();

    // Check for JWT token in the Authorization header
    const token = req.headers.get('authorization')?.split(' ')[1];
    
    if (token) {
      console.log("works1")
      try {
        // Verify the JWT token
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

        // const payload = await verifyToken(token);
   
        console.log("token1",token,payload)
        
        // Set a cookie with the decoded JWT payload
        res.cookies.set('userSession', JSON.stringify(payload), { 
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production', 
          path: '/', 
          sameSite: 'strict' 
        });
        return res; // Return response with JWT cookie set if verified successfully
      } catch (error) {
      console.log("works2err")

        console.error('JWT verification failed:', error.message);
      }
    }

    // If no JWT, fallback to NextAuth session
    const session = await getToken({ req });
    if (session) {
      console.log("works3session")
      res.cookies.set('userSession', JSON.stringify(session), { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        path: '/', 
        sameSite: 'strict' 
      });
      return res; // Return response with session cookie set
    } else {
      // Redirect to login if no valid JWT or session
      const loginUrl = new URL('/login', req.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow all other routes to continue
  return NextResponse.next();
}

// Configure middleware to match specific routes
export const config = {
  matcher: '/api/:path*',
};
