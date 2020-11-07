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

                <rect width="100%" height="100%" stroke="url(#bkg-frame)" stroke-width=".5" fill="aliceblue" />
                <circle cx="50%" cy="50%" r=".5" stroke="red" stroke-width=".2" fill="none" />

                <!-- <rect x="0" y="0" width="100%" height="4px" stroke="none" fill="green" transform="rotate(45, 50, 2) translate(50, 50)" />
                <circle :cx="`${0 + 100 / 2}`" :cy="`${0 + 4 / 2}`" r="1" fill="blue" /> -->

                <g transform="rotate(45, 50, 50) ">
                    <rect width="100%" height="4px" stroke="none" fill="green" />
                    <circle :cx="`${0 + 100 / 2}`" :cy="`${0 + 4 / 2}`" r="1" fill="blue" />
                </g>

                <rect
                    v-for="box in boxes"
                    :key="box.id"
                    x="0"
                    y="0"
                    :width="box.w"
                    :height="box.h"
                    :fill="box.fill"
                    :transform ="`rotate(${getBoxAngle(box)}, ${box.x + box.w / 2}, ${box.y + box.h / 2}) translate(${box.x}, ${box.y})`"
                />
            </svg>
        </div>

        <div class="stats">Total boxes: {{boxes.length}}</div>
        <div class="options">
            <div class="inp-group">
                <label>
                    <input type="checkbox" @click="onRotate"> Rotate
                </label>
                <label>
                    Step
                    <input class="inp-text input-number" type="range" min="0" max="359" step="1" v-model="globalAngle">
                </label>
            </div>

            <div class="inp-group">
                <label>
                    <input type="checkbox" @click="onGlobalAngleOn"> Use global angle
                </label>
                <input class="inp-text input-number" type="number" v-model="globalAngle">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, onMounted, reactive, Ref, ref, toRef, toRefs, watch } from "vue";
    import { Box, generateRandomBox, generateRandomBoxes, useTimeout, useGlobalRotationAngle } from '../core/stripes';

    //TODO: Limit number of overlapping bars

    export default defineComponent({
        setup() {
            let state = reactive<{
                    boxes: Box[];
                }>({
                boxes: [],
            });

            onMounted(() => state.boxes.push(...generateRandomBoxes(1)));

            const clearBoxes = () => state.boxes = [];
            const addBox = () => state.boxes.push(generateRandomBox());
            const addBoxes = () => state.boxes.push(...generateRandomBoxes(10));

            const gAngle = useGlobalRotationAngle(toRef(state, 'boxes'));

            const getBoxAngle = (box: Box) => gAngle.state.globalAngleOn ? gAngle.state.globalAngle : box.angle;

            const { onRotate } = useTimeout(() => {
                if (gAngle.state.globalAngleOn) {
                    gAngle.state.globalAngle = (gAngle.state.globalAngle + 30)  % 360;
                }

                state.boxes.forEach((box) => {
                    if (gAngle.state.globalAngleOn) {
                       box.angle = gAngle.state.globalAngle;
                    } else {
                        box.angle = (box.angle + 30) % 360;
                    }
                });
            });

            return {
                ...toRefs(state),
                clearBoxes,
                addBox,
                addBoxes,
                getBoxAngle,
                onRotate,
                ...toRefs(gAngle.state),
                onGlobalAngleOn: gAngle.onGlobalAngleOn,
            };
        },
    });
</script>

<style lang="scss">
    .container {
        width: 100%;
        height: 100%;
        position: relative;

        background-color: tomato;
        // background: tomato url(https://i.stack.imgur.com/PEnJm.png);
        // background: #263039 url(https://i.stack.imgur.com/PEnJm.png);
        // background-blend-mode: multiply;

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
            margin: 0 1rem;
            background-color: rgb(230, 90, 66);

            display: grid;
        }
    }

    // Common controls

    .inp-group {
        display: grid;
        grid-auto-flow: column;
        align-items: center;
    }

    label {
        user-select: none;
        display: flex;
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
