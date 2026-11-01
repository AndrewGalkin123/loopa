import { highlight } from "@/components/code/highlight";

/* Pseudocode and implementations of interpolation search, as plain text (highlighted by highlight()). */

export const PSEUDOCODE = highlight(
  `
procedure interpolationSearch(A, x)
  lo ← 0;  hi ← n - 1
  while lo ≤ hi and A[lo] ≤ x ≤ A[hi] do
    if A[lo] = A[hi] then
      pos ← lo
    else
      pos ← lo + ⌊(x - A[lo]) · (hi - lo) / (A[hi] - A[lo])⌋
    if A[pos] = x then
      return pos
    else if A[pos] < x then
      lo ← pos + 1
    else
      hi ← pos - 1
  return -1
`,
  "pseudo",
);

const JS = `
function interpolationSearch(arr, x) {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi && arr[lo] <= x && x <= arr[hi]) {
    const pos = arr[lo] === arr[hi]
      ? lo
      : lo + Math.floor(((x - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo]));
    if (arr[pos] === x) return pos;
    if (arr[pos] < x) lo = pos + 1;
    else hi = pos - 1;
  }
  return -1;
}
`;

const PYTHON = `
def interpolation_search(arr, x):
    lo = 0
    hi = len(arr) - 1
    while lo <= hi and arr[lo] <= x <= arr[hi]:
        if arr[lo] == arr[hi]:
            pos = lo
        else:
            pos = lo + (x - arr[lo]) * (hi - lo) // (arr[hi] - arr[lo])
        if arr[pos] == x:
            return pos
        if arr[pos] < x:
            lo = pos + 1
        else:
            hi = pos - 1
    return -1
`;

const JAVA = `
static int interpolationSearch(int[] arr, int x) {
  int lo = 0;
  int hi = arr.length - 1;
  while (lo <= hi && arr[lo] <= x && x <= arr[hi]) {
    int pos = lo;
    if (arr[lo] != arr[hi]) {
      // long: the product could overflow int
      pos = lo + (int) ((long) (x - arr[lo]) * (hi - lo) / (arr[hi] - arr[lo]));
    }
    if (arr[pos] == x) return pos;
    if (arr[pos] < x) lo = pos + 1;
    else hi = pos - 1;
  }
  return -1;
}
`;

export const IMPLEMENTATIONS = [
  { id: "js", label: "JavaScript", lines: highlight(JS, "js") },
  { id: "py", label: "Python", lines: highlight(PYTHON, "py") },
  { id: "java", label: "Java", lines: highlight(JAVA, "java") },
];
