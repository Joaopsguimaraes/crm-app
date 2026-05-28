import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Public_Sans, Roboto } from "next/font/google";
import { Suspense, type ReactNode } from "react";
import "./globals.css";

const publicSansHeading = Public_Sans({ subsets: ["latin"], variable: "--font-heading" });

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "CRM App",
  description: "CRM App frontend",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="en" className={cn("font-sans", roboto.variable, publicSansHeading.variable)}>
      <body className="min-h-svh bg-[radial-gradient(circle_at_top_left,oklch(0.995_0_0),oklch(0.955_0.003_286))]">
        <Suspense fallback={null}>
          <TooltipProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="min-w-0 bg-transparent">
                <div className="sticky top-0 z-20 flex h-10 items-center gap-2 border-b border-border/70 bg-background/80 px-3 backdrop-blur-xl">
                  <SidebarTrigger className="md:hidden" />
                  <div className="mx-auto text-xs font-medium text-muted-foreground">CRM</div>
                </div>
                {children}
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </Suspense>
      </body>
    </html>
  );
}
