<template>
  <fragment>
    <template v-for="(item,index) in data">
      <el-submenu v-if="item.type===0 && item.children" :index="item.id+''" :key="index">
        <template slot="title">
          <i :class="item.icon" />
          <span slot="title">{{item.label}}</span>
        </template>
        <treemenu :data="item.children" />
      </el-submenu>
      <el-menu-item v-else :index="item.path" :key="item.id">
        <i :class="item.icon" />
        <span slot="title">{{item.label}}</span>
      </el-menu-item>
    </template>
  </fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'
export default {
  name: 'Treemenu',
  components: { Fragment },
  props: {
    data: Array
  }
}
</script>
