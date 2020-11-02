<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="tomato" />
        <rect
            v-for="box in boxes"
            :key="box.id"
            :x="box.x"
            :y="box.y"
            :width="box.w"
            :height="box.h"
            fill="blue"
            :transform="`rotate(${box.a})`"
            transform-origin="50%, 50%"
        />
    </svg>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

type Box = {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    a: number; // angle
};

function generateBox(): Box {
    return {
        id: Date.now().toString(36),
        x: 50,
        y: 50,
        w: 40,
        h: 10,
        a: 0,
    };
}

export default defineComponent({
    setup() {
        const boxes = reactive<Box[]>([generateBox()]);

        //const timer = setInterval(() => boxes[0].a = boxes[0].a + 10, 1000);

        return {
            boxes,
        };
    },
});
</script>

<style lang="scss" scoped>
</style>