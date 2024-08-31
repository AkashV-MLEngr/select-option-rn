import React, { useContext, useState } from 'react'
import { RegisterTypes } from '../../types/types';
import axios from 'axios';
import { UserRegister } from '../endpoinds';
import { Button, Form } from 'react-bootstrap';
import { stateDistricts, statesList } from './StatesDistricts';
import { useNavigate } from 'react-router-dom';
import Alerts from '../Alert';

interface FormData {
    state: string;
    district: string;
    // Add other form fields as needed
  }

const RegisterForm = () => {
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertVariant, setAlertVariant] = useState<string | undefined>(undefined);
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterTypes>({
    firstName: '',
    lastName: '',   
    phoneNumber: 0,
    whatsappNumber: 0,
    language: "",
    address: "",
    city: "",
    state: "",
    district: ""   
  });
  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedState = event.target.value;
    setFormData({
      ...formData,
      state: selectedState,
      district: '', // Reset district when state changes
    });
  };

  const handleDistrictChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrict = event.target.value;
    setFormData({
      ...formData,
      district: selectedDistrict,
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
    try {
      const response = await axios.post(UserRegister, formData);
      console.log('User registered:', response.data);
      if (response.status === 201) {
        setAlertMessage('Account created successfully');
        setAlertVariant('success')
        const userId = response.data['id']
        navigate('/api/home', {state:{userId}});
      }
    } catch (error) {
      console.error('There was an error registering the user:', error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 500) {
          setAlertMessage('An error occurred while registration!');
          setAlertVariant('danger');
        } else {
          setAlertMessage('An error occurred while creating the user.');
          setAlertVariant('danger');
        }
      } else {
        setAlertMessage('An error occurred while creating the user.');
        setAlertVariant('danger');
      }
    }
  };
  return (
    <><div>
          <Alerts alertMessage={alertMessage} alertVariant={alertVariant} setAlertMessage={setAlertMessage} />
      </div>
      <form onSubmit={handleRegister} className="container mt-5">
              <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      onChange={handleChange}
                      required />
              </div>
              <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      onChange={handleChange}
                      required />
              </div>
              <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                  <input
                      type="tel"
                      className="form-control"
                      id="phoneNumber"
                      name="phoneNumber"
                      onChange={handleChange}
                      required />
              </div>
              <div className="mb-3">
                  <label htmlFor="whatsappNumber" className="form-label">Whatsapp Number</label>
                  <input
                      type="tel"
                      className="form-control"
                      id="whatsappNumber"
                      name="whatsappNumber"
                      onChange={handleChange}
                       />
              </div>
              <div className="mb-3">
                  <label htmlFor="language" className="form-label">Language</label>
                  <input
                      type="text"
                      className="form-control"
                      id="language"
                      name="language"
                      onChange={handleChange}
                      required />
              </div>
              <div className="mb-3">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      onChange={handleChange}
                       />
              </div>
              <div className="mb-3">
                  <label htmlFor="city" className="form-label">City</label>
                  <input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      onChange={handleChange}
                       />
              </div>
              <div className="mb-3">
                  <label htmlFor="state" className="form-label">State</label>
                  <select id="state"
                        required
                      value={formData.state}
                      className='form-select'
                      onChange={handleStateChange}>
                      <option value="">Select State</option>
                      {statesList.map((state) => (
                          <option key={state} value={state}>
                              {state}
                          </option>
                      ))}
                  </select>
              </div>
              {formData.state && (
                  <div className="mb-3">
                      <label htmlFor="district" className="form-label">District</label>
                      <select id="district"
                          value={formData.district}
                          required
                          className='form-select'
                          onChange={handleDistrictChange}>
                          <option value="">Select District</option>
                          {stateDistricts[formData.state].map((district) => (
                              <option key={district} value={district}>
                                  {district}
                              </option>
                          ))}
                      </select>
                  </div>
              )}
              <div>
                  <Form.Group controlId="formBasicCheckbox">
                      <Form.Check
                          type="checkbox"
                          label="I agree to the Terms and Conditions"
                          checked={isChecked}
                          onChange={handleCheckboxChange} />
                  </Form.Group>
              </div>
              <div className='mt-4'>
                  <Button variant="outline-secondary" type="submit" className='offset-3 col-6' disabled={!isChecked}>
                      Register
                  </Button>
              </div>


          </form></>
  )
}

export default RegisterForm