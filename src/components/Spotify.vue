<template>
    <div class="fixed top-0 right-0">
        <div class="flex items-center">
            <button @click="this.toggleSpotify()"
                class="py-4 px-1 text-neutral-100 bg-neutral-900 rounded-tl rounded-bl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
            <div class="bg-neutral-900 h-screen max-w-xs md:max-w-md">
                <div class="spotify-search">
                    <input 
                        v-model="input" 
                        ref="focus" 
                        class="spotify-search-input font-normal text-sm"
                        placeholder="Search songs..."
                        @keydown.enter="searchTrack()">
                    <button class="spotify-search-btn" @click="!this.loading && searchTrack()">
                        <svg v-if="this.loading" class="animate-spin w-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="search">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </button>
                </div>
                <div class="tracks">
                    <div v-for="t in this.$store.state.tracks" class="track bg-neutral-900" :key="t.id"
                        @click="getTrack(t.id)">
                        <img class="track-img" :src="t.album.images[2].url" alt="">
                        <div class="track-data">
                            <p class="track-name">{{ t.name }}</p>
                            <p class="track-artist">{{ t.artists[0].name }} - {{ t.album.name }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
export default {
    name: 'Spotify',
    props: {
        tracks: Array,
    },
    data() {
        return {
            expiryTime: null,
            loading: false,
            input: "",
        };
    },
    mounted() {
        this.$refs.focus.focus()
    },
    methods: {
        ...mapActions(["getAccessToken"]),
        ...mapMutations(["toggleSpotify"]),
        async searchTrack() {
            if (this.input.length > 0) {
                this.loading = true;
                const accessToken = await this.getAccessToken();
                await fetch(`https://api.spotify.com/v1/search?q=${this.input}&type=track&limit=50`, {
                    headers: {
                        "Authorization": "Bearer " + accessToken.access_token,
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    }
                })
                    .then(res => res.json())
                    .then(data => this.$store.state.tracks = data.tracks.items);
                this.loading = false;
            }
        },
        async getTrack(id) {
            const accessToken = await this.getAccessToken();

            await fetch(`https://api.spotify.com/v1/audio-features/${id}`, {
                headers: {
                    "Authorization": "Bearer " + accessToken.access_token,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            })
                .then(res => res.json())
                .then(data => this.$store.commit('setTrack', data))
                .then(this.$store.state.showSpotify = false)
        },
    }
}
</script>

<style>
.spotify {
    background-color: var(--dark-color);
    width: 24rem;
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.spotify-search {
    padding: 1.5rem;
    display: flex;
    align-items: center;
    position: relative;
}

.spotify-search-input {
    border: none;
    border-radius: 20px;
    padding: 0.5rem 1rem;
    width: 100%;
    outline: none;
    font-family: Roboto;
    -webkit-box-shadow: 3px 3px 9px -3px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 3px 3px 9px -3px rgba(0, 0, 0, 0.2);
    box-shadow: 3px 3px 9px -3px rgba(0, 0, 0, 0.2);
}

.spotify-search-btn {
    position: absolute;
    right: 0;
    margin-right: 2.3rem;
    color: var(--grey-color);
    border: none;
    background-color: transparent;
    font-size: 1rem;
    outline: none;
    margin-bottom: 1px;
    display: flex;
    align-items: center;
}

.tracks {
    position: stricky;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-color: rgb(87, 87, 87) var(--grey-color);
    scrollbar-width: thin;
    max-height: calc(100vh - 5rem);
}

.track {
    height: 5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    color: #fff;
}

.track:hover {
    background-color: var(--grey-color);
}

.track-img {
    height: 100%;
    padding: 3px 6px;
}

.track-data {
    display: flex;
    flex-direction: column;
}

.track-name {
    font-size: 1.1rem;
    margin-bottom: 0.3rem;
}

.track-artist {
    font-size: 0.8rem;
    color: rgb(117, 117, 117);
}

.search {
    height: 1.4rem;
    width: 1.4rem;
}
</style>
