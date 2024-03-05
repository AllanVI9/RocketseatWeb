'use client'

import { api } from "@/lib/api";
import Link from "next/link"
import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

export function DeleteMemory(memory: any) {
  const router = useRouter()

  let { id, token } = memory;

  // const [status, setStatus] = useState<number>(0);
  // useEffect(() => {
  // }, [status]);

  const handleDeleteMemory = async (event: any) => {
    event.preventDefault();

    try {
      const response = await api.delete(`/memories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      //if (response.status == 200) {
      await handleDeleteSuccess()
      //await refreshData()
      //setStatus(response.status)
      // token = ''
      router.push('/')
      //}
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleDeleteSuccess = async () => {
    alert('Excluído com sucesso!')
  }

  return (
    <Link
      href='/'
      className="inline-block rounded-full bg-red-500 ml-5 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-red-600"
      onClick={(event) => handleDeleteMemory(event)}
    >Excluir
    </Link>
  )
}
