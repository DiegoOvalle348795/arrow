"use client";

import apiClient from "@/libs/api";
import { useState, useEffect } from "react";
import LoadingCircle from "@/components/common/LoadingCircle";
import Link from "next/link";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: stats } = await apiClient.get("/admin/dashboard");
        setStats(stats);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8"></div>
      {/* Stats Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="topsection pb-4">
            <h1 className="text-3xl font-bold">
              Welcome to your Admin Dashboard 🚀
            </h1>
            <p className="text-gray-600">
              This is your private user dashboard where you can put whatever you
              want 🤠
            </p>
          </div>
          {loading ? (
            <LoadingCircle />
          ) : (
            <div className="bg-base-100">
              <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-px  sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
                    <p className="text-sm/6 font-medium text-gray-400">
                      Total Users
                    </p>
                    <p className="mt-2 flex items-baseline gap-x-2">
                      <span className="text-4xl font-semibold tracking-tight text-white">
                        {stats?.usersCount || 0}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Admin Actions Section */}
      <div className="card bg-base-100 shadow-xl mt-8">
        <div className="card-body">
          <h2 className="text-2xl font-bold mb-6">Admin Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin/users" className="btn btn-primary">
              Manage Users
            </Link>
            <Link href="/admin/portfolio/add" className="btn btn-secondary">
              Add Portfolio Work
            </Link>
            <Link href="/portfolio" className="btn btn-accent">
              View Portfolio
            </Link>
            <Link href="/admin/dashboard/calendar" className="btn btn-warning">
              Calendario de Trabajos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
