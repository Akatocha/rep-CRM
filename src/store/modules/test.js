import axios from 'axios'
export default{
  state: {
    posts: []
  },
  getters: {
    POSTS(state){
      return state.posts
    }
  },
  mutations: {
    updatePosts(state, posts){
      state.posts = posts
    },
    createPost(state, text){
      state.posts.unshift(text)
    }
  },
  actions: {
   async getPosts(ctx, limit = 3){
      await  axios.get('https://jsonplaceholder.typicode.com/posts?_limit=' + limit)
      .then(response =>{
        let arr = response.data
        ctx.commit('updatePosts', arr)
      })
      .catch(err => {
        console.log(err)
      })
    },
    createPostAct({commit, getters, dispatch}, text){
      commit('createPost', text)
    }
  }
}