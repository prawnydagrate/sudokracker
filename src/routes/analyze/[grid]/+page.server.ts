import { error } from "@sveltejs/kit";

export async function load({ params: { grid: gridStr } }) {
    if (
        gridStr.length != 81 ||
        !"0123456789".includes(Array.from(new Set(gridStr)).sort().join(""))
    ) {
        throw error(400, { message: "Invalid grid" });
    }
    const grid = [];
    let ptr = 0;
    while (ptr < 81) {
        let newPtr = ptr + 9;
        grid.push(gridStr.substring(ptr, newPtr).split("").map(digit => parseInt(digit)));
        ptr = newPtr;
    }
    const zeroes = [];
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] == 0) {
                zeroes.push([y, x]);
            }
        }
    }
    return { grid, zeroes };
}