import { highlight } from "@/components/code/highlight";

/* Pseudocode and implementations of Selection Sort, as plain text (highlighted by highlight()). */

export const PSEUDOCODE = highlight(
  `
procedure selectionSort(A)
  n ← length(A)
  for i ← 0 to n-2 do
    min ← i
    for j ← i+1 to n-1 do
      if A[j] < A[min] then
        min ← j
    swap(A[i], A[min])
`,
  "pseudo",
);

const JS = `
function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[min]) min = j;
    }
    [arr[i], arr[min]] = [arr[min], arr[i]];
  }
  return arr;
}
`;

const PYTHON = `
def selection_sort(arr):
    for i in range(len(arr) - 1):
        min_index = i
        for j in range(i + 1, len(arr)):
            if arr[j] < arr[min_index]:
                min_index = j
        arr[i], arr[min_index] = arr[min_index], arr[i]
    return arr
`;

const JAVA = `
static void selectionSort(int[] arr) {
  for (int i = 0; i < arr.length - 1; i++) {
    int min = i;
    for (int j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[min]) min = j;
    }
    int t = arr[i];
    arr[i] = arr[min];
    arr[min] = t;
  }
}
`;

export const IMPLEMENTATIONS = [
  { id: "js", label: "JavaScript", lines: highlight(JS, "js") },
  { id: "py", label: "Python", lines: highlight(PYTHON, "py") },
  { id: "java", label: "Java", lines: highlight(JAVA, "java") },
];
