import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';
import loading from './assets/loading.gif';
import './App.css';

const App = () => {
const [uploadedImage, setUploadedImage] = useState(null);
const [textResult, setTextResult] = useState('');

const OCRSTATUS = {
  IDLE: "",
  FAILED: "Failed to perform OCR",
  PROCESSING: "Processing...",
  SUCCEEDED: "Completed",
}
const [ocrState, setOcrState] = useState(OCRSTATUS.IDLE);


const handleChangeImage = e => {
  if(e.target.files[0]){
    setUploadedImage(e.target.files[0])
  } else {
    setUploadedImage(null);
    setTextResult('');
  }
}

const worker = createWorker();

const runOCR = async () => {
	setOcrState(OCRSTATUS.PROCESSING);
try
{
  await worker.load();
//set the language to recognise
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data } = await worker.recognize(uploadedImage);
  setTextResult(data.text);
  setOcrState(OCRSTATUS.SUCCEEDED);
} catch (err) { 
		setOcrState(OCRSTATUS.FAILED);
	}
}

  const onImageChanged = () => {
    setTextResult('');
  }


const handleAnotherImage = () => {
  setUploadedImage(null);
  onImageChanged();
  setOcrState(OCRSTATUS.IDLE)
}

  return (
    <div className='App'>
      <h1>Image OCR Application</h1>
      <p className="center">Get Text from an Image</p>

  { !uploadedImage ? (
      <div className='center input-wrapper'>
        <label htmlFor='uploadimage'>Upload Image</label>
        <input type="file" id='uploadimage' accept='image/*' onChange={handleChangeImage} />
		<p className="center"><b>Supported formats:</b> <span className="white">JPG</span>, <span className="white">PNG</span>, <span className="white">BMP</span></p>
      </div>
		 ) : (
	<>
		<div className="center">
		 <button className="btn btn-primary" onClick={runOCR}>Run OCR</button>
		 <button className="btn btn-primary" onClick={handleAnotherImage}>Reset</button>
		</div>

		<div className='result'>
			<div className='box-image'>
				<img src={URL.createObjectURL(uploadedImage)} alt="thumb" />
			</div>
			{ ocrState === 'Processing...'  && <div className='box-p'>Processing... please wait <img src={loading} alt="processing" /></div> }

			{ textResult && (
			<div className='box-p'>
			    <p>{textResult}</p>
	        </div>
			)}
		</div>
	</>
		)
  }
		</div>
)
}

export default App;

/*
			<div className='box-image'>
				<span>OCR status: {ocrState}</span>
*/
