<template>
  <h2 class="text-3xl font-bold mb-8">Мои закладки</h2>

  <CardList
    :items="favorites"
    is-favorites
    @on-remove-favorite="onRemoveFavorite"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import CardList from '@/components/CardList.vue'

const favorites = ref([])

const fetchFavorites = async () => {
  try {
    const { data } = await axios.get(`https://c17e5842ad37082c.mokky.dev/favorites`)
    favorites.value = data
    console.log(favorites.value)
  } catch (error) {
    console.log(error)
  }
}

const onRemoveFavorite = (item) => {
  console.log(favorites)
  favorites.value.splice(favorites.value.indexOf(item), 1)
}

onMounted(() => {
  fetchFavorites()
})
</script>

<style lang="scss" scoped>

</style>
