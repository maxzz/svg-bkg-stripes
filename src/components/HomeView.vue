<template>
    <div class="container">
        <div class="controls">
            <button @click="clearBoxes">Clear boxes</button>
            <button @click="addBoxes">Add 10 boxes</button>
            <button @click="addBox">Add box</button>
        </div>
    
        <div class="svg-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <defs>
                    <linearGradient id="bkg-frame">
                        <stop offset="0%"   stop-color="olive" />
                        <stop offset="100%" stop-color="red" />
                    </linearGradient>
                </defs>

                <rect width="100" height="100" stroke="url(#bkg-frame)" stroke-width=".5" fill="aliceblue" />
                
                <rect x="50" y="50" width="2" height="2" stroke="red" stroke-width="1" fill="tomato" />

                <rect
                    v-for="box in boxes"
                    :key="box.id"
                    x="0"
                    y="0"
                    :width="box.w"
                    :height="box.h"
                    :fill="box.cH"
                    :transform ="`rotate(${box.a}, ${box.x + box.w / 2}, ${box.y + box.h / 2}) translate(${box.x}, ${box.y})`"
                />
            </svg>
        </div>

        <div class="stats">Total boxes: {{boxes.length}}</div>
        <div class="controls">
            <label>
                <input type="checkbox" v-model="optRotate" @click="onRotate"> Rotate
            </label>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, onMounted, reactive, ref, watch } from "vue";
    import { Box, generateRandomBox, generateRandomBoxes, useTimeout } from '../core/stripes';

    export default defineComponent({
        setup() {
            let state = reactive< { boxes: Box[]; optRotate: boolean } >({
                boxes: [],
                optRotate: false,
            });

            onMounted(() => state.boxes.push(...generateRandomBoxes(1)));

            const clearBoxes = () => state.boxes.length = 0;
            const addBox = () => state.boxes.push(generateRandomBox());
            const addBoxes = () => state.boxes.push(...generateRandomBoxes(10));

            const { onRotate } = useTimeout(() => {
                state.boxes.forEach((_) => _.a = (_.a + 30) % 360);
            });

            return {
                ...state,
                clearBoxes,
                addBox,
                addBoxes,
                onRotate,
            };
        },
    });
</script>

<style lang="scss">
    .container {
        background-color: tomato;
        width: 100%;
        height: 100%;
        position: relative;
    }
    .controls {
        padding: 1em 0;
        user-select: none;

        button {
            padding: .4em;
            margin-left: .2em;
        }
    }
    .svg-wrap {
        svg {
            width: 80vw;
            border: 4px solid white;
            //height: 400px;
        }
    }
</style>