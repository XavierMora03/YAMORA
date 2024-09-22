"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
export default function NotFound (){
    const router = useRouter();
    
    return(
        <>
        <h1>404</h1>
        <p>Página no encontrada</p>
        {/* <Link href="/">Regresar</Link> */}
        <button onClick={()=>{router.back()}}>Regresar</button>
        </>
    )
} 