// Put this file anywhere in your Next.js 10 app. 
// I keep mine in hooks/datastax.js

import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { useMutation, useQuery, queryCache } from 'react-query'

// Get a free DataStax account here:
// https://www.datastax.com/
// Stargate documentation:
// https://stargate.io/docs/stargate/0.1/developers-guide/document-using.html

const STARGATE_NAMESPACE = 'stargate'
const ASTRA_USER = 'einstein'
const ASTRA_PASSWORD = 'rosen'
const ASTRA_ID = '4a49cfd8-6ff5-4793-9e21-28b4b4f5ac7a'
const ASTRA_REGION = 'us-east1'

// global axios defaults docs:
// https://github.com/axios/axios#global-axios-defaults
// good primer: Stay DRY Using axios for API Requests by David Atlanda (6/22/20)
// https://css-tricks.com/stay-dry-using-axios-for-api-requests/

const host = `https://${ASTRA_ID}-${ASTRA_REGION}.apps.astra.datastax.com/`
const path = `api/rest/v2/namespaces/${STARGATE_NAMESPACE}/collections/`
axios.defaults.baseURL = host + path
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Cassandra token interceptor
// basic config from repo: https://github.com/Flyrell/axios-auth-refresh

const refreshAuthLogic = failedRequest => 
  axios.post(host + 'api/rest/v1/auth', {
    username: ASTRA_USER,
    password: ASTRA_PASSWORD
  }).then(tokenRefreshResponse => {
    // this is never accessed, just for debugging
    localStorage.setItem('token', tokenRefreshResponse.data.authToken)
    // sets the token for the immediate retry
    failedRequest.response.config.headers['X-Cassandra-Token'] = tokenRefreshResponse.data.authToken
    // sets the token for future requests
    axios.defaults.headers.common['X-Cassandra-Token'] = tokenRefreshResponse.data.authToken
    return Promise.resolve();
}); 

createAuthRefreshInterceptor(axios, refreshAuthLogic, {
  // to prevent multiple 401s prior to first authentication
  pauseInstanceWhileRefreshing: true // default: false
});

// https://react-query.tanstack.com/docs/overview
// React Query syncs the cache with the database
// react-query hooks take a key and a fetcher function:

export function useImage(id) {
  return useQuery(['images', id], (_, id) =>
    axios.get(`images/${id}`)
      .then((res) => res.data.data)
  )
}

export function useImages() {     
  return useQuery('images', getImages)
}

const getImages = async () => {
  const images = await axios.get('images', 
    { params: { 'page-size': 20 } })
      .then((res) => res.data.data) 
      .catch((err) => console.log(err))
    
  Object.keys(images).forEach(key => {
    // add DataStax id to each image
    images[key].id = key
    // load each image into the cache
    queryCache.setQueryData(['images', key], images[key])
  })
  // object to array for easier iteration
  return Object.values(images)
}

export function useCreateScan() {
  return useMutation((values) => 
    axios.post('images/', values)
    .then((res) => console.log(res)) 
    .catch((err) => console.log(err))
  )
}

export function useUpdateImage() {
  return useMutation((values) => 
    axios.patch(`images/${values.id}`, values)
      .then((res) => res.data), {
        onMutate: (values) => { 
          queryCache.setQueryData(['images', values.id], values) },
        onSuccess: (data, variables) => { 
          queryCache.invalidateQueries(['images', variables.id]) 
          queryCache.invalidateQueries('images')
      },
    }
  )
}

export function useDeleteImage() {
  return useMutation((id) => 
    axios.delete(`images/${id}`)
      .then((res) => res), {
        onSuccess: (data, variables) => { 
          queryCache.invalidateQueries('images')
      },
    }
  )
}

export function useUpload() {
  return useMutation((file) => 
    axios.post('https://fdjex7qini.execute-api.us-east-1.amazonaws.com/Prod2/', file)
      .then((res) => res.data)
      .then((res) => console.log(res))
  )
}
