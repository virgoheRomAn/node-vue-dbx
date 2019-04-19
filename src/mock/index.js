import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Basic from './basic'
import User from './user'

export default {
  /**
   * mock bootstrap
   */
  bootstrap () {
    let mock = new MockAdapter(axios)
    Basic.bootstrap(mock)
    User.bootstrap(mock)
  }
}
