
import { useRouter } from "next/router";
import { useEffect } from "react";


export default function Custom404() {

    const router = useRouter()

    useEffect(() => {
        router.replace("/");
    }, [])


    return <div className="h-[95vh] w-full flex justify-center items-center"><h1 className="font-bold text-2xl lg:text-5xl">Sorry! Page Not found </h1></div>
}
