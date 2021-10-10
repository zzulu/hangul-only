<template>
  <div class="container">
    <Input v-on:create-comment="createComment" :user="user" />
    <Comments :comments="comments" :loading="commentsLoading" />
  </div>
</template>

<script>
import axios from 'axios'
import firebase, { db } from '@/firebase.js'
import Comments from '@/components/Comments.vue'
import Input from '@/components/Input.vue'

export default {
  name: 'App',
  components: {
    Comments,
    Input,
  },
  data() {
    return {
      user: {
        uid: '',
        author: '',
      },
      comments: [],
      commentsLoading: true,
    }
  },
  methods: {
    createComment(comment) {
      this.$firebaseRefs.comments.push(comment)
    },
    createAuthor: async (uid) => {
      const res = await axios.post('https://api.only.hangul.kim', {
        input: uid.slice(0, 10).split('').filter((char) => isNaN(parseInt(char))).join('')
      })
      return await res.data.output.slice(0, 3)
    },
    onAuthStateChanged() {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          this.user = {
            uid: user.uid,
            author: await this.createAuthor(user.uid),
          }
          this.$rtdbBind('comments', db.ref('comments').limitToLast(100)).then(() => {
            this.commentsLoading = false
          })
        } else {
          this.user = { uid: '', author: '' }
          firebase.auth().signInAnonymously().catch(() => {
            this.user = { uid: '', author: '' }
          })
        }
      })
    },
  },
  mounted() {
    this.onAuthStateChanged()
  },
}
</script>

<style>
body {
  font-family: 'Spoqa Han Sans', sans-serif;
  color: #343a40;
}
</style>
