import React from 'react';
// import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import CardLayout from '@/UI/Card/CardLayout';
import Chart from '../../Graphs/BarChart';
import Button from '@/UI/Button/Button';

type Props = {}


const WeeklyOverView = (props: Props) => {


    return (
        <>
            <CardLayout className='h-[39rem] mt-8 md:mt-0 col-span-2 lg:col-span-1'>
                <div className="card-body gap-10">
                    <h2 className="card-title-80 text-[2.2rem] leading-[2.7rem]">
                        Weekly OverView
                    </h2>
                    <Chart />
                </div>
                <div className="card-actions justify-center mb-[2rem] ">
                    <Button type='button' className='btn-[#9155fd] h-5 m-auto w-[90%]'>Details</Button>
                </div>
            </CardLayout>
        </>
    )
}

export default WeeklyOverView;