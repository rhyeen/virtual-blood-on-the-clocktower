export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export function shuffleNumberRange(startNumber: number, endNumber: number): any[] {
  const arr = [];
  for(let i = startNumber; i <= endNumber; i++) {
    arr.push(i);
  }
  shuffleArray(arr);
  return arr;
}
