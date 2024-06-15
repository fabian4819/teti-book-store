import Link from "next/link"
export default function RegisterForm({name, email, password, role, setName, setEmail, setPassword, setRole, handleSubmit, error= " "}){
    return(
        <div 
        className="bg-white w-[50vw] text-black p-[1vw] flex flex-col items-center gap-[1vw] h-full rounded-[1vw] text-[1.5vw]"
        >
            <h1 className="font-bold text-[2vw]">Register</h1>
            <form className="flex flex-col w-[100%]">
                <label>Name :</label>
                <input
                placeholder="Example Elpmaxe"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
                <label >Email :</label>
                <input 
                placeholder="example@gmail.com" 
                type="text" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                />
                <label>
                    Password :
                </label>
                <input 
                className="border-none" 
                placeholder="********" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                />
                <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                >
                    <option value='seller'>Seller</option>
                    <option value='courier'>Courier</option>
                    <option value='buyer'>Buyer</option>
                </select>
            </form>
            {error && 
            <p 
            className="text-[1vw] text-red-600"
            >
                {error}
            </p>}
            <button  
            className="text-white hover:text-black bg-black hover:bg-white hover:border-black border-[0.1vw] border-[qvw] w-full px-[2vw] rounded-[1vw]"
            onClick={handleSubmit}
            >
                Register
            </button>
            <p className="text-[1vw] m-[1vw]">Already have an account? <Link href={"../login"}>Login</Link></p>
        </div>
    )
}