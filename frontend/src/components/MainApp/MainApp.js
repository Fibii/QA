import React, { useEffect, useState } from 'react'
import {
  Route, Switch, useHistory,
} from 'react-router-dom'
import grey from '@material-ui/core/colors/grey'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import UserContext from '../UserContext/UserContext'

import Header from '../Header/Header'
import Welcome from '../Welcome/Welcome'
import SignIn from '../SignInForm/SignInForm'
import SignupForm from '../SignupForm/SignupForm'
import NewQuestionForm from '../NewQuestionForm/NewQuestionForm'
import Question from '../Question/Question'
import Questions from '../Questions/Questions'
import userService from '../../services/users'
import { setErrorMessage } from '../../actions/questionActions'
import Profile from '../Profile/Profile'
import Footer from '../Footer/Footer'
import LoadingScreen from '../LoadingScreen/LoadingScreen'

const useStyles = makeStyles(() => ({
  container: {
    backgroundColor: grey[100],
    minHeight: '100%',
  },
  content: {
    flex: '1 0 auto',
    marginTop: 32,
  },
  footer: {
    flexShrink: 0,
  },
}))

const MainApp = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const history = useHistory()
  const classes = useStyles()

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
    <Grid container direction="column" className={classes.container}>
      <UserContext.Provider value={[user, setUser]}>
        <Header />
        <Grid className={classes.content}>
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                user ? (
                  <Questions user={user} />
                ) : (
                  <Welcome />
                )
              )}
            />
            <Route path="/welcome" render={() => <Welcome />} />
            <Route path="/login" render={() => <SignIn setUser={setUser} />} />
            <Route path="/register" component={SignupForm} />
            <Route path="/question/new" exact render={() => <NewQuestionForm />} />
            <Route path="/question/:id" exact render={() => <Question />} />
            <Route path="/user/:id" exact render={() => <Profile />} />
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
