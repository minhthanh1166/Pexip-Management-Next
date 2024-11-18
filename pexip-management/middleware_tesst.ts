// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   // const path = request.nextUrl.pathname;

//   // Kiểm tra user role từ session hoặc token
//   const userRole = request.cookies.get("userRole")?.value;
//   console.log("userRole", userRole);
  

//   // if (path.startsWith("/operator") && userRole !== "operator") {
//   //   return NextResponse.redirect(new URL("/unauthorized", request.url));
//   // }

//   // if (path.startsWith("/administrator") && userRole !== "administrator") {
//   //   return NextResponse.redirect(new URL("/unauthorized", request.url));
//   // }

//   return NextResponse.next();
// }
