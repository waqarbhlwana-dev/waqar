import { useState } from "react";
import { 
  Briefcase, 
  GraduationCap, 
  Play, 
  FileText, 
  Home,
  TrendingUp
} from "lucide-react";

export default function BottomNavigation() {
  const [activeTab, setActiveTab] = useState("home");

  const navigationItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      href: "/",
      description: "Market Overview"
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: Briefcase,
      href: "/portfolio",
      description: "Portfolio Management"
    },
    {
      id: "courses",
      label: "Courses",
      icon: GraduationCap,
      href: "/courses",
      description: "Free Courses"
    },
    {
      id: "videos",
      label: "Videos",
      icon: Play,
      href: "/videos",
      description: "YouTube Videos"
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      href: "/reports",
      description: "Research Reports"
    }
  ];

  const handleNavigation = (itemId, href) => {
    setActiveTab(itemId);
    // In a real app, you would use router.push(href) or similar navigation
    console.log(`Navigating to: ${href}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1E1E1E] border-t border-[#E8EAEE] dark:border-[#333333] shadow-lg">
      {/* Desktop Navigation */}
      <div className="hidden sm:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-center py-4">
          <div className="flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id, item.href)}
                  className={`group flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-[#FF8200] dark:bg-[#FF8F1F] text-white"
                      : "text-[#6B7280] dark:text-[#A0A0A0] hover:text-[#FF8200] dark:hover:text-[#FF8F1F] hover:bg-[#FFF7F0] dark:hover:bg-[#333333]"
                  }`}
                >
                  <Icon 
                    className={`w-6 h-6 transition-transform duration-200 ${
                      isActive ? "scale-110" : "group-hover:scale-105"
                    }`} 
                  />
                  <span className="font-poppins text-sm font-medium">
                    {item.label}
                  </span>
                  <span className={`font-poppins text-xs ${
                    isActive 
                      ? "text-white/80" 
                      : "text-[#6B7280] dark:text-[#A0A0A0] group-hover:text-[#FF8200] dark:group-hover:text-[#FF8F1F]"
                  }`}>
                    {item.description}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden">
        <nav className="flex items-center justify-between px-2 py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id, item.href)}
                className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-lg flex-1 transition-all duration-200 ${
                  isActive
                    ? "bg-[#FF8200] dark:bg-[#FF8F1F] text-white"
                    : "text-[#6B7280] dark:text-[#A0A0A0] hover:text-[#FF8200] dark:hover:text-[#FF8F1F] active:bg-[#FFF7F0] dark:active:bg-[#333333]"
                }`}
              >
                <Icon 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? "scale-110" : ""
                  }`} 
                />
                <span className="font-poppins text-xs font-medium">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Action Button (floating) */}
      <div className="absolute -top-6 right-4 sm:right-8">
        <button className="w-12 h-12 bg-gradient-to-r from-[#FF8200] to-[#FF9C14] dark:from-[#FF8F1F] to-[#FFA335] text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200">
          <TrendingUp className="w-6 h-6" />
        </button>
      </div>

      {/* Background overlay for better mobile visibility */}
      <div className="absolute inset-0 bg-white/80 dark:bg-[#1E1E1E]/80 backdrop-blur-sm -z-10"></div>

      {/* Poppins Font */}
      <style jsx global>{`
        .font-poppins {
          font-family: 'Poppins', 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}