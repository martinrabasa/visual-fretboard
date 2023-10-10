<template>
    <div class="w-full py-10">
        <div class="flex justify-end items-center gap-4">
            <select v-model="this.$store.state.key"
                class="rounded py-1.5 px-2 bg-neutral-800 text-neutral-100 text-sm cursor-pointer md:text-base" @change="createScale()">
                <option selected disabled hidden value="null">Note</option>
                <option v-for="note, noteIndex in data.notes" :key="note" :value="noteIndex">
                    {{ note.name }}
                </option>
            </select>

            <select v-model="this.$store.state.mode"
                class="rounded py-1.5 px-2 bg-neutral-800 text-neutral-100 text-sm cursor-pointer md:text-base" @change="createScale()">
                <option selected disabled hidden value="null">Scale</option>
                <option v-for="scale, scaleIndex in data.scales" :key="scale" :value="scaleIndex">
                    {{ scale.name }}
                </option>
            </select>
        </div>

        <div class="my-10">
            <div class="flex h-9" v-for="string, stringIndex in data.strings" :key="string">
                <div v-for="fret, fretIndex in data.frets" :key="fret" :class="getFretClass(string, fretIndex)">
                    <div :class="data.notes[getNote(stringIndex, fretIndex)].class"
                        :style="{ visibility: scale.notes != null && scale.notes.includes(getNote(stringIndex, fretIndex)) ? 'visible' : 'hidden' }">
                        <p class="note-label" v-show="data.notes[getNote(stringIndex, fretIndex)].visible">
                            {{ data.notes[getNote(stringIndex, fretIndex)].name }}
                        </p>
                    </div>
                </div>
            </div>
        </div>


        <div class="flex flex-wrap justify-center items-center gap-6">
            <button v-for="degree, index in scale.degrees" :key="degree" :class="degree.class" :title="degree.name"
                @click="clickDegree(index)">
                {{ degree.note != null ? degree.note : degree.symbol }}
            </button>
        </div>
    </div>
</template>

<script>
import data from '../data.json'
export default {
    name: 'Fretboard',
    data() {
        return {
            data: data,
            
            /* USER SCALE */
            scale: {
                name: this.$store.state.mode,
                key: this.$store.state.key,
                pattern: null,
                notes: null,
                degrees: data.degrees,
            },
        }
    },
    watch: {
        '$store.state.key'() {
            this.createScale();
        },
        '$store.state.mode'() {
            this.createScale();
        }
    },
    mounted() {
        this.createScale();
        this.setFretsByWidth();

        window.onresize = () => {
            this.setFretsByWidth();
        }
    },
    methods: {
        createScale() {
            if (this.$store.state.key != null && this.$store.state.mode != null) {
                this.scale.pattern = this.data.scales[this.$store.state.mode].pattern;
                this.scale.notes = this.getNotes();
                this.scale.chords = this.getChords();
            }

            this.defaultLayout();
        },
        setFretsByWidth() {
            if (window.innerWidth < 640) {
                this.data.frets = 8;
            } else if (window.innerWidth < 768) {
                this.data.frets = 10;
            } else if (window.innerWidth < 1024) {
                this.data.frets = 14;
            } else {
                this.data.frets = 17;
            }
        },
        /* Returns the corresponding note to the specified string and fret */
        getNote(string, fret) {
            var result = this.data.stringNotes[string] + fret;

            if (result > 23) {
                result -= 24;
            }
            else if (result > 11) {
                result -= 12;
            }

            return result;
        },

        /* Takes the scale key and based on the scale pattern returns all notes of the scale */
        getNotes() {
            var index = this.$store.state.key;
            var result = [index];

            for (let i = 0; i < (this.scale.pattern.length); i++) {
                index += this.scale.pattern[i];
                if (index > 11) {
                    index -= 12;
                }
                result.push(index);
            }

            return result;
        },

        getChords() {
            var result = [];

            for (let i = 0; i < this.scale.notes.length; i++) {
                var chord = [];
                chord.push(this.scale.notes[i]);

                var index = i;
                for (let y = 0; y < 2; y++) {
                    index += 2;
                    if (index > 6) {
                        index -= 7;
                    }
                    chord.push(this.scale.notes[index]);
                }

                var firstThird = this.thirdDetector(chord[0], chord[1]);
                var secondThird = this.thirdDetector(chord[1], chord[2]);

                if (firstThird == "minor" && secondThird == "minor") {
                    this.scale.degrees[i].note = (this.data.notes[chord[0]].name + "dim");
                }
                else if (firstThird == "minor" && secondThird == "major") {
                    this.scale.degrees[i].note = (this.data.notes[chord[0]].name.toLowerCase());
                }
                else if (firstThird == "major" && secondThird == "minor") {
                    this.scale.degrees[i].note = (this.data.notes[chord[0]].name);
                }
                else if (firstThird == "major" && secondThird == "major") {
                    this.scale.degrees[i].note = (this.data.notes[chord[0]].name + "aug");
                }
            }

            return result;
        },

        thirdDetector(tonic, third) {
            if (third < tonic) {
                third += 12;
            }
            if (third - tonic == 3) {
                return "minor";
            } else if (third - tonic == 4) {
                return "major";
            }
        },

        clickDegree(index) {
            const degree = "w-14 bg-neutral-800 text-neutral-100 rounded shadow py-4 text-lg lg:text-xl lg:py-6 lg:w-20";

            if (this.scale.degrees[index].class == degree) {
                this.scale.degrees[index].class = `${degree} ` + this.scale.degrees[index].name.toLowerCase();
            }
            else {
                this.scale.degrees[index].class = degree
            }

            var fNote = this.scale.notes[index];

            if (this.data.notes[fNote].class.includes(this.scale.degrees[index].name.toLowerCase())) {
                this.data.notes[fNote].class = "note " + this.scale.notes[index].name;
                this.data.notes[fNote].visible = false;
            }
            else {
                this.data.notes[fNote].class += " " + this.scale.degrees[index].name.toLowerCase();
                this.data.notes[fNote].visible = true;
            }
        },

        /* Returns fret class based on the specified string and fret position */
        getFretClass(stringIndex, fretIndex) {
            var result = "w-full border-x-2 border-t-2 border-neutral-400 flex items-center justify-center";

            if (fretIndex == 0) {
                result += " w-1/2 border-l-0 border-r-8 border-r-neutral-700";
            }
            else if (fretIndex == 1) {
                result += " border-l-0";
            }
            else if (fretIndex == this.data.frets - 1) {
                result += " border-r-0 w-1/2";
            }

            if (stringIndex == 6) {
                result += " border-l-0 border-r-0"
            }

            return result;
        },

        defaultLayout() {
            const degree = "w-14 bg-neutral-800 text-neutral-100 rounded shadow py-4 text-lg lg:text-xl lg:py-6 lg:w-20";

            var notes = this.data.notes;
            for (let i = 0; i < notes.length; i++) {
                notes[i].class = `note ${notes[i].name}`;
                notes[i].visible = false;
            }

            var degrees = this.scale.degrees;
            for (let i = 0; i < this.scale.degrees.length; i++) {
                degrees[i].class = degree;
            }

            notes[this.scale.notes[0]].class = `note ${notes[this.scale.notes[0]].name} tonic`;
            notes[this.scale.notes[0]].visible = true;
            degrees[0].class = `${degree} tonic`;
        }
    }
}
</script>