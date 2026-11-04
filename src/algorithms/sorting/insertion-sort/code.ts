import { highlight } from "@/components/code/highlight";

/* Pseudocode and implementations of Insertion Sort, as plain text (highlighted by highlight()). */

export const PSEUDOCODE = highlight(
  `
procedure insertionSort(A, n)
  for i ← 1 to n-1 do
    key ← A[i]
    j ← i-1
    while j ≥ 0 and A[j] > key do
      A[j+1] ← A[j]   // shift to the right
      j ← j-1
    A[j+1] ← key
`,
  "pseudo",
);

const JS = `
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}
`;

const PYTHON = `
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr
`;

const JAVA = `
static void insertionSort(int[] arr) {
  for (int i = 1; i < arr.length; i++) {
    int key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}
`;

export const IMPLEMENTATIONS = [
  { id: "js", label: "JavaScript", lines: highlight(JS, "js") },
  { id: "py", label: "Python", lines: highlight(PYTHON, "py") },
  { id: "java", label: "Java", lines: highlight(JAVA, "java") },
];
