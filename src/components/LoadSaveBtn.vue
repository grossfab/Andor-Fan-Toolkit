<!--
Copyright (C) 2019 Fabian Große
Released under the GNU GENERAL PUBLIC LICENSE 3
https://github.com/Saphareas/Andor-Fan-Toolkit/blob/master/LICENSE
-->

<template>
  <div class="container">
    <a href="#" @click="save" class="loadsavebtn">&#128190;</a>
    <a href="#" @click="load" class="loadsavebtn">&#128194;</a>
  </div>
</template>

<script>
  import LoadSave from "@/components/loadSave.js"

  export default {
    name: "LoadSaveBtn",
    extends: LoadSave
  }
</script>

<style lang="scss" scoped>
  @import "@/components/theme.scss";
  .container {
    position: fixed;
    bottom: 0px;
    right: 0px;
  }

  .loadsavebtn {
    @include theme-light;
    display: block;
    height: 60px;
    width: 60px;
    border-radius: 30px;
    text-align: center;
    line-height: 60px;
    font-size: 1.5rem;
    text-decoration: none;
    box-shadow: 0 0 12px black;
    margin: 12px;
    opacity: .2;
    transition: .1s ease-in-out opacity;

    &:hover {
      opacity: 1;
    }
  }
</style>
