<template>
    <div class="w-full flex flex-col items-center justify-between py-4 px-6 
                bg-neutral-800 text-neutral-100 rounded lg:flex-row">
        <h1 class="uppercase text-xl font-black hidden lg:block">Metronome</h1>
        <div class="flex flex-col-reverse items-center justify-center gap-2 lg:flex-row">
            <button class="hidden lg:block" v-on:click="this.$store.state.tempo--">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                    class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
            <input type="range" v-model="this.$store.state.tempo" min="20" max="300">
            <button class="hidden lg:block" v-on:click="this.$store.state.tempo++">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                    class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
            <input class="bpm outline-none text-neutral-800 text-center w-12 p-2 rounded" min="20" max="300" v-model="this.$store.state.tempo" type="number">
        </div>
        <button class="metronome-play" @click="toggle()">
            <svg v-if="playing" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                class="h-16 w-16">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                class="h-16 w-16">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
            </svg>
        </button>
    </div>
</template>

<script>
export default {
    name: "Metronome",
    data() {
        return {
            playing: false,
            audioContext: null,
            audioBuffer: null,
            currentTime: null
        }
    },
    computed: {
        getTempo() {
            return this.$store.state.tempo;
        }
    },
    mounted() {
        this.initContext();
    },
    methods: {
        toggle() {
            if (!this.playing) {
                this.currentTime = this.audioContext.currentTime;
                this.playing = true;
                this.play();
            } else {
                this.playing = false;
            }
        },

        play() {
            this.currentTime += 60 / this.$store.state.tempo;

            const source = this.audioContext.createBufferSource();
            source.buffer = this.audioBuffer;
            source.connect(this.audioContext.destination);
            source.onended = this.playing ? this.play : "";
            source.start(this.currentTime);
        },

        async initContext() {
            this.audioContext = new AudioContext();

            this.audioBuffer = await fetch("click.wav")
                .then(res => res.arrayBuffer())
                .then(arrayBuffer =>
                    this.audioContext.decodeAudioData(arrayBuffer)
                )
        }
    }
}
</script>

<style>
.bpm[type=number] {
    -moz-appearance: textfield;
}
</style>