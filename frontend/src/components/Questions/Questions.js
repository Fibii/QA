import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import grey from '@material-ui/core/colors/grey'
import Copyright from '../Copyrights/Copyrights'
import Notification from '../Notification/Notification'
import questionService from '../../services/questions'
import QPaper from '../QPaper/QPaper'

const useStyles = makeStyles(() => ({
  container: {
    position: 'relative',
    minHeight: '100vh',
    height: '100%',
    backgroundColor: grey[100],
  },
}))

/**
 * returns a list of questions
 *
 * @see validator
 * */
const Questions = ({ user }) => {
  const [dense] = useState(false)
  const [questions, setQuestions] = useState([])
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const classes = useStyles()

  useEffect(() => {
    const getQuestions = async () => {
      const questions = await questionService.getAll()
      if (!questions) {
        setError(true)
      } else {
        setQuestions(questions)
      }
    }
    getQuestions()
  }, [])

  if (error) {
    return (
      <Notification title="Error" message="Cannot connect to the server" severity="error" />
    )
  }

  /**
   * deletes a question form the database
   * @param id: id of the question to be deleted
   * */
  const handleDeleteQuestion = async (id) => {
    const response = await questionService.deleteQuestion(id)
    if (response) {
      const newQuestion = questions.filter((question) => question.id !== id)
      setQuestions(newQuestion)
    } else {
      setErrorMessage('error: couldn\'t delete the question')
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  return (
    <div className={classes.container} data-testid="questions-container">
      <Notification title="Error" message={errorMessage} severity="error" />
      <div>
        <List dense={dense} data-testid="question-list">
          {questions.map((question) => (
            <QPaper
              user={user}
              question={question}
              handleDelete={() => handleDeleteQuestion(question.id)}
              key={question.id}
              data-testid="question"
            />
          ))}
        </List>
        <Copyright />
      </div>
    </div>
  )
}


export default Questions
