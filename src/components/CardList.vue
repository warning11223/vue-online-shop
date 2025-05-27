<template>
  <div v-if="!isFavorites" class="flex justify-between items-center">
    <h2 class="text-3xl font-bold mb-8">Все кроссовки</h2>

    <div class="flex gap-4">
      <select @change="onChangeSelect" class="py-2 px-3 border rounded-md outline-none">
        <option value="name">По названию</option>
        <option value="price">По цене (дешевые)</option>
        <option value="-price">По цене (дорогие)</option>
      </select>

      <div class="relative">
        <img class="absolute left-4 top-3" src="/search.svg" />
        <input
          @input="onChangeSearchInput"
          class="border rounded-md py-2 pl-11 pr-4 outline-none focus:border-gray-400"
          type="text"
          placeholder="Поиск..."
        />
      </div>
    </div>
  </div>

  <div class="grid grid-cols-4 gap-5" v-auto-animate>
    <Card
      v-for="item in isFavorites ? items : sneakers"
      :key="item.id"
      :id="item.id"
      :image-url="item.imageUrl"
      :title="item.title"
      :is-favorite="item.isFavorite"
      :is-added="item.isAdded"
      :price="item.price"
      @on-click-favorite="() => onClickFavorite(item)"
      @on-click-add="() => onClickAdd(item)"
    />
  </div>
</template>

<script setup>
import Card from '@/components/Card.vue'
import { inject, onMounted, reactive, ref, watch } from 'vue'
import axios from 'axios'
import debounce from 'lodash.debounce'

const filters = reactive({
  sortBy: 'title',
  searchQuery: '',
})

const sneakers = ref([])

const fetchSneakers = async () => {
  try {
    const params = {
      sortBy: filters.sortBy,
      ...(filters.searchQuery !== '' && { title: `*${filters.searchQuery}*` }),
    }

    const { data } = await axios.get(`https://c17e5842ad37082c.mokky.dev/items`, {
      params,
    })
    sneakers.value = data
  } catch (e) {
    console.error(e)
  }
}

const fetchFavorites = async () => {
  try {
    const { data } = await axios.get('https://c17e5842ad37082c.mokky.dev/favorites')

    sneakers.value = sneakers.value.map((item) => {
      const favorite = data.find((favorite) => favorite.itemId === item.id)

      if (!favorite) {
        return item
      }

      return {
        ...item,
        isFavorite: true,
        favoriteId: favorite.id,
      }
    })
  } catch (e) {
    console.log(e)
  }
}

onMounted(async () => {
  const localCart = localStorage.getItem('cart')
  cart.value = localCart ? JSON.parse(localCart) : []

  await fetchSneakers()
  await fetchFavorites()

  sneakers.value = sneakers.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id)
  }))
})

watch(() => filters.sortBy, fetchSneakers)

watch(() => filters.searchQuery, fetchSneakers)

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value
}

const onChangeSearchInput = debounce((event) => {
  filters.searchQuery = event.target.value
}, 400)

const onClickFavorite = async (item) => {
  console.log(item)
  try {
    if (!item.isFavorite) {
      const obj = {
        ...item,
        itemId: item.id,
        isFavorite: true,
      }

      item.isFavorite = true

      const { data } = await axios.post(`https://c17e5842ad37082c.mokky.dev/favorites`, obj)

      item.favoriteId = data.id
    } else {
      const id = props.isFavorites ? item.id : item.favoriteId;

      item.isFavorite = false
      await axios.delete(`https://c17e5842ad37082c.mokky.dev/favorites/${id}`)
      emit('onRemoveFavorite', item);
      item.favoriteId = null
    }
  } catch (err) {
    console.log(err)
  }
}

const { addToCart, removeFromCart, cart } = inject('cart')

const onClickAdd = (item) => {
  if (item.isAdded) {
    removeFromCart(item)
  } else {
    addToCart(item)
  }
}

const emit = defineEmits(['onRemoveFavorite'])

const props = defineProps({
  items: Array,
  isFavorites: Boolean
})
</script>

<style lang="scss" scoped></style>
