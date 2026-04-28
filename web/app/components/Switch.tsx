"use client"

import { useState } from "react"

export default function Switch(){
    const [ativo, setAtivo] = useState(false)

    return(
        <>
            <div className="flex justify-center gap-3">
                <button className={`toggled-btn ${ativo ? 'ativo' : ''}`} onClick={() => setAtivo(!ativo)}>
                    <div className="thumb" />
                </button>
            </div>

            <style>{`
                .toggled-btn{
                    background-color: #b7b9ba;
                    border: 1px solid #aaa;
                    border-radius: 99px;
                    width: 40px;
                    height: 22px;
                    transition: background-color 0.1s ease, border-color 0.2s ease, 0.6s ease all;
                    cursor: pointer;
                    position: relative;
                }

                .toggled-btn .thumb{
                    height: 15px;
                    width: 15px;
                    background-color: #fff;
                    border-radius: 999px;
                    transform: translateX(0);
                    position: absolute;
                    left: 3px;
                    top: 50%;
                    transform: translateY(-50%);
                    transition: 0.4s ease all;
                }

                .toggled-btn.ativo{
                    background-color: #202AD0;
                    border: none;
                }

                .toggled-btn:hover{
                    border-color: #6f6f6f;
                }

                .toggled-btn.ativo .thumb{
                    left: calc(50px - 30px);
                }
            
            `}
            </style>
        </>
        
    );
}