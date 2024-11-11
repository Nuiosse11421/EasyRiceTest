import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Headers from '../../components/header'
import axios from 'axios';

const Result = () => {
  const router = useRouter();
  const { inspectionID } = router.query; // ดึง inspectionID จาก URL
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (inspectionID) {
      // ดึงข้อมูลจาก backend โดยใช้ inspectionID
      axios.get(`http://localhost:8000/history/${inspectionID}`)
        .then(response => {
          setResult(response.data);
        })
        .catch(err => {
          console.error('Error fetching result: ', err);
        });
    }
  }, [inspectionID]);

  if (!result) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Headers />
      <div className="text-black flex flex-col items-center">
        {/* Header Inspection */}
        <div>
          <h1 className='text text-5xl font-sans mb-5 mt-10'>Inspection</h1>
        </div>
        <div className="flex flex-row space-x-6 mt-4">
          {/* Image and Button */}
          <div className="w-[336px]">
            <img src={result.imageLink} className="w-[336px] h-[472px] object-cover rounded-md shadow-md" />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => router.push('/create-inspection')}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded"
              >
                Back
              </button>
              <button
                onClick={() => router.push(`/edit?inspectionID=${inspectionID}`)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Information of Inspection Result */}
          <div className="w-[690px] bg-gray-100 p-4 rounded-lg shadow-md">
            <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg shadow-md bg-white p-3">
              {/*Sample data*/}
              <p><strong>Create Date - Time:</strong><br /> {new Date(result.createDate).toLocaleString()}</p>
              <p><strong>Inspection ID:</strong><br /> {result.inspectionID}</p>
              <p><strong>Standard:</strong><br /> {result.standardName}</p>
              <p><strong>Total Sample:</strong><br /> {result.standardData.value}</p>
              <p><strong>Update Date - Time:</strong><br /> {new Date(result.samplingDate).toLocaleString()}</p>
            </div>
            {/* Note and Price */}
            <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg shadow-md bg-white p-3">
              <p><strong>Note:</strong><br />{result.note}</p>
              <p><strong>Price:</strong><br /> {result.price}</p>
              <p><strong>Date/Time of Sampling:</strong><br /> {new Date(result.samplingDate).toLocaleString()}</p>
              <p><strong>Sampling Point:</strong><br /> {result.samplingPoint.join(', ')}</p>
            </div>
            {/* Composition */}
            <div className="mb-4 rounded-lg shadow-md bg-white p-3">
              <h2 className="font-semibold mb-2 ml-4">Composition</h2>
              <table className="min-w-full text-left text-sm ">
                <thead>
                  <tr className='bg-gray-100'>
                    <th className="px-4 py-2 border-b border-gray-300">Name</th>
                    <th className="px-4 py-2 border-b border-gray-300">Length</th>
                    <th className="px-4 py-2 border-b border-gray-300">Actual</th>
                  </tr>
                </thead>
                <tbody>
                  {result.standardData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.minLength} - {item.maxLength}</td>
                      <td className="px-4 py-2">{item.value.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='mb-4 rounded-lg shadow-md bg-white p-3'>
              <h2 className='font-semibold mb-2 ml-4'>Defect Rice</h2>
              <table className="min-w-full text-left text-sm ">
                <thead>
                  <tr className='bg-gray-100'>
                    <th className="px-4 py-2 border-b border-gray-300">Name</th>

                    <th className="px-4 py-2 border-b border-gray-300 text-right">Actual</th>
                  </tr>
                </thead>
                <tbody>
                  {result.standardData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-4 py-2">{item.key}</td>
                      <td className="px-4 py-2 text-right">{item.value.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
