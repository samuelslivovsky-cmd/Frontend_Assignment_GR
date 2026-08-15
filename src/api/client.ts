const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://frontend-assignment-api.goodrequest.dev'

export type ApiMessageType = 'ERROR' | 'WARNING' | 'INFO' | 'SUCCESS'

export type ApiMessage = {
  message: string
  type: ApiMessageType
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status)
  }

  return response.json() as Promise<T>
}

/** The API layer has no translations, so an unlabelled failure borrows the caller's wording. */
export function errorMessage(error: unknown, fallback: string): string {
  return (error instanceof Error && error.message) || fallback
}

// The API reports failures through the same `messages` envelope it uses for success.
async function readErrorMessage(response: Response): Promise<string> {
  const body = (await response.json().catch(() => null)) as { messages?: ApiMessage[] } | null

  return body?.messages?.[0]?.message ?? ''
}
