// app/hooks/useCartSync.ts
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/app/store/cartStore";

/**
 * Hook to automatically sync cart with backend when user logs in
 * Call this in your root layout or a top-level component
 */
export function useCartSync() {
  const { data: session, status } = useSession();
  const { loadFromBackend, syncWithBackend, isSynced, items } = useCartStore();

  useEffect(() => {
    // Wait for auth to resolve
    if (status === "loading") return;

    // User is logged in
    if (session?.user && !isSynced) {
      const hasLocalItems = items.length > 0;

      if (hasLocalItems) {
        // User has items in local storage, sync them to backend
        console.log("📤 Syncing local cart to backend...");
        syncWithBackend();
      } else {
        // Load cart from backend
        console.log("📥 Loading cart from backend...");
        loadFromBackend();
      }
    }
  }, [session, status, isSynced]);
}


// ============= USAGE EXAMPLE =============
// In your app/layout.tsx:
//
// import { useCartSync } from "@/app/hooks/useCartSync";
//
// function CartSyncProvider({ children }: { children: React.ReactNode }) {
//   useCartSync();
//   return <>{children}</>;
// }
//
// export default function RootLayout({ children }) {
//   return (
//     <html>
//       <body>
//         <AuthSessionProvider>
//           <CartSyncProvider>
//             {children}
//           </CartSyncProvider>
//         </AuthSessionProvider>
//       </body>
//     </html>
//   );
// }