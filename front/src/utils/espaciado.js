export default function espaciado(palabra) {
    return palabra
        .split(/(?=[A-Z])/)
        .map((v) => {
            return `${v.charAt(0).toUpperCase()}${v.slice(1)}`;
        })
        .join(" ");
}
