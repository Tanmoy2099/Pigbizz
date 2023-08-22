import React from 'react'

type Props = {
    title: string;
    value: number | string;
    backgroundColor: string;
    valueColor: string;
    svgColor: string;

}

const ValueCard = (props: Props) => {



    return (

        <div className={`w-[48%] aspect-square md:w-[25.5rem] md:h-[20.7rem] relative overflow-hidden rounded flex justify-center items-center `} style={{ backgroundColor: props.backgroundColor }}>
            <div className='text-center'>
                <h1 className='text-2xl'>{props.title}</h1>
                <h2 className={`text-6xl `} style={{ color: props.valueColor }}>{props.value}</h2>
                <h1 className='text-2xl'>Pieces</h1>
            </div>

            <div className='w-fit h-fit absolute bottom-0 left-0 right-0 -z-20'>
                <svg width="255" height="64" viewBox="0 0 255 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M268.5 54C268.5 83.5125 145.643 71.7214 70.2565 71.7214C-5.13007 71.7214 -3.9988 103.184 -3.99906 25.2466C-3.99906 -4.26588 21.5 48.5 161.5 16.9999C405 -25.5 268.5 24.4875 268.5 54Z" fill={props.svgColor}
                    //  fill-opacity="0.15" 
                    />
                </svg>
            </div>

        </div>
    )
}

export default ValueCard;