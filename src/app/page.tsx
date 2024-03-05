import { EmptyMemories } from '@/components/EmptyMemories'
import { api } from '@/lib/api'
import { cookies } from 'next/headers'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import Image from 'next/image'
import Link from 'next/link'
import { EventHandler, FormEvent, MouseEventHandler } from 'react'
import { DeleteMemory } from '@/components/DeleteMemory'
// import { ArrowRight } from 'lucide-react'

dayjs.locale(ptBR)

interface Memory {
  id: string
  coverUrl: string
  excerpt: string
  createdAt: string
}

export default async function Home() {
  const isAuthenticated = cookies().has('token')

  if (!isAuthenticated) {
    return <EmptyMemories />
  }

  const token = cookies().get('token')?.value

  const response = await api.get('/memories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memories: Memory[] = response.data

  if (memories.length === 0) {
    return <EmptyMemories />
  }

  async function handleGetMemory() {
    const response = await api.get('/memories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const memories: Memory[] = response.data

    if (memories.length === 0) {
      return <EmptyMemories />
    }
  }

  // async function handleDeleteMemory(event: any, id: string) {
  // async function handleDeleteMemory(id: string) {
  // const handleClick = event => {
  const handleDeleteMemory = async (event: any, id: string) => {
    event.preventDefault();
    // const mouseEvent = event as MouseEventHandler<HTMLAnchorElement> | undefined
    const response = await api.delete(`/memories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // await handleSuccess()

    // router.push('/')
  }

  // Call this function whenever you want to
  // refresh props!
  // const refreshData = () => {
  //   const router = useRouter();
  //   router.replace(router.asPath);
  // }

  return (
    <div className="flex flex-col gap-10 p-8">
      {memories.map((memory) => {
        return (
          <div key={memory.id} className="space-y-4">
            <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
              {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
            </time>
            <Image
              src={memory.coverUrl}
              alt=""
              width={592}
              height={280}
              className="aspect-video w-full rounded-lg object-cover"
            />
            <p className="text-lg leading-relaxed text-gray-100">
              {memory.excerpt}
            </p>
            {/* <Link
              href={`/memories/${memory.id}`}
              className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100"
            >
              Ler mais
              <ArrowRight className="h-4 w-4" />
            </Link> */}
            <Link
              className="inline-block rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
              href={{
                pathname: '/memories/update',
                query: { id: memory.id },
              }}
            >Alterar
            </Link>
            {/* <Link
              className="inline-block rounded-full bg-red-500 ml-5 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-red-600"
              href='/'
            // onClick={() => handleDeleteMemory(memory.id)}
            >Excluir
            </Link> */}
            {/* <Link
              className="inline-block rounded-full bg-red-500 ml-5 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-red-600"
              href=''
            >
              <a onClick={(e) => { handleDeleteMemory(e, memory.id) }}>
                Excluir
              </a>
            </Link> */}
            {/* <a href=''
              className="inline-block rounded-full bg-red-500 ml-5 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-red-600"
            // onClick={(e) => handleDeleteMemory(e, memory.id)}
            >
              Excluir
            </a> */}
            {/* <a
              className="inline-block rounded-full bg-red-500 ml-5 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-red-600"
              onClick={() => console.log("clicked")}>Excluir
            </a> */}
            <DeleteMemory {... { id: memory.id, token }} />
          </div>
        )
      })}
    </div >
  )
}
