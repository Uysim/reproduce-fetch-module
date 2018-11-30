/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import Ember from 'ember'
import JwtAuthenticator from 'ember-simple-auth-token/authenticators/jwt'
import Configuration from 'ember-simple-auth/configuration'
import DS from 'ember-data'

export default JwtAuthenticator.extend({
  store:      Ember.inject.service(),
  cookies:    Ember.inject.service(),

  scopeField: 'resourceType',

  init() {
    this._super(...arguments)
    return this.scopeField = Configuration.scopeField
  },

  getAuthenticateData(sessionModel) { return sessionModel },

  handleAuthResponse(response) {
    return response.getProperties('jwt', 'expirationTime', 'claim', 'provider', 'resourceId', 'resourceType')
  },

  makeRequest(url, data, headers) {
    if (url === 'authenticate') { return data.save() }
    return this.get('store').findRecord('session', data.jwt)
  },

  restore(data) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      if (this._validate(data)) { return resolve(data) } else { return reject() }
    })
  },

  _validate(data) {
    if (!_.isObject(data)) { return false }
    _.each(['jwt', 'claim', 'jwt', 'provider', 'resourceId', 'resourceType'], function(key) {
      if (!_.keys(data).includes(key)) { return false }
    })
    return true
  }
})
