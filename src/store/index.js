import { createStore } from "vuex";

export default createStore({
    state: {
        tempo: 120,
        key: 0,
        mode: 0,
        loading: false,
        accessToken: null,
        track: null,
        tracks: null,
        showSpotify: false,
    },
    mutations: {
        setTrack(state, track) {
            state.tempo = Math.round(track.tempo);
            state.key = track.key;
            state.mode = track.mode == 1 ? 5 : 0;
            state.track = track;
        },
        loading(state) {
            state.loading = false;
        },
        toggleSpotify(state) {
            state.showSpotify = !state.showSpotify;
        },
    },
    actions: {
        async newAccessToken() {
            const token = await fetch(
                "https://accounts.spotify.com/api/token",
                {
                    method: "POST",
                    headers: new Headers({
                        "Content-Type": "application/x-www-form-urlencoded",
                    }),
                    body: new URLSearchParams({
                        grant_type: "client_credentials",
                        client_id: import.meta.env.VITE_CLIENT_ID,
                        client_secret: import.meta.env.VITE_CLIENT_SECRET,
                    }),
                }
            )
                .then((res) => res.json())
                .then((data) => (this.accessToken = data))
                .catch((error) => console.log(error));
        },
        async getAccessToken({ dispatch }) {
            if (this.expiryTime == null || this.expiryTime < Date.now()) {
                await dispatch("newAccessToken");
            }

            return this.accessToken;
        },
    },
    modules: {},
    getters: {},
});
