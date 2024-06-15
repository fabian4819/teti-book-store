// import ProtectedPage from "@/components/Auth/protectedPage";
'use client'
import React, { useEffect, useState, createContext, useContext } from 'react';
import { auth,database } from '/firebaseConfig';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut} from 'firebase/auth';
import { ref, onValue } from 'firebase/database'; 
import { SellerProvider } from '@/context/SellerContext';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // Timeout 30 Menit


export default function DashboardLayout({ children }) {
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [sellerId, setSellerId] = useState<string>("");
  const router = useRouter();

  const [lastActivityTime, setLastActivityTime] = useState(new Date().getTime());

  useEffect(()=>{
    const handleUserActivity = () => {
      setLastActivityTime(new Date().getTime());
    };

    const unsubscribe = onAuthStateChanged(auth, (user)=>{
      if(!user){
        router.push('/login');
      }
      else {
        const currentUser = auth.currentUser;
        const userRef = ref(database, 'users/' + currentUser.uid);
        onValue(userRef, (snapshot) => {
          const role = snapshot.val().role
          setRole(role)
          if (role === 'seller') {
            setSellerId(currentUser.uid);
          }
          setLoading(false)
        })
        
      }
    });

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    const checkInactivity = () => {
      const currentTime = new Date().getTime();
      if (currentTime - lastActivityTime > INACTIVITY_TIMEOUT) {
        signOut(auth);
      }
    };

    const intervalId = setInterval(checkInactivity, 1000);

    return () =>
      {
        unsubscribe();
        window.removeEventListener('mousemove', handleUserActivity);
        window.removeEventListener('keydown', handleUserActivity);
        window.removeEventListener('click', handleUserActivity);
        clearInterval(intervalId);
      };
  }, [router, lastActivityTime]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleSignOut = () => {
    signOut(auth);
  }
  
  
  if (role != "seller"){
    return (<main>Access Denied</main>)
  }

  return (
    <SellerProvider sellerId={sellerId}>
      <main>
        {children}
        <button onClick={handleSignOut}>Sign Out</button>
      </main>
    </SellerProvider>
  );
}