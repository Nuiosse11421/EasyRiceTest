import { useEffect, useState } from 'react';
import axios from 'axios';
export default function StandardDropdown({ setSelectedStandard }) {
  const [standards, setStandards] = useState([]);

  useEffect(() => {
    // Fetch standards data from backend API
    axios.get('http://localhost:8000/standard')
      .then((response) => {
        setStandards(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching standards:', error);
      });
  }, []);

  return (
    <div>
      <label htmlFor="standard">Standard*</label><br/>
      <select
        id="standardID"
        name='standardID'
        required
        onChange={(e) => setSelectedStandard(e.target.value)}
      >
        <option value="">Please Select Standard</option>
        {standards.map((standard) => (
          <option key={standard.id} value={standard.id}>
            {standard.name}
          </option>
        ))}
      </select>
    </div>
  );
}