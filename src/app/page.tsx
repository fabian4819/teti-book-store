'use client';
import PaymentForm from "@/components/Auth/payment-form";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
  const handleClick = () => {
    router.push('/register');
  };
  return (
    <main
      className="min-w-full min-h-screen flex items-center justify-center bg-gray-700"
      onClick={handleClick}
    >
      <div className="bg-white p-8 rounded-full shadow-md flex flex-col items-center">
        <Image src="https://drive.google.com/uc?export=view&id=1pjQwafktHYF6wzwvu1JrV80_4fQMlBZk" alt="TokoBuku" width={300} height={150} />
        <h1 className="text-3xl font-bold ">Welcome</h1>
      </div>
    </main>
  );
}