import { useRef, useState } from 'react';
import washLogo from './assets/wash4kids.svg'; 
import CarImageCompare from './CarImageCompare/imagecompare';
import SignatureCanvas from 'react-signature-canvas';
import InputBar from './InputBar/InputBar'
import img1 from './assets/image1.jpg';
import img2 from './assets/image2.jpg';
import contractimg from './assets/contract.jpg'
import './App.css';

function App() {
  const [selected, setSelected] = useState('About');

  const items = ['About', 'Review', 'Results', 'Pricing'];
  
  const sigPadRef = useRef(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

const clearSignature = () => {
  if (sigPadRef.current) {
    sigPadRef.current.clear();
  }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!sigPadRef.current || sigPadRef.current.isEmpty()) {
    alert('Please provide a signature');
    return;
  }

  const signatureDataUrl = sigPadRef.current
    .getTrimmedCanvas()
    .toDataURL('image/png');

  // ✅ FIXED: Added the correct route '/api/sendContract'
  await fetch('https://wash4kidz.onrender.com/api/sendContract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...form, signatureDataUrl }),
  });

  alert('Contract sent! Check your email.');
};



  return (
    <div className="Web-Container">
      <div className="Navbar">
        <img src={washLogo} alt="Wash 4 Kids Logo" className="Logo" />

        <div className="NavItems">
          {items.map((item) => (
            <div
              key={item}
              className={`NavItem ${selected === item ? 'selected' : ''}`}
              onClick={() => setSelected(item)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="imgsliders">
          <div className="CarImage1">
         <CarImageCompare
      image1={img1}
      image2={img2}
    />
    </div>
    <div className="CarImage2">
         <CarImageCompare
      image1={img1}
      image2={img2}
    />
    </div>
    <div className="CarImage3">
         <CarImageCompare
      image1={img1}
      image2={img2}
    />
    </div>
    <div className="CarImage4">
         <CarImageCompare
      image1={img1}
      image2={img2}
    />
    </div>
      </div>
      <div className="inputs">
        <div className="FirstName">
              <InputBar placeholder='First Name' name="firstName" value={form.firstName} onChange={handleChange}></InputBar>
        </div>
        <div className="LastName">
              <InputBar placeholder='Last Name' name="lastName" value={form.lastName} onChange={handleChange}></InputBar>
        </div>
        <div className="Email">
              <InputBar placeholder='Email'  name="email" value={form.email}onChange={handleChange}></InputBar>
        </div>
      </div>

      <div className="Contract">
        <img src={contractimg}></img>
      </div>


      <div className='Signature'>
        <SignatureCanvas
          ref={sigPadRef}
          penColor="black"
          canvasProps={{ width: 705, height: 129, className: 'sigCanvas' }}
        />
      </div>
      <button type="button" className='clearbtn' onClick={clearSignature}>Clear</button>
      <button type="button" className='submitbtn' onClick={handleSubmit}>Submit</button>

      <div className="footer">
        <div className="footer-links">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/security">Security</a>
          <a href="">©2025 Wash4Kidz</a>
        </div>
      </div>




 


  



    </div>
  );
}

export default App;
