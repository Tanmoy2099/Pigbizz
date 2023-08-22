import React from 'react'

type Props = {
    totalPrice: number;
    title: string;
    cost: number;
    imagePath: string;
    alt: string;
}

const EarningPigCard = (props: Props) => {
    return (
        
            <div className='grid grid-cols-6 justify-center'>
                <img src={props.imagePath} alt={props.alt} />
                <h1 className='col-span-3 text-[1.5rem] opacity-70'>{props.title}</h1>
                <div className='col-span-2'>
                    {/* <h1 className='text-[1.4rem] opacity-70'>₹{props.cost}</h1> */}
                    <h1 className='text-[1.4rem] opacity-70'>₹24,544.25</h1>
                    <progress className="progress progress-primary " value={props.cost} max={props.totalPrice}></progress>
            </div>
        </div>
    )
}

export default EarningPigCard