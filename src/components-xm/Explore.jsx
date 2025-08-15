import React, { useEffect } from "react";
import { ShoppingCart, Upload, Crown, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuthStore } from "@/zustland/store.js";
import Header from "@/components-xm/Header/Header.jsx";
import PublicHeader from "@/components-xm/Header/PublicHeader.jsx";

export function Explore() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userDetail } = useAuthStore();

  // Navigation items for tabs
  const navigationItems = [
    { 
      id: "marketplace", 
      label: "MARKETPLACE", 
      icon: ShoppingCart, 
      path: "/explore/marketplace",
      description: "Browse and discover courses from our extensive catalog"
    },
    { 
      id: "live-learning", 
      label: "LIVE LEARNING", 
      icon: Video, 
      path: "/explore/live-learning",
      description: "Join interactive live sessions and real-time learning experiences"
    },
    { 
      id: "bring-your-own", 
      label: "BRING YOUR OWN COURSE", 
      icon: Upload, 
      path: "/explore/bring-your-own-course",
      description: "Upload and share your own educational content"
    },
    { 
      id: "privileged-access", 
      label: "PRIVILEGED ACCESS", 
      icon: Crown, 
      path: "/explore/privileged-access",
      description: "Access exclusive premium content and features"
    },
  ];

  // Redirect to marketplace by default if at base explore route
  useEffect(() => {
    if (location.pathname === "/explore" || location.pathname === "/explore/") {
      navigate("/explore/marketplace", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <>
      {userDetail ? <Header /> : <PublicHeader />}
      <div className="p-4 overflow-y-auto h-[calc(100svh-4em)]">
        <div className="space-y-6">
    

          {/* Navigation Tabs */}
          <Card className="w-full rounded-xl border-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-700 text-white shadow-2xl">
            <CardHeader>
              <CardTitle className="text-center tracking-wide text-2xl md:text-3xl">
                What would you like to learn today?
              </CardTitle>
              <p className="text-center text-white/90 mt-2">
                Discover thousands of courses from beginner to advanced levels
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 p-1 bg-white rounded-xl shadow-sm border">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.path)}
                      className={`flex items-center gap-2 px-2 py-1 rounded-lg font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="hidden sm:inline text-xs sm:text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Content from child routes */}
          <Outlet />
        </div>
      </div>
    </>
  );
}