import { PigData } from "@/types/pigData";
import { axiosHandler, systemAxios } from "./axiosHandler";
import { axiosHeaderAuth } from "./axiosHeaderAuth";

export async function addPig(values: PigData) {
    const url = '/pig'
    try {
        const res = await axiosHandler.post(url, values);
        if (res.data.status === "fail") throw Error(res.data.message)
        return res.data.data
    } catch (error: any) {
        throw new Error(error.response?.data.message)
    }
}

export async function updatePig(values: PigData) {
    const url = '/pig'
    try {
        const res = await axiosHandler.put(url, values);
        if (res.data.status === "fail") throw Error(res.data.message)
        return res.data.data
    } catch (error: any) {
        throw new Error(error.response?.data.message)
    }
}

export async function getMedicineInventoryNames(context: any) {
    const url = "/medicine-inventory/names";
    try {
        let res;
        if (context) {
            res = await systemAxios.get(url, { headers: axiosHeaderAuth(context) });
        } else {
            res = await axiosHandler.get(url);
        }
        if (res?.data?.status === "fail") throw Error(res.data.message)
        return res.data.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message ? error?.response?.data?.message : error?.message);
    }
}

export async function getFeedInventoryNames(context: any) {
    const url = "/feed-inventory/names";
    try {
        let res;
        if (context) {
            res = await systemAxios.get(url, { headers: axiosHeaderAuth(context) });
        } else {
            res = await axiosHandler.get(url);
        }
        if (res?.data?.status === "fail") throw Error(res.data.message)
        return res.data.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message ? error?.response?.data?.message : error?.message);
    }
}