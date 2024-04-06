/**
 * 
 * @returns A random GUID (Globally Unique Identifier) in the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 */
export function generateGUID(): string {
    // Generate a random hexadecimal string of length 8 for each segment
    const segment1 = Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, "0");
    const segment2 = Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, "0");
    const segment3 = Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, "0");
    const segment4 = Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, "0");

    // Concatenate segments with hyphens to form the GUID
    const guid = `${segment1}-${segment2}-${segment3}-${segment4}`;

    return guid;
};
