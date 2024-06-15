"use client"
import SellerNavbar from "@/components/Seller/SellerNavbar";
import { FormEvent, useEffect, useState } from "react";
import { database } from "/firebaseConfig"
import {push, ref, set} from "firebase/database"
import { useRouter } from "next/navigation";
import { useSeller } from "@/context/SellerContext";
import { IKContext, IKUpload } from 'imagekitio-react';
import { IKUploadResponse } from "@/types/IKUploadResponse";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const authenticator =  async () => {
    try {
        const response = await fetch('http://localhost:3001/auth');
  
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }
  
        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Authentication request failed: ${error.message}`);
        } else {
            throw new Error(`Authentication request failed: ${String(error)}`);
        }
    }
};


const NewProductPage = () => {
    const {sellerId} = useSeller();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState(0);
    const [price, setPrice] = useState(0);
    const [photoUrl, setPhotoUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    const [submitClicked, setSubmitClicked] = useState(false); // State untuk menandai apakah tombol submit telah ditekan
    const [isFormValid, setIsFormValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const isValid =
            title.trim() !== '' &&
            author.trim() !== '' &&
            description.trim() !== '' &&
            stock !== 0 &&
            price !== 0 &&
            photoUrl.trim() !== '';

        setIsFormValid(isValid);
        if (!isValid && submitClicked) {
            setErrorMessage('Harap lengkapi semua kolom sebelum mengirimkan formulir.');
        } else {
            setErrorMessage('');
        }
    }, [title, author, description, stock, price, photoUrl, submitClicked]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitClicked(true);

        if (!isFormValid) {
            return;
        }
    
        // Membuat objek produk yang akan diunggah ke Firebase
        const productData = {
            sellerId,
            title,
            author,
            description,
            stock,
            price,
            sold: 0,
            photoUrl
        };

        setUploading(true);
    
        try {
            // Mendapatkan referensi ke lokasi yang tepat di Firebase
            const productsRef = ref(database, `user_seller/${sellerId}/products`);
    
            // Menambahkan data produk ke Firebase
            const newProductRef = push(productsRef, productData);
            // Mendapatkan ID produk yang baru ditambahkan
            const productId = newProductRef.key;
            // Menambahkan ID produk ke dalam objek produk sebelum diunggah ke Firebase
            const productDataWithId = { ...productData, product_id: productId };

            // Menyimpan data produk beserta ID ke Firebase
            await set(newProductRef, productDataWithId);
            // Mengosongkan input setelah berhasil menambahkan produk
            setTitle('');
            setAuthor('');
            setDescription('');
            setStock(0);
            setPrice(0);
            setPhotoUrl('');
            setUploading(false);
            setSubmitClicked(false);
    
            // Redirect atau tindakan lain yang sesuai dengan aplikasi Anda
            router.push('/seller/products'); // Contoh: Mengarahkan pengguna ke halaman dashboard setelah menambahkan produk
        } catch (error) {
            console.error('Error adding product to Firebase:', error);
            // Menangani kesalahan saat menambahkan produk ke Firebase
            // Misalnya, menampilkan pesan kesalahan kepada pengguna
        }
    };
    
    const onImagekitError = (err: unknown) => {
        console.log("Error", err);
    };
      
    const onImagekitSuccess = (res : IKUploadResponse) => {
        console.log("Success", res);
        if(res.url) {
            setPhotoUrl(res.url)
        }
    };

    return (
        <>
        <SellerNavbar />

        <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
            <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-lg">
                <h1 className="font-bold text-center text-2xl mb-5">Tambah Produk Baru</h1>
                <div className="bg-white shadow w-full rounded-lg">
                    <div>
                        <p className="pl-5 pt-7 font-semibold text-sm text-gray-600 block">Gambar</p>
                        <div className="pl-5 py-2">
                            <IKContext 
                                publicKey={publicKey} 
                                urlEndpoint={urlEndpoint} 
                                authenticator={authenticator} 
                            >
                                <IKUpload
                                    fileName={sellerId}
                                    folder={`/IAI/seller/${sellerId}`}
                                    onError={onImagekitError}
                                    onSuccess={onImagekitSuccess}
                                />
                            </IKContext>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="px-5 pt-5 pb-7">
                        <div className="mb-5">
                            <label htmlFor="title" className="font-semibold text-sm text-gray-600 block">Judul</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="border border-slate-400 rounded-lg px-3 py-2 mt-1 text-sm w-full"
                            />
                        </div>
                        <div className="mb-5">
                        <label htmlFor="author" className="font-semibold text-sm text-gray-600 block">Pengarang</label>
                        <input
                            type="text"
                            id="author"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="border border-slate-400 rounded-lg px-3 py-2 mt-1 text-sm w-full"
                        />
                        </div>

                        <div className="mb-4">
                        <label htmlFor="description" className="font-semibold text-sm text-gray-600 block">Deskripsi</label>
                        <textarea
                            id="description"
                            className="mt-1 block w-full border border-slate-400 rounded-md shadow-sm "
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={10}
                            required
                        />
                        </div>

                        <div className="mb-5">
                        <label htmlFor="stock" className="font-semibold text-sm text-gray-600 block ">Stok</label>
                        <input
                            type="number"
                            id="stock"
                            value={stock}
                            onChange={(e) => setStock(Number(e.target.value))}
                            className="border rounded-lg px-3 py-2 mt-1 text-sm w-full border-slate-400"
                        />
                        </div>
                        <div className="mb-5">
                        <label htmlFor="price" className="font-semibold text-sm text-gray-600 block">Harga</label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="border rounded-lg px-3 py-2 mt-1 text-sm w-full border-slate-400"
                        />
                        </div>
                        {/* {submitClicked && !isFormValid && (
                            <p className="text-red-500 text-sm mb-5">{errorMessage}</p>
                        )} */}
                        <button 
                            type="submit" 
                            className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                            disabled={!isFormValid}    
                        >
                            <span className="inline-block mr-2">Tambah Produk</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
        </>
    )
}

export default NewProductPage;