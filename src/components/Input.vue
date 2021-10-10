<template>
  <div class="row">
    <form v-on:submit.prevent="transliterate" class="form col-12 offset-sm-1 col-sm-10 offset-md-2 col-md-8 offset-lg-3 col-lg-6">
      <input id="sentence" class="box" type="text" v-model="input" autocomplete="off" autofocus>
      <div class="loader__wrapper">
        <div id="loader" class="loader" v-if="processing">
          <div class="circle"></div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Input',
  props: {
    user: Object,
  },
  data() {
    return {
      input: '',
      processing: false,
    }
  },
  methods: {
    transliterate() {
      this.processing = true
      const requests = this.splitEnKoBlock(this.input).map((block) => {
        if (block[0] == 'en') {
          return axios.post('https://api.only.hangul.kim', { input: block[1] })
            .then((res) => res.data.output)
        }
        return new Promise((resolve) => resolve(block[1]))
      })
      Promise.all(requests)
        .then((responses) => {
          this.createComment(this.input, responses.map(response => response).join(''))
        })
        .catch(() => {
          this.processing = false
        })
      this.input = ''
    },
    splitEnKoBlock(input) {
      const result = []
      let [enChars, koChars] = [[], []]
      let lang = ''
      const chars = input.split('')
      chars.forEach((char) => {
        const code = char.charCodeAt(0);
        if ((code > 64 && code < 91) || (code > 96 && code < 123)) {
          if (lang == 'ko') {
            result.push(new Array(lang, koChars.join('')))
            koChars = []
          }
          enChars.push(char)
          lang = 'en'
        } else {
          if (lang == 'en') {
            result.push(new Array(lang, enChars.join('')))
            enChars = []
          }
          koChars.push(char)
          lang = 'ko'
        }
      })

      if (lang == 'ko') {
        result.push(new Array(lang, koChars.join('')))
      } else {
        result.push(new Array(lang, enChars.join('')))
      }
      
      return result
    },
    createComment(input, output) {
      this.$emit('create-comment', {
        uid: this.user.uid,
        author: this.user.author,
        content: output,
        origin: input,
        createdAt: Date.now(),
      })
      this.processing = false
    },
  },
}
</script>

<style>
input:focus {
  outline: none;
}

.form {
  margin-top: 3rem;
}

.box {
  display: block;
  width: 100%;
  border: 1px solid #ced4da;
  padding: 1.25rem 2rem;
  font-size: 1.25rem;
  font-weight: 400;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  line-height: 1.5;
  border-radius: 0;
  transition: border-color .15s ease-in-out;
}

#sentence {
  position: relative;
}

#sentence:focus {
  border-color: #495057;
}

/* Loader */

.loader__wrapper {
  position: relative;
  padding: 2rem 0;
}

.loader {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
}

.circle {
  width: 1.5rem;
  height: 1.5rem;
  border-width: 4px;
  border-style: solid;
  border-color: #212529;
  border-radius: 50%;
  animation-name: drop;
  animation-duration: 0.8s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes drop {
  0% {
    opacity: 0;
    width: 0px;
    height: 0px;
    border-width: 0px;
  }

  60% {
    opacity: 1;
    border-width: 3px;
  }

  80% {
    width: 1.5rem;
    height: 1.5rem;
  }

  100% {
    opacity: 0;
    border-width: 1px;
  }
}

</style>
