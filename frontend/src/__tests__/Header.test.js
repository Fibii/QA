import React from 'react'
import {
  render, waitForElement, cleanup, fireEvent,
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'
import { MemoryRouter, Route } from 'react-router-dom'
import user from '../__mocks__/user'
import Header from '../components/Header'
import UserContext from '../components/UserContext'
import questions from '../__mocks__/questions'

afterAll(cleanup)
afterEach(() => {
  jest.clearAllMocks()
})

const MAIN_URL = process.env.REACT_APP_URL
const APP_NAME = 'Quest'

const setup = async (user = null, setUser = null) => {
  axiosMock.get.mockResolvedValueOnce({
    data: questions,
  })

  const renderResult = render(
    <UserContext.Provider value={[user, setUser]}>
      <MemoryRouter initialEntries={[MAIN_URL]}>
        <Route path={MAIN_URL}>
          <Header />
        </Route>
      </MemoryRouter>
    </UserContext.Provider>,
  )

  await waitForElement(() => renderResult.getByTestId('header-container'))
  return renderResult
}

describe('header tests', () => {
  test('renders header and drawer with logged in user', async () => {
    const { getByTestId } = await setup(user)
    expect(getByTestId('header-container')).toBeInTheDocument()
    fireEvent.click(getByTestId('open-drawer'))
    expect(getByTestId('drawer-container')).toBeInTheDocument()
  })

  test('renders header without drawer when a user is not logged in', async () => {
    const { queryByTestId, getByTestId } = await setup()
    expect(getByTestId('header-container')).toBeInTheDocument()
    expect(queryByTestId('open-drawer')).toBeNull()
    expect(getByTestId('logo').textContent).toContain(APP_NAME)
  })
})
