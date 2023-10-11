"use client"
import { useEffect, useState } from "react"
import HistorySharpIcon from '@mui/icons-material/HistorySharp';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import KeyboardDoubleArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';
import { useDispatch, useSelector } from "react-redux";
import { UserState } from "@/store/reducers/user";
import { getLogger, getUser } from "@/store/actions/fetchUser";
import { swalErrorWithMessage } from "@/components/swal";
import axios from "axios";
import { baseUrl1 } from "@/constant/url";
import { getCookie } from "@/components/cookie";

export default function Page() {
    const logger: any = useSelector((state: any) => state.UserReducer.logger);
    const dispatch = useDispatch()

    useEffect(() => {
        (async function fetchData() {
            await axios({
                url: `${baseUrl1}/logger`,
                method: 'PATCH',
                headers: { access_token: getCookie("access_token") }
            })
        })()
        dispatch(getLogger())
    }, [])

    function dateFormat(dateStr: string): string {
        const dateTime = new Date(dateStr)
        const date = dateTime.toISOString().split('T')[0]; // Extract the date part
        const hour = `${dateTime.getHours()}`.padStart(2, '0'); // Get the hour (0-23)
        const minute = `${dateTime.getMinutes()}`.padStart(2, '0'); // Get the minute (0-59)
        const time = `${hour}:${minute}`
        return date + ' ' + time
    }

    return (
        <>
            <div className='card-box'>
                <p className='title'><HistorySharpIcon /><b>History</b></p>
                <table className='history'>
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logger.map(({ createdAt: date, description }: any, i: number) => {
                            return (
                                <tr key={i}>
                                    <td>{dateFormat(date)}</td>
                                    <td>{description}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}
