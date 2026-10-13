[1mdiff --git a/apps/web/src/layouts/MainLayout.tsx b/apps/web/src/layouts/MainLayout.tsx[m
[1mindex 750fec9..042b5f3 100644[m
[1m--- a/apps/web/src/layouts/MainLayout.tsx[m
[1m+++ b/apps/web/src/layouts/MainLayout.tsx[m
[36m@@ -1,3 +1,4 @@[m
[32m+[m[32m﻿[m
 import { useState } from "react";[m
 import type { ReactNode } from "react";[m
 [m
[36m@@ -64,7 +65,10 @@[m [mexport function MainLayout({[m
       <AppHeader />[m
 [m
       <div className="app-body">[m
[31m-        <Sidebar onNavigate={setCurrentPage} />[m
[32m+[m[32m        <Sidebar[m
[32m+[m[32m          currentPage={currentPage}[m
[32m+[m[32m          onNavigate={setCurrentPage}[m
[32m+[m[32m        />[m
 [m
         <main className="app-content">[m
           {renderPage()}[m
[36m@@ -72,4 +76,5 @@[m [mexport function MainLayout({[m
       </div>[m
     </div>[m
   );[m
[31m-}[m
\ No newline at end of file[m
[32m+[m[32m}[m
[41m+[m
