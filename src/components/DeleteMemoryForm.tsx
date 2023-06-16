'use client'

import { FormEvent, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import Cookie from 'js-cookie'
import { useRouter } from 'next/navigation'
import { EmptyMemories } from './EmptyMemories'

export function DeleteMemoryForm(props: any) {
  const isAuthenticated = Cookie.get('token')

  if (!isAuthenticated) {
    return <EmptyMemories />
  }

  const { id } = props;

  const router = useRouter()

  async function handleDeleteMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const token = Cookie.get('token')

    const response = await api.delete(`/memories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // await api.delete(`/memories/${id}`),

    await handleSuccess()

    router.push('/')
  }

  const handleSuccess = async () => {
    alert('Excluído com sucesso!')
  }

}
