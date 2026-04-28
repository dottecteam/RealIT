"use client";
 
import Switch from "./Switch";
 
export default function RegionFilter(){
    return (
        <div className="relative w-full sm:w-1/2">
            <div className="bg-white rounded-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-4 min-h-[60px] flex justify-center items-center gap-5">
                <Switch />
                <h2 className="text-[#202AD0] font-bold">Visualização por UF</h2>
            </div>    
        </div>
    );
}
 