// Kurang insert ke database bagian courier



'use client'
import { useState } from 'react';
import { auth, database } from '/firebaseConfig';
import { ref, set } from 'firebase/database';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import RegisterForm from '@/components/Auth/register-form';


const Register = () => {
  const router = useRouter()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('seller')
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      set(ref(database,'users/' + user.uid),{
        name : name,
        email: user.email,
        role: role 
      })
      if (role == 'seller'){
        set(ref(database, 'user_seller/' + user.uid),{
          email : user.email,
          product : [],
          uid : user.uid,
          username : name
        })
      } else if (role == 'buyer'){
        set(ref(database, 'user_buyer/' + user.uid),{
          email : user.email,
          orders : [],
          uid : user.uid,
          username : name,
          shipping_address : ""
        })
      }
      alert('Register Success')
      router.push('/login')
      
    } catch (error) {
      console.error("Error registering: ", error);
      setError(error.message)
    }
  };



  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-700">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select a role</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="courier">Courier</option>

       
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleRegister}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Register
            </button>
          </div>
          {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
        </form>
        <p className="mt-4">Already have an account? <a href="/login" className="text-blue-500">Log in</a></p>
      </div>
    </div>
  );
};
export default Register;
