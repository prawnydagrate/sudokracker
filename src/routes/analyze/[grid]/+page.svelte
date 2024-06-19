<script lang="ts">
    import { get } from "svelte/store";
    import { grid as gridStore } from "../../../stores.ts";
    export let data;
    const { grid, zeroes } = data;
    $gridStore = grid;

    type SudokuGrid = number[][];

    function isValid(
        n: number,
        grid: SudokuGrid,
        row: number,
        col: number,
    ): boolean {
        if (grid[row].includes(n)) {
            return false;
        } else if (grid.map((row) => row[col]).includes(n)) {
            return false;
        }
        const subgridRowStart = Math.floor(row / 3) * 3;
        const subgridColStart = Math.floor(col / 3) * 3;
        return !grid
            .slice(subgridRowStart, subgridRowStart + 3)
            .flatMap((row) => row.slice(subgridColStart, subgridColStart + 3))
            .includes(n);
    }

    function solveBacktracking(
        grid: SudokuGrid,
        row: number,
        col: number,
    ): SudokuGrid | null {
        gridStore.set(grid);
        if (row == 9) {
            return grid;
        } else if (col == 9) {
            return solveBacktracking(grid, row + 1, 0);
        } else if (grid[row][col] != 0) {
            return solveBacktracking(grid, row, col + 1);
        }
        for (let n = 1; n <= 9; n++) {
            if (isValid(n, grid, row, col)) {
                grid[row][col] = n;
                const res = solveBacktracking(grid, row, col);
                if (res != null) {
                    return res;
                }
                grid[row][col] = 0;
            }
        }
        return null;
    }

    function solveSudoku(): boolean {
        const grid = get(gridStore);
        let res = solveBacktracking(grid, 0, 0);
        if (res != null) {
            gridStore.set(grid);
        }
        return res != null;
    }
</script>

<svelte:head>
    <title>sudokracker | Analyze</title>
</svelte:head>
<h1>Analyze</h1>
<hr />
<div class="center">
    <table id="grid">
        {#each $gridStore as row, y}
            <tr>
                {#each row as cell, x}
                    <td class="row-{y} col-{x}">
                        {#if cell != 0}
                            {#if zeroes.find(([f, s]) => f == y && s == x) != null}
                                <strong>{cell}</strong>
                            {:else}
                                {cell}
                            {/if}
                        {/if}
                    </td>
                {/each}
            </tr>
        {/each}
    </table>
    <button id="solve-button" on:click={() => solveSudoku()}>Solve</button>
</div>

<style>
    * {
        font-family:
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            "Open Sans",
            "Helvetica Neue",
            sans-serif;
    }

    .center {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    h1 {
        text-align: center;
    }

    table#grid td {
        border: 1px solid black;
        width: 60px;
        height: 60px;
        text-align: center;
        font-size: 24pt;
        background-color: lightcyan;
        color: #333;
        transition-duration: 100ms;
    }

    table#grid td:hover {
        background-color: lightyellow;
    }

    table#grid {
        border-collapse: collapse;
        margin: 1rem;
    }

    table#grid td.row-2,
    table#grid td.row-5 {
        border-bottom-width: 3px;
    }

    table#grid td.row-3,
    table#grid td.row-6 {
        border-top-width: 3px;
    }

    table#grid td.col-2,
    table#grid td.col-5 {
        border-right-width: 3px;
    }

    table#grid td.col-3,
    table#grid td.col-6 {
        border-left-width: 3px;
    }

    table#grid td.row-0 {
        border-top-width: 2px;
    }

    table#grid td.col-0 {
        border-left-width: 2px;
    }

    table#grid td.row-8 {
        border-bottom-width: 2px;
    }

    table#grid td.col-8 {
        border-right-width: 2px;
    }

    button#solve-button {
        margin: 1rem;
        padding: 8px;
        background-color: #333;
        color: #bbffbb;
        border: 1px solid #bbffbb;
        border-radius: 48px;
        width: 480px;
        height: 80px;
        font-size: 32pt;
        transition-duration: 200ms;
    }

    button#solve-button:hover {
        background-color: #bbffbb;
        color: #333;
    }
</style>
