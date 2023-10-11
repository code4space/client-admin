"use client"
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect, FormEvent } from 'react';
import { Input, InputEmail, InputFile } from '@/components/input';
import { useDispatch, useSelector } from 'react-redux';
import { UserState } from '@/store/reducers/user';
import { getUser } from '@/store/actions/fetchUser';
import axios from 'axios';
import { baseUrl } from '@/constant/url';
import { getCookie } from '@/components/cookie';
import { swalError, swalTopEnd } from '@/components/swal';

export default function Page() {
    const dispatch = useDispatch();
    const user: any = useSelector((state: UserState) => state.UserReducer.user);

    const [openModal, setOpenModal] = useState(false)
    const [userInfo, setUserInfo] = useState<any>({
        email: 'email@yahoo.com',
        phone: '+12 3456789',
        position: 'Fullstack Developer',
        name: 'Jaden Smith',
        image: "",
        id: ''
    })

    useEffect(() => {
        async function fetchData() {
            dispatch(getUser(1))
        }
        fetchData()
    }, [])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();

        // Append the form fields to formData
        for (const key in userInfo) {
            formData.append(key, userInfo[key]);
        }

        console.log(formData)
        try {
            await axios.patch(baseUrl + `/admin`, formData, {
                headers: { access_token: getCookie('access_token') },
            }).then((res) => {
                setUserInfo({ ...userInfo, image: res.data.imagePath })
                swalTopEnd("Update Success")
                dispatch(getUser())
                setOpenModal(false)
            })
        } catch (error) {
            swalError(error);
        }
    };

    function handleClick(id: string) {
        setOpenModal(true)
        const { _id, email, phone, name, position, image } = user.find(({ _id }: any) => _id === id)
        setUserInfo({ id: _id, email, phone, name, position, image })
    }

    console.log(userInfo)
    return (
        <div className={openModal ? 'profile-container' : ''}>
            <div className='card-box'>
                <p className='title'><b>ADMIN</b></p>
                <table className='history'>
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Position</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.map(({ name, email, position, phone, image, _id }: any, i: number) => {
                            return (
                                <tr key={i}>
                                    <td>{name}</td>
                                    <td>{email}</td>
                                    <td>{position}</td>
                                    <td>{phone}</td>
                                    <td><button onClick={() => handleClick(_id)}>Ubah</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            {openModal ? <div className="modal">
                <div className="content">
                    <div className="header">
                        <h2>Edit Profile</h2>
                        <CloseIcon onClick={() => setOpenModal(false)} />
                    </div>
                    <form className="main" onSubmit={handleSubmit}>
                        <div className="inputBox">
                            <Input placeHolder={"Name"} state={userInfo} setState={setUserInfo} value={"name"} />
                        </div>
                        <div className="inputBox">
                            <Input placeHolder={"Posisi"} state={userInfo} setState={setUserInfo} value={"position"} />
                        </div>
                        <div className="inputBox">
                            <InputEmail placeHolder={"Email"} state={userInfo} setState={setUserInfo} value={"email"} />
                        </div>
                        <div className="inputBox">
                            <Input placeHolder={"Phone Number"} state={userInfo} setState={setUserInfo} value={"phone"} />
                        </div>
                        <div className="inputBox">
                            <InputFile required={false} state={userInfo} setState={setUserInfo} value={"image"} />
                        </div>
                        <span></span>
                        <button className='basic-button' type='submit'>Simpan</button>
                    </form>
                </div>
            </div> : null}
        </div>
    )
}
