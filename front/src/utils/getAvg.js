import keys from "../constants/keysReviewForm";

export default function getAvg(lista) {
    const avg = {};
    for (let i = 0; i < lista.length; i++) {
        keys.forEach((v) => {
            // eslint-disable-next-line no-prototype-builtins
            if (!avg.hasOwnProperty(v)) avg[v] = 0;
            avg[v] += lista[i][v];
        });
    }
    keys.forEach((v) => {
        avg[v] = (avg[v] / lista.length).toFixed(1);
    });
    let avgSumaTotal = 0;
    keys.forEach((v) => {
        avgSumaTotal += Number(avg[v]);
    });
    const avgTotal = (avgSumaTotal / keys.length).toFixed(1);
    return { avgLista: avg, avgTotal };
}
