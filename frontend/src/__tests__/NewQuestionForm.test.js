import React from 'react'
import { render, fireEvent, waitForElement } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'
import { MemoryRouter, Route } from 'react-router-dom'
import NewQuestionForm from '../components/NewQuestionForm'
import newQuestion from '../__mocks__/newQuestion'
import user from '../__mocks__/user'
import UserContext from '../components/UserContext'
import inputHelper from '../services/testHelpers/inputHelper'

jest.mock('axios')
const baseUrl = 'http://localhost:3001/api'
const url = `${baseUrl}/questions`

describe('NewQuestionForm tests', () => {
  test('renders NewQuestionForm and POST a new question', async () => {
    const { getByTestId, rerender } = render(
      <UserContext.Provider value={[user]}>
        <MemoryRouter initialEntries={['/question/new']}>
          <Route path="/question/new">
            <NewQuestionForm />
            ,
          </Route>
        </MemoryRouter>
        ,
      </UserContext.Provider>,
    )

    const title = 'question test title'
    const content = 'question test content'
    const tags = 'question, test, tag'

    axiosMock.post.mockResolvedValueOnce({
      data: newQuestion,
    })

    expect(getByTestId('questionForm-container')).toBeInTheDocument()
    fireEvent.change(getByTestId('title-input'), inputHelper.parseValue(title))
    fireEvent.change(getByTestId('content-input'), inputHelper.parseValue(content))
    fireEvent.change(getByTestId('tags-input'), inputHelper.parseValue(tags))
    fireEvent.click(getByTestId('submit-button'), tags)

    rerender(
      <UserContext.Provider value={[user]}>
        <MemoryRouter initialEntries={['/question/new']}>
          <Route path="/question/new">
            <NewQuestionForm />
            ,
          </Route>
        </MemoryRouter>
        ,
      </UserContext.Provider>,
    )
    await waitForElement(() => getByTestId('questionForm-container'))
    expect(axiosMock.post).toHaveBeenCalledTimes(1)
    expect(axiosMock.post).toHaveBeenCalledWith(url,
      {
        content: 'question test content',
        tags: ['question', 'test', 'tag'],
        title: 'question test title',
      },
      null) // null here is for config object, check services/questions addQuestion
  })

  test('renders NewQuestionForm and validates input', async () => {
    const { getByTestId, rerender } = render(
      <UserContext.Provider value={[user]}>
        <MemoryRouter initialEntries={['/question/new']}>
          <Route path="/question/new">
            <NewQuestionForm />
            ,
          </Route>
        </MemoryRouter>
        ,
      </UserContext.Provider>,
    )

    const title = 'bad t'
    const content = 'bad c'
    const tags = 'bad tags'

    axiosMock.post.mockResolvedValueOnce({
      data: newQuestion,
    })

    expect(getByTestId('questionForm-container')).toBeInTheDocument()
    fireEvent.change(getByTestId('title-input'), inputHelper.parseValue(title))
    fireEvent.change(getByTestId('content-input'), inputHelper.parseValue(content))
    fireEvent.change(getByTestId('tags-input'), inputHelper.parseValue(tags))
    fireEvent.click(getByTestId('submit-button'), tags)

    rerender(
      <UserContext.Provider value={[user]}>
        <MemoryRouter initialEntries={['/question/new']}>
          <Route path="/question/new">
            <NewQuestionForm />
            ,
          </Route>
        </MemoryRouter>
        ,
      </UserContext.Provider>,
    )
    await waitForElement(() => getByTestId('questionForm-container'))
    expect(getByTestId('notification')).toBeInTheDocument()
    expect(getByTestId('notification').textContent).toContain('All fields are required, if a field is red, fix it')
  })

  test('shows an error when a user is not logged in', async () => {
    const { queryByTestId } = render(
      <UserContext.Provider value={[null]}>
        <MemoryRouter initialEntries={['/question/new']}>
          <Route path="/question/new">
            <NewQuestionForm />
            ,
          </Route>
        </MemoryRouter>
        ,
      </UserContext.Provider>,
    )

    expect(queryByTestId('questionForm-container')).toBeNull()
    expect(queryByTestId('notification').textContent).toContain('you must be logged in')
  })
})
