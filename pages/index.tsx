import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Periskope Chat</title>
      </Head>
      <div className="flex items-center justify-center h-screen bg-gray-100 text-2xl font-semibold">
        Periskope Chat App is Running!
      </div>
    </>
  )
}
