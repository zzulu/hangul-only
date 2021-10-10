<template>
  <div class="row">
    <ul class="col-12 offset-sm-1 col-sm-10 offset-md-2 col-md-8 offset-lg-3 col-lg-6 mb-5">
      <template v-if="!loading">
        <li v-for="comment in reversedComments" :key="comment.createdAt" class="comment">
          <div class="comment__author">{{ comment.author }}</div>
          <div class="comment__content">{{ comment.content }}</div>
        </li>
      </template>
      <template v-else>
        <li v-for="n in 3" class="comment" :key="n">
          <div class="comment__author loading"></div>
          <div class="comment__content loading"></div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Comments',
  props: {
    comments: Array,
    loading: Boolean,
  },
  computed: {
    reversedComments() {
      return [...this.comments].reverse()
    },
  },
}
</script>

<style>
ul {
  list-style: none;
  padding: 0;
}

.comment {
  border: 1px solid #ced4da;
  padding: 1.25rem 2rem;
  margin-bottom: 1rem;
}

.comment__author {
  font-size: 1rem;
  color: #868e96;
  margin-bottom: .25rem;
}

.comment__content {
  font-size: 1.25rem;
}

.comment__author.loading {
  background-color: #f1f3f5;
  height: 1.25rem;
  width: 5rem;
  margin-top: .375rem;
  margin-bottom: .125rem;
}

.comment__content.loading {
  background-color: #f1f3f5;
  height: 1.5rem;
  margin-top: .5rem;
}
</style>
