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
                <circle cx="50%" cy="50%" r=".5" stroke="red" stroke-width=".2" fill="none" />

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
                <input type="checkbox" @click="onGlobalAngleOn"> Use global angle
            </label>
                <input class="inp-text input-number" type="number" v-model="globalAngle">
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, onMounted, reactive, ref, toRefs, watch } from "vue";
    import { Box, generateRandomBox, generateRandomBoxes, useTimeout } from '../core/stripes';

    //TODO: Limit number of overlapping bars

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
                if (state.globalAngleOn) {
                    state.globalAngle = (state.globalAngle + 30)  % 360;
                }

                state.boxes.forEach((box) => {
                    if (state.globalAngleOn) {
                       box.angle = state.globalAngle;
                    } else {
                        box.angle = (box.angle + 30) % 360;
                    }
                });
            });

            function onGlobalAngleOn(event: MouseEvent) {
                state.globalAngleOn = (event.target as HTMLInputElement).checked;

                if (state.globalAngleOn) {
                    state.boxes.forEach((box) => box.angle = state.globalAngle);
                    console.log('a', state.globalAngle);
                }
            }

            watch(() => state.globalAngle, () => {
                if (state.globalAngleOn) {
                    state.boxes.forEach((box) => box.angle = state.globalAngle);
                    console.log('update');
                }
            });

            return {
                ...toRefs(state),
                clearBoxes,
                addBox,
                addBoxes,
                onRotate,
                onGlobalAngleOn,
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
        max-width: 4em;
    }
</style>
