<template>
    <div class="spotify">
        <button @click="this.toggleSpotify()" class="py-4 px-5 text-neutral-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
            </svg>
        </button>
        <div class="spotify-search">
            <input v-model="input" class="spotify-search-input font-normal text-sm" placeholder="Search songs...">
            <button class="spotify-search-btn" @click="searchTrack()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                    class="search">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </button>
        </div>
        <div class="tracks">
            <div v-for="t in this.$store.state.tracks" class="track" :key="t.id" @click="getTrack(t.id)">
                <img class="track-img" :src="t.album.images[2].url" alt="">
                <div class="track-data">
                    <p class="track-name">{{ t.name }}</p>
                    <p class="track-artist">{{ t.artists[0].name }} - {{ t.album.name }}</p>
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
            input: "",
        };
    },
    methods: {
        ...mapActions(["getAccessToken"]),
        ...mapMutations(["toggleSpotify"]),
        async searchTrack() {
            if(this.input.length > 0) {
                const accessToken = await this.getAccessToken();
                await fetch(`https://api.spotify.com/v1/search?q=${this.input}&type=track&limit=50`, {
                    headers: {
                        "Authorization": "Bearer " + accessToken.access_token,
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    }})
                    .then(res => res.json())
                    .then(data => this.$store.state.tracks = data.tracks.items);
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
    padding-inline: 1.5rem;
    padding-bottom: 1.5rem;
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
    margin-right: 1.9rem;
    color: var(--grey-color);
    border: none;
    background-color: transparent;
    cursor: pointer;
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
    background-color: var(--dark-color);
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