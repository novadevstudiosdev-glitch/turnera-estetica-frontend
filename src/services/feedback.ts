'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

type FeedbackResponse = {
  message?: string;
};

export async function submitFeedback(content: string) {
  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error('El comentario no puede estar vacío.');
  }

  const baseUrl = API_BASE_URL ? API_BASE_URL.replace(/\/$/, '') : '';
  const url = baseUrl ? `${baseUrl}/api/feedback` : '/api/feedback';
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('turnera_access_token') : null;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ content: trimmed }),
  });

  if (!response.ok) {
    let message = 'No pudimos enviar tu comentario. Intentá nuevamente.';
    try {
      const data = (await response.json()) as FeedbackResponse;
      if (data?.message) {
        message = data.message;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  try {
    return (await response.json()) as FeedbackResponse;
  } catch {
    return {};
  }
}
