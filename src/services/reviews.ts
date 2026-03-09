'use client';

export type ReviewRecord = {
  id: string;
  reviewerName: string;
  comment: string;
  rating: number;
  isApproved: boolean;
  createdAt?: string | null;
  appointmentId?: string;
  adminResponse?: string | null;
};

type RawReview = Record<string, unknown>;

type FetchOptions = {
  token?: string | null;
  signal?: AbortSignal;
};

type CreatePayload = {
  appointmentId: string;
  rating: number;
  comment?: string;
  reviewerName?: string;
};

type ApprovePayload = {
  id: string;
  isApproved: boolean;
  token?: string | null;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const reviewsUrl = apiBaseUrl ? `${apiBaseUrl.replace(/\/$/, '')}/api/reviews` : '/api/reviews';

const coerceBoolean = (value: unknown) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'si', 'sí', 'approved', 'aprobado'].includes(normalized)) {
      return true;
    }
    if (['false', '0', 'no', 'pending', 'pendiente', 'rejected', 'rechazado'].includes(normalized)) {
      return false;
    }
  }
  return undefined;
};

const normalizeReview = (raw: RawReview, index: number): ReviewRecord => {
  const idValue =
    (raw.id as string | number | undefined) ??
    (raw._id as string | number | undefined) ??
    (raw.reviewId as string | number | undefined) ??
    `review-${index + 1}`;
  const reviewerNameValue =
    (raw.reviewerName as string | undefined) ??
    (raw.reviewer_name as string | undefined) ??
    (raw.user as { fullName?: string; name?: string; email?: string } | undefined)?.fullName ??
    (raw.user as { fullName?: string; name?: string; email?: string } | undefined)?.name ??
    (raw.user as { fullName?: string; name?: string; email?: string } | undefined)?.email ??
    (raw.patientName as string | undefined) ??
    'Cliente';
  const commentValue =
    (raw.comment as string | undefined) ??
    (raw.message as string | undefined) ??
    (raw.text as string | undefined) ??
    '';
  const ratingRaw =
    (raw.rating as number | string | undefined) ??
    (raw.score as number | string | undefined) ??
    (raw.stars as number | string | undefined);
  const ratingValue = Math.min(5, Math.max(1, Number(ratingRaw) || 5));
  const approvedCandidate = raw.isApproved ?? raw.is_approved ?? raw.approved;
  const approvedValue = coerceBoolean(approvedCandidate);
  return {
    id: String(idValue),
    reviewerName: String(reviewerNameValue).trim() || 'Cliente',
    comment: String(commentValue).trim(),
    rating: ratingValue,
    isApproved: approvedValue ?? false,
    createdAt:
      (raw.createdAt as string | undefined) ??
      (raw.created_at as string | undefined) ??
      (raw.date as string | undefined) ??
      null,
    appointmentId:
      (raw.appointmentId as string | undefined) ??
      (raw.appointment_id as string | undefined) ??
      (raw.appointment as { id?: string } | undefined)?.id,
    adminResponse:
      (raw.adminResponse as string | undefined) ??
      (raw.admin_response as string | undefined) ??
      null,
  };
};

const parseList = (raw: unknown): RawReview[] => {
  if (Array.isArray(raw)) return raw as RawReview[];
  if (raw && typeof raw === 'object') {
    const wrapped = raw as { data?: unknown; results?: unknown; items?: unknown };
    if (Array.isArray(wrapped.data)) return wrapped.data as RawReview[];
    if (Array.isArray(wrapped.results)) return wrapped.results as RawReview[];
    if (Array.isArray(wrapped.items)) return wrapped.items as RawReview[];
  }
  return [];
};

const parseResponse = async (response: Response) => {
  const rawText = await response.text();
  if (!rawText) return null;
  try {
    return JSON.parse(rawText) as unknown;
  } catch {
    return rawText;
  }
};

export async function fetchReviews(options: FetchOptions = {}) {
  const headers: HeadersInit = {};
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  const response = await fetch(reviewsUrl, {
    method: 'GET',
    headers,
    signal: options.signal,
  });
  const payload = await parseResponse(response);
  if (!response.ok) {
    const message =
      (payload as { message?: string; error?: string })?.message ??
      (payload as { message?: string; error?: string })?.error ??
      'No pudimos cargar las reseñas.';
    throw new Error(message);
  }
  return parseList(payload).map((item, index) => normalizeReview(item, index));
}

export async function createReview(payload: CreatePayload, token?: string | null) {
  if (!payload.appointmentId) {
    throw new Error('Selecciona el turno que querés reseñar.');
  }
  if (!payload.rating || payload.rating < 1) {
    throw new Error('Selecciona una calificación válida.');
  }
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(reviewsUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      appointmentId: payload.appointmentId,
      rating: payload.rating,
      comment: payload.comment?.trim() || undefined,
      reviewerName: payload.reviewerName?.trim() || undefined,
    }),
  });
  const responsePayload = await parseResponse(response);
  if (!response.ok) {
    const message =
      (responsePayload as { message?: string; error?: string })?.message ??
      (responsePayload as { message?: string; error?: string })?.error ??
      'No pudimos enviar tu reseña.';
    throw new Error(message);
  }
  return responsePayload;
}

export async function approveReview(payload: ApprovePayload) {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (payload.token) headers.Authorization = `Bearer ${payload.token}`;
  const response = await fetch(`${reviewsUrl}/${payload.id}/approve`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      isApproved: payload.isApproved,
    }),
  });
  const responsePayload = await parseResponse(response);
  if (!response.ok) {
    const message =
      (responsePayload as { message?: string; error?: string })?.message ??
      (responsePayload as { message?: string; error?: string })?.error ??
      'No pudimos actualizar la aprobación.';
    throw new Error(message);
  }
  return responsePayload;
}
