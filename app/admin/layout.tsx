"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Film, 
  Settings, 
  LogOut,
  Home
} from "lucide-react";
import { loginOut } from "@/lib/auth";

// Admin sidebar navigation items
const sidebarItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { name: "Videos", href: "/admin/videos", icon: Film },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await loginOut();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-purple-600">Admin Panel</h2>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {/* Home button - takes admin back to regular user home page */}
            <li>
              <Link 
                href="/dashboard/home"
                className="flex items-center p-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
              >
                <Home className="w-5 h-5 mr-3" />
                Main Home
              </Link>
            </li>
            
            {/* Divider */}
            <li className="py-2">
              <div className="border-t border-gray-200"></div>
            </li>
            
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className={`flex items-center p-2 rounded-lg text-sm ${
                      isActive 
                        ? "bg-purple-100 text-purple-700" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
            
            <li className="pt-4 mt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center p-2 w-full text-left rounded-lg text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Log Out
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 bg-white border-b border-gray-200 shadow-sm">
          <h1 className="text-lg font-medium">
            Admin Control Panel
          </h1>
        </div>
        
        {children}
      </main>
    </div>
  );
} 