import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

// 这个人写模板时还没有await和async，我们改一下
const actions = {
  // user login
  async login({ commit }, userInfo) {
    // 解构出用户名和密码
    const { username, password } = userInfo
    // // 异步任务用promise
    // return new Promise((resolve, reject) => {
    //   // 发请求带参数，then中负责成功响应的处理
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //     // 失败用catch处理
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
    const result = await login({ username: username.trim(), password: password })
    // console.log(result)// 先看一下
    if (result.code === 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('fail'))
    }
  },

  // get user info
  async getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
    // const result = await getInfo(state.token)
    // // console.log(result)
    // if (result.code === 20000) {
    //   const { name, avatar } = result
    //   commit('SET_NAME', name)
    //   commit('SET_AVATAR', avatar)
    //   return result.data
    // } else {
    //   return Promise.reject(new Error('fail'))
    // }
  },

  // user logout
  async logout({ commit, state }) {
    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     removeToken() // must remove  token  first
    //     resetRouter()
    //     commit('RESET_STATE')
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
    const result = await logout(state.token)
    // console.log(result)
    if (result.code === 20000) {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      return 'ok'
    } else {
      return Promise.reject(new Error('fail'))
    }
  },

  // remove token
  resetToken({ commit }) {
    // return new Promise(resolve => {
    //   removeToken() // must remove  token  first
    //   commit('RESET_STATE')
    //   resolve()
    // })
    removeToken()
    commit('RESET_STATE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

