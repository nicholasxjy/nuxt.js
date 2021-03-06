'use strict'

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

<%
function recursiveRoutes(routes, tab, components) {
  var res = ''
  routes.forEach((route, i) => {
    components.push({ _name: route._name, component: route.component })
    res += tab + '{\n'
    res += tab + '\tpath: ' + JSON.stringify(route.path) + ',\n'
    res += tab + '\tcomponent: ' + route._name
    res += (route.name) ? ',\n\t' + tab + 'name: ' + JSON.stringify(route.name) : ''
    res += (route.children) ? ',\n\t' + tab + 'children: [\n' + recursiveRoutes(routes[i].children, tab + '\t\t', components) + '\n\t' + tab + ']' : ''
    res += '\n' + tab + '}' + (i + 1 === routes.length ? '' : ',\n')
  })
  return res
}
var _components = []
var _routes = recursiveRoutes(router.routes, '\t\t', _components)
uniqBy(_components, '_name').forEach((route) => { %>
const <%= route._name %> = process.BROWSER_BUILD ? () => System.import('<%= route.component %>') : require('<%= route.component %>')
<% }) %>

const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    // savedPosition is only available for popstate navigations.
    return savedPosition
  } else {
    let position = {}
    // if no children detected
    if (to.matched.length < 2) {
      position = { x: 0, y: 0 }
    }
    // if link has anchor,  scroll to anchor by returning the selector
    if (to.hash) {
      position = { selector: to.hash }
    }
    return position
  }
}

export default new Router({
  mode: 'history',
  base: '<%= router.base %>',
  linkActiveClass: '<%= router.linkActiveClass %>',
  scrollBehavior,
  routes: [
<%= _routes %>
  ]
})
