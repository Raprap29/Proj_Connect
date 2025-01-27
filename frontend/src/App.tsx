import React, { ChangeEvent, FormEvent, useState } from "react"
import axios from "axios";
function App() {

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(file){
      setSelectedFile(file);
      console.log('Selected file:', file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('message', 'This is a test message');
    try{
      const {data} = await axios.post('/api/ai/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(data);
    }catch(e){  
      return console.error(e);
    }

  }

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}
    </React.Fragment>
  )
}

export default App
