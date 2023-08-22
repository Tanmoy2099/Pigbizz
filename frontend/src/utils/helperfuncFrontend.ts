import { pagination } from "@/types/pagination";
import { systemAxios } from "./axiosHandler";
import { axiosHeaderAuth } from "./axiosHeaderAuth";

export function paginationUrl({ l = 10, p = 0 }: pagination) {
    return `?l=${l}&p=${p}`
}


export async function getSettings(context: any) {
    try {
        const url = `/settings`;
        const res = await systemAxios.get(url, { headers: axiosHeaderAuth(context) })
        if (res.data.status !== 'ok') {
            throw new Error(res.data.message)
        }
        return res.data.data

    } catch (error: any) {
        throw new Error(error?.response?.data?.message ? error?.response?.data?.message : error?.message)
    }
}

export async function getFeedType(context: any) {
    try {
        const url = `/feed-inventory/type`;
        const res = await systemAxios.get(url, { headers: axiosHeaderAuth(context) })
        if (res.data.status !== 'ok') {
            throw new Error(res.data.message)
        }
        return res.data.data

    } catch (error: any) {
        throw new Error(error?.response?.data?.message ? error?.response?.data?.message : error?.message)
    }
}

export function pagination({ l = 10, p = 0 }: pagination) {
    return `?l=${l}&p=${p}`
}