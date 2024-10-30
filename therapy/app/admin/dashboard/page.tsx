import React from 'react'
import Dashboard from '@/components/Dashboard';
import AdminLayout from '../AdminLayout';

const DashboardPage = () => {
  return (
    <AdminLayout>
        <main className={`p-10 bg-[#FFF5F5] w-[100%]`}>
            <Dashboard/>
        </main>
    </AdminLayout>
  )
}

export default DashboardPage;