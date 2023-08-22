import CardLayout from '@/UI/Card/CardLayout';
import React from 'react'

type Props = {}

const DifferentCosts = (props: Props) => {


    const partsCss = `h-[40%] w-[50%] flex justify-center items-center `;
    const titleCss = "card-title-80 text-[1.4rem] leading-[1.7rem] opacity-80 mb-2";
    const priceCss = "card-title-80 text-[2.5rem] leading-[2.4rem] opacity-80"


    return (
        <div className='grid w-full grid-cols-2 md:grid-cols-2 grid-rows-2  md:gap-[2.9rem]'>
            {/* Medicine */}
            <CardLayout className='col-span-1'>
                <div className={partsCss}><img className='h-[4rem] w-[4rem]' src="/images/medicine.svg" alt="medicine" /></div>
                <div className="gap-1">
                    <h2 className={titleCss}>
                        Medicine
                    </h2>
                    <h2 className={priceCss}>
                        ₹20.5k
                    </h2>
                </div>
            </CardLayout>

            {/* Feed */}
            <CardLayout className='col-span-1'>
                <div className={partsCss}><img className='h-[4rem] w-[4rem]' src="/images/feed.svg" alt="feed" /></div>
                <div className=" gap-1">
                    <h2 className={titleCss}>
                        Feed
                    </h2>
                    <h2 className={priceCss}>
                        ₹20.5k
                    </h2>
                </div>
            </CardLayout>

            {/* Crew Cost */}
            <CardLayout className='col-span-1'>
                <div className={partsCss}><img className='h-[4rem] w-[4rem]' src="/images/CrewCost.svg" alt="CrewCost" /></div>
                <div className=" gap-1">
                    <h2 className={titleCss}>
                        Crew Cost
                    </h2>
                    <h2 className={priceCss}>
                        ₹20.5k
                    </h2>
                </div>
            </CardLayout>

            {/* P&L */}
            <CardLayout className='col-span-1'>
                <div className={partsCss}><img className='h-[4rem] w-[4rem]' src="/images/P&L.svg" alt="P&L" /></div>
                <div className="card-body gap-1">
                    <h2 className={titleCss}>
                        P&L
                    </h2>
                    <h2 className={priceCss}>
                        ₹20.5k
                    </h2>
                </div>
            </CardLayout>
        </div>
    )
}

export default DifferentCosts;