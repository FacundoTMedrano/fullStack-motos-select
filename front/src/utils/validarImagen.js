export default function validarImagen(file) {
    const validTypes = [
        "image/svg+xml",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ];
    const isValidType = validTypes.includes(file.type);
    if (!isValidType) {
        return "no es del tipo adecuado";
    }
    const isValidSize = file.size <= 5 * 1024 * 1024;
    if (!isValidSize) {
        return "tamaño maximo excedido";
    }
}
