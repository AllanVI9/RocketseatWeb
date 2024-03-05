'use client'

import { FormEvent, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import Cookie from 'js-cookie'
import { useRouter } from 'next/navigation'
import { EmptyMemories } from './EmptyMemories'
import { MediaPicker } from './MediaPicker'
import { Camera } from 'lucide-react'

interface Memory {
    id: string
    userId: string
    coverUrl: string
    content: string
    isPublic: boolean
    createdAt: string
}

export function UpdateMemoryForm(props: any) {
    const isAuthenticated = Cookie.get('token')

    if (!isAuthenticated) {
        return <EmptyMemories />
    }

    const { id } = props;

    const router = useRouter()

    let [memory, setMemory] = useState<Memory>({
        id: '',
        userId: '',
        coverUrl: '',
        content: '',
        isPublic: false,
        createdAt: ''
    })

    useEffect(() => {
        handleGetMemory()
    }, [memory.id]);

    async function handleGetMemory() {
        const token = Cookie.get('token')

        const response = await api.get(`/memories/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        // setMemory(memory => ({ ...memory, ...response.data }));
        setMemory(_ => ({ ...response.data }));
    }

    async function handleUpdateMemory(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        const fileToUpload: FormDataEntryValue | null = formData.get('coverUrl') as File

        let coverUrl = ''

        if (fileToUpload && fileToUpload.size > 0) {
            const uploadFormData = new FormData()
            uploadFormData.set('file', fileToUpload)

            const uploadResponse = await api.post('/upload', uploadFormData)

            coverUrl = uploadResponse.data.fileUrl

            setMemory({ ...memory, coverUrl });
        } else {
            coverUrl = memory.coverUrl
        }

        const token = Cookie.get('token')

        await api.put(`/memories/${id}`,
            {
                // coverUrl: coverUrl,
                coverUrl,
                content: formData.get('content'),
                isPublic: formData.get('isPublic'),
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        )

        await handleUpdateSuccess()

        router.push('/')
    }

    const handleUpdateSuccess = async () => {
        alert('Alterado com sucesso!')
    }

    const handleIsPublicChange = async (e: { target: { checked: boolean } }) => {
        setMemory({ ...memory, isPublic: e.target.checked });
    };

    const handleContentChange = async (e: { target: { value: string } }) => {
        setMemory({ ...memory, content: e.target.value });
    };

    return (
        <form onSubmit={handleUpdateMemory} className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-4">
                <label
                    htmlFor="media"
                    className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
                >
                    <Camera className="h-4 w-4" />
                    Anexar mídia
                </label>

                <label
                    htmlFor="isPublic"
                    className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
                >
                    <input
                        type="checkbox"
                        name="isPublic"
                        id="isPublic"
                        className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
                        // defaultChecked={false}
                        // value={+memory.isPublic}
                        checked={memory.isPublic}
                        onChange={handleIsPublicChange}
                    />
                    Tornar memória pública
                </label>
            </div>

            <MediaPicker {...props = { coverUrl: memory.coverUrl }} />

            <textarea
                name="content"
                spellCheck={false}
                className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
                placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
                value={memory.content}
                onChange={handleContentChange}
            />

            <button
                type="submit"
                className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
            >
                Salvar
            </button>
        </form>
    )
}
