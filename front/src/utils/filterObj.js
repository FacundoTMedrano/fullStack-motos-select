export default function filterObj(obj) {
    return Object.fromEntries(
        Object.entries(obj).filter(
            (v) =>
                v[1] !== undefined &&
                v[1] !== null &&
                v[1] !== "" &&
                !(Array.isArray(v[1]) && v[1].length === 0)
        )
    );
}
