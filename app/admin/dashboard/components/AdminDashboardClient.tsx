"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/constants";
import Link from "next/link";
import axios from "axios";

export default function AdminDashboardClient() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVideos: 0,
    activeSubscriptions: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication from localStorage as a backup protection
    function verifyAdminAuth() {
      try {
        const userData = localStorage.getItem('userData');
        if (!userData) {
          router.push("/login");
          return;
        }
        
        const user = JSON.parse(userData);
        if (!user || user.role !== Role.ADMIN) {
          router.push("/unauthorized");
          return;
        }
      } catch (error) {
        console.error("Error verifying admin auth:", error);
        router.push("/login");
      }
    }
    
    // Fetch admin dashboard data from API
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const response = await axios.get("/api/admin/dashboard");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Fallback to placeholder data if API fails
        setStats({
          totalUsers: 0,
          totalVideos: 0,
          activeSubscriptions: 0
        });
      } finally {
        setLoading(false);
      }
    }

    verifyAdminAuth();
    fetchDashboardData();
  }, [router]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <Link href="/admin/users">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Users</h2>
            {loading ? (
              <div className="h-10 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-4xl font-bold text-purple-600">{stats.totalUsers}</p>
            )}
          </div>
        </Link>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Videos</h2>
          {loading ? (
            <div className="h-10 w-20 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className="text-4xl font-bold text-purple-600">{stats.totalVideos}</p>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Active Subscriptions</h2>
          {loading ? (
            <div className="h-10 w-20 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className="text-4xl font-bold text-purple-600">{stats.activeSubscriptions}</p>
          )}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
        <p className="text-gray-500">No recent activity to display.</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">System Status</h2>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <p className="text-gray-700">All systems operational</p>
        </div>
      </div>
    </div>
  );
} 