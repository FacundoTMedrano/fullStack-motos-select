import keys from "../constants/keysReviewForm";

export default function reviewAvgUserPuntos(obj) {
    let suma = 0;
    for (let i = 0; i < keys.length; i++) {
        suma += obj[keys[i]];
    }
    return (suma / keys.length).toFixed(1);
}
