'use client'
import { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Input from '@/lib/Input'

interface InitialStateProps {
    email: string,
    password: string
}

const initialState: InitialStateProps = {
    email: '',
    password: ''
}

export default function page() {
    const router = useRouter()
    const searchParams = useSearchParams();
    const [state, setState] = useState<InitialStateProps>(initialState)
    const [err, setErr] = useState<string | null>(null)

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault()
        let s = state
        s.email = s.email.toLowerCase()

        await signIn('credentials', {
            ...s,
            redirect: false,
        }).then((callback) => {
            let callbackUrl = searchParams.get('callbackUrl')
            if (callback?.ok) {
                router.push(callbackUrl || '/')
                router.refresh()
            }

            if (callback?.error) {
                setErr('Wrong Credentials')
                throw new Error('Wrong Credentials')
            }
        })
    }


    function handleChange(event: any) {
        setState({ ...state, [event.target.name]: event.target.value });
    }

    return (
        <div>
            <form onSubmit={onSubmit} className='text-center'>
                <div className='w-full text-[2rem] text-semibold text-center pb-[1.5rem] pt-[4rem]'>
                    Log In
                </div>
                <div className='flex flex-col justify-center h-fit w-[350px] mx-auto gap-2'>
                    <Input placeholder='Email' id='email' type="email" name='email' onChange={handleChange} value={state.email} />
                    <Input placeholder='Password' id='password' type="password" name='password' onChange={handleChange} value={state.password} />
                    <button className='border-2 rounded-2xl border-black w-min m-auto px-4 py-2 mt-4' type='submit'>Submit</button>
                </div>
                {err &&
                    <div className='text-red-600'>
                        {err}
                    </div>
                }

                <div>
                    <div className='mt-[1rem]'>Haven't got an account ? <Link href='/register' className='text-blue-500 hover:underline'>Sign up</Link></div>
                </div>
            </form>
        </div>
    )
}
