'use client'

import {SetStateAction, Dispatch, useState} from "react";
import { Input, InputProps } from "@/components/ui/input"
import {useFormContext} from "react-hook-form";
import {cn} from "@/lib/utils";

type InputTagsProps = InputProps & {
    tags: string[]
    setTags: Dispatch<SetStateAction<string[]>>
}

export const InputTags = ({onChange,value}:InputTagsProps)=>{
    const [pendingDataPoint,setPendingDataPoint] = useState<string>('')
    const [focused,setFocused] = useState<boolean>(false)
    
    function addPendingDataPoint(){
        if (pendingDataPoint){
            const newDataPoints = new Set([...value,pendingDataPoint])
            onChange(Array.from(newDataPoints))
            setPendingDataPoint('')
        }
    }
    
    const { setFocus } = useFormContext()
    
    return(
        <div className={cn('min-h-[40px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',focused ? 'ring-offset-2 outline-none ring-ring ring-2' : 'ring-offset-0 outline-none ring-ring ring-0')} onClick={()=>setFocus('Tags')}>
            <h1></h1>
        </div>
    )
}