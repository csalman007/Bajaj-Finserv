import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const filters = ['Alphabets', 'Numbers', 'Highest Alphabet'];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedInput = JSON.parse(jsonInput); // Validate if JSON is correctly formatted
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        throw new Error('Input should contain a "data" field with an array');
      }

      setError('');
      
      // Send the input data to the backend
      const response = await axios.post('https://bfhl-backend-1mre.onrender.com/bfhl', parsedInput);
      setResponseData(response.data);
    } catch (err) {
      setError('Invalid JSON input. Please check your input and try again.');
      setResponseData(null);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  // Handle filter selection
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedFilters(
      selectedFilters.includes(value)
        ? selectedFilters.filter((filter) => filter !== value)
        : [...selectedFilters, value]
    );
  };

  // Render filtered response based on selected filters
  const renderResponse = () => {
    if (!responseData) return null;
    
    const { alphabets, numbers, highest_alphabet } = responseData;
    return (
      <div>
        {selectedFilters.includes('Numbers') && numbers && (
          <div>
            <h3>Numbers</h3>
            <p>{numbers.join(', ')}</p>
          </div>
        )}
        {selectedFilters.includes('Alphabets') && alphabets && (
          <div>
            <h3>Alphabets</h3>
            <p>{alphabets.join(', ')}</p>
          </div>
        )}
        {selectedFilters.includes('Highest Alphabet') && highest_alphabet && (
          <div>
            <h3>Highest Alphabet</h3>
            <p>{highest_alphabet.join(', ')}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>BFHL Frontend</h1>
      <form onSubmit={handleSubmit}>
        <label>Enter JSON Input:</label>
        <textarea
          value={jsonInput}
          onChange={handleInputChange}
          placeholder='{"data": ["A", "B", "1", "2"]}'
        />
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {responseData && (
        <div>
          <h2>Response</h2>
          <label>Select filters:</label>
          {filters.map((filter) => (
            <div key={filter}>
              <input
                type="checkbox"
                value={filter}
                checked={selectedFilters.includes(filter)}
                onChange={handleFilterChange}
              />
              <label>{filter}</label>
            </div>
          ))}
          {renderResponse()}
        </div>
      )}
    </div>
  );
}

export default App;
