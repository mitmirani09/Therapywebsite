import React from 'react'

const Dashboard = () => {
  return (
    <main className="flex flex-col h-[100%]">
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="bg-white p-4 rounded-lg shadow">
                                <div className="flex items-center mb-2">
                                    <i className="fas fa-users text-purple-500 text-2xl mr-2"></i>
                                    <div>
                                        <h2 className="text-lg font-semibold">Total counselling</h2>
                                        <p className="text-2xl font-bold">2.4k</p>
                                        <p className="text-sm text-gray-500">Last Year</p>
                                    </div>
                                </div>
                                <p className="text-green-500 font-semibold">+ 5.9%</p>
                            </div>
                            <div className="col-start-1 bg-white p-4 rounded-lg shadow">
                                <div className="flex items-center mb-2">
                                    <i className="fas fa-user-plus text-orange-500 text-2xl mr-2"></i>
                                    <div>
                                        <h2 className="text-lg font-semibold">New Appointments</h2>
                                        <p className="text-2xl font-bold">245</p>
                                        <p className="text-sm text-gray-500">Last Year</p>
                                    </div>
                                </div>
                                <p className="text-red-500 font-semibold">- 2.4%</p>
                            </div>
                            <div className="col-start-1 bg-white p-4 rounded-lg shadow">
                                <div className="flex items-center mb-2">
                                    <i className="fas fa-calendar-check text-blue-500 text-2xl mr-2"></i>
                                    <div>
                                        <h2 className="text-lg font-semibold">Appointments Today</h2>
                                        <p className="text-2xl font-bold">25</p>
                                        <p className="text-sm text-gray-500">Last Year</p>
                                    </div>
                                </div>
                                <p className="text-red-500 font-semibold">- 2.4%</p>
                            </div>
                            <div className="col-start-2 row-start-1 row-span-3 bg-white p-4 rounded-lg shadow">
                                <h2 className="text-lg font-semibold mb-4">Patients by Gender</h2>
                                <img src="https://placehold.co/200x200" alt="Pie chart showing patients by gender" className="mb-4"/>
                                <div className="flex justify-around">
                                    <div className="flex items-center">
                                        <span className="w-3 h-3 bg-blue-500 rounded-full inline-block mr-2"></span>
                                        <span>Male</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-3 h-3 bg-green-500 rounded-full inline-block mr-2"></span>
                                        <span>Female</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-3 h-3 bg-red-500 rounded-full inline-block mr-2"></span>
                                        <span>Kids</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2 bg-white p-4 rounded-lg shadow">
                                <h2 className="text-lg font-semibold mb-4">Earnings</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-bold">2.4k</p>
                                            <p className="text-sm text-gray-500">Online Consultation</p>
                                        </div>
                                        <p className="text-green-500 font-semibold">+ 5.9%</p>
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-bold">2.4k</p>
                                            <p className="text-sm text-gray-500">Total counselling</p>
                                        </div>
                                        <p className="text-green-500 font-semibold">+ 5.9%</p>
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-bold">2.4k</p>
                                            <p className="text-sm text-gray-500">Total counselling</p>
                                        </div>
                                        <p className="text-green-500 font-semibold">+ 5.9%</p>
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-bold">2.4k</p>
                                            <p className="text-sm text-gray-500">Total counselling</p>
                                        </div>
                                        <p className="text-green-500 font-semibold">+ 5.9%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </main>
  )
}

export default Dashboard;
