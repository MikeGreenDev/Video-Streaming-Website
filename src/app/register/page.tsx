'use client'

import axios from 'axios'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/lib/Input'

interface InitialStateProps {
    username: string,
    email: string,
    password: string
}

const initialState: InitialStateProps = {
    username: '',
    email: '',
    password: ''
}

export default function page() {
    const router = useRouter()
    const [state, setState] = useState<InitialStateProps>(initialState)
    const [error, setError] = useState<String>("")

    const onSubmit = (event: FormEvent) => {
        event.preventDefault()

        if (!state.username || !state.email || !state.password) {
            setError("All Fields must be filled")
            return
        }

        axios.post('/api/register', state)
            .then(() => {
                router.refresh()
            })
            .then(() => {
                setTimeout(() => {
                    router.push('/login')
                }, 2500)
            })
            .catch((err: any) => {
                setError(err.response.data.error || "Unknown Error")
            })
            .finally(() => {
            })
    }

    function handleChange(event: any) {
        setState({ ...state, [event.target.name]: event.target.value });
    }

    return (
        <form onSubmit={onSubmit} className='text-center w-min m-auto [&_input]:text-black'>
            <h1 className='text-left text-3xl mt-[2rem] font-bold'>Register</h1>
            <div className='flex flex-col justify-center w-[20rem] mx-auto mt-[.5rem] mb-[1rem] gap-2'>
                <Input placeholder='Username' id='username' type='text' name='username' onChange={handleChange} value={state.username} autoComplete='off'/>
                <Input placeholder='Email' id='email' type='email' name='email' onChange={handleChange} value={state.email} autoComplete='username'/>
                <Input placeholder='Password' id='password' type='password' name='password' onChange={handleChange} value={state.password} autoComplete='new-password'/>
                <button className='border-2 rounded-2xl border-black w-min m-auto px-4 py-2' type='submit'>Submit</button>
            </div>
            {error != "" && <div className='min-w-96 w-min m-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'>{error}</div>}

            <div>
                <div>Already have an Account? <Link className='text-blue-500 hover:underline' href='/login'>Log in</Link></div>
            </div>
        </form>
    )
}
