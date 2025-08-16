import React, { useEffect, useState, useMemo, useRef } from "react";
import { ShoppingCart, Upload, Crown, Video, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuthStore } from "@/zustland/store.js";
import Header from "@/components-xm/Header/Header.jsx";
import PublicHeader from "@/components-xm/Header/PublicHeader.jsx";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";

function Billing() {
    const navigate = useNavigate();
  const location = useLocation();
  const { userDetail } = useAuthStore();
  const [hoveredItem, setHoveredItem] = useState(null);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Navigation items for tabs
  const navigationItems = useMemo(() => [
    { 
      id: "overview", 
      label: "OVERVIEW", 
      icon: ShoppingCart, 
      path: "/account-settings/billing",
      description: "Browse and discover courses from our extensive catalog"
    },
    { 
      id: "live-learning", 
      label: "HISTORY", 
      icon: Video, 
      path: "/account-settings/billing/history",
      description: "Join interactive live sessions and real-time learning experiences"
    },
   
  ], []);

 

  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Check scroll position on mount and resize
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollPosition();
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, []);

  return (
    <>
       <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
           <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                        <SidebarTrigger className="-ml-1"/>
                        <Separator orientation="vertical" className="mr-2 h-4"/>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="truncate max-w-[30ch]">Credits & Billing</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className="ml-auto sm:flex-initial"></div>
                    </header>

        <div className="p-4 mx-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Hero Section with Enhanced Gradient */}
            <div className="relative overflow-hidden">
              <Card className="w-full rounded-2xl border-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white shadow-2xl backdrop-blur-sm">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}></div>
                </div>
                
                <CardHeader className="relative z-10 pb-2">
                  <div className="flex items-center justify-center mb-2">
                    <Sparkles className="w-6 h-6 text-yellow-300 animate-float" />
                  </div>
                  <CardTitle className="text-center tracking-wide text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    What would you like to learn today?
                  </CardTitle>
                  <p className="text-center text-white/90 mt-2 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                    Discover thousands of courses from beginner to advanced levels
                  </p>
                </CardHeader>
                
                <CardContent className="relative z-10 pb-6">
                  {/* Mobile: Horizontal scroll with arrows, Desktop: Flex wrap */}
                  <div className="relative">
                    {/* Left Arrow */}
                    {showLeftArrow && (
                      <button
                        onClick={scrollLeft}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-purple-700 rounded-full p-1 shadow-lg transition-all duration-300 sm:hidden"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft size={16} />
                      </button>
                    )}
                    
                    {/* Right Arrow */}
                    {showRightArrow && (
                      <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-purple-700 rounded-full p-1 shadow-lg transition-all duration-300 sm:hidden"
                        aria-label="Scroll right"
                      >
                        <ChevronRight size={16} />
                      </button>
                    )}
                    
                    <div 
                      ref={scrollContainerRef}
                      className="overflow-x-auto scrollbar-hide"
                      onScroll={checkScrollPosition}
                    >
                      <div className="flex gap-1.5 p-1 min-w-max sm:flex-wrap sm:justify-center sm:min-w-0 sm:gap-2">
                        {navigationItems.map((item, index) => {
                          const Icon = item.icon;
                          console.log(location.pathname + " " + item.path)
                          const isActive = location.pathname === item.path;
                          const isHovered = hoveredItem === item.id;
                          
                          return (
                            <button
                              key={item.id}
                              onClick={() => navigate(item.path)}
                              onMouseEnter={() => setHoveredItem(item.id)}
                              onMouseLeave={() => setHoveredItem(null)}
                              className={`group relative overflow-hidden rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 flex-shrink-0 
                                px-2 py-1.5 sm:px-3 sm:py-2 ${
                                isActive
                                  ? 'bg-white text-purple-700 shadow-lg ring-1 ring-white/50'
                                  : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 hover:border-white/40'
                              }`}
                              style={{
                                animationDelay: `${index * 50}ms`
                              }}
                              aria-label={`Navigate to ${item.label}`}
                            >
                              {/* Animated background for active state */}
                              {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-white to-blue-50 rounded-lg"></div>
                              )}
                              
                              {/* Hover effect background */}
                              <div className={`absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 rounded-lg transition-opacity duration-300 ${isHovered && !isActive ? 'opacity-100' : 'opacity-0'}`}></div>
                              
                              <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                                <div className={`p-1 sm:p-1.5 rounded transition-all duration-300 ${
                                  isActive 
                                    ? 'bg-purple-100 text-purple-700' 
                                    : isHovered 
                                      ? 'bg-white/20 text-white scale-110' 
                                      : 'bg-white/10 text-white'
                                }`}>
                                  <Icon size={14} className="sm:w-4 sm:h-4" />
                                </div>
                                
                                <span className={`font-medium whitespace-nowrap transition-colors duration-300 
                                  text-[10px] sm:text-xs ${
                                  isActive ? 'text-purple-700' : 'text-white'
                                }`}>
                                  <span className="hidden xs:inline">{item.label}</span>
                                  <span className="xs:hidden">
                                    {item.label.split(' ')[0]}
                                  </span>
                                </span>
                              </div>
                              
                              {/* Animated border for active state */}
                              {isActive && (
                                <div className="absolute inset-0 rounded-lg border border-purple-300 animate-pulse-subtle"></div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content from child routes with enhanced container */}
            <div className=" ">
              <div className=" ">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Billing;
