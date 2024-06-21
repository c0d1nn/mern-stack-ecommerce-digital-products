import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import Spinner from '../components/Spinner';

const EditProduct = () => {

    const [name, setName] = useState('');
    const [priceInCents, setPriceInCents] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();

    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };


    useEffect(() => {
        setLoading(true);
        axios
            .get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/product/${id}`)
            .then((response) => {
                setName(response.data.name);
                setPriceInCents(response.data.priceInCents);
                setDescription(response.data.description);
                setCategory(response.data.category);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
                alert('An error happened. Check console');
            });
    }, [id]);


    const handleEditProduct = () => {
        const data = { name, priceInCents,description, category };
        setLoading(true);
        axios
            .put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/product/${id}`, data, config)
            .then(() => {
                setLoading(false);
                enqueueSnackbar('Product edited successfully', {variant: 'success'});
                navigate('/admin');
            })
            .catch((error) => {
                setLoading(false);
                enqueueSnackbar('Error', {variant: 'error'});
                console.log(error);
            });
    };

  return (
    <div className='p-6 bg-base-100 flex justify-center items-center'>
        {loading && <Spinner/>}
        <div className='container max-w-lg shadow-lg rounded-lg p-5 bg-base-200'>
            <Link to="/admin" className='flex justify-center items-center
            btn mb-4 w-12 py-2 px-4 text-sm rounded-xl'>Back</Link>
            <h1 className='text-3xl font-semibold my-4 '>Edit Product</h1>
            <div className='my-4'>
                <label htmlFor="name" className='block text-md  mb-2'>Name</label>
                <input 
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='border border-base-300 px-4 py-2 w-full rounded-md'    
                />

                <label htmlFor="priceInCents" className='block text-md  mb-2'>
                    Price in cents
                </label>
                <input 
                    id="priceInCents"
                    type="number"
                    value={priceInCents}
                    onChange={(e) => setPriceInCents(e.target.value)}
                    className='border border-base-300 px-4 py-2 w-full rounded-md'    
                />

                <label htmlFor="description" className='block text-md  mb-2'>Description</label>
                <input 
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='border border-base-300 px-4 py-2 w-full rounded-md'    
                />

                <label htmlFor='category' className='block text-lg mb-2 mt-4'>
                    Category
                </label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className='w-full border border-base-300 px-4 py-2 rounded-md'
                    required
                >
                    <option value="" disabled>Select category</option>
                    <option value="course">Course</option>
                    <option value="template">Template</option>
                </select>

                <button onClick={handleEditProduct} className='w-full bg-green-500
                                hover:bg-green-800 text-white py-2 px-4 rounded-md mt-4'>
                    Save Changes
                </button>
            </div>
        </div>
    </div>
  )
}

export default EditProduct