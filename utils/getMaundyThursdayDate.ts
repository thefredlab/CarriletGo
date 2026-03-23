export default function getMaundyThursdayDate(year?: number): Date {
    let y = year ?? new Date().getFullYear();

    if (!Number.isInteger(y) || y < 1583) {
        throw new RangeError(
            "Year must be an integer greater than or equal to 1583."
        );
    }

    let a = y % 19,
        b = Math.floor(y / 100),
        c = y % 100,
        d = Math.floor(b / 4),
        e = b % 4,
        f = Math.floor((b + 8) / 25),
        g = Math.floor((b - f + 1) / 3),
        h = (19 * a + b - d - g + 15) % 30,
        i = Math.floor(c / 4),
        k = c % 4,
        l = (32 + 2 * e + 2 * i - h - k) % 7,
        m = Math.floor((a + 11 * h + 22 * l) / 451),
        month = Math.floor((h + l - 7 * m + 114) / 31),
        day = ((h + l - 7 * m + 114) % 31) + 1;

    let maundyThursday = new Date(y, month - 1, day - 3);

    maundyThursday.setHours(0, 0, 0, 0);

    return maundyThursday;
}
