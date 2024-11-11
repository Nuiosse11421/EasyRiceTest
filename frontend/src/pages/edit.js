import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Headers from '../components/header'
import '../app/globals.css'

const Edit = () => {
    const router = useRouter();
    const { inspectionID } = router.query;
    const [formData, setFormData] = useState({
        note: '',
        price: '',
        samplingDate: '',
        samplingPoint: [],
    })
    useEffect(() => {
        if (inspectionID) {
            axios.get(`http://localhost:8000/history/${inspectionID}`)
                .then(response => {
                    const { note, price, samplingDate, samplingPoint } = response.data;
                    setFormData({
                        note: note || '',
                        price: price || 0,
                        samplingDate: samplingDate ? new Date(samplingDate).toISOString().slice(0, 16) : '',
                        samplingPoint: samplingPoint || [],
                    })
                }).catch(err => {
                    console.error('Error fetching inspection Date: ', err)
                })
        }
    }, [inspectionID])
    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        if (type === 'checkbox') {
            const updatedPoints = checked ? [...formData.samplingPoint, value] : formData.samplingPoint.filter(point => point !== value);
            setFormData({ ...formData, samplingPoint: updatedPoints });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.put(`http://localhost:8000/history/${inspectionID}`, formData)
            .then(() => {
                router.push(`/result/${inspectionID}`)
            }).catch(err => {
                console.error('Error updateing inspection: ', err)
            })
    }
    return (
        <div>
            <Headers />
            <div className='text-black p-8 w-auto'>
                <div className='max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6'>
                    <h2 className='text-2xl font-bold mb-6 text-gray-800 text-center'>Edit Inspection ID: {inspectionID}</h2>
                    <div>
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            <div>
                                <label className='block text-gray-700'>Note:
                                    <input
                                        name='note'
                                        value={formData.note}
                                        onChange={handleInputChange}
                                        className='mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500'
                                    >
                                    </input>
                                </label>
                                <label className='block text-gray-700 mt-2'>Price:
                                    <input
                                        type='number'
                                        name='price'
                                        value={formData.price}
                                        min="0"
                                        placeholder=''
                                        className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500'
                                        onChange={handleInputChange}>
                                    </input>
                                </label>
                                <label className='text-gray-700 mt-2'>Sampling Point:
                                    <div className='flex justify-between'>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="samplingPoint"
                                                value="Front End"
                                                checked={formData.samplingPoint.includes('Front End')}
                                                className="mr-2 mt-2 text-green-500 focus:ring-green-400"
                                                onChange={handleInputChange}
                                            />
                                            Front End
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="samplingPoint"
                                                value="Back End"
                                                checked={formData.samplingPoint.includes('Back End')}
                                                className="mr-2 text-green-500 focus:ring-green-400"
                                                onChange={handleInputChange}
                                            />
                                            Back End
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="samplingPoint"
                                                value="Other"
                                                checked={formData.samplingPoint.includes('Other')}
                                                className="mr-2 text-green-500 focus:ring-green-400"
                                                onChange={handleInputChange}
                                            />
                                            Other
                                        </label>
                                    </div>
                                </label>
                                <lable>Date/Time of Sampling:
                                    <input
                                        type='datetime-local'
                                        name='samplingDate'
                                        value={formData.samplingDate}
                                        className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                        onChange={handleInputChange}
                                    />
                                </lable>
                            </div>
                            <div className='flex justify-end space-x-2'>
                                <button className='bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded' type="button" onClick={() => router.push(`/result/${inspectionID}`)}>Cancel</button>
                                <button className='bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded' type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Edit;