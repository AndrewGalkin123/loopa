import { highlight } from "@/components/code/highlight";

/* Pseudocode and implementations of Heap Sort, as plain text (highlighted by highlight()). */

export const PSEUDOCODE = highlight(
  `
procedure heapSort(A)
  n ← length(A)
  for i ← ⌊n/2⌋-1 downto 0 do      // build a max-heap
    siftDown(A, i, n)
  for end ← n-1 downto 1 do
    swap(A[0], A[end])             // the maximum goes to the end
    siftDown(A, 0, end)

procedure siftDown(A, i, size)
  largest ← i
  l ← 2i+1
  r ← 2i+2
  if l < size and A[l] > A[largest] then
    largest ← l
  if r < size and A[r] > A[largest] then
    largest ← r
  if largest ≠ i then
    swap(A[i], A[largest])
    siftDown(A, largest, size)
`,
  "pseudo",
);

const JS = `
function heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(arr, i, n);
  for (let end = n - 1; end >= 1; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    siftDown(arr, 0, end);
  }
  return arr;
}

function siftDown(arr, i, size) {
  let largest = i;
  const l = 2 * i + 1;
  const r = 2 * i + 2;
  if (l < size && arr[l] > arr[largest]) largest = l;
  if (r < size && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    siftDown(arr, largest, size);
  }
}
`;

const PYTHON = `
def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        sift_down(arr, i, n)
    for end in range(n - 1, 0, -1):
        arr[0], arr[end] = arr[end], arr[0]
        sift_down(arr, 0, end)
    return arr

def sift_down(arr, i, size):
    largest = i
    l, r = 2 * i + 1, 2 * i + 2
    if l < size and arr[l] > arr[largest]:
        largest = l
    if r < size and arr[r] > arr[largest]:
        largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        sift_down(arr, largest, size)
`;

const JAVA = `
static void heapSort(int[] arr) {
  int n = arr.length;
  for (int i = n / 2 - 1; i >= 0; i--) siftDown(arr, i, n);
  for (int end = n - 1; end >= 1; end--) {
    swap(arr, 0, end);
    siftDown(arr, 0, end);
  }
}

static void siftDown(int[] arr, int i, int size) {
  int largest = i;
  int l = 2 * i + 1, r = 2 * i + 2;
  if (l < size && arr[l] > arr[largest]) largest = l;
  if (r < size && arr[r] > arr[largest]) largest = r;
  if (largest != i) {
    swap(arr, i, largest);
    siftDown(arr, largest, size);
  }
}

static void swap(int[] arr, int i, int j) {
  int t = arr[i]; arr[i] = arr[j]; arr[j] = t;
}
`;

export const IMPLEMENTATIONS = [
  { id: "js", label: "JavaScript", lines: highlight(JS, "js") },
  { id: "py", label: "Python", lines: highlight(PYTHON, "py") },
  { id: "java", label: "Java", lines: highlight(JAVA, "java") },
];
