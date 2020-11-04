<template>
    <div class="container">
        <div class="controls">
            <button class="inp-btn" @click="clearBoxes">Clear boxes</button>
            <button class="inp-btn" @click="addBoxes">Add 10 boxes</button>
            <button class="inp-btn" @click="addBox">Add box</button>
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
                
                <circle cx="50%" cy="50%" r="1%" stroke="green" stroke-width=".3%" fill="tomato" />
                <!-- <rect x="50" y="50" width="1" height="1" stroke="red" stroke-width="1" fill="tomato" /> -->

                <rect
                    v-for="box in boxes"
                    :key="box.id"
                    x="0"
                    y="0"
                    :width="box.w"
                    :height="box.h"
                    :fill="box.fill"
                    :transform ="`rotate(${box.angle}, ${box.x + box.w / 2}, ${box.y + box.h / 2}) translate(${box.x}, ${box.y})`"
                />
            </svg>
        </div>

        <div class="stats">Total boxes: {{boxes.length}}</div>
        <div class="options">
            <label>
                <input type="checkbox" v-model="optRotate" @click="onRotate"> Rotate
            </label>
            <label>
                <input type="checkbox" v-model="globalAngleOn" @click="onRotate"> Use global angle
                <input class="inp-text input-number" type="number" v-model="globalAngle">
            </label>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, onMounted, reactive, ref, watch } from "vue";
    import { Box, generateRandomBox, generateRandomBoxes, useTimeout } from '../core/stripes';

    export default defineComponent({
        setup() {
            let state = reactive<{
                    boxes: Box[];
                    optRotate: boolean,
                    globalAngle: number;
                    globalAngleOn: boolean;
                }>({
                boxes: [],
                optRotate: false,
                globalAngle: 0,
                globalAngleOn: false,
            });

            onMounted(() => state.boxes.push(...generateRandomBoxes(1)));

            const clearBoxes = () => state.boxes.length = 0;
            const addBox = () => state.boxes.push(generateRandomBox());
            const addBoxes = () => state.boxes.push(...generateRandomBoxes(10));

            const { onRotate } = useTimeout(() => {
                state.boxes.forEach((_) => _.angle = (_.angle + 30) % 360);
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

        .controls {
            padding: 1em 0;
        }

        .svg-wrap {
            svg {
                width: 80vw;
                border: 4px solid white;
                //height: 400px;
            }
        }

        .options {
            padding: 1em 0;
        }
    }

    // Common controls

    label {
        user-select: none;
    }

    .inp-btn {
        padding: .4em;
        margin-left: .2em;
        user-select: none;
    }

    .inp-text {
        padding: .3em;
        border-radius: 3px;
        border: 1px solid #bbb;
        font: inherit;
        font-size: 1rem;
    }

    .input-number {
        max-width: 3em;
    }
</style>
