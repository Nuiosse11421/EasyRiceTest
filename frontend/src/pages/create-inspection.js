// frontend/pages/create-inspection.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import '../app/globals.css'
//import component
import StandardDropdown from '../../components/StandardDropdown'
import Headers from '../components/header'


export default function CreateInspection() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    standardID: '',
    note: '',
    price: '',
    samplingPoint: [],
    samplingDate: '',
    file: null,
  });
  const [selectedStandard, setSelectedStandard] = useState('');
  const samplingPoints = ['Front End', 'Back End', 'Other'];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    console.log('Input field changed:', { name, value, type });
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'number' ? parseFloat(value) || '' : value,
    }));

  };

  const handleCheckboxChange = (point) => {
    setForm((prevForm) => ({
      ...prevForm,
      samplingPoint: prevForm.samplingPoint.includes(point)
        ? prevForm.samplingPoint.filter((p) => p !== point)
        : [...prevForm.samplingPoint, point],
    }));
  };

  const handleFileChange = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      file: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('standardID', selectedStandard);
    formData.append('note', form.note);
    formData.append('price', form.price);
    formData.append('samplingPoint', JSON.stringify(form.samplingPoint));
    formData.append('samplingDate', form.samplingDate);
    if (form.file) {
      formData.append('file', form.file);
    }

    try {
      const response = await axios.post('http://localhost:8000/history', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      console.log('Form submitted: ', response.data)
      router.push(`/result/${response.data.data.inspectionID}`);

    } catch (err) {
      console.error(err)
    }
  };

  return (
    <div>
      <Headers />
      <div className='p-8 w-auto'>
        <div className="w-[448px] h-[790px] mx-auto bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Create Inspection</h1>
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <label className='block text-gray-700'>
                Name*
                <br />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder='enter name'
                  className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500'
                  required
                />
              </label>
              {/* Standard */}
              <div className="text-gray-700">
                <StandardDropdown setSelectedStandard={setSelectedStandard} />
              </div>
              {/* File Upload */}
              <label className="block text-gray-700">
                Upload File:
                <input
                  type="file"
                  accept=".json"
                  name="file"
                  onChange={handleFileChange}
                  placeholder='raw1.json'
                  className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500'
                />
              </label>
              {/* Note */}
              <label className="block text-gray-700">
                Note:
                <input
                  type="text"
                  name="note"
                  value={form.note}
                  className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500'
                  onChange={handleChange}
                />
              </label>
              {/* Price Field */}
              <label className="block text-gray-700">
                Price:
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  placeholder='10,000'
                  min="0"
                  max="100000"
                  step="0.01"
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </label>
              {/* Sampling Point Checkboxes */}
              <fieldset className='text-gray-700'>
                <legend className="font-semibold">Sampling Point:</legend>
                <div className='flex justify-between'>
                  {samplingPoints.map((point) => (
                    <label key={point} className="m-1">
                      <input
                        type="checkbox"
                        value={point}
                        checked={form.samplingPoint.includes(point)}
                        onChange={() => handleCheckboxChange(point)}
                        className="mr-2 text-green-500 focus:ring-green-400"
                      />
                      {point}
                    </label>
                  ))}
                </div>
              </fieldset>
              {/* Sampling Date/Time */}
              <label className="block text-gray-700">
                Date/Time of Sampling
                <input
                  type="datetime-local"
                  name="samplingDate"
                  value={form.samplingDate}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label >
              {/* Submit Button */}
              <div className='flex justify-end space-x-2'>
                <button type="button" className='bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded'>cancel</button>
                <button type="submit" className='bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded'>Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}