import { highlight } from "@/components/code/highlight";

/* Pseudocode and implementations of binary search, as plain text (highlighted by highlight()). */

export const PSEUDOCODE = highlight(
  `
procedure binarySearch(A, x)
  lo ← 0;  hi ← n - 1
  while lo ≤ hi do
    mid ← ⌊(lo + hi) / 2⌋
    if A[mid] = x then
      return mid
    else if A[mid] < x then
      lo ← mid + 1
    else
      hi ← mid - 1
  return -1
`,
  "pseudo",
);

const JS = `
function binarySearch(arr, x) {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === x) return mid;
    if (arr[mid] < x) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
`;

const PYTHON = `
def binary_search(arr, x):
    lo = 0
    hi = len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == x:
            return mid
        if arr[mid] < x:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
`;

const JAVA = `
static int binarySearch(int[] arr, int x) {
  int lo = 0;
  int hi = arr.length - 1;
  while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;   // (lo + hi) could overflow int
    if (arr[mid] == x) return mid;
    if (arr[mid] < x) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
`;

export const IMPLEMENTATIONS = [
  { id: "js", label: "JavaScript", lines: highlight(JS, "js") },
  { id: "py", label: "Python", lines: highlight(PYTHON, "py") },
  { id: "java", label: "Java", lines: highlight(JAVA, "java") },
];
