/**
 * Centralized query key factory for React Query.
 *
 * Pattern: mỗi entity có 1 object với các hàm trả về key array.
 * - Key cha ngắn hơn dùng cho invalidateQueries (partial match)
 * - Key con cụ thể hơn dùng cho getQueryData / setQueryData (exact match)
 *
 * Ví dụ:
 *   CART_KEYS.all              → ['cart']
 *   CART_KEYS.detail(userId)   → ['cart', userId]
 *
 *   invalidateQueries(CART_KEYS.all) → invalidate tất cả cart queries ✅
 *   setQueryData(CART_KEYS.detail(id), data) → set đúng key ✅
 */

// ─── Cart ────────────────────────────────────────────────────────────────────
export const CART_KEYS = {
  /** ['cart'] — dùng cho invalidateQueries (partial match tất cả cart queries) */
  all: ['cart'] as const,
  /** ['cart', userId] — dùng cho getQueryData / setQueryData */
  detail: (userId: string | undefined) => [...CART_KEYS.all, userId] as const,
};

// ─── Books ───────────────────────────────────────────────────────────────────
export const BOOK_KEYS = {
  /** ['books'] */
  all: ['books'] as const,
  /** ['books', filters] — dùng cho danh sách sách với filter */
  list: (filters: object) => [...BOOK_KEYS.all, filters] as const,
  /** ['books', 'detail'] */
  details: () => [...BOOK_KEYS.all, 'detail'] as const,
  /** ['books', 'detail', id] */
  detail: (id: string) => [...BOOK_KEYS.details(), id] as const,
};

// ─── Category ────────────────────────────────────────────────────────────────
export const CATEGORY_KEYS = {
  /** ['categories'] */
  all: ['categories'] as const,
  /** ['categories', 'structure'] — cây category */
  structure: () => [...CATEGORY_KEYS.all, 'structure'] as const,
};

// ─── Address ─────────────────────────────────────────────────────────────────
export const ADDRESS_KEYS = {
  /** ['addresses'] */
  all: ['addresses'] as const,
  /** ['addresses', 'list'] */
  list: () => [...ADDRESS_KEYS.all, 'list'] as const,
};
