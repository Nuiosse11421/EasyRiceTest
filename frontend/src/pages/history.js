// pages/history.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { GoChevronLeft } from 'react-icons/go'
import { GoChevronRight } from 'react-icons/go'
import Headers from '../components/header'
import '../app/globals.css'


const HistoryPage = () => {
    const router = useRouter();
    const [history, setHistory] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [searchId, setSearchId] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);

    // ดึงข้อมูล history
    const fetchHistory = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/history`, {
                params: { page, searchId, formDate: fromDate, toDate }
            });
            setHistory(res.data.history);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    // เรียกใช้เมื่อหน้าต่างโหลดหรือมีการเปลี่ยนแปลงข้อมูล
    useEffect(() => {
        fetchHistory();
    }, [page, searchId, fromDate, toDate]);

    const handleSearch = () => {
        setPage(1); // รีเซ็ตไปยังหน้าที่ 1 เมื่อมีการค้นหาใหม่
        fetchHistory();
    };
    const handleCheckboxChange = (inspectionId) => {
        setSelectedItems((prevSelected) =>
            prevSelected.includes(inspectionId)
                ? prevSelected.filter((id) => id !== inspectionId)
                : [...prevSelected, inspectionId]
        );
    };
    const handleClear = () => {
        setSearchId('');
        setFromDate('');
        setToDate('');
        setPage(1);
        fetchHistory();
    };

    const handleRowClick = (inspectionId) => {
        router.push(`/result/${inspectionId}`);
    };
    const handleDelete = async () => {
        try {
            await Promise.all(
                selectedItems.map((inspectionID) => axios.delete(`http://localhost:8000/history/${inspectionID}`))
            );
            setSelectedItems([]);
            fetchHistory();
        } catch (err) {
            console.error('Error delete items: ', err.message)
        }
    }

    return (
        <div>
            <Headers />
            <div className=' p-8 text-black'>
                <div className="p-8 text-black max-w-[1332px] h-auto mx-auto">
                    <div className="flex justify-end space-x-2 mb-4">
                        <button className='bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded' onClick={() => router.push('/create-inspection')}>+ Create Inspection</button>
                    </div>
                    {/* Search Form */}
                    <div className="bg-white p-4 rounded-md shadow mb-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex space-x-4 w-full">
                                <div className="flex-1">
                                    <label className="block font-semibold text-gray-700">ID</label>
                                    <input
                                        type="text"
                                        value={searchId}
                                        onChange={(e) => setSearchId(e.target.value)}
                                        placeholder="Search by Inspection ID"
                                        className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block font-semibold text-gray-700">From Date</label>
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block font-semibold text-gray-700">To Date</label>
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={handleClear}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded"
                            >
                                Clear Filter
                            </button>
                            <button
                                onClick={handleSearch}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={handleDelete}
                            disabled={selectedItems.length === 0}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
                        >
                            Delete
                        </button>
                        <span className="text-gray-700">Selection items: {selectedItems.length} item(s)</span>
                    </div>
                    {/* Table */}
                    <table className="w-full border border-gray-300 rounded-md shadow-md">
                        <thead className="bg-green-600 text-white">
                            <tr>
                                <th></th>
                                <th>Create Date - Time</th>
                                <th>Inspection ID</th>
                                <th>Name</th>
                                <th>Standard</th>
                                <th>Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => (
                                <tr key={item.inspectionID} className="border-t border-gray-300 hover:bg-gray-100">
                                    <td className='p-2'>
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.inspectionID)}
                                            onChange={() => handleCheckboxChange(item.inspectionID)}
                                            className="focus:ring-green-500"
                                        />
                                    </td>
                                    <td className="p-2 cursor-pointer" onClick={() => handleRowClick(item.inspectionID)}>{new Date(item.createDate).toLocaleString()}</td>
                                    <td className="p-2 cursor-pointer" onClick={() => handleRowClick(item.inspectionID)}>{item.inspectionID}</td>
                                    <td className="p-2 cursor-pointer" onClick={() => handleRowClick(item.inspectionID)}>{item.name}</td>
                                    <td className="p-2 cursor-pointer" onClick={() => handleRowClick(item.inspectionID)}>{item.standardName}</td>
                                    <td className="p-2 cursor-pointer" onClick={() => handleRowClick(item.inspectionID)}>{item.note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className='flex items-start justify-between mt-4'>
                        <div className=''>
                            <span>{page} of {totalPages}</span>
                            <button className='ml-2' onClick={() => setPage(page - 1)} disabled={page === 1}>
                                <GoChevronLeft />
                            </button>
                            <button className='ml-2' onClick={() => setPage(page + 1)} disabled={page === totalPages}><GoChevronRight /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;
