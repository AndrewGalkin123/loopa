import { highlight } from "@/components/code/highlight";

/* Pseudocode and implementations of linear search, as plain text (highlighted by highlight()). */

export const PSEUDOCODE = highlight(
  `
procedure linearSearch(A, x)
  for i ← 0 to n - 1 do
    if A[i] = x then
      return i
  return -1
`,
  "pseudo",
);

const JS = `
function linearSearch(arr, x) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === x) return i;
  }
  return -1;
}
`;

const PYTHON = `
def linear_search(arr, x):
    for i in range(len(arr)):
        if arr[i] == x:
            return i
    return -1
`;

const JAVA = `
static int linearSearch(int[] arr, int x) {
  for (int i = 0; i < arr.length; i++) {
    if (arr[i] == x) return i;
  }
  return -1;
}
`;

export const IMPLEMENTATIONS = [
  { id: "js", label: "JavaScript", lines: highlight(JS, "js") },
  { id: "py", label: "Python", lines: highlight(PYTHON, "py") },
  { id: "java", label: "Java", lines: highlight(JAVA, "java") },
];
