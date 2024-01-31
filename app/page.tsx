import Image from 'next/image'

export default function Home() {
    return (
        <>
            <section>
                <div className="relative w-full h-screen">
                    {/* Image Container */}
                    <div className="relative w-full h-full">
                        <Image
                            src={
                                'https://images.unsplash.com/photo-1518882174711-1de40238921b?q=80&w=2458&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' as string
                            }
                            layout="fill"
                            objectFit="cover"
                            quality={100}
                            alt="Background"
                        />
                    </div>
                </div>
            </section>
        </>
    )
}
