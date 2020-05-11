import React, { useEffect, useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import grey from '@material-ui/core/colors/grey'
import UserContext from './UserContext'

import Header from './Header'
import Welcome from './Welcome'
import SignIn from './SignInForm'
import SignupForm from './SignupForm'
import NewQuestionForm from './NewQuestionForm'
import Question from './Question'
import Questions from './Questions'

import questionService from '../services/questions'
import userService from '../services/users'
import { setErrorMessage } from '../actions/questionActions'
import Profile from './Profile'

const MainApp = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const loggedUser = JSON.parse(window.localStorage.getItem('qa_userLoggedIn'))
      if (loggedUser) {
        setUser(loggedUser)
        questionService.setToken(loggedUser.token)
        userService.setToken(loggedUser.token)
      }
    } catch (error) {
      setErrorMessage('error while loading the saved in user')
    }
  }, [])

  return (
    <div
      style={{
        backgroundColor: grey[100],
        height: '100vh',
      }}
      data-testid="mainApp-container"
    >
      <UserContext.Provider value={[user, setUser]}>
        <Header />
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
      </UserContext.Provider>
    </div>
  )
}

export default MainApp
