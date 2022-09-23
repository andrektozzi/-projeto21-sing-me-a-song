export default function isArrSorted(resultData) {
    const arrScoresResult = [];
    resultData.map((el: any) => arrScoresResult.push(el.score));
  
    const isArrSorted = arrScoresResult.every(function (x, i) {
      return i === 0 || x <= arrScoresResult[i - 1];
    });
  
    return isArrSorted;
}