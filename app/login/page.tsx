export default function Home() {
    return (
        <>
            <main className='bg-makerBg border-4 border-makerYellow mx-[120px] my-[60px] py-10 px-20 flex justify-center rounded-3xl'>
                <div className='flex flex-col gap-6 min-w-[400px]'>
                    <label className='flex flex-col gap-2'>
                        Login
                        <input className='border-2 bg-transparent border-gray-300 rounded-lg h-12' />
                    </label>

                    <label className='flex flex-col gap-2'>
                        Senha
                        <input className='border-2 bg-transparent border-gray-300 rounded-lg h-12' />
                    </label>

                    <button className='border bg-makerYellow p-2 font-medium rounded-xl w-full text-black text-2xl'>
                        Acessar Serviços
                    </button>

                    <div className='flex flex-col gap-2'>
                        <p className='text-center'>Ainda não possui cadastro?</p>
                        <button className='border border-makerYellow p-2 font-medium rounded-xl w-full text-black text-2xl'>
                            Criar Conta
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}
