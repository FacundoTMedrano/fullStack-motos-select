export const base = "http://localhost:5173";
export default {
    marcas: {
        admin: {
            getById: (id) => `${base}/marcas/${id}`,
            postCrear: () => `${base}/marcas/`,
            delete: (id) => `${base}/marcas/${id}`,
            patch: (id) => `${base}/marcas/${id}`,
        },
        user: { getAll: () => `${base}/marcas/` },
    },
    estilos: {
        admin: {
            Postcrear: () => `${base}/estilos/`,
            delete: (id) => `${base}/estilos/${id}`,
            patch: (id) => `${base}/estilos/${id}`,
        },
        user: { getAll: () => `${base}/estilos/` },
    },
    cilindradas: {
        admin: {
            getById: (id) => `${base}/cilindradas/${id}`,
            delete: (id) => `${base}/cilindradas/${id}`,
            put: (id) => `${base}/cilindradas/${id}`,
            postCreate: () => `${base}/cilindradas/`,
        },
        user: { getAll: () => `${base}/cilindradas/` },
    },
    motos: {
        user: { getAll: () => `${base}/motos/` },
        admin: {
            postCrear: () => `${base}/motos/`,
            getById: (id) => `${base}/motos/${id}`,
            patch: (id) => `${base}/motos/${id}`,
            delete: (id) => `${base}/motos/${id}`,
        },
    },
    auth: {
        sinUsuario: {
            getRefresh: () => `${base}/auth/refresh`,
            postLogOut: () => `${base}/auth/logout`,
            postLogin: () => `${base}/auth/login`,
            postRegister: () => `${base}/auth/register`,
            postVerifyEmail: () => `${base}/auth/verify-email`,
            postResetPassword: () => `${base}/auth/reset-password`,
            postForgotPass: () => `${base}/auth/forgot-password`,
        },
        user: { postChangePass: () => `${base}/auth/change_password` },
    },
    reviews: {
        admin: {
            getAll: () => `${base}/reviews/get-all`,
            getByUser: (id) => `${base}/reviews/get-by-user/${id}`,
            getSingleReview: (id) => `${base}/reviews/get-single-review/${id}`,
            delete: (id) => `${base}/reviews/delete-by-admin/${id}`,
            patchUpdateState: (id) =>
                `${base}/reviews/update-state-by-admin/${id}`,
        },
        user: {
            getAllByMoto: (id) => `${base}/reviews/moto/${id}`,
            postCrear: () => `${base}/reviews/create`,
            getMyReviews: () => `${base}/reviews/my-reviews`,
            getMySingleReview: (id) => `${base}/reviews/get-review/${id}`,
            deleteMyReview: (id) => `${base}/reviews/delete/${id}`,
            patchUpdateMyReview: (id) => `${base}/reviews/update/${id}`,
        },
    },
    user: {
        admin: { getAll: () => `${base}/user` },
    },
};
