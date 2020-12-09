import '../styles/globals.scss'
import Amplify from 'aws-amplify'
import Predictions, { AmazonAIPredictionsProvider } from "@aws-amplify/predictions"
import config from '../src/aws-exports'

Amplify.configure({
  ...config,
  ssr: true
})
Amplify.register(Predictions)
Predictions.addPluggable(new AmazonAIPredictionsProvider())

function MyApp({ Component, pageProps }) {
  return (
      <Component {...pageProps} />
  )
}

export default MyApp
