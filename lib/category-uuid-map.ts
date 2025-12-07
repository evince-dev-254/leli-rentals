/**
 * Category ID Mapping
 * Maps frontend string IDs to database UUIDs
 * These UUIDs must match the ones in database/seed_categories.sql
 */

export const CATEGORY_UUID_MAP: Record<string, string> = {
    vehicles: '11111111-1111-1111-1111-111111111111',
    homes: '22222222-2222-2222-2222-222222222222',
    equipment: '33333333-3333-3333-3333-333333333333',
    electronics: '44444444-4444-4444-4444-444444444444',
    fashion: '55555555-5555-5555-5555-555555555555',
    entertainment: '66666666-6666-6666-6666-666666666666',
    events: '77777777-7777-7777-7777-777777777777',
    photography: '88888888-8888-8888-8888-888888888888',
    fitness: '99999999-9999-9999-9999-999999999999',
    baby: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    office: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    bikes: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
}

/**
 * Convert a string category ID to its UUID
 * @param stringId - The string ID (e.g., 'electronics')
 * @returns The corresponding UUID or null if not found
 */
export function getCategoryUUID(stringId: string): string | null {
    return CATEGORY_UUID_MAP[stringId] || null
}

/**
 * Convert a UUID back to its string ID
 * @param uuid - The UUID
 * @returns The corresponding string ID or null if not found
 */
export function getCategoryStringId(uuid: string): string | null {
    const entry = Object.entries(CATEGORY_UUID_MAP).find(([_, id]) => id === uuid)
    return entry ? entry[0] : null
}
