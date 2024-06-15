'use client'
import { useState } from 'react';
import { auth, database } from '/firebaseConfig';
import LoginForm from '@/components/Auth/login-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref } from 'firebase/database';
import { onValue } from 'firebase/database';
import { notFound, redirect , useRouter} from 'next/navigation';


const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userRef = ref(database, ('users/' + userCredential.user.uid));
      onValue(userRef, (snapshot)=>{
        const role = snapshot.val().role
        alert('success SignIn ' + role)
        if (role === "seller") {
          router.push('/seller/products')
        } else {
          router.push('/'+ role)
        }
        
      })
    } catch (error) {
      console.error("Error logging in: ", error);
      alert('Login Failed')
      setError(error.message)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-700">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Log in</h2>
        <form>
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
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleLogin}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Log in
            </button>
          </div>
          {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
        </form>
        <p className="mt-4">Don't have an account? <a href="/register" className="text-blue-500">Register</a></p>
      </div>
    </div>
  );
};

export default Login;