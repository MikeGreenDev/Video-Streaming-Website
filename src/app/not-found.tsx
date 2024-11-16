import Link from 'next/link'

export default function NotFound() {
    return (
        <div className='text-center m-auto'>
            <h2>Not Found</h2>
            <p>Could not find requested resource</p>
            <Link href="/"><button className='btn'>Return Home</button></Link>
        </div>
    )
}
