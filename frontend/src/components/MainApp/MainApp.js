import React, { useEffect, useState, lazy, Suspense } from 'react'
import {
  Route, Switch,
} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import UserContext from '../UserContext/UserContext'

// import Header from '../Header/Header'
// import SignIn from '../SignInForm/SignInForm'
// import SignupForm from '../SignupForm/SignupForm'
import NewQuestionForm from '../NewQuestionForm/NewQuestionForm'
import Question from '../Question/Question'
// import Questions from '../Questions/Questions'
import userService from '../../services/users'
import { setErrorMessage } from '../../actions/questionActions'
import Profile from '../Profile/Profile'
import Footer from '../Footer/Footer'
import LoadingScreen from '../LoadingScreen/LoadingScreen'
import NoPage from '../NoPage/NoPage'
import config from '../../config'

const useStyles = makeStyles(() => ({
  container: {
    minHeight: '100%',
    height: '100%',
  },
  content: {
    flex: '1 0 auto',
  },
  footer: {
    flexShrink: 0,
  },
}))

const Welcome = lazy(() => import('../Welcome/Welcome'))
const SignIn = lazy(() => import('../SignInForm/SignInForm'))
const SignupForm = lazy(() => import('../SignupForm/SignupForm'))
const Questions = lazy(() => import('../Questions/Questions'))
const Header = lazy(() => import('../Header/Header'))
// const Welcome = lazy(() => import('../Welcome/Welcome'))
// const Welcome = lazy(() => import('../Welcome/Welcome'))

const MainApp = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const classes = useStyles()
  const { urls } = config

  useEffect(() => {
    const before = async () => {
      try {
        const user = await userService.getSavedUser()
        if (user !== null) {
          setUser(user)
        }
      } catch (error) {
        setErrorMessage('error while loading the saved in user')
      }
      setIsLoading(false)
    }

    before()
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Grid container direction="column" className={classes.container} wrap="nowrap">
      <UserContext.Provider value={[user, setUser]}>
          <Header />
          <Grid className={classes.content}>
            <Switch>
              <Route
                exact
                path={urls.root}
                render={() => (
                  user ? (
                    <Suspense fallback="loading">
                      <Questions user={user} />
                    </Suspense>
                  ) : (
                    <Welcome />
                  )
                )}
              />
              <Route path={urls.welcome} render={() =>
                <Suspense fallback="loading">
                  <Welcome />
                </Suspense>} />
              <Route path={urls.login} render={() =>
                <Suspense fallback="loading">
                  <SignIn setUser={setUser} />
                </Suspense>} />
              <Route path={urls.register} render={
                <Suspense fallback="loading">
                  <SignupForm />
                </Suspense>
              } />
              <Route path={urls.newQuestion} exact render={() => <NewQuestionForm />} />
              <Route path={`${urls.question}/:id`} exact render={() => <Question />} />
              <Route path={`${urls.user}/:id`} exact render={() => <Profile />} />
              <Route component={NoPage} />
            </Switch>
          </Grid>
      </UserContext.Provider>
      <Grid className={classes.footer}>
        <Footer />
      </Grid>
    </Grid>
  )
}

export default MainApp
