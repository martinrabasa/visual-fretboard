<template>
  <div class="max-w-4xl mx-auto h-full text-neutral-800 font-raleway font-bold">
    <div class="py-4 px-2">
      <header class="flex justify-between items-center w-full">
        <h1 class="uppercase font-raleway font-black text-3xl md:text-4xl">Visual Fretboard</h1>
        <button @click="this.toggleSpotify()" v-show="!this.loading"
          class="flex justify-center items-center gap-2 bg-neutral-800 p-2 rounded text-neutral-100 text-xs md:text-sm">
          <span class="max-w-2xs">Search tempo and scales</span>
          <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 496 512">
            <path
              d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z" />
          </svg>
        </button>
      </header>
      <main class="h-full">
        <Fretboard />
        <Metronome />
        <Dialog :open="this.$store.state.showSpotify" @close="this.toggleSpotify()">
          <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
          <DialogPanel>
            <Spotify v-if="this.$store.state.showSpotify" :tracks=tracks />
          </DialogPanel>
        </Dialog>
      </main>
    </div>
  </div>
</template>

<script>
import Fretboard from './components/Fretboard.vue';
import Metronome from './components/Metronome.vue';
import Spotify from './components/Spotify.vue'
import { mapActions, mapMutations } from "vuex";
import {
  Dialog,
  DialogPanel,
} from '@headlessui/vue'

export default {
  components: {
    Fretboard, Metronome, Spotify, Dialog, DialogPanel
  },
  data() {
    return {
      loading: true,
      tracks: []
    }
  },
  created() {
    this.defaultPlaylist();
  },
  methods: {
    ...mapActions(["getAccessToken"]),
    ...mapMutations(["toggleSpotify"]),
    async defaultPlaylist() {
      if (!this.$store.state.tracks) {
        const accessToken = await this.getAccessToken();
        const playlist = "37i9dQZF1DWXRqgorJj26U"; // Rock classics

        if (accessToken) {
          fetch(`https://api.spotify.com/v1/playlists/${playlist}/tracks?limit=30`, {
            method: 'GET',
            headers: {
              "Authorization": "Bearer " + accessToken.access_token,
              "Accept": "application/json",
              "Content-Type": "application/json"
            }
          })
            .then(res => res.json())
            .then(data => this.$store.state.tracks = data.items.map(t => t.track));
          this.loading = false;
        }
      }
    },
  }
}
</script>